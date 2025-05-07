import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = (props) => {
  const navigate = useNavigate();
  const { currentUser } = props; // Removed unused setCurrentUser
  const [coursedata, setCoursedata] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return; // Avoid fetching courses if not logged in
    }

    let _id = currentUser.user._id;

    const fetchCourses = () => {
      setLoading(true);
      if (currentUser.user.role === "instructor") {
        CourseService.get(_id)
          .then((course) => {
            setCoursedata(course.data);
            setLoading(false);
          })
          .catch((err) => {
            setError("Failed to fetch courses. Please try again later.");
            setLoading(false);
          });
      } else if (currentUser.user.role === "student") {
        CourseService.getEnrolledCourses(_id)
          .then((courses) => {
            setCoursedata(courses.data);
            setLoading(false);
          })
          .catch((err) => {
            setError("Failed to fetch enrolled courses. Please try again later.");
            setLoading(false);
          });
      }
    };

    fetchCourses();
  }, [currentUser]);

  const handleCourseDescription = (course) => {
    let myWindow = window.open(
      "",
      "Course Description",
      "width=600px,height=200px,statusbar=0"
    );
    myWindow.document.write(
      `<title>Course Description</title>
      <h1>Course Description</h1>
      <p>${course.description}</p>`
    );
    myWindow.focus();
  };

  const handleDeleteCourse = (courseId) => {
    CourseService.closeCoursebyName(courseId, currentUser.user._id)
      .then(() => {
        alert("The course has been closed");
        setCoursedata((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        );
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to delete the course. Please try again later.");
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {/* Login prompt */}
      {!currentUser && (
        <div>
          <h1>You must login before accessing this page</h1>
          <button className="btn btn-primary btn-lg" onClick={handleLogin}>
            Click button to login
          </button>
        </div>
      )}

      {/* Instructor or Student view */}
      {currentUser?.user?.role && (
        <div>
          <h1>WELCOME TO {currentUser.user.role.toUpperCase()}'S COURSE PAGE</h1>
        </div>
      )}

      {/* Error handling */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          {/* Display courses */}
          {coursedata && coursedata.length > 0 ? (
            <div>
              <div className="alert alert-light" role="alert">
                <h3>Here are all of your courses available in the system.</h3>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  flexWrap: "wrap",
                }}
              >
                {coursedata.map((course) => (
                  <div
                    key={course._id}
                    style={{
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <div className="card" style={{ width: "18rem" }}>
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text">
                          Student Count: {course.students.length}
                        </p>
                        <p className="card-text">Price: {course.price}</p>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleCourseDescription(course)}
                          >
                            See Course
                          </button>
                          {currentUser?.user?.role === "instructor" && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteCourse(course._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="alert alert-info" role="alert">
              No courses available.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseComponent;
