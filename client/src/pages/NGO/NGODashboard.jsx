import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NGODashboard.css";

export default function NGODashboard() {

  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [events, setEvents] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });

const handlePasswordChange = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    await axios.put("http://localhost:5000/api/ngo/change-password", passwordForm, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Password updated!");
    setShowSettings(false);
  } catch (err) {
    alert(err.response?.data?.message || "Update failed");
  }
};

const handleDeleteAccount = async () => {
  const confirm = window.confirm("CRITICAL WARNING: This will permanently delete your NGO profile and ALL your posted events. Volunteers will lose their registrations. Proceed?");
  if (confirm) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/ngo/delete-account", {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert("Delete failed");
    }
  }
};

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://localhost:5000/api/ngo/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      //console.log("NGO DATA:", res.data.ngo); 
      setNgo(res.data.ngo);
    })
    .catch(() => navigate("/login"));

   
    axios.get("http://localhost:5000/api/events/ngo-events", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setEvents(res.data))
    .catch(err => console.log(err));

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleDelete = async (eventId) => {
  if (window.confirm("Are you sure? This will remove all registered volunteers and delete the event.")) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/events/delete-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(res.data.message);
      
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting event");
    }
  }
};


  return (
    <div className="ngo-dashboard">
      <div className="ngo-left">

       
        <img
          src={
            ngo?.photo
              ? `http://localhost:5000${ngo.photo}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="NGO"
          className="ngo-photo"
          onError={(e) => {
            e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
          }}
        />

        <h3>{ngo?.ngoName || "NGO Name"}</h3>

        <button
          className="edit-btn"
          onClick={() => navigate("/ngo/edit-profile")}
        >
          Edit NGO Details
        </button>

        <button 
  className="settings-btn-ngo" 
  onClick={() => setShowSettings(true)}
>
  Settings
</button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* RIGHT */}
      <div className="ngo-right">

        {/* FILTER */}
        <div className="ngo-topbar">

          <div className="filters">

            <button
              className={filter === "upcoming" ? "active" : ""}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming Events
            </button>

            <button
              className={filter === "past" ? "active" : ""}
              onClick={() => setFilter("past")}
            >
              Past Events
            </button>

          </div>

          {ngo?.status === "verified" ? (
    <button className="post-btn" onClick={() => navigate("/ngo/post-event")}>
      + Post Event
    </button>
  ) : (
    <div className="status-notice">
      {ngo?.status === "pending" ? 
        "Account under verification. You can post events once approved." : 
        "Account rejected. Please contact admin."}
    </div>
  )}

        </div>

        {/* EVENTS */}
        <div className="events-list">

          {events
            .filter(e => e.status === filter)
            .map(event => (

              <div className="event-card" key={event._id}>

                {/* ✅ EVENT IMAGE SAFE */}
                <img
                  src={`http://localhost:5000${event.image}`}
                  alt={event.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200";
                  }}
                />

                <div className="event-info">

                  <h3>{event.title}</h3>

                  <p>📍 {event.location}</p>

                  <p>
                    📅 {new Date(event.start_date).toLocaleDateString()}
                  </p>

                  <p>Status: {event.status}</p>

                  <button
  className="view-btn"
  onClick={() => navigate(`/ngo/volunteers/${event._id}`)}
>
  See Volunteers
</button>
{filter === "upcoming" && (
  <button
    className="delete-btn"
    style={{ 
      backgroundColor: "#dc3545", 
      color: "white", 
      padding: "8px 15px", 
      border: "none", 
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "10px"
    }}
    onClick={() => handleDelete(event._id)}
  >
    Delete
  </button>
)}

                </div>

              </div>

          ))}

        </div>

      </div>


{showSettings && (
        <div className="event-overlay">
          <div className="settings-modal">
            <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
            <h2>NGO Account Settings</h2>
            
            <form onSubmit={handlePasswordChange} className="settings-form">
              <h4>Change Password</h4>
              <input 
                type="password" 
                placeholder="Current Password" 
                required 
                onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})} 
              />
              <input 
                type="password" 
                placeholder="New Password" 
                required 
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
              />
              <button type="submit" className="save-btn">Update Password</button>
            </form>

            <hr style={{ margin: "20px 0" }} />

            <div className="danger-zone">
              <h4>Danger Zone</h4>
              <p>Deleting your account will remove all your events and data permanently.</p>
              <button className="delete-btn" onClick={handleDeleteAccount}>
                Delete NGO Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}