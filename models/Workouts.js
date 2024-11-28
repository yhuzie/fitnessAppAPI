const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    duration: {
        type: String,
        required: [true, 'Duration is Required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    }
});

module.exports = mongoose.model('Workout', workoutSchema);
