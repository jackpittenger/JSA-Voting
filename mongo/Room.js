const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    id: {type: String, required: true, unique:true},
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessCode: String
});

module.exports.Room = mongoose. model('Room', roomSchema);