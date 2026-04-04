import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavbarDashboard.css";

export default function NavbarDashboard({ setShowModal, ngoStatus }) {
  const location = useLocation();
  const userRole = localStorage.getItem("userRole"); 

  return (
    <nav className="dash-navbar">
      <div className="nav-left">Prayaas</div>

      <div className="nav-center">
        {/* Dynamic Dashboard Link */}
        {userRole && (
    <Link 
      to={userRole === "ngo" ? "/ngo/dashboard" : "/dashboard"} 
      className={location.pathname.includes("dashboard") ? "active" : ""}
    >
      Dashboard
    </Link>
  )}

        <Link to="/community" className={location.pathname === "/community" ? "active" : ""}>
          Community Feed
        </Link>

        {/* Volunteer Only: Events & Leaderboard */}
        {userRole === "volunteer" && (
          <>
            <Link to="/events" className={location.pathname === "/events" ? "active" : ""}>
              Events
            </Link>
            <Link to="/leaderboard" className={location.pathname === "/leaderboard" ? "active" : ""}>
              Leaderboard
            </Link>
          </>
        )}

        {/* NGO Only: Management Links (Optional for your demo) */}
        {userRole === "ngo" && (
          <>
          <Link to="/events" className={location.pathname === "/events" ? "active" : ""}>
            Events
          </Link>
          <Link to="/leaderboard" className={location.pathname === "/leaderboard" ? "active" : ""}>
              Leaderboard
            </Link>
            </>
        )}
      </div>

      <div className="nav-right">
        {/* NGO + Verified + Community Page Check */}
        {userRole === "ngo" && 
         location.pathname === "/community" && 
         ngoStatus === "verified" && (
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