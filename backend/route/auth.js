const router = require("express").Router();
const bcrypt = require("bcryptjs");
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").usermodel;
const Jwt = require("jsonwebtoken");

// Middleware for logging incoming requests (can be helpful for debugging)
router.use((req, res, next) => {
  console.log("A request is coming to auth.js \n");
  next();
});

// Test API to check server status
router.get("/testAPI", (req, res) => {
  return res.json({ message: "testAPI is working" });
});

// Register route for new user
router.post("/register", async (req, res) => {
  // Validate request body
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send({ success: false, message: error.details[0].message });

  try {
    // Check if the email already exists
    let emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send({ success: false, message: "Email already exists." });

    // Hash password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    let newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role,
    });

    // Save the new user to the database
    let savedUser = await newUser.save();

    // Respond with success and saved user details
    res.status(200).send({
      success: true,
      message: "User registered successfully",
      savedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "An error occurred while registering user." });
  }
});

// Login route for existing user
router.post("/login", async (req, res) => {
  // Validate login credentials
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ success: false, message: error.details[0].message });

  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send({ success: false, message: "The user doesn't exist." });

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).send({ success: false, message: "Wrong password." });

    // Generate JWT token
    const tokenObject = { _id: user._id, email: user.email };
    const token = Jwt.sign(tokenObject, process.env.MYSECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    // Send response with JWT token and user details
    res.status(200).send({
      success: true,
      token: "JWT " + token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "An error occurred while logging in." });
  }
});

module.exports = router;
