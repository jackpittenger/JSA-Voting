const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  token: { type: String, unique: true, required: true },
  pin: { type: String, required: true },
  permission: { type: Number, required: true },
  /*
   * 0: No access
   * 1: Mod
   * 2: Admin
   * 3: Dev
   * */
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
});

module.exports = mongoose.model("User", userSchema);
