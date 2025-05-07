import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const RegisterComponent = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Handle form input changes
  const handleUsername = (e) => setUsername(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleRole = (e) => setRole(e.target.value);

  // Validate form inputs
  const validateForm = () => {
    if (!username || !email || !password || !role) {
      setMessage("All fields are required.");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return; // Only proceed if the form is valid
    setMessage(""); // Reset any previous error message
    setLoading(true); // Set loading to true while waiting for the registration to complete

    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert("Registration successful! Redirecting to login page.");
        navigate("/login");
      })
      .catch((error) => {
        setMessage(error.response?.data || "An error occurred during registration.");
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the request is completed
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <h2>Register</h2>
      <div>
        {message && <div className="alert alert-danger">{message}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            onChange={handleUsername}
            type="text"
            className="form-control"
            name="username"
            value={username}
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleEmail}
            type="email"
            className="form-control"
            name="email"
            value={email}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
            value={password}
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            onChange={handleRole}
            className="form-control"
            name="role"
            value={role}
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          className="btn btn-primary"
          disabled={loading} // Disable button when loading
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
