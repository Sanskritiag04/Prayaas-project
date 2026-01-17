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
        betterment of society.At its core, Prayaas empowers individuals 
        who want to create meaningful social impact by giving them a simple, 
        secure space to discover causes, participate in events, and track their 
        and connect with people who genuinely care. By fostering transparency, collaboration, 
        and a sense of belonging, Prayaas transforms volunteering from a one-time act into an 
        emotional and fulfilling journey of contribution, where technology supports empathy and 
        every small effort counts toward building a better society.
      </p>

      


    </section>
    







  );
};

export default AboutHero;
