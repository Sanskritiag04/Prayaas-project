const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  phone: Number,
  address: String,
  password: String
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
