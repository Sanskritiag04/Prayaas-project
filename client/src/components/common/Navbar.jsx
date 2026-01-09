import React from 'react';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="nav-container">
      <div className="logo">
        <div className="logo-icon">❤</div>
        <span>Prayaas</span>
      </div>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/events">Events</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/about">About</a>
      </div>
      <div className="nav-auth">
        <button className="login-btn">Login</button>
      </div>
    </div>
  </nav>
);

export default Navbar;