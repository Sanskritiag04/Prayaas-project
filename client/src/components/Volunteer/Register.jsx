import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";



export default function Register() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // 👁 Password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👁 Confirm Password

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

  const validateForm = () => {

    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(form.name.trim())) {
    alert("Full Name should only contain letters and spaces");
    return false;
  }
  
  // Ensure the name isn't just one letter (like "A")
  if (form.name.trim().length < 2) {
    alert("Full Name must be at least 2 characters long");
    return false;
  }

    if (
      !form.email.includes("@") ||
      !(form.email.endsWith(".com") || form.email.endsWith(".in"))
    ) {
      alert("Email must contain @ and end with .com or .in");
      return false;
    }

    if (!/^\d+$/.test(form.age)) {
      alert("Age must contain only numbers");
      return false;
    }

    if (form.age < 18 || form.age > 90) {
      alert("Age must be between 18 and 90");
      return false;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone number must be exactly 10 digits");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      alert("Pincode must be exactly 6 digits");
      return false;
    }

    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

    if (!passwordPattern.test(form.password)) {
      alert(
        "Password must contain:\n• One letter\n• One digit\n• One special character\n• Min 6 characters"
      );
      return false;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/volunteer/register",
        form
      );
      alert(res.data.message);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <div className="register-container">

      <h2>Volunteer Registration</h2>

      <form onSubmit={handleSubmit}>

        <label>Full Name</label>
        <input name="name" onChange={handleChange} required />

        <label>Email (.com / .in)</label>
        <input name="email" onChange={handleChange} required />

        <label>Age (18 - 90)</label>
        <input name="age" onChange={handleChange} required />

        <label>Phone Number</label>
        <input name="phone" onChange={handleChange} required />

        <label>City</label>
        <input name="city" onChange={handleChange} required />

        <label>State</label>
        <select name="state" onChange={handleChange} required>
          <option value="">Select State</option>
          {states.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

        <label>Pincode (6 digits)</label>
        <input name="pincode" onChange={handleChange} required />

        {/* PASSWORD WITH EYE */}
        <label>Password</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* CONFIRM PASSWORD WITH EYE */}
        <label>Confirm Password</label>
        <div className="password-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button type="submit">Create Account</button>

      </form>
    </div>
  );
}
