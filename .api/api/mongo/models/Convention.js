const mongoose = require("mongoose");

const convetionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomsOpen: { type: boolean, default: true },
});

module.exports = mongoose.model("Convention", convetionSchema);
