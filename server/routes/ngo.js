const express = require("express");
const router = express.Router();
const NGO = require("../models/NGO");
const bcrypt = require("bcryptjs");
const generateOTP = require("../utils/generateOTP");

/* =========================
   NGO REGISTRATION
========================= */
router.post("/register", async (req, res) => {
  try {
    const {
      ngoName,
      email,
      registrationId,
      panNumber,
      state,
      pincode,
      password,
      confirmPassword
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingNGO = await NGO.findOne({
      $or: [{ email }, { registrationId }, { panNumber }]
    });

    if (existingNGO) {
      return res.status(400).json({ message: "NGO already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ngo = new NGO({
      ngoName,
      email,
      registrationId,
      panNumber,
      state,
      pincode,
      password: hashedPassword
    });

    await ngo.save();

    res.status(201).json({ message: "NGO registered successfully" });

  } catch (error) {
    console.error("NGO REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   VERIFY OTP
========================= */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const ngo = await NGO.findOne({ email });
  if (!ngo) {
    return res.status(404).json({ message: "NGO not found" });
  }

  if (
    ngo.resetOTP !== otp ||
    ngo.resetOTPExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified successfully" });
});

module.exports = router;
