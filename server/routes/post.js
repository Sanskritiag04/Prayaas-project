const express = require('express');
const router = express.Router();
const path = require('path');
const Post = require("../models/Post");
const multer = require('multer'); 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/feed');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 1. Create a Post (NGO only)
router.post('/create',upload.array('images', 5), async (req, res) => {
  try {
    const { ngo_id, ngoName, caption, image } = req.body;
    const imagePaths = req.files.map(file => `/uploads/feed/${file.filename}`);
    // Check if critical data is missing
    if (!ngo_id || !caption) {
      return res.status(400).json({ message: "NGO ID and Caption are required" });
    }

    const newPost = new Post({
      ngo_id,
      ngoName: ngoName || "Anonymous NGO",
      caption,
      images: imagePaths,
      likes: [] // Initialize empty likes array
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Backend Error:", err); // This will show the real error in your terminal
    res.status(500).json(err);
  }
});

// 2. Get All Posts (For the Feed)
router.get('/all', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. Like/Unlike a Post
router.put('/like/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const { volunteerId } = req.body;
    
    if (!post.likes.includes(volunteerId)) {
      await post.updateOne({ $push: { likes: volunteerId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: volunteerId } });
      res.status(200).json("Post unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route: PUT http://localhost:5000/api/posts/report/:postId
router.put('/report/:postId', async (req, res) => {
  try {
    const { volunteerId, reason } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json("Post not found");

    // Logic: Add the report to the array
    const reportEntry = {
      reporterId: volunteerId,
      reason: reason
    };

    await post.updateOne({ 
      $push: { reports: reportEntry },
      $set: { isReported: true } 
    });

    res.status(200).json("Post has been reported to Admin.");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/reported', async (req, res) => {
  try {
    // Look for posts where the reports array is NOT empty
    const posts = await Post.find({ isReported: true }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// --- Inside routes/post.js ---

// 1. Get Reported Posts
router.get('/reported', async (req, res) => {
  try {
    const posts = await Post.find({ isReported: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json(err); }
});


router.put('/dismiss-report/:postId', async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $set: { reports: [], isReported: false }
    });
    res.status(200).json("Report dismissed");
  } catch (err) { res.status(500).json(err); }
});


router.delete('/:postId', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post deleted");
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;