const verifyJwt = require("./verifyJwt");

function verifyRoomsOpen(cb) {
  return function verifyRoomsOpen(req, res, value) {
    if (value) return cb(req, res);
    return verifyJwt(cb, 2)(req, res);
  };
}

module.exports = verifyRoomsOpen;
