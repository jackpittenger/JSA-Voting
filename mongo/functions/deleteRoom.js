const mongoose = require("mongoose");
const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");
const Voter = require("../models/Voter");

module.exports = async (req, res) => {
  decoded = verifyJwt(req.header("Authorization"), res);
  if (decoded.permissions.indexOf("Mod") === -1) {
    return res.status(401).json({ error: "Not authorized" });
  }
  User.findOne({ token: decoded.token })
    .then((doc) => doc)
    .then((doc) => {
      if (!doc)
        return res.status(403).json({ error: "Current user not found!" });
      else if (doc.room !== req.body.room)
        return res
          .status(401)
          .json({ error: "You do not own this room or it doesn't exist!" });
      Room.findOneAndDelete({ id: req.body.room })
        .then((room) => {
          doc.room = null;
          doc.save();
          Voter.deleteMany({
            _id: { $in: room.users.map((v) => mongoose.Types.ObjectId(v)) },
          })
            .then(() => {
              return res.status(200).json({ success: true });
            })
            .catch(() => {
              return res.status(500).json({ error: "Unable to delete Voter!" });
            });
        })
        .catch(() => res.status(500).json({ error: "Unable to delete!" }));
    })
    .catch(() => res.status(401).json({ error: "User not found!" }));
};
