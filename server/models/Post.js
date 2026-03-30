const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  ngoName: { type: String }, // Storing name for quick access
  caption: { type: String, required: true },
  images: [{ type: String }], // Path to the uploaded image/video
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }], // Array of volunteer IDs who liked it
  reports: [{
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
    reason: String,
    reportedAt: { type: Date, default: Date.now }
  }],
  isReported: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);