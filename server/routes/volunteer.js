const express = require("express");
const router = express.Router();
const Volunteer = require("../models/volunteer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const generateOTP = require("../utils/generateOTP");
/* =====================
   SEND OTP
===================== */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const volunteer = await Volunteer.findOne({ email });
  if (!volunteer) {
    return res.status(404).json({ message: "Email not registered" });
  }

  const otp = generateOTP();

  volunteer.resetOTP = otp;
  volunteer.resetOTPExpiry = Date.now() + 60 * 1000; // 1 minute
  await volunteer.save();

  res.json({
    message: "OTP sent to your email",
    otp // ⚠️ DUMMY (remove later)
  });
});

/* =====================
   VERIFY OTP
===================== */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const volunteer = await Volunteer.findOne({ email });
  if (!volunteer) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    volunteer.resetOTP !== otp ||
    volunteer.resetOTPExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified successfully" });
});

/* =========================
   VOLUNTEER REGISTRATION
   ========================= */

router.post("/register", async (req, res) => {
  try {
    const {
  name,
  email,
  phone,
  age,
  city,
  state,
  pincode,
  password,
  confirmPassword
} = req.body;


    // 1️⃣ Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2️⃣ Check existing volunteer
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: "Volunteer already registered" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Save volunteer (NO confirmPassword)
    const volunteer = new Volunteer({
    name,
    email,
    phone,
  age,
  city,
  state,
  pincode,
  password: hashedPassword
});


    await volunteer.save();

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      { id: volunteer._id, role: "volunteer" },
      "PRAYAAS_SECRET",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Volunteer registered successfully",
      token
    });

  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   VOLUNTEER LOGIN
   ========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if volunteer exists
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: volunteer._id, role: "volunteer" },
      "PRAYAAS_SECRET",
      { expiresIn: "1h" }
    );

    // 4. Success response
    res.status(200).json({
      message: "Login successful",
      token,
      volunteer: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   VOLUNTEER DASHBOARD
========================= */
router.get("/dashboard", auth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.user.id).select("-password");

    res.status(200).json({
      message: "Volunteer dashboard data",
      volunteer: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        badges: [{
    name: "Beginner",
    image: "beginner.png"
  },
  {
    name: "Active Volunteer",
    image: "gold.png"
  }], // dummy for now
        myEvents: [
          { title: "Beach Cleanup", date: "2025-02-10" },
          { title: "Food Donation Drive", date: "2025-01-20" }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error" });
  }
});



module.exports= router;