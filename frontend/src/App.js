import React, { useState } from "react";
import NavComponent from "./components/NavComponent";
import HomeComponent from "./components/HomeComponent";
import RegisterComponent from "./components/RegisterComponent";
import LoginComponent from "./components/LoginComponent";
import CourseComponent from "./components/CourseComponent";
import { Route, Routes } from "react-router-dom";
import ProfileComponent from "./components/ProfileComponent";
import PostCourseComponent from "./components/PostCourseComponent";
import EnrollComponent from "./components/EnrollComponent";
import AuthService from "./services/auth.service";
import LogoutPage from "./components/LogoutPage";

const App = () => {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  console.log(currentUser);

  return (
    <div>
      <NavComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
  {/* Public routes */}
  <Route path="/" element={<HomeComponent />} />
  <Route path="/register" element={<RegisterComponent />} />
  <Route
    path="/login"
    element={<LoginComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />}
  />
  <Route
    path="/logout"
    element={<LogoutPage setCurrentUser={setCurrentUser} />}
  />

  {/* Protected routes (only accessible when logged in) */}
  {currentUser && (
    <>
      <Route
        path="/profile"
        element={<ProfileComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      />
      <Route
        path="/course"
        element={<CourseComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      />
      <Route
        path="/postcourse"
        element={<PostCourseComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      />
      <Route
        path="/enrollment"
        element={<EnrollComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      />
    </>
  )}
</Routes>

    </div>
  );
};

export default App;
