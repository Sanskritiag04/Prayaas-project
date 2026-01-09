import { useState } from "react";
import "./Register.css";

export default function NGORegister() {
  const [form, setForm] = useState({
    ngoName: "",
    email: "",
    phone: "",
    city: "",
    registrationId: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("NGO Data:", form);
    alert("NGO Registered Successfully (Frontend Only)");
  };

  return (
    <div className="register-box">
      <h2>NGO Registration</h2>

      <form onSubmit={handleSubmit}>
        <input name="ngoName" placeholder="NGO Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input name="city" placeholder="City" onChange={handleChange} required />
        <input name="registrationId" placeholder="Registration ID" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
