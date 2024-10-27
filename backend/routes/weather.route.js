const express = require("express");
const router = express.Router();
const {
  getWeatherForCity,
  setUserAlert,
  getDailySummary,
  getAllMetroCitiesSummary,
  getWeeklyMetroCitiesSummary,
} = require("../controllers/weather.controller");

router.get("/weather/city/:city", getWeatherForCity);
router.get("/weather/summary/:city", getDailySummary);
router.get("/weather/summary/metros/all", getAllMetroCitiesSummary);
router.get("/weather/summary/metros/weekly", getWeeklyMetroCitiesSummary);
router.post("/weather/alert", setUserAlert);
module.exports = router;
