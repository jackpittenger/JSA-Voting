const verifyJwt = require("./helpers/verifyJwt");

const Config = require("../models/Config");

const roomsToggle = async (_, res, decoded) => {
  Config.findOne({})
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
};

module.exports = verifyJwt(roomsToggle, 2);
