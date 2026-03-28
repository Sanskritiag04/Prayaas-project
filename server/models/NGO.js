const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    ngoName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    registrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    panNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

panCard: {
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
      default: ""
    },
    
status: {
  type: String,
  enum: ["pending", "verified", "rejected"],
  default: "pending"
},
adminRemarks: {
  type: String,
  default: ""
},

    resetOTP: String,
    resetOTPExpiry: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("NGO", ngoSchema);