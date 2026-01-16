const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: Number,
      required: true
    },

    age: {
      type: Number,
      required: true,
      min: 18
    },

    // ✅ NORMALIZED ADDRESS (as your mam suggested)
    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pincode: {
      type: Number,
      required: true
    },

    // AUTH
    password: {
      type: String,
      required: true
    },

    // PROFILE
    photo: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
    },

    // DASHBOARD DATA
    badges: [
      {
        name: String,
        image: String
      }
    ],

    myEvents: [
      {
        title: String,
        date: String
      }
    ],

    // 🔐 FORGOT PASSWORD (OTP)
    resetOTP: String,
    resetOTPExpiry: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
