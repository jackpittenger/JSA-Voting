const Room = require("../models/Room");

module.exports = async (_, res) => {
  Room.countDocuments({ concluded: true })
    .then((count) => {
      return res.status(200).json({ count: count });
    })
    .catch(() => {
      return res
        .status(500)
        .json({ error: "Failure getting total concluded room count" });
    });
};
