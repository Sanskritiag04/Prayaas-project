import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarDashboard from '../components/common/NavbarDashboard';
import './CommunityFeed.css';

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
const [reportingPostId, setReportingPostId] = useState(null);
const [reportReason, setReportReason] = useState("");

  const volunteerId = localStorage.getItem("userId"); 
  const userRole = localStorage.getItem("userRole");
  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts/all');
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // --- HANDLE SUBMIT STORY ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const storedId = localStorage.getItem("userId");
  const storedName = localStorage.getItem("userName");

  if (!storedId || storedId === "undefined") {
    alert("Session error: User ID not found. Please logout and login again.");
    return;
  }

  if (selectedFiles.length === 0) {
    alert("Please select at least one photo!");
    return;
  }
const formData = new FormData();
    formData.append("ngo_id", storedId);
    formData.append("ngoName", storedName);
    formData.append("caption", caption);
    
    selectedFiles.forEach((file) => {
  formData.append("images", file); 
});
//     for (let i = 0; i < selectedFiles.length; i++) {
//     formData.append("images", selectedFiles[i]);
//   }

  // Debug: Check if multiple files are in the FormData before sending
  for (var pair of formData.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
  }

 try {
      await axios.post('http://localhost:5000/api/posts/create', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setShowModal(false);
      setCaption("");
      setSelectedFiles([]);
      fetchPosts();
      alert("Impact Story Posted! 🎉");
    } catch (err) {
      console.error(err);
    }
};

const handleLike = async (postId) => {
  if (!volunteerId || volunteerId === "undefined") {
    alert("Please login as a volunteer to like posts!");
    return;
  }

  try {
    await axios.put(`http://localhost:5000/api/posts/like/${postId}`, { 
      volunteerId: volunteerId // Pass this in req.body
    });
    fetchPosts(); // Refresh feed to show the new like count
  } catch (err) {
    console.error("Error liking post:", err);
  }
};

const handleReportSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://localhost:5000/api/posts/report/${reportingPostId}`, {
      volunteerId: volunteerId,
      reason: reportReason
    });

    alert("Thank you. This post has been flagged for admin review.");
    setShowReportModal(false);
    setReportReason("");
  } catch (err) {
    console.error("Report failed:", err);
  }
};

  return (
    <div className="community-page-wrapper">
      <NavbarDashboard setShowModal={setShowModal}/>
      
      <div className="feed-container">
        <div className="posts-column">
          {posts.map((post) => (
  <div className="post-card" key={post._id}>
    <div className="post-header">
      <div className="header-info">
      <strong>{post.ngoName}</strong>
      <small>{new Date(post.createdAt).toLocaleDateString()}</small>
    </div>
    
    {/* ✅ REPORT SYMBOL (Flag Icon) */}
    {userRole === "volunteer" && (
      <button 
        className="report-post-btn" 
        onClick={() => {
          setReportingPostId(post._id);
          setShowReportModal(true);
        }}
        title="Report this post"
      >
        Report🚩
      </button>
    )}
    </div>

    {/* --- INSTAGRAM STYLE SLIDER --- */}
    <div className="post-slider-container">
      <div className="post-slider">
        {post.images && post.images.map((img, index) => (
          <img 
            key={index}
            src={`http://localhost:5000${img}`} 
            alt={`Impact ${index + 1}`} 
            className="slider-img"
          />
        ))}
      </div>
      
      {/* Indicator Dots (Instagram style) */}
      {post.images?.length > 1 && (
        <div className="slider-dots">
          {post.images.map((_, i) => (
            <div key={i} className="dot"></div>
          ))}
        </div>
      )}
    </div>

    <div className="post-body">
      <p>{post.caption}</p>
      <button 
        className={`like-btn ${post.likes?.includes(volunteerId) ? 'liked' : ''}`} 
        onClick={() => handleLike(post._id)}
      >
        {post.likes?.includes(volunteerId) ? '❤️' : '🤍'} {post.likes?.length || 0} Likes
      </button>
    </div>
  </div>
))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="impact-modal">
            <h2>Share Real Impact</h2>
            <form onSubmit={handlePostSubmit} className="impact-form">
              <label>Caption</label>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} required />

              <label>Upload Event Photos (Multiple)</label>
              <input 
                type="file" 
                name="images"
                multiple 
                accept="image/*" 
                onChange={handleFileChange}
                required 
              />
              <div className="file-previews">
  {selectedFiles.map((file, index) => (
    <div key={index} className="preview-item">
      <span>{file.name}</span>
      <button 
        type="button" 
        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
      >
        ✕
      </button>
    </div>
  ))}
</div>
              
              <div className="modal-actions">
                <button type="submit" className="submit-story-btn">Post to Feed</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReportModal && (
  <div className="modal-overlay">
    <div className="impact-modal">
      <div className="modal-header">
        <h2>Report Post</h2>
        <button className="close-x" onClick={() => setShowReportModal(false)}>✕</button>
      </div>
      <form onSubmit={handleReportSubmit} className="impact-form">
        <label>Why are you reporting this post?</label>
        <select 
          value={reportReason} 
          onChange={(e) => setReportReason(e.target.value)} 
          required
          className="report-select"
        >
          <option value="">Select a reason</option>
          <option value="Inappropriate Content">Inappropriate Content</option>
          <option value="Misleading Information">Misleading Information</option>
          <option value="Spam">Spam</option>
          <option value="Other">Other</option>
        </select>
        
        {reportReason === "Other" && (
          <textarea 
            placeholder="Please specify..." 
            onChange={(e) => setReportReason(e.target.value)}
            required
          />
        )}

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={() => setShowReportModal(false)}>Cancel</button>
          <button type="submit" className="submit-report-btn">Submit Report</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default CommunityFeed;