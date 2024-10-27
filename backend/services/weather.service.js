const axios = require("axios");
const City = require("../models/city.model");
const User = require("../models/user.model");

require("dotenv").config();
const redisClient = require("../config/redis.config");

const METRO_CITIES = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

exports.getWeatherForCity = async (city) => {
  const client = await redisClient();
  const cachedData = await client.get(`weather:${city}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
  const response = await axios.get(url);

  const filteredData = {
    city: response.data.name,
    temp: response.data.main.temp,
    temp_min: response.data.main.temp_min,
    temp_max: response.data.main.temp_max,
    humidity: response.data.main.humidity,
    feels_like: response.data.main.feels_like,
    dt: response.data.dt,
    weather: response.data.weather.map((w) => ({
      main: w.main,
    })),
  };

  await client.set(`weather:${city}`, JSON.stringify(filteredData), {
    EX: 300,
  });

  return filteredData;
};

async function fetchAllMetroCitiesWeather() {
  let data = [];
  for (const city of METRO_CITIES) {
    try {
      const weatherData = await exports.getWeatherForCity(city);
      data.push(weatherData);
      await exports.updateDailySummary(city, weatherData);
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
    }
  }
  return data;
}

exports.fetchWeatherDataForMetroCities = async (io) => {
  io.on("connection", async (socket) => {
    try {
      const initialData = await fetchAllMetroCitiesWeather();
      socket.emit("weatherData", initialData);
    } catch (error) {
      console.error("Error fetching initial weather data:", error);
    }
  });

  setInterval(async () => {
    try {
      const data = await fetchAllMetroCitiesWeather();
      io.emit("weatherData", data);
    } catch (error) {
      console.error("Error in interval weather update:", error);
    }
  }, 5 * 60 * 1000);
};

exports.updateDailySummary = async (cityName, weatherData) => {
  const today = new Date().toISOString().split("T")[0];
  const client = await redisClient();

  let city = await City.findOne({ name: cityName });
  if (!city) {
    city = new City({ name: cityName, dailySummary: [] });
  }

  let todaySummary = city.dailySummary.find(
    (summary) => summary.date.toISOString().split("T")[0] === today
  );

  if (!todaySummary) {
    todaySummary = {
      date: new Date(),
      tempSum: weatherData.temp,
      tempCount: 1,
      maxTemp: weatherData.temp_max,
      minTemp: weatherData.temp_min,
      weatherConditions: new Map(),
    };
    city.dailySummary.push(todaySummary);
  } else {
    todaySummary.tempSum += weatherData.temp;
    todaySummary.tempCount += 1;
    todaySummary.maxTemp = Math.max(todaySummary.maxTemp, weatherData.temp_max);
    todaySummary.minTemp = Math.min(todaySummary.minTemp, weatherData.temp_min);
  }

  if (!(todaySummary.weatherConditions instanceof Map)) {
    todaySummary.weatherConditions = new Map(
      Object.entries(todaySummary.weatherConditions || {})
    );
  }

  if (Array.isArray(weatherData.weather)) {
    for (const condition of weatherData.weather) {
      const conditionMain = condition.main;
      const currentCount =
        todaySummary.weatherConditions.get(conditionMain) || 0;
      todaySummary.weatherConditions.set(conditionMain, currentCount + 1);
    }
  }

  todaySummary.weatherConditions = Object.fromEntries(
    todaySummary.weatherConditions
  );

  await city.save();

  await client.set(
    `dailySummary:${cityName}`,
    JSON.stringify({
      averageTemp: todaySummary.tempSum / todaySummary.tempCount,
      maxTemp: todaySummary.maxTemp,
      minTemp: todaySummary.minTemp,
      weatherConditions: [...todaySummary.weatherConditions],
    })
  );

  console.log(`Daily summary updated for ${cityName}`);
};

exports.getDailySummaryForCity = async (cityName) => {
  const client = await redisClient();
  const cachedData = await client.get(`dailySummary:${cityName}`);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const city = await City.findOne({ name: cityName });
  if (!city || !city.dailySummary.length) {
    throw new Error("No daily summary data available for this city");
  }

  const today = new Date().toISOString().split("T")[0];
  const todaySummary = city.dailySummary.find(
    (summary) => summary.date.toISOString().split("T")[0] === today
  );

  if (!todaySummary) {
    throw new Error("No summary data available for today");
  }

  const summary = {
    averageTemp: todaySummary.tempSum / todaySummary.tempCount,
    maxTemp: todaySummary.maxTemp,
    minTemp: todaySummary.minTemp,
    weatherConditions: todaySummary.weatherConditions,
  };

  await client.set(`dailySummary:${cityName}`, JSON.stringify(summary), {
    EX: 3600,
  });

  return summary;
};

exports.getAllMetroCitiesDailySummary = async () => {
  const summaries = [];
  for (const city of METRO_CITIES) {
    try {
      const summary = await exports.getDailySummaryForCity(city);
      summaries.push({
        city,
        ...summary,
      });
    } catch (error) {
      console.error(`Error fetching daily summary for ${city}:`, error);
    }
  }
  return summaries;
};

exports.getWeeklyMetroCitiesSummary = async () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const cities = await City.find({
    name: { $in: METRO_CITIES },
    "dailySummary.date": {
      $gte: startDate,
      $lte: endDate,
    },
  });

  return cities;
};

exports.setUserAlert = async (username, city, temperatureThreshold) => {
  try {
    let user = await User.findOne({ username });
    if (user) {
      user.city = city;
      user.temperatureThreshold = temperatureThreshold;
      user.alertCount = 0;
      user.alertTimestamps = [];
    }
    await user.save();

    const client = await redisClient();
    await client.set(
      `userAlert:${username}`,
      JSON.stringify({ city, temperatureThreshold })
    );
  } catch (error) {
    console.error(`Error setting user alert for ${name}:`, error);
    throw error;
  }
};
