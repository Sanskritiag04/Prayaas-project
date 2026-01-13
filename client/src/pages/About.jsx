import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import AboutHero from "../components/About/AboutHero";
import Mission from "../components/About/Mission";
import Values from "../components/About/Values";

const About = () => {
  return (
    <>
      <Navbar />
      <AboutHero />
      <Mission />
      <Values />
      <Footer />
    </>
  );
};

export default About;
