import React from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const NavComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const navigate = useNavigate();

  const handlelogout = async function () {
    await AuthService.logout();
    alert("Logout successfully");
    setCurrentUser(null);
    navigate("/");
  };

  const isInstructor = currentUser?.user?.role === "instructor";
  const isStudent = currentUser?.user?.role === "student";

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>
            {!currentUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
            {currentUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/course">
                    Course
                  </Link>
                </li>
                {isInstructor && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/postcourse">
                      Post Course
                    </Link>
                  </li>
                )}
                {isStudent && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/enrollment">
                      Enrollment
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                <Link className="nav-link" to="/logout">
  Logout
</Link>

                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavComponent;
