module.exports = (cb) => {
  return function checkRoomsOpen(req, res) {
    cb(req, res, true);
    /*    Config.findOne({})
      .then((doc) => doc)
      .then((doc) => {
        cb(req, res, doc != null ? doc.roomsOpen : false);
      })
      .catch(() => res.status(500).json({ error: "Error getting config" }));
*/
  };
};
