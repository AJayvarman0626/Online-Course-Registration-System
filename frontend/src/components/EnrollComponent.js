import React, { useState } from "react";
import CourseService from "../services/course.service";
import { useNavigate } from "react-router-dom";

const EnrollComponent = (props) => {
  let navigate = useNavigate();
  const { currentUser } = props;
  const [courseSearch, setCourseSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const handleLogin = () => {
    navigate("/login");
  };

  const handleCourseQuery = (e) => {
    setCourseSearch(e.target.value);
  };

  const handleSearch = () => {
    setLoading(true);
    CourseService.searchCoursebyName(courseSearch)
      .then((response) => {
        setSearchResult(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setMessage("Error searching for courses. Please try again.");
        setLoading(false);
      });
  };

  const handleEnrollment = (courseId) => {
    CourseService.enroll(courseId, currentUser.user._id)
      .then(() => {
        alert("Enrollment successful!");
        navigate("/course");
      })
      .catch((err) => {
        setMessage("Error enrolling in course. Please try again.");
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {/* Login Required */}
      {!currentUser && (
        <div>
          <h1>You must login before accessing this page</h1>
          <button className="btn btn-primary btn-lg" onClick={handleLogin}>
            Click to Login
          </button>
        </div>
      )}

      {/* Restrict to Students Only */}
      {currentUser && currentUser.user.role !== "student" && (
        <div>
          <h1>Only students can enroll in courses</h1>
          <button className="btn btn-primary btn-lg" onClick={handleLogin}>
            Click to change account
          </button>
        </div>
      )}

      {/* Student Search Section */}
      {currentUser && currentUser.user.role === "student" && (
        <div>
          <div className="form-group">
            <label htmlFor="coursename">Search Course</label>
            <input
              name="coursequery"
              id="coursename"
              type="text"
              className="form-control"
              onChange={handleCourseQuery}
              value={courseSearch}
            />
            <br />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {/* Display Search Results */}
      {currentUser && searchResult && searchResult.length > 0 && !loading && (
        <div>
          <div className="alert alert-light" role="alert">
            <h3>Search Results</h3>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {searchResult.map((course) => (
              <div
                key={course._id}
                style={{
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  width: "18rem",
                }}
              >
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text">{course.description}</p>
                    <p>Student Count: {course.students.length}</p>
                    <p>Price: {course.price}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEnrollment(course._id)}
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Search Results */}
      {currentUser && searchResult && searchResult.length === 0 && !loading && (
        <div>
          <div className="alert alert-info" role="alert">
            No courses found with the given search term.
          </div>
        </div>
      )}

      {/* Message Handling */}
      {message && (
        <div className="alert alert-warning" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
