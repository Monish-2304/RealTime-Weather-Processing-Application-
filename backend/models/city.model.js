const mongoose = require("mongoose");

const DailySummarySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  tempSum: { type: Number, required: true },
  tempCount: { type: Number, required: true },
  maxTemp: { type: Number, required: true },
  minTemp: { type: Number, required: true },
  weatherConditions: { type: Map, of: Number },
});

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  dailySummary: [DailySummarySchema],
});

module.exports = mongoose.model("City", CitySchema);
