import { useEffect, useState } from "react";
import axios from "axios";
import NavbarDashboard from "../../components/Volunteer/NavbarDashboard";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import goldBadge from "../../assets/badges/gold-badge.png";
import silverBadge from "../../assets/badges/silver-badge.png";
import pro_philo from "../../assets/badges/pro_philo.png";
import comm_hero from "../../assets/badges/comm_hero.png";
import React, { useRef } from "react";

const badgeList = [
  { name: "Beginner", image: silverBadge, minPoints: 0 },
  { name: "Active Volunteer", image: goldBadge, minPoints: 50 },
  { name: "Pro Philanthropist", image: pro_philo, minPoints: 200 },
  { name: "Community Hero", image: comm_hero, minPoints: 500 }
];

// const badgeMilestones = [
//   { name: "Beginner", minPoints: 0 },
//   { name: "Active Volunteer", minPoints: 50 },
//   { name: "Pro Philanthropist", minPoints: 200 },
//   { name: "Community Hero", minPoints: 500 }
// ];


export default function VolunteerDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [myEvents, setMyEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [certificates, setCertificates] = useState([]);
const [showSettings, setShowSettings] = useState(false);
const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });

const handlePasswordChange = async (e) => {
  e.preventDefault();
  try {
    await axios.put("http://localhost:5000/api/volunteer/change-password", passwordForm, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    alert("Password updated successfully");
    setShowSettings(false);
    setPasswordForm({ oldPassword: "", newPassword: "" });
  } catch (err) {
    alert(err.response?.data?.message || "Password update failed");
  }
};

const handleDeleteAccount = async () => {
  const confirm = window.confirm("WARNING: This is permanent. All your points and certificates will be lost. Delete anyway?");
  if (confirm) {
    try {
      await axios.delete("http://localhost:5000/api/volunteer/delete-account", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      localStorage.clear();
      navigate("/");
    } catch (err) {
      alert("Failed to delete account");
    }
  }
};

const handlePhotoClick = () => {
  fileInputRef.current.click();
};

const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    alert("Only JPG or PNG allowed");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file);

  try {
    await axios.put(
      "http://localhost:5000/api/volunteer/upload-photo",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          //"Content-Type": "multipart/form-data"
        }
      }
    );

    alert("Profile photo updated");
    window.location.reload();

  } catch (err) {
    alert("Upload failed");
  }
};


const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) return;

  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  navigate("/");
};

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

 
  axios
    .get("http://localhost:5000/api/volunteer/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setData(res.data.volunteer))
    .catch(() => alert("Unauthorized"));

 axios
  .get("http://localhost:5000/api/volunteer/my-certificates", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => setCertificates(res.data))
  .catch(() => console.log("Could not load certificates"));

  axios
    .get("http://localhost:5000/api/event-registration/my-events", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setMyEvents(res.data))
    .catch(() => console.log("Could not load registered events"));

}, []); 

  if (!data) return <p>Loading...</p>;

  // ✅ PERFORM CALCULATIONS AFTER DATA IS GUARANTEED TO EXIST
  const currentPoints = data.points || 0;
  const nextBadge = badgeList.find(b => b.minPoints > currentPoints) || null;
  const currentBadge = [...badgeList].reverse().find(b => b.minPoints <= currentPoints);

  let progressPercent = 100;
  if (nextBadge) {
    const range = nextBadge.minPoints - currentBadge.minPoints;
    const progressInsideRange = currentPoints - currentBadge.minPoints;
    progressPercent = (progressInsideRange / range) * 100;
  }

 return (
  <>
    <div className="dashboard-wrapper">
      {/* --- FIXED LEFT SIDEBAR --- */}
      <aside className="profile-card">
    <div className="profile-img-container">
      <img
        src={
          data.photo
            ? `http://localhost:5000/${data.photo}`
            : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
        }
        alt="profile"
      />
    </div>
    
    <h3>{data.name}</h3>
    <p className="user-email">{data.email}</p>

    <div className="sidebar-actions">
      {/* Grouped Change Photo with other buttons */}
      <button className="outline" onClick={handlePhotoClick}>
        Change Photo
      </button>
      
      <button className="primary-btn" onClick={() => navigate("/volunteer/edit-profile")}>
        Edit Profile
      </button>
      
      <button className="primary-btn" onClick={() => setShowSettings(true)}>
        Account Settings
      </button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/png, image/jpeg"
        onChange={handlePhotoChange}
      />
    </div>

    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </aside>

      {/* --- SCROLLABLE RIGHT CONTENT --- */}
      <main className="dashboard-content">
        {/* Navbar inside the scrollable area so it can be sticky at the top */}
        <NavbarDashboard />

         {/* ✅ EVENTS SECTION */}
          <section>
            <div className="section-header">
               <h2>My Registered Events</h2>
            </div>
            <div className="event-grid">
              {myEvents.length === 0 ? (
                <div className="empty-state">No events registered yet</div>
              ) : (
                myEvents.map((e) => (
                  <div className="event-card" key={e._id}>
                    <img src={`http://localhost:5000${e.image}`} alt={e.title} />
                    <div className="event-card-body">
                      <h4>{e.title}</h4>
                      <p>📅 {new Date(e.start_date).toLocaleDateString()}</p>
                      <button onClick={() => setActiveEvent(e)}>View Details</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        <div className="content-padding">
          {/* ✅ PROGRESS & ACHIEVEMENTS SECTION */}
          <section className="achievements-section">
            <div className="points-header">
              <h2>Badges & Achievements</h2>
              <span className="total-points">⭐ {currentPoints} Points</span>
            </div>

            {nextBadge && (
              <div className="progress-container">
                <div className="progress-labels">
                  <span>Current: <strong>{currentBadge.name}</strong></span>
                  <span>Next: <strong>{nextBadge.name}</strong></span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="progress-hint">
                  Collect {nextBadge.minPoints - currentPoints} more points to unlock {nextBadge.name}!
                </p>
              </div>
            )}

            <div className="badges">
              {badgeList.map((badge, index) => {
                const isUnlocked = currentPoints >= badge.minPoints;
                return (
                  <div key={index} className={`badge-card ${isUnlocked ? "unlocked" : "locked"}`}>
                    <img src={badge.image} alt={badge.name} />
                    <span>{badge.name}</span>
                    {!isUnlocked && <small>Needs {badge.minPoints} pts</small>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ✅ CERTIFICATES SECTION */}
          <section>
            <h2>My Certificates</h2>
            {certificates.length === 0 ? (
              <p className="empty-state">No certificates earned yet.</p>
            ) : (
              <div className="certificates-container">
                {certificates.map((c) => (
                  <div key={c._id} className="certificate-card">
                    <div className="cert-icon">📜</div>
                    <h4>{c.event_id?.title}</h4>
                    <p>Certificate of Participation</p>
                    <a
                      href={`http://localhost:5000/${c.certificate}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download PDF
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>

    {/* --- MODALS (Outside the grid to prevent blurring issues) --- */}
    {activeEvent && (
      <div className="event-overlay">
        <div className="expanded-card">
          <button className="close-btn" onClick={() => setActiveEvent(null)}>✕</button>
          <img src={`http://localhost:5000${activeEvent.image}`} alt={activeEvent.title} />
          <div className="expanded-content">
            <span className="event-type">{activeEvent.event_type}</span>
            <h2>{activeEvent.title}</h2>
            <p className="description">{activeEvent.description}</p>
            <div className="meta">
              <p><strong>🏢 Hosted By:</strong> {activeEvent.ngo_id?.ngoName || "Prayaas Partner"}</p>
              <p><strong>📍 Location:</strong> {activeEvent.location}</p>
              <p><strong>📅 Start:</strong> {new Date(activeEvent.start_date).toDateString()}</p>
              {activeEvent.end_date && <p><strong>📅 End:</strong> {new Date(activeEvent.end_date).toDateString()}</p>}
              <p><strong>Status:</strong> {activeEvent.status}</p>
            </div>
          </div>
        </div>
      </div>
    )}

    {showSettings && (
      <div className="event-overlay">
        <div className="settings-modal">
          <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
          <h2>Account Settings</h2>
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
          <hr />
          <div className="danger-zone">
            <h4>Danger Zone</h4>
            <p>Once you delete your account, there is no going back.</p>
            <button className="delete-btn" onClick={handleDeleteAccount}>Delete My Account</button>
          </div>
        </div>
      </div>
    )}
  </>
);
}