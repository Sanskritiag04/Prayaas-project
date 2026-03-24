const express = require("express");
const router = express.Router();
const NGO = require("../models/NGO");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Ensure folder exists
const uploadPath = "uploads/profile";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ MULTER STORAGE FIXED
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.id : "unknown"; // FIX
    cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/PNG allowed"), false);
    }
  }
});

// ================= REGISTER =================
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
      $or: [{ email }, { registrationId }, { panNumber }]
    });

    if (existingNGO) {
      return res.status(400).json({ message: "NGO already exists" });
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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    const ngo = await NGO.findOne({ email });
    if (!ngo) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: ngo._id, role: "ngo" },
      "PRAYAAS_SECRET",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      ngo: {
        id: ngo._id,
        name: ngo.ngoName,
        email: ngo.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DASHBOARD =================
router.get("/dashboard", auth("ngo"), async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user.id).select("-password");
    res.json({ ngo });
  } catch {
    res.status(500).json({ message: "Dashboard error" });
  }
});

// ================= UPDATE PROFILE (WITH PHOTO) =================
router.put("/profile", auth("ngo"), (req, res) => {

  upload.single("photo")(req, res, async (err) => {

    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { ngoName, state, pincode } = req.body;

      // ✅ VALIDATION FIX
      if (!ngoName || !state || !pincode) {
        return res.status(400).json({ message: "All fields required" });
      }

      const updateData = {
        ngoName: ngoName.trim(),
        state: state.trim(),
        pincode: Number(pincode)
      };

      // ✅ ADD PHOTO IF EXISTS
      if (req.file) {
        updateData.photo = `/uploads/profile/${req.file.filename}`;
      }

      const updatedNGO = await NGO.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select("-password");

      res.json({
        message: "Profile updated successfully",
        ngo: updatedNGO
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }

  });

});

const generateOTP = require("../utils/generateOTP");

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const ngo = await NGO.findOne({ email: email.trim().toLowerCase() });
    if (!ngo) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const otp = generateOTP();

    ngo.resetOTP = String(otp);
    ngo.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    await ngo.save();

    //console.log("NGO OTP:", otp); 

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const ngo = await NGO.findOne({ email: email.trim().toLowerCase() });

    if (!ngo) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      String(ngo.resetOTP) !== String(otp) ||
      ngo.resetOTPExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
//     const token = jwt.sign(
//   { id: ngo._id, role: "ngo" }, // or volunteer._id
//   "PRAYAAS_SECRET",
//   { expiresIn: "1d" }
// );

// res.json({
//   message: "OTP verified successfully",
//   token
// });
res.json({message: "OTP verified successfully"});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  const user = await NGO.findOne({ email }); // or NGO

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  // clear OTP
  user.resetOTP = null;
  user.resetOTPExpiry = null;

  await user.save();

  res.json({ message: "Password updated successfully" });
});
module.exports = router;