import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [view, setView] = useState("pending"); 
  const [ngos, setNgos] = useState([]);
  const token = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ volunteers: 0, ngos: 0, events: 0 });
  const [reportedEvents, setReportedEvents] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  alert("Logged out successfully");
  navigate("/login");
};

  useEffect(() => {
  const fetchStats = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStats(res.data);
  };
  fetchStats();
}, []);

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");
    
    if (view === "reported") {
      const res = await axios.get("http://localhost:5000/api/admin/reported-events", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportedEvents(res.data);
      setNgos([]); // Clear NGOs so the other map doesn't interfere
    } else {
      const endpoint = view === "pending" ? "pending-ngos" : "all-ngos";
      const res = await axios.get(`http://localhost:5000/api/admin/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNgos(res.data);
      setReportedEvents([]); // Clear reported events
    }
  } catch (err) {
    console.error("Fetch failed", err);
  }
};

const handleVerify = async (id, status) => {
  let remarks = "";
  if (status === "rejected") {
    remarks = prompt("Enter reason for rejection (e.g., Invalid PAN card):");
    if (!remarks) return; // Cancel if no reason given
  }

  const token = localStorage.getItem("token");
  try {
    await axios.put(`http://localhost:5000/api/admin/verify-ngo/${id}`, 
      { status, remarks }, // Send remarks to backend
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(`NGO ${status} successfully!`);
    fetchData();
  } catch (err) {
    alert("Action failed");
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Delete NGO? This will remove all their events and registrations forever.")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/delete-ngo/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNgos(ngos.filter(n => n._id !== id));
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

  const filteredNgos = ngos.filter(n => 
  n.ngoName.toLowerCase().includes(searchQuery) || 
  n.panNumber.toLowerCase().includes(searchQuery)
    );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-top">
        <h1>Admin Control Center</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
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
  {/* 1. RENDER REPORTED EVENTS VIEW */}
  {view === "reported" ? (
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
            {event.reportReason.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
        <div className="btn-group">
          <button className="reject-btn" onClick={() => handleDeleteEvent(event._id)}>Delete Event</button>
          <button className="approve-btn" onClick={() => handleDismissReport(event._id)}>Dismiss</button>
        </div>
      </div>
    ))
  ) : (
    /* 2. RENDER NGO VIEWS (Pending / All) */
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
            <button className="delete-btn-master" onClick={() => handleDelete(ngo._id)}>Delete Account</button>
          )}
        </div>
      </div>
    ))
  )}
</div>
    </div>
  );
}