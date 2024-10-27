const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  city: { type: String },
  temperatureThreshold: { type: Number },
  alertCount: { type: Number, default: 0 },
  alertTimestamps: { type: [Number], default: [] },
});

module.exports = mongoose.model("User", UserSchema);
