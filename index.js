const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config(); // Load environment variables locally (ignored in production if variables are set in Render)

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoURI = process.env.MONGODB_STRING; // Ensure this is set in Render's environment variables
if (!mongoURI) {
  console.error("Missing MONGODB_STRING environment variable");
  process.exit(1); // Exit the process if MongoDB URI is not set
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Routes Middleware
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/users");

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 4000; // Use Render's assigned port or fallback to 4000
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API is now online on port ${PORT}`);
  });
}

// Export the app and mongoose for testing or other integrations
module.exports = { app, mongoose };
