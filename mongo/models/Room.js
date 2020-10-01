const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voter",
    },
  ],
  accessCode: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  open: { type: Boolean, default: true },
  votingOpen: { type: Boolean, default: false },
  /* Concluded Room */
  concluded: { type: Boolean, default: false },
  time: { type: Date, required: true, default: Date.now },
  yea: { type: Number },
  nay: { type: Number },
  abs: { type: Number },
});

module.exports = mongoose.model("Room", roomSchema);
