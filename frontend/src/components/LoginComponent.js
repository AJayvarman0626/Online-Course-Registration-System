import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const LoginComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Perform login with AuthService
    AuthService.login(email, password)
      .then((res) => {
        if (res.data.success) {
          // Store the user data in localStorage
          localStorage.setItem("user", JSON.stringify(res.data));
          // Redirect to profile page or the previous page
          window.alert("Successfully logged in");
          navigate("/profile");
        } else {
          setMessage("Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage(error.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            onChange={handleEmail}
            type="email" // Email type for better browser validation
            className="form-control"
            name="email"
            value={email}
            placeholder="Enter your email"
            required
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
            value={password}
            placeholder="Enter your password"
            required
          />
        </div>
        <br />
        <div className="form-group">
          <button
            className="btn btn-primary btn-block"
            onClick={handleLogin}
            disabled={!email || !password} // Disable the button when either field is empty
          >
            Login
          </button>
        </div>
        <div className="form-group">
          <p>
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
