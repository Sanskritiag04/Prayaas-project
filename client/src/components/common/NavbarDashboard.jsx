import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavbarDashboard.css";

export default function NavbarDashboard({ setShowModal }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user role from storage
  const userRole = localStorage.getItem("userRole"); 

  return (
    <nav className="dash-navbar">
      {/* LEFT: Logo */}
      <div className="nav-left">Prayaas</div>

      {/* CENTER: Navigation Links */}
      <div className="nav-center">
        <Link 
          to={userRole === "ngo" ? "/ngo/dashboard" : "/dashboard"} 
          className={location.pathname.includes("dashboard") ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link to="/community" className={location.pathname === "/community" ? "active" : ""}>
          Community Feed
        </Link>

        <Link to="/events" className={location.pathname === "/events" ? "active" : ""}>
          Events
        </Link>

        <Link to="/leaderboard" className={location.pathname === "/leaderboard" ? "active" : ""}>
          Leaderboard
        </Link>
      </div>

      {/* RIGHT: Conditional Post Button for NGOs */}
      <div className="nav-right">
        {userRole === "ngo" && location.pathname === "/community" && (
          <button 
            className="nav-post-story-btn" 
            onClick={() => setShowModal(true)}
          >
            + Post Story
          </button>
        )}
      </div>
    </nav>
  );
}