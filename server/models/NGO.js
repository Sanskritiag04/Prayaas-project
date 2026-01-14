const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  ngoName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registrationId: { type: String, required: true, unique: true },
  panNumber: { type: String, required: true, unique: true },

  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },

  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("NGO", ngoSchema);
