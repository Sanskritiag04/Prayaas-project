const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
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


    password: {
      type: String,
      required: true
    },

    photo: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
    },

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

    // resetOTP: String,
    // resetOTPExpiry: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
