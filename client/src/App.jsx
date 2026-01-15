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

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* Volunteer Registration */}
        <Route
          path="/volunteer/register"
          element={<VolunteerRegister />}
        />
        <Route path="/dashboard" element={<VolunteerDashboard />} />
        {/* NGO Registration */}
        <Route
          path="/ngo/register"
          element={<NGORegister />}
        />
      </Routes>
    </Router>
  );
}

export default App;
