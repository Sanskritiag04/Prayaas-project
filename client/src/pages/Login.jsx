import { useState } from "react";
import "./Login.css";

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // backend integration later
    alert("Login clicked!");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h2>Login to Prayaas</h2>
        <p>Welcome back! Please login to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <div className="links">
          <a href="#">Forgot password?</a>
          <a href="/register">Create account</a>
        </div>

      </div>
    </div>
  );
}
