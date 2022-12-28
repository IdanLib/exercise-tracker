const mongoose = require("mongoose");
const { Schema } = require("mongoose");

//Defining db schemas using the mongoose Schema constructor
const ExerciseSchema = new Schema({
    userId: String,
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: Date,
});


module.exports = mongoose.model("ExerciseSchema", ExerciseSchema);