const router = require("express").Router();
const courseValidation = require("../validation").courseValidation;
const Course = require("../models").coursemodel;
const passport = require("passport");

// Rate limiting (optional)
const rateLimit = require("express-rate-limit");
const courseSearchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later.",
});

// Middleware to ensure authentication for all routes
router.use(passport.authenticate("jwt", { session: false }));

// Log incoming requests (debugging)
router.use((req, res, next) => {
  console.log("A request is coming into course API...");
  next();
});

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("instructor", ["username", "email"]);
    res.status(200).send(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error fetching courses" });
  }
});

// GET course by ID
router.get("/:_id", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params._id })
      .populate("instructor", ["email"]);
    if (!course) {
      return res.status(404).send({ success: false, message: "Course not found" });
    }
    res.status(200).send(course);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error fetching course" });
  }
});

// GET courses by instructor
router.get("/instructor/:instructor_id", async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.instructor_id })
      .populate("instructor", ["username", "email"]);
    res.status(200).send(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Cannot get course data" });
  }
});

// GET courses by student (enrolled courses)
router.get("/student/:student_id", async (req, res) => {
  try {
    const courses = await Course.find({ students: req.params.student_id })
      .populate("instructor", ["username", "email"]);
    res.status(200).send(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Cannot get course data" });
  }
});

// Search for courses by name (case-insensitive)
router.get("/find/:coursename", courseSearchLimiter, async (req, res) => {
  try {
    const { coursename } = req.params;
    const courses = await Course.find({
      title: new RegExp(coursename, 'i'), // Case-insensitive search
    });
    res.status(200).send(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error searching for course" });
  }
});

// POST create a new course (instructor only)
router.post("/", async (req, res) => {
  // Validate input
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send({ success: false, message: error.details[0].message });

  const { title, description, price } = req.body;

  // Ensure only instructors can create courses
  if (req.user.role !== "instructor") {
    return res.status(400).send({ success: false, message: "Only instructors can post a new course." });
  }

  try {
    const newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    await newCourse.save();
    res.status(200).send({ success: true, message: "New course has been saved." });
  } catch (err) {
    console.error(err);
    res.status(400).send({ success: false, message: "Cannot save course." });
  }
});

// POST enroll a student in a course
router.post("/enroll/:_id", async (req, res) => {
  const { _id } = req.params;
  const { user_id } = req.body;

  try {
    const course = await Course.findOne({ _id });
    if (!course) {
      return res.status(404).send({ success: false, message: "Course not found." });
    }
    course.students.push(user_id);
    await course.save();
    res.status(200).send({ success: true, message: "Enrollment is successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error enrolling student" });
  }
});

// PATCH update a course (instructor or admin only)
router.patch("/:_id", async (req, res) => {
  // Validate input
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send({ success: false, message: error.details[0].message });

  const { _id } = req.params;

  try {
    const course = await Course.findOne({ _id });
    if (!course) {
      return res.status(404).send({ success: false, message: "Course not found." });
    }

    // Ensure the user is either the instructor or an admin
    if (course.instructor.equals(req.user._id) || req.user.role === "admin") {
      await Course.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true });
      res.status(200).send({ success: true, message: "Course updated." });
    } else {
      return res.status(403).send({ success: false, message: "Only the instructor or admin can edit this course." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error updating course." });
  }
});

// DELETE a course (instructor or admin only)
router.delete("/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const course = await Course.findOne({ _id });
    if (!course) {
      return res.status(404).send({ success: false, message: "Course not found." });
    }

    // Ensure the user is either the instructor or an admin
    if (course.instructor.equals(req.user._id) || req.user.role === "admin") {
      await Course.deleteOne({ _id });
      res.status(200).send({ success: true, message: "Course deleted." });
    } else {
      return res.status(403).send({ success: false, message: "Only the instructor or admin can delete this course." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Error deleting course." });
  }
});

module.exports = router;
