const Room = require("../models/Room");

module.exports = async (_, res) => {
  Room.countDocuments({ concluded: true })
    .then((count) => {
      return res.status(200).json({ count: Math.ceil(count / 10) });
    })
    .catch(() => {
      return res.status(500).json({ error: "Failure getting room page count" });
    });
};
