const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    token: {type: String, unique: true, required: true},
    pin: {type: String, required: true},
    permissions: {type: [String], required: true},
    room: {type: String, required: false}
});

module.exports.User = mongoose. model('User', userSchema);