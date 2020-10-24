const verifyRoomsOpen = require("./helpers/verifyRoomsOpen");
const checkRoomsOpen = require("./helpers/checkRoomsOpen");

const Room = require("../models/Room");

const page = async (req, res) => {
  Room.find({ concluded: true })
    .sort({ _id: -1 })
    .limit(10)
    .skip(req.params.page * 10)
    .then((arr) => {
      return res.status(200).json({ res: arr, success: true });
    })
    .catch(() => {
      return res.status(500).json({ error: "Failure getting page" });
    });
};

module.exports = checkRoomsOpen(verifyRoomsOpen(page));
