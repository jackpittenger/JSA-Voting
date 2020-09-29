const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");
const ConcludedRoom = require("../models/ConcludedRoom");

module.exports = async (req, res) => {
  decoded = verifyJwt(req.header("Authorization"), res);
  if (decoded === false) return;
  if (decoded.permissions.indexOf("Mod") === -1) {
    return res.status(401).json({ error: "Not authorized" });
  }
  User.findOne({ token: decoded.token })
    .then((user) => user)
    .then((user) => {
      Room.findOne({ owner: user._id })
        .then((room) => room)
        .then((room) => {
          let arr = [0, 0, 0];
          for (let i = 0; i < room.users.length; i++) {
            if (room.users[i].vote === "yea") arr[0]++;
            if (room.users[i].vote === "abstain") arr[1]++;
            if (room.users[i].vote === "nay") arr[2]++;
          }
          ConcludedRoom.create({
            id: room.id,
            yea: arr[0],
            nay: arr[1],
            abs: arr[2],
            owner: room.owner,
          })
            .then(() => {
              room
                .delete()
                .then(() => res.status(200).json({ success: true }))
                .catch(() =>
                  res.status(500).json({ error: "Unable to delete room" })
                );
            })
            .catch(() =>
              res.status(500).json({ error: "Unable to create concluded room" })
            );
        });
    });
};
