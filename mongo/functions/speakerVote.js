const verifyJwt = require("./helpers/verifyJwt");

const Voter = require("../models/Voter");
const Room = require("../models/Room");

const speakerVote = async (req, res, decoded) => {
  if (!req.body.name || req.body.name > 50)
    return res.status(422).json({ error: "Invalid name" });
  Voter.findOne({
    firstName: decoded.firstName,
    code: decoded.code,
    lastName: decoded.lastName,
    school: decoded.school,
  }).then((doc) => {
    if (doc.speaker != null)
      return res
        .status(403)
        .json({ error: "You've already voted for a best speaker!" });
    Room.findOne({ concluded: false, accessCode: doc.code })
      .then((room) => {
        if (!room) return res.status(409).json({ error: "Incorrect code!" });
        if (!room.votingOpen)
          return res.status(455).json({
            error: "This room is not currently open for votes!",
          });
        if (room.speakers.indexOf(req.body.name) === -1)
          return res.status(400).json({ error: "Invalid speaker name!" });
        doc.speaker = req.body.name;
        return doc
          .save()
          .then(() => res.status(202).json({ sucess: true }))
          .then(async () =>
            vote(
              [
                decoded.firstName,
                decoded.lastName,
                decoded.school,
                decoded.vote,
                req.body.speaker,
              ],
              await Room.findOne({ concluded: false, accessCode: decoded.code })
            )
          );
      })
      .catch(() => {
        res.status(401).json({ error: "Voter not found!" });
      });
  });
};

module.exports = verifyJwt(speakerVote, false);
