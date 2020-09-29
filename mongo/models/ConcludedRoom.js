const mongoose = require("mongoose");

const concludedRoomSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  yea: { type: Number, required: true },
  nay: { type: Number, required: true },
  abs: { type: Number, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  time: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("ConcludedRoom", concludedRoomSchema);
