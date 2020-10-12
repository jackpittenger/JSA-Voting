const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");

const updateRoomByline = async (req, res, decoded) => {
  if (req.body.byline === null || req.body.byline.length > 120)
    return res.status(400).json({ error: "Byline length too long" });
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
          room.byline = req.body.byline;
          room
            .save()
            .then(() => {
              res.status(200).json({ success: true });
            })
            .catch(() => res.status(500).json({ error: "Error saving" }));
        });
    });
};

module.exports = verifyJwt(updateRoomByline, 1);
