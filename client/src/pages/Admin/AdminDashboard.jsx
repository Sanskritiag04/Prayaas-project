import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [view, setView] = useState("pending");
  const [ngos, setNgos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ volunteers: 0, ngos: 0, events: 0 });
  const [reportedEvents, setReportedEvents] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    alert("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) { console.error("Stats fetch failed", err); }
    };
    fetchStats();
  }, [token]);

  // Consolidated Fetch Function
  const fetchData = async () => {
    try {
      if (view === "reported-posts") {
        const res = await axios.get("http://localhost:5000/api/posts/reported", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportedPosts(res.data);
        setNgos([]);
        setReportedEvents([]);
      } else if (view === "reported") {
        const res = await axios.get("http://localhost:5000/api/admin/reported-events", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportedEvents(res.data);
        setNgos([]);
        setReportedPosts([]);
      } else {
        const endpoint = view === "pending" ? "pending-ngos" : "all-ngos";
        const res = await axios.get(`http://localhost:5000/api/admin/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNgos(res.data);
        setReportedEvents([]);
        setReportedPosts([]);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handleVerify = async (id, status) => {
    let remarks = "";
    if (status === "rejected") {
      remarks = prompt("Enter reason for rejection (e.g., Invalid PAN card):");
      if (!remarks) return;
    }
    try {
      await axios.put(`http://localhost:5000/api/admin/verify-ngo/${id}`, 
        { status, remarks }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`NGO ${status} successfully!`);
      fetchData();
    } catch (err) { alert("Action failed"); }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Delete this post for policy violation?")) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportedPosts(reportedPosts.filter(p => p._id !== postId));
        alert("Post deleted.");
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Delete this event for policy violation?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/delete-event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportedEvents(reportedEvents.filter(e => e._id !== eventId));
      } catch (err) { alert("Action failed"); }
    }
  };

  const handleDismissReport = async (eventId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/dismiss-report/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportedEvents(reportedEvents.filter(e => e._id !== eventId));
      alert("Reports dismissed.");
    } catch (err) { alert("Action failed"); }
  };

  const handleDismissPost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/posts/dismiss-report/${postId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Remove it from the local state so it disappears from the "Reported Posts" view
    setReportedPosts(reportedPosts.filter(p => p._id !== postId));
    alert("Post reports dismissed successfully.");
  } catch (err) {
    console.error("Dismiss failed:", err);
    alert("Action failed.");
  }
};
  const filteredNgos = ngos.filter(n => 
    n.ngoName.toLowerCase().includes(searchQuery) || 
    n.panNumber.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-top">
          <h1>Admin Control Center</h1>
          <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="admin-stats-bar">
          <div className="stat-card">👥 Volunteers: {stats.volunteers}</div>
          <div className="stat-card">🏢 Total NGOs: {stats.ngos}</div>
          <div className="stat-card">📅 Live Events: {stats.events}</div>
        </div>
        <div className="admin-tabs">
          <button className={view === "pending" ? "active" : ""} onClick={() => setView("pending")}>Pending Approval</button>
          <button className={view === "all" ? "active" : ""} onClick={() => setView("all")}>Manage All NGOs</button>
          <button className={view === "reported" ? "active" : ""} onClick={() => setView("reported")}>Reported Events</button>
          <button className={view === "reported-posts" ? "active" : ""} onClick={() => setView("reported-posts")}>Reported Posts</button>
        </div>
      </div>

      <div className="admin-actions">
        <input 
          type="text" 
          placeholder="Search by NGO Name or PAN..." 
          className="admin-search-bar"
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>

      <div className="ngo-grid">
        {/* VIEW: REPORTED EVENTS */}
        {view === "reported" && (
          reportedEvents.length === 0 ? <p>No reported events.</p> : 
          reportedEvents.map((event) => (
            <div key={event._id} className="ngo-verify-card reported">
              <div className="card-header">
                <h3>🚨 {event.title}</h3>
                <span className="badge badge-danger">{event.reportCount} Reports</span>
              </div>
              <p><strong>NGO:</strong> {event.ngo_id?.ngoName}</p>
              <div className="report-reasons">
                <strong>Reasons:</strong>
                <ul>
                  {event.reportReason?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div className="btn-group">
                <button className="reject-btn" onClick={() => handleDeleteEvent(event._id)}>Delete Event</button>
                <button className="approve-btn" onClick={() => handleDismissReport(event._id)}>Dismiss</button>
              </div>
            </div>
          ))
        )}

        {/* VIEW: REPORTED POSTS */}
        {view === "reported-posts" && (
          reportedPosts.length === 0 ? <p>No reported community posts.</p> : 
          reportedPosts.map((post) => (
            <div key={post._id} className="ngo-verify-card reported">
              <div className="card-header">
                <h3>🖼️ Post by {post.ngoName}</h3>
                <span className="badge badge-danger">{post.reports?.length || 0} Reports</span>
              </div>
              <p className="post-caption-preview">"{post.caption}"</p>
              <div className="document-preview">
                 <img 
                   src={`http://localhost:5000${post.images?.[0]}`} 
                   alt="Post Preview" 
                   onClick={() => window.open('/community', '_blank')} 
                 />
              </div>
              <div className="report-reasons">
                <strong>Reasons:</strong>
                <ul>
                  {post.reports?.map((r, i) => <li key={i}>{r.reason}</li>)}
                </ul>
              </div>
              <div className="btn-group">
                <button className="reject-btn" onClick={() => handleDeletePost(post._id)}>Delete Post</button>
                <button className="approve-btn" onClick={() => handleDismissPost(post._id)}>
          Dismiss 
        </button>
              </div>
            </div>
          ))
        )}

        {/* VIEW: NGO MANAGEMENT (Pending/All) */}
        {(view === "pending" || view === "all") && (
          filteredNgos.length === 0 ? <p>No records found.</p> : 
          filteredNgos.map(ngo => (
            <div key={ngo._id} className={`ngo-verify-card ${ngo.status}`}>
              <div className="card-header">
                <h3>{ngo.ngoName}</h3>
                <span className={`badge ${ngo.status}`}>{ngo.status}</span>
              </div>
              <p>PAN: {ngo.panNumber}</p>
              {view === "pending" && (
                <div className="document-preview">
                  <img src={`http://localhost:5000${ngo.panCard}`} alt="PAN" onClick={() => window.open(`http://localhost:5000${ngo.panCard}`)} />
                </div>
              )}
              <div className="btn-group">
                {ngo.status === "pending" && (
                  <>
                    <button className="approve-btn" onClick={() => handleVerify(ngo._id, "verified")}>Approve</button>
                    <button className="reject-btn" onClick={() => handleVerify(ngo._id, "rejected")}>Reject</button>
                  </>
                )}
                {view === "all" && (
                  <button className="delete-btn-master" onClick={() => {
                    if (window.confirm("Delete NGO?")) {
                      // Call your delete NGO logic here
                    }
                  }}>Delete Account</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}