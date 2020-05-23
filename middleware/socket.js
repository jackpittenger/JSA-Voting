let sockets = [];

module.exports = (io) => {
  io.on("connection", (client) => {
    console.log("Connected!");
    client.on("token", (data) => {
      sockets.push([client, data]);
      console.log(sockets);
    });
    client.on("disconnect", () => {
      sockets = sockets.filter((c) => c[0] !== client);
      console.log("User disconnected!");
      console.log(sockets);
    });
  });
};
