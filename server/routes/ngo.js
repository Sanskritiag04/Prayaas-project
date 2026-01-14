const express = require("express");
const router = express.Router();
const NGO = require("../models/NGO");
const bcrypt = require("bcryptjs");

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
      street,
      city,
      state,
      pincode,
      password,
      confirmPassword
    } = req.body;

    // Check existing NGO
    const existingNGO = await NGO.findOne({
      $or: [{ email }, { registrationId }, { panNumber }]
    });

    if (existingNGO) {
      return res.status(400).json({
        message: "NGO already registered"
      });
    }
    if (password !== confirmPassword) {
  return res.status(400).json({
    message: "Passwords do not match"
  });
}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const ngo = new NGO({
      ngoName,
      email,
      registrationId,
      panNumber,
      address: {
        street,
        city,
        state,
        pincode
      },
      password: hashedPassword
    });

    await ngo.save();

    res.status(201).json({
      message: "NGO registered successfully"
    });

  } catch (error) {
    console.error("NGO REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
