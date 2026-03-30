import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "volunteer" // default
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let url = "";
    if (form.role === "volunteer") {
      url = "http://localhost:5000/api/volunteer/login";
    } else if (form.role === "ngo") {
      url = "http://localhost:5000/api/ngo/login";
    } else if (form.role === "admin") {
      url = "http://localhost:5000/api/admin/login";
    }

      const res = await axios.post(url, {
        email: form.email,
        password: form.password
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", form.role);

      const userData = res.data.volunteer || res.data.ngo;

      if (userData) {
  // 3. Store the ID and Name (Check if it's ._id or .id)
  localStorage.setItem("userId", userData._id || userData.id);
  
  // Store the name so the feed knows who posted
  const nameToStore = userData.ngoName || userData.name || "NGO Partner";
  localStorage.setItem("userName", nameToStore);
  
  console.log("Logged in user ID saved:", userData._id || userData.id);
} else {
  console.error("User data missing in backend response!", res.data);
}
    
    // localStorage.setItem("userId", userData._id); 
    
    // // For NGOs, save the NGO name specifically
    // if (form.role === "ngo") {
    //   localStorage.setItem("userName", userData.ngoName);
    // } else {
    //   localStorage.setItem("userName", userData.name || userData.username);
    // }
      alert("Login successful!");

      if (form.role === "volunteer") navigate("/dashboard");
    else if (form.role === "ngo") navigate("/ngo/dashboard");
    else if (form.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h2>Login to Prayaas</h2>
        <p>Welcome back! Please login to continue</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>

          {/* ROLE SELECT */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="role-select"
          >
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <div className="links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/volunteer/register">Create account</Link>
        </div>

      </div>
    </div>
  );
}
