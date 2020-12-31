const verifyJwt = require("./helpers/verifyJwt");

const roomsToggle = async (_, res, decoded) => {
  return res.status(501).json({ error: "Not transfered over" });
  /*Config.findOne({})
    .then((doc) => doc)
    .then((doc) => {
      if (!doc) doc = new Config({ roomsOpen: false });
      doc.roomsOpen = !doc.roomsOpen;
      doc
        .save()
        .then(() => res.status(200).json({ success: true }))
        .catch(() =>
          res.status(500).json({ error: "Failure saving updated config" })
        );
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ error: "Failure finding config" });
    });
*/
};

module.exports = verifyJwt(roomsToggle, 2);
