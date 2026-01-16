const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  image: String,
  type: {
    type: String,
    enum: ["upcoming", "past"]
  }
});

module.exports = mongoose.model("Event", eventSchema);
