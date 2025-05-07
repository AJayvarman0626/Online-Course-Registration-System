import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const LogoutPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    await AuthService.logout();
    alert("Logout successful");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2>Are you sure you want to log out?</h2>
      <button className="btn btn-danger mt-3" onClick={handleConfirmLogout}>
        Yes, Logout
      </button>
    </div>
  );
};

export default LogoutPage;
