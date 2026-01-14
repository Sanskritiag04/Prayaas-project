import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

export default function NGORegister() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    ngoName: "",
    email: "",
    registrationId: "",
    panNumber: "",
    panFile: null,        // NEW
    street: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // File handler
  const handleFileChange = (e) => {
    setForm({ ...form, panFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }

      const res = await axios.post(
        "http://localhost:5000/api/ngo/register",
        formData
      );

      alert(res.data.message);

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-box">

      {/* Back Button */}
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>

      <h2>NGO Registration</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="ngoName"
          placeholder="NGO Name"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="registrationId"
          placeholder="Registration ID"
          onChange={handleChange}
          required
        />

        <input
          name="panNumber"
          placeholder="PAN Number"
          onChange={handleChange}
          required
        />

        {/* PAN FILE UPLOAD */}
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={handleFileChange}
          required
        />

        <input
          name="street"
          placeholder="Street Address"
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
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

      </form>
    </div>
  );
}
