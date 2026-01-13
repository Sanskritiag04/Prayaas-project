const express = require("express");
const router = express.Router();
const Volunteer = require("../models/volunteer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/* =========================
   VOLUNTEER REGISTRATION
   ========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, age, address, password } = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: "Volunteer already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new volunteer
    const volunteer = new Volunteer({
      name,
      email,
      phone,
      age,
      address,
      password: hashedPassword
    });

    await volunteer.save();

    // Generate JWT
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
  res.status(500).json({
    message: "Server error",
    error: error.message
  });
}

});

module.exports = router;

// const express = require("express");
// const router = express.Router();

// /* =========================
//    VOLUNTEER REGISTRATION
//    (NO DB, NO JWT – TEST ONLY)
//    ========================= */
// router.post("/register", (req, res) => {
//   const { name, email, phone, age, address, password } = req.body;

//   console.log("Volunteer data received:");
//   console.log(req.body);

//   // Fake success response
//   res.status(200).json({
//     message: "Volunteer data received successfully",
//     data: {
//       name,
//       email,
//       phone,
//       age,
//       address
//     }
//   });
// });

// module.exports = router;
