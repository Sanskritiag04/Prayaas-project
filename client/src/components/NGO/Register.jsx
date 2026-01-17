import { useState } from "react";

import "./Register.css";
import axios from "axios";

export default function NGORegister() {
 
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    ngoName: "",
    email: "",
    registrationId: "",
    panNumber: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: ""
  });

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
    "Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh",
    "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
    "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/ngo/register", form);
      alert("NGO Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="ngo-register-container">

      

      <h2>NGO Registration</h2>

      <form onSubmit={handleSubmit}>

        <label>NGO Name</label>
        <input name="ngoName" onChange={handleChange} required />

        <label>Email (.com / .in)</label>
        <input name="email" onChange={handleChange} required />

        <label>Registration ID</label>
        <input name="registrationId" onChange={handleChange} required />

        <label>PAN Number</label>
        <input
          name="panNumber"
          placeholder="ABCDE1234F"
          onChange={handleChange}
          required
        />

        <label>State</label>
        <select name="state" onChange={handleChange} required>
          <option value="">Select State</option>
          {states.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

        <label>Pincode</label>
        <input name="pincode" onChange={handleChange} required />

        <label>Password</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <label>Confirm Password</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button type="submit">Register NGO</button>
      </form>
    </div>
  );
}