import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import VolunteerRegister from "./components/Volunteer/Register";
import NGORegister from "./components/NGO/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Volunteer Registration */}
        <Route
          path="/volunteer/register"
          element={<VolunteerRegister />}
        />

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
