import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileComponent = ({ currentUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert("Please log in first.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const { username, email, role } = currentUser.user;

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Your Profile</h2>
          <div className="mb-3">
            <strong>Username:</strong>
            <p>{username}</p>
          </div>
          <div className="mb-3">
            <strong>Email:</strong>
            <p>{email}</p>
          </div>
          <div className="mb-3">
            <strong>Role:</strong>
            <p className="text-capitalize">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
