const express = require("express");
const router = express.Router();
const NGO = require("../models/NGO");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");


router.post("/register", async (req, res) => {
  try {
    let {
      ngoName,
      email,
      registrationId,
      panNumber,
      state,
      pincode,
      password,
      confirmPassword
    } = req.body;

    email = email.trim().toLowerCase();
    registrationId = registrationId.trim();
    panNumber = panNumber.trim().toUpperCase();
    ngoName = ngoName.trim();

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingNGO = await NGO.findOne({
      $or: [
        { email },
        { registrationId },
        { panNumber }
      ]
    });

    if (existingNGO) {
      if (existingNGO.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingNGO.registrationId === registrationId) {
        return res.status(400).json({ message: "Registration ID already exists" });
      }
      if (existingNGO.panNumber === panNumber) {
        return res.status(400).json({ message: "PAN number already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ngo = new NGO({
      ngoName,
      email,
      registrationId,
      panNumber,
      state,
      pincode: Number(pincode),
      password: hashedPassword
    });

    await ngo.save();

    res.status(201).json({ message: "NGO registered successfully" });

  } catch (error) {
    console.error("NGO REGISTER ERROR 👉", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate field detected. Please check email, PAN or registration ID."
      });
    }

    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    // check NGO exists
    const ngo = await NGO.findOne({ email });
    if (!ngo) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // create token
    const token = jwt.sign(
      {
        id: ngo._id,
        role: "ngo"
      },
      "PRAYAAS_SECRET",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      ngo: {
        id: ngo._id,
        name: ngo.ngoName,
        email: ngo.email
      }
    });

  } catch (error) {
    console.error("NGO LOGIN ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dashboard", auth("ngo"), async (req, res) => {
  try {

    const ngo = await NGO.findById(req.user.id).select("-password");

    res.json({
      message: "NGO dashboard data",
      ngo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
});
// EDIT NGO PROFILE
router.put("/edit-profile", auth("ngo"), async (req, res) => {
  try {
    const { ngoName, state, pincode } = req.body;

    // basic validation
    if (!ngoName || !state || !pincode) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const updatedNGO = await NGO.findByIdAndUpdate(
      req.user.id,
      {
        ngoName: ngoName.trim(),
        state: state.trim(),
        pincode: Number(pincode)
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "NGO profile updated successfully",
      ngo: updatedNGO
    });

  } catch (error) {
    console.error("EDIT NGO PROFILE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});
// UPDATE NGO PROFILE
router.put("/profile", auth("ngo"), async (req, res) => {
  try {
    const { ngoName, state, pincode } = req.body;

    const updatedNGO = await NGO.findByIdAndUpdate(
      req.user.id,
      {
        ngoName,
        state,
        pincode
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "NGO profile updated successfully",
      ngo: updatedNGO
    });

  } catch (error) {
    console.error("NGO UPDATE ERROR 👉", error);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
