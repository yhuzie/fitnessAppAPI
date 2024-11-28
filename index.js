const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_STRING);

//Routes Middleware
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/users");

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};