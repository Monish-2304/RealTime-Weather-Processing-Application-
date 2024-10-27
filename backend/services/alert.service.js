const User = require("../models/user.model");
const { getWeatherForCity } = require("./weather.service");

const alertCheckInterval = 5 * 60 * 1000;
const alertLimit = 3;
const alertTimeframe = 6 * 60 * 60 * 1000;

const startAlertCheck = (io) => {
  setInterval(async () => {
    try {
      const users = await User.find({
        city: { $exists: true },
        temperatureThreshold: { $exists: true },
      });

      for (const user of users) {
        try {
          const userSockets = Array.from(io.sockets.sockets.values()).filter(
            (socket) =>
              socket.auth?.authenticated &&
              socket.auth.username === user.username
          );

          if (userSockets.length === 0) continue;

          const weatherData = await getWeatherForCity(user.city);

          if (weatherData.temp > user.temperatureThreshold) {
            const currentTime = Date.now();

            user.alertTimestamps = user.alertTimestamps.filter(
              (timestamp) => currentTime - timestamp < alertTimeframe
            );

            if (user.alertTimestamps.length === 0) {
              user.alertCount = 0;
            }

            if (user.alertCount < alertLimit) {
              const alertMessage =
                `Temperature Alert: Current temperature in ${user.city} is ${weatherData.temp}°C, ` +
                `exceeding your threshold of ${user.temperatureThreshold}°C!`;

              userSockets.forEach((socket) => {
                socket.emit("alert", alertMessage);
              });

              user.alertCount++;
              user.alertTimestamps.push(currentTime);
              await user.save();

              console.log(`Alert sent to ${user.username} for ${user.city}`);
            }
          } else {
            if (user.alertCount > 0 && user.alertTimestamps.length > 0) {
              user.alertCount = 0;
              user.alertTimestamps = [];
              await user.save();
            }
          }
        } catch (error) {
          console.error(
            `Error processing alert for user ${user.username}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Error checking temperature alerts:", error);
    }
  }, alertCheckInterval);
};

module.exports = startAlertCheck;
