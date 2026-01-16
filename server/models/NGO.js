const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  ngoName: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  registrationId: { type: String, required: true, unique: true },
  panNumber: { type: String, required: true, unique: true },

  state: { type: String, required: true },
  pincode: { type: Number, required: true },

  password: { type: String, required: true },

  resetOTP: String,
  resetOTPExpiry: Date
});

module.exports = mongoose.model("NGO", ngoSchema);
