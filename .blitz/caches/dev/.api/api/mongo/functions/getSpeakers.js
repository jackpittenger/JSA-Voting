const verifyJwt = require("./helpers/verifyJwt");

const Voter = require("../models/Voter");
const Room = require("../models/Room");

const getSpeakers = async (req, res, decoded) => {
  Voter.findOne({
    firstName: decoded.firstName,
    code: decoded.code,
    lastName: decoded.lastName,
    school: decoded.school,
  }).then((doc) => {
    if (doc == null || doc.speaker != null)
      return res
        .status(403)
        .json({ error: "You've already voted for a best speaker!" });
    Room.findOne({ concluded: false, accessCode: doc.code }).then((room) => {
      if (!room) return res.status(409).json({ error: "Incorrect code!" });
      if (!room.votingOpen)
        return res.status(455).json({
          error: "This room is not currently open for votes!",
        });
      return res.status(200).json({ speakers: room.speakers });
    });
  });
};

module.exports = verifyJwt(getSpeakers, false);
