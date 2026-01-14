import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/volunteer/register",
        form
      );

      alert(res.data.message);

    } catch (err) {
      alert(
        err.response?.data?.message || "Something went wrong"
      );
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
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
        />

        <input
          name="state"
          placeholder="State"
          onChange={handleChange}
          required
        />

        <input
          name="pincode"
          placeholder="Pincode"
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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Submit */}
        <button type="submit">Create Account</button>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>
      </form>
    </div>
  );
}
