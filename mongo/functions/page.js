const Room = require("../models/Room");

module.exports = async (req, res) => {
  Room.find({ concluded: true })
    .sort({ _id: req.params.page > 0 ? req.params.page * -10 : -1 })
    .limit(10)
    .then((arr) => {
      return res.status(200).json({ res: arr, success: true });
    })
    .catch(() => {
      return res.status(500).json({ error: "Failure getting page" });
    });
};
