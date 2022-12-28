const { Schema, default: mongoose } = require("mongoose");

const UserSchema = new Schema({
    username: String
});

module.exports = mongoose.model("userModel", UserSchema);