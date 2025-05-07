import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const PostCourseComponent = (props) => {
  let navigate = useNavigate();
  let { currentUser, setCurrentUser } = props;
  let [title, setTitle] = useState("");
  let [description, setDiscription] = useState("");
  let [price, setPrice] = useState(0);
  let [message, setMessage] = useState("");
  const handlelogin = function () {
    navigate("/login");
  };
  const handletitle = function (e) {
    setTitle(e.target.value);
  };
  const handledescription = function (e) {
    setDiscription(e.target.value);
  };
  const handleprice = function (e) {
    setPrice(e.target.value);
  };
  const handlecourse = function () {
    //console.log(title, description, price);
    CourseService.post(title, description, price)
      .then(() => {
        alert("Course has been successfully created");
        navigate("/course");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <h1>You must login before accessing this page</h1>
          <button className="btn btn-primary btn-lg" onClick={handlelogin}>
            Click button to login
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "instructor" && (
        <div>
          <h1>Only instructors can pose new courses</h1>
          <button className="btn btn-primary btn-lg" onClick={handlelogin}>
            Click button to change account
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div className="form-group">
          <label htmlFor="inputtitle">Title</label>
          <input
            name="title"
            id="inputitle"
            className="form-control"
            type={"text"}
            onChange={handletitle}
          />
          <br />
          <label htmlFor="inputdescription">Description</label>
          <input
            name="description"
            id="inputdescription"
            type={"text"}
            className="form-control"
            onChange={handledescription}
          />
          <br />
          <label htmlFor="inputprice">Price</label>
          <input
            name="price"
            id="inputprice"
            className="form-control"
            type={"number"}
            onChange={handleprice}
          />
          <br />
          <button className="btn btn-primary" onClick={handlecourse}>
            Submit Course
          </button>
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCourseComponent;
