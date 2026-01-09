import React from 'react';
import './Hero.css';
import { Link } from "react-router-dom";

const Hero = () => (
  <section className="hero-section">
    <div className="hero-content">
      <div className="hero-badge">❤ Connecting Hearts, Creating Impact</div>
      <h1>Empowering Change, <br/> <span>One Volunteer at a Time</span></h1>
      <p>Prayas bridges the gap between NGOs and passionate volunteers. Find meaningful opportunities and make a real difference.</p>
      <div className="hero-buttons">
          <Link to="/volunteer/register">Register as Volunteer</Link>
          <Link to="/ngo/register">Register as NGO</Link>

        </div>
      <div className="hero-stats">
        <div className="stat"><h3>10,000+</h3><p>Active Volunteers</p></div>
        <div className="stat"><h3>500+</h3><p>Registered NGOs</p></div>
        <div className="stat"><h3>2,500+</h3><p>Events Completed</p></div>
      </div>
    </div>
  </section>
);

export default Hero;