const User = require("../../models/User");
const Room = require("../../models/Room");

module.exports = async (res, decoded, key) => {
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
          room[key] = !room[key];
          room
            .save()
            .then(() => {
              res.status(200).json({ success: true });
            })
            .catch(() => res.status(500).json({ error: "Error saving" }));
        });
    });
};