const jwt = require("jsonwebtoken");

module.exports = (callback, permission) => {
  return function withJwt(req, res) {
    jwt.verify(
      req.header("Authorization"),
      process.env.SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "JWT not verified" });
        } else if (permission && decoded.permissions < permission) {
          return res.status(401).json({ error: "Not authorized" });
        }
        return callback(req, res, decoded);
      }
    );
  };
};
