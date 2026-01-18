import { useEffect, useState } from "react";
import axios from "axios";
import NavbarDashboard from "../../components/Volunteer/NavbarDashboard";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import goldBadge from "../../assets/badges/gold-badge.png";
import silverBadge from "../../assets/badges/silver-badge.png";
import React, { useRef } from "react";

const badges = [
  { name: "Beginner", image: silverBadge },
  { name: "Active Volunteer", image: goldBadge }
];


export default function VolunteerDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [myEvents, setMyEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);

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
          "Content-Type": "multipart/form-data"
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
    .get("http://localhost:5000/api/event-registration/my-events", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setMyEvents(res.data))
    .catch(() => console.log("Could not load registered events"));

}, []); 

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <NavbarDashboard />

      <div className="dashboard-wrapper">
        
        <div className="profile-card">
          <img src="/profile.png" alt="profile" />
          <h3>{data.name}</h3>
          <p>{data.email}</p>

          <button onClick={() => navigate("/volunteer/edit-profile")}>Edit Profile</button>
<button className="outline" onClick={handlePhotoClick}>
  Change Photo
</button>

<input
  type="file"
  ref={fileInputRef}
  style={{ display: "none" }}
  accept="image/png, image/jpeg"
  onChange={handlePhotoChange}
/>

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

      
        <div className="dashboard-content">

          {/* EVENTS */}
          <section>
            <h2>My Events</h2>
            <div className="event-grid">
              {myEvents.length === 0 ? (
  <p>No events registered yet</p>
) : (
  myEvents.map((e) => (
    <div className="event-card" key={e._id}>
      <img src={`http://localhost:5000${e.image}`} alt={e.title} />
      <h4>{e.title}</h4>
      <p>{new Date(e.start_date).toLocaleDateString()}</p>
      <button onClick={() => setActiveEvent(e)}>View Details</button>
    </div>
  ))
)}

            </div>
          </section>

          {/* BADGES */}
          <section>
            <h2>Badges</h2>
            <div className="badges">
  {badges.map((badge, index) => (
    <div key={index} className="badge-card">
      <img src={badge.image} alt={badge.name} />
      <span>{badge.name}</span>
    </div>
  ))}
</div>


          </section>

        </div>
      </div>

      {activeEvent && (
  <div className="event-overlay">
    <div className="expanded-card">

      {/* CLOSE BUTTON */}
      <button
        className="close-btn"
        onClick={() => setActiveEvent(null)}
      >
        ✕
      </button>

      <img
        src={`http://localhost:5000${activeEvent.image}`}
        alt={activeEvent.title}
      />

      <div className="expanded-content">
        <span className="event-type">{activeEvent.event_type}</span>
        <h2>{activeEvent.title}</h2>

        <p className="description">
          {activeEvent.description}
        </p>

        <div className="meta">
          <p><strong>📍 Location:</strong> {activeEvent.location}</p>
          <p><strong>📅 Start:</strong> {new Date(activeEvent.start_date).toDateString()}</p>
          {activeEvent.end_date && (
            <p><strong>📅 End:</strong> {new Date(activeEvent.end_date).toDateString()}</p>
          )}
          <p><strong>Status:</strong> {activeEvent.status}</p>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}