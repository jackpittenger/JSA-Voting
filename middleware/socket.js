const jwt = require("jsonwebtoken");
const User = require("../mongo/models/User");
let sockets = [];

module.exports.setup = (io) =>
  io.on("connection", (client) => {
    client.on("token", (data) => {
      jwt.verify(data, process.env.SECRET, (err, decoded) => {
        if (err || decoded.permission < 1)
          return client.emit("unauthorized", () => client.disconnect());
        User.findOne({ token: decoded.token })
          .then((usr) => usr)
          .then((usr) => sockets.push([client, usr]))
          .catch((err) => console.error(err));
      });
    });
    client.on(
      "disconnect",
      () => (sockets = sockets.filter((c) => c[0] !== client))
    );
  });

module.exports.newVoter = (payload, owner) =>
  sockets
    .filter((c) => c[1].token === owner.token)
    .forEach((v) => v[0].emit("newuser", payload));

module.exports.vote = (payload, owner) => {
  sockets
    .filter((c) => c[1]._id.toString() === owner.owner.toString())
    .forEach((v) => v[0].emit("vote", payload));
};
