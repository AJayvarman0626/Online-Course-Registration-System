const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,  // Fixed typo from 'requried' to 'required'
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,  // Fixed typo from 'requried' to 'required'
    minlength: 6,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,  // Fixed typo from 'requried' to 'required'
    minlength: 8,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"], // Added 'admin' to the enum as per your function logic
    required: true,  // Fixed typo from 'requried' to 'required'
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

// Check if the user is a student
userSchema.methods.isStudent = function () {
  return this.role === "student"; // Simplified the logic
};

// Check if the user is an instructor
userSchema.methods.isInstructor = function () {
  return this.role === "instructor"; // Simplified the logic
};

// Check if the user is an admin
userSchema.methods.isAdmin = function () {
  return this.role === "admin"; // Simplified the logic
};

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (err) {
      next(err); // Ensure that errors are passed to the next middleware
    }
  } else {
    next();
  }
});

// Compare entered password with the hashed password in the database
userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch); // Pass null for the error and the result to the callback
  });
};

module.exports = mongoose.model("User", userSchema);
