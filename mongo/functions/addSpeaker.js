const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");

const addSpeaker = async (req, res, decoded) => {
  if (!req.body.name || req.body.name > 50)
    return res.status(422).json({ error: "Invalid name" });
  User.findOne({ token: decoded.token })
    .then((doc) => doc)
    .then((doc) => {
      if (!doc)
        return res.status(403).json({ error: "Current user not found!" });
      Room.findOne({ _id: doc.room, concluded: false, owner: doc._id })
        .then((room) => room)
        .then((room) => {
          if (!room)
            return res.status(403).json({ error: "Current room not found!" });
          room.speakers.push(req.body.name);
          room
            .save()
            .then(() => {
              res.status(200).json({ success: true });
            })
            .catch(() => res.status(500).json({ error: "Error saving" }));
        });
    });
};

module.exports = verifyJwt(addSpeaker, 1);
