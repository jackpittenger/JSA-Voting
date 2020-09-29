const jwt = require("jsonwebtoken");

module.exports = (token, res) => {
  return jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "JWT not verified" });
      return false;
    }
    return decoded;
  });
};
