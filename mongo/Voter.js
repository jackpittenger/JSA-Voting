const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  school: { type: String, required: true },
  code: { type: String, required: true },
  vote: { type: String },
  speaker: { type: String },
});

module.exports.Voter = mongoose.model("Voter", voterSchema);
