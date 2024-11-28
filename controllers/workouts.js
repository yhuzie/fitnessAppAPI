const Workout = require("../models/Workouts");

module.exports.addWorkout = async (req, res) => {
    try {
        const newWorkout = await Workout.create({
            name: req.body.name,
            duration: req.body.duration,
            status: req.body.status || 'Incomplete', 
            date: req.body.date || Date.now(),      
            userId: req.user.id                      
        });

        return res.status(201).json({
            userId: req.user.id,
            name: newWorkout.name,
            duration: newWorkout.duration,
            status: newWorkout.status,
            _id: newWorkout._id,
            dateAdded: newWorkout.date, 
            __v: newWorkout.__v
        });
    } catch (err) {
        console.error("Error adding workout:", err);
        return res.status(400).json({ error: "Failed to add workout. Please ensure all required fields are provided." });
    }
};


module.exports.getMyWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.id });


        if (!workouts || workouts.length === 0) {
            return res.status(404).json({ message: "No workouts found for this user." });
        }


        return res.status(200).json({ workouts });
    } catch (err) {
        console.error("Error fetching workouts:", err);
        return res.status(500).json({ error: "Failed to fetch workouts. Please try again later." });
    }
};


module.exports.updateWorkout = async (req, res) => {
    try {
        const { name, duration, status } = req.body;

        const workout = await Workout.findByIdAndUpdate(
            req.params.workoutId, 
            { name, duration, status }, 
            { new: true } 
        );

        if (!workout) {
            return res.status(404).json({ message: "Workout not found." });
        }


        return res.status(200).json({
            message: "Workout updated successfully.",
            updatedWorkout: {
                _id: workout._id,
                userId: workout.userId,
                name: workout.name,
                duration: workout.duration,
                status: workout.status,
                dateAdded: workout.date,
                __v: workout.__v
            }
        });
    } catch (err) {

        console.error("Error updating workout:", err);
        return res.status(400).json({ error: "Failed to update workout. Please check your data." });
    }
};



module.exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.workoutId);
        if (!workout) {
            return res.status(404).json({ message: "Workout not found." });
        }
        return res.status(200).json({ message: "Workout deleted successfully." });
    } catch (err) {
        console.error("Error deleting workout:", err);
        return res.status(400).json({ error: "Failed to delete workout. Please try again." });
    }
};

module.exports.completeWorkoutStatus = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndUpdate(
            req.params.workoutId,
            { status: "Completed" },
            { new: true }
        );
        if (!workout) {
            return res.status(404).json({ message: "Workout not found." });
        }
        return res.status(200).json({
            message: "Workout updated successfully.",
            updatedWorkout: {
                _id: workout._id,
                userId: workout.userId,
                name: workout.name,
                duration: workout.duration,
                status: workout.status,
                dateAdded: workout.date,
                __v: workout.__v
            }
        });
    } catch (err) {
        console.error("Error updating workout status:", err);
        return res.status(400).json({ error: "Failed to update workout status." });
    }
};
