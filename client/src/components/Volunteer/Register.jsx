import { useState } from "react";
import "./Register.css";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/volunteer/register",
        form
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Volunteer Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Create Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
