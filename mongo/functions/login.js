const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res) => {
  return User.findOne({ token: req.body.token })
    .then((doc) => doc)
    .then((doc) => {
      if (!doc)
        return res.status(401).json({ error: "Invalid login credentials" });
      if (doc.pin === req.body.pin) {
        let payload = { token: req.body.token, permission: doc.permission };
        let jwtToken = jwt.sign(payload, process.env.SECRET, {
          expiresIn: "3h",
        });
        res.status(202).send({ token: jwtToken, message: "Success" });
      } else
        return res.status(401).json({ error: "Invalid login credentials" });
    })
    .catch(() =>
      res.status(500).json({ error: "Internal error, please try again" })
    );
};
