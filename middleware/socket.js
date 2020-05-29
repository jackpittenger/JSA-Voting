const jwt = require("jsonwebtoken");
const User = require("../mongo/User").User;
let sockets = [];

module.exports.setup = (io) => {
  io.on("connection", (client) => {
    client.on("token", (data) => {
      jwt.verify(data, process.env.SECRET, (err, decoded) => {
        if (err || decoded.permissions.indexOf("Mod") === -1)
          return client.emit("unauthorized", () => client.disconnect());
        User.findOne({ token: decoded.token })
          .then((usr) => usr)
          .then((usr) => sockets.push([client, usr]));
      });
    });
    client.on("disconnect", () => {
      console.log(sockets);
      sockets = sockets.filter((c) => c[0] !== client);
    });
  });
};

module.exports.newVoter = (payload, owner) => {
  return sockets
    .filter((c) => c[1].token === owner.token)
    .forEach((v, i) => {
      v[0].emit("newuser", payload);
    });
};
