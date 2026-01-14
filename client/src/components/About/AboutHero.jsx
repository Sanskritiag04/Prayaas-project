import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const AboutHero = () => {

  const navigate = useNavigate();

  return (
    <section className="about-hero">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <h1>Prayaas</h1>

      <p>
        Prayaas is a social impact platform designed to connect NGOs with
        passionate volunteers, enabling meaningful collaboration for the
        betterment of society.
      </p>

    </section>
  );
};

export default AboutHero;
