const express = require("express");
const router = express.Router();
const Volunteer = require("../models/volunteer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const generateOTP = require("../utils/generateOTP");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/PNG allowed"), false);
    }
  },
  storage
});



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
    otp 
  });
});

router.put(
  "/upload-photo",
  auth,
  upload.single("photo"),
  async (req, res) => {
    try {
      const volunteer = await Volunteer.findById(req.user.id);
      volunteer.photo = `uploads/profile/${req.file.filename}`;
      await volunteer.save();

      res.json({ message: "Photo uploaded" });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);



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


    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

   
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: "Volunteer already registered" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
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


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

 
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

 
    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

 
    const token = jwt.sign(
  {
    id: volunteer._id,
    role: "volunteer" 
  },
  "PRAYAAS_SECRET",
  { expiresIn: "1d" }
);

  
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



router.get("/dashboard", auth("volunteer"), async (req, res) => {
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
  }],
        myEvents: []
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error" });
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.user.id).select("-password");
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});


router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, age, city, state, pincode } = req.body;

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        age,
        city,
        state,
        pincode
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      volunteer: updatedVolunteer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
});


module.exports= router;