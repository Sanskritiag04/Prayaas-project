import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import the Navbar you just created
import Navbar from './components/common/Navbar';

// 2. Import your pages
import Home from './pages/Home';
import RegisterNGO from './pages/NGO/RegisterNGO';
// import RegisterVol from './pages/Volunteer/RegisterVol';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      {/* 3. Place Navbar here so it shows on every page */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-ngo" element={<RegisterNGO />} />
        {/* <Route path="/register-vol" element={<RegisterVol />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;