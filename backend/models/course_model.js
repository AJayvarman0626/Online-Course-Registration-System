const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true, // Instructor is a mandatory field
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model for students
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
