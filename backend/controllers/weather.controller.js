const weatherService = require("../services/weather.service");

exports.getWeatherForCity = async (req, res) => {
  try {
    const { city } = req.params;
    const weatherData = await weatherService.getWeatherForCity(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDailySummary = async (req, res) => {
  try {
    const { city } = req.params;
    const summaryData = await weatherService.getDailySummaryForCity(city);
    res.json(summaryData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMetroCitiesSummary = async (req, res) => {
  try {
    const summaries = await weatherService.getAllMetroCitiesDailySummary();
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWeeklyMetroCitiesSummary = async (req, res) => {
  try {
    const summaries = await weatherService.getWeeklyMetroCitiesSummary();
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setUserAlert = async (req, res) => {
  try {
    const { username, city, temperatureThreshold } = req.body;
    await weatherService.setUserAlert(username, city, temperatureThreshold);
    res.json({ message: "Alert set successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
