const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const authRoute = require("./route/auth");
const courseRoute = require("./route/course-route");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Initialize Passport
require("./config/passport")(passport); // Import and initialize passport configuration

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);  // Suppress deprecation warning
    await mongoose.connect(process.env.DB_CLUSTER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Middleware setup
const setupMiddleware = () => {
  app.use(express.json()); // Parse JSON request body
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body
  app.use(cors()); // Enable CORS for cross-origin requests
  app.use(passport.initialize()); // Initialize passport middleware
};

// API Routes setup
const setupRoutes = () => {
  app.use("/api/user", authRoute); // Auth routes
  app.use("/api/courses", passport.authenticate("jwt", { session: false }), courseRoute); // Protected course routes
};

// Start the server
const startServer = () => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT} 🎉`);
  });
};

// Initialize application
const initApp = async () => {
  await connectDB(); // Wait for DB connection
  setupMiddleware(); // Set up middleware
  setupRoutes(); // Set up routes
  startServer(); // Start the server
};

// Execute initialization
initApp();
