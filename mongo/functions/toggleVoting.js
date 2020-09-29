const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");

module.exports = async (req, res) => {
  decoded = verifyJwt(req.header("Authorization"), res);
  if (decoded === false) return;
  if (decoded.permissions.indexOf("Mod") === -1) {
    return res.status(401).json({ error: "Not authorized" });
  }
  User.findOne({ token: decoded.token })
    .then((doc) => doc)
    .then((doc) => {
      if (!doc)
        return res.status(403).json({ error: "Current user not found!" });
      Room.findOne({ id: doc.room })
        .then((room) => room)
        .then((room) => {
          if (!room)
            return res.status(403).json({ error: "Current room not found!" });
          room.votingOpen = !room.votingOpen;
          room
            .save()
            .then(() => {
              res.status(200).json({ success: true });
            })
            .catch(() => res.status(500).json({ error: "Error saving" }));
        });
    });
};
