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

const handlePhotoClick = () => {
  fileInputRef.current.click();
};

const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // validation
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
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  navigate("/");
};
  useEffect(() => {
    axios.get("http://localhost:5000/api/volunteer/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setData(res.data.volunteer))
    .catch(() => alert("Unauthorized"));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <NavbarDashboard />

      <div className="dashboard-wrapper">
        {/* LEFT */}
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

        {/* RIGHT */}
        <div className="dashboard-content">

          {/* EVENTS */}
          <section>
            <h2>My Events</h2>
            <div className="event-grid">
              {data.myEvents.map((e, i) => (
                <div className="event-card" key={i}>
                  <img src="/event.jpg" alt="" />
                  <h4>{e.title}</h4>
                  <p>{e.date}</p>
                  <button>View Details</button>
                </div>
              ))}
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
    </>
  );
}
