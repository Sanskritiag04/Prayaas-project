import React from "react";
import "./About.css";

const Values = () => {
  return (
    <section className="values-section">
      <h2>What We Do</h2>

      <div className="values-grid">
        <div className="value-card">
          <h3>Volunteer Discovery</h3>
          <p>
            We help volunteers find opportunities that match their interests,
            skills, and availability.
          </p>
        </div>

        <div className="value-card">
          <h3>NGO Empowerment</h3>
          <p>
            NGOs can easily post events, manage volunteers, and track
            participation efficiently.
          </p>
        </div>

        <div className="value-card">
          <h3>Recognition & Rewards</h3>
          <p>
            Volunteers earn points, badges, and certificates to recognize their
            contribution and commitment.
          </p>
        </div>

        <div className="value-card">
          <h3>Community Impact</h3>
          <p>
            We encourage collaboration and transparency to maximize positive
            social outcomes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Values;
