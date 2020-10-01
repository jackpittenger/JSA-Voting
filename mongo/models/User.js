const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  token: { type: String, unique: true, required: true },
  pin: { type: String, required: true },
  permissions: { type: [String], required: true },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
});

module.exports = mongoose.model("User", userSchema);
