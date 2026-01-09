import React from 'react';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;