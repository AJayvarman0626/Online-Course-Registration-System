import React, { useEffect, useState } from "react";
import CourseService from "../services/course.service";
import { useNavigate } from "react-router-dom";

const CourseListComponent = ({ currentUser }) => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch courses on component mount
    CourseService.getAll()
      .then((res) => {
        setCourses(res.data);
      })
      .catch((error) => {
        setMessage(error.response?.data || "Failed to fetch courses");
      });
  }, []);

  const handleEnroll = (courseId) => {
    // Check if the user is logged in and is a student
    if (!currentUser || currentUser.user.role !== "student") {
      alert("Only students can enroll. Please log in as a student.");
      navigate("/login");
      return;
    }

    // Try to enroll the student in the course
    CourseService.enroll(courseId)
      .then(() => {
        alert("Enrolled successfully!");
      })
      .catch((err) => {
        alert("Enrollment failed: " + (err.response?.data || err.message));
      });
  };

  return (
    <div className="container mt-4">
      <h2>Available Courses</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <div className="row">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p className="card-text">
                    <strong>Price:</strong> ${course.price}
                  </p>
                  {currentUser?.user.role === "student" && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default CourseListComponent;
