import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="common-navbar">
    <div className="common-nav-container">

      <div className="common-logo">
        <div className="common-logo-icon">❤</div>
        <span>Prayaas</span>
      </div>

      <div className="common-nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="common-nav-auth">
        <Link to="/login" className="common-login-btn">
          Login
        </Link>
      </div>

    </div>
  </nav>
);

export default Navbar;
