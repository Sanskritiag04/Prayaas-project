import { useEffect, useState } from "react";
import axios from "axios";
import NavbarDashboard from "../../components/Volunteer/NavbarDashboard";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import goldBadge from "../../assets/badges/gold-badge.png";
import silverBadge from "../../assets/badges/silver-badge.png";

const badges = [
  { name: "Beginner", image: silverBadge },
  { name: "Active Volunteer", image: goldBadge }
];




export default function VolunteerDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

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

          <button>Edit Profile</button>
          <button className="outline">Change Photo</button>
          <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
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
