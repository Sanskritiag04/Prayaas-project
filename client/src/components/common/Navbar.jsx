import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar">
    <div className="nav-container">

      <div className="logo">
        <div className="logo-icon">❤</div>
        <span>Prayaas</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="nav-auth">
        <Link to="/login" className="login-btn">
          Login
        </Link>
      </div>

    </div>
  </nav>
);

export default Navbar;
