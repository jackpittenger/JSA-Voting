const verifyJwt = require("./helpers/verifyJwt");
const generatePin = require("./helpers/generatePin");

const User = require("../models/User");

module.exports = async (req, res) => {
  if (req.body.type !== "admin" && req.body.type !== "mod") {
    return res.status(501).json({ error: "Not Implemented" });
  }
  decoded = verifyJwt(req.header("Authorization"), res);
  if (decoded === false) return;
  if (
    (req.body.type === "admin" && decoded.permissions.indexOf("Dev") === -1) ||
    (req.body.type === "mod" && decoded.permissions.indexOf("Admin") === -1)
  ) {
    return res.status(401).json({ error: "Not authorized" });
  } else if (
    !req.body.name ||
    req.body.name.length > 24 ||
    req.body.name.length < 5
  ) {
    return res.status(422).json({ error: "Invalid name" });
  }

  let pin = generatePin(7);
  User.create({
    token: req.body.name,
    pin: pin,
    permissions: [
      req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1),
    ],
  })
    .then((doc) => res.status(200).json({ pin: doc.pin }))
    .catch(() =>
      res.status(500).json({ error: "Error while creating a user" })
    );
};
