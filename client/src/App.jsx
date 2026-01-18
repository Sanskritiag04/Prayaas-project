import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import Events from './pages/Events';
import VolunteerRegister from "./components/Volunteer/Register";
import NGORegister from "./components/NGO/Register";
import About from "./pages/About";
import Leaderboard from "./pages/Leaderboard";
import VolunteerDashboard from './pages/Volunteer/VolunteerDashboard';
import ForgotPassword from "./pages/ForgotPassword";
import FAQs from "./pages/FAQs"; 
import EditProfile from "./pages/Volunteer/EditProfile";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/volunteer/register" element={<VolunteerRegister />} />
        <Route path="/dashboard" element={<VolunteerDashboard />} />
        <Route path="/ngo/register" element={<NGORegister />} />
         <Route path="/volunteer/edit-profile" element={<EditProfile />} />
        <Route path="/faqs" element={<FAQs />} /> 

      </Routes>
    </Router>
  );
}

export default App;
