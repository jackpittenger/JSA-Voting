const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");

const clearRooms = async (req, res, decoded) => {
  User.findOne({ token: decoded.token })
    .then((doc) => doc)
    .then((doc) => {
      if (!doc) return res.status(500).json({ error: "Not authorized" });
      Room.deleteMany({ concluded: true })
        .then(() => res.status(200).json({ success: true }))
        .catch(() => res.status(500).json({ error: "Error" }));
    })
    .catch(() => res.status(500).json({ error: "Error" }));
};

module.exports = verifyJwt(clearRooms, 3);
