import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Route path="/events" element={<Events />} />

import Home from './pages/Home';
import Events from './pages/Events';
import VolunteerRegister from "./components/Volunteer/Register";
import NGORegister from "./components/NGO/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events/>}/>
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
