const checkRoomsOpen = require("./helpers/checkRoomsOpen");

const roomsOpen = async (req, res, value) => {
  res.status(200).json({ open: value });
};

module.exports = checkRoomsOpen(roomsOpen);
