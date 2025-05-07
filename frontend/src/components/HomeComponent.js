import React from "react";
import { useNavigate } from "react-router-dom";

const HomeComponent = () => {
  const navigate = useNavigate();
  return (
    <main>
      <div className="container py-4">
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">Online Course Registeration System</h1>
            <p className="col-md-8 fs-4">
              This system is using React.js as front-end framework, and Node.js,
              MongoDB as backend server.
            </p>
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={() => {
                window.open(
                  "https://github.com/AJayvarman0626/Online-Course-Registration-System"
                );
              }}
            >
              See how it works.
            </button>
          </div>
        </div>

        <div className="row align-items-md-stretch">
          <div className="col-md-6">
            <div className="h-100 p-5 text-white bg-dark rounded-3">
              <h2>As a student</h2>
              <p>
                Students can register in courses they like. This website is for
                practice purpose only, so please do not provide any personal
                information.
              </p>
              <button
                className="btn btn-outline-light"
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login or Register Now
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-5 bg-light border rounded-3">
              <h2>As an Instructor</h2>
              <p>
                You can become an instructor by registering as one, and start
                making online courses. This website is for practice purpose
                only, so please do not provide any personal information.
              </p>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login or Register Now
              </button>
            </div>
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; Jothika💗
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
