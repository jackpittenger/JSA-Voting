const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    token: {type: String, unique: true},
    pin: String,
    permissions: [String]
});

module.exports.User = mongoose. model('User', userSchema);