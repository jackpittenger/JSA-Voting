require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const https = require("https");
const io = require("socket.io")();

const app = express();
const {
  login,
  createUser,
  authenticateCode,
  createRoom,
  getRoom,
  deleteRoom,
  submitForm,
} = require("./mongo");
const withAuth = require("./middleware/withAuth");
const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.crt", "utf8");

require("./middleware/socket")(io);
app.use(bodyParser.json());

app.get("/dashboard", withAuth, (req, res) => {
  res.sendStatus(500).json({ message: "Unknown server error" });
});

app.post("/api/login", (req, res) => {
  return login(req, res);
});

app.post("/api/create_user", (req, res) => {
  return createUser(req, res);
});

app.post("/api/auth_code", (req, res) => {
  return authenticateCode(req, res);
});

app.post("/api/create_room", (req, res) => {
  return createRoom(req, res);
});

app.post("/api/get_room", (req, res) => {
  return getRoom(req, res);
});

app.post("/api/submit_form", (req, res) => {
  return submitForm(req, res);
});

app.delete("/api/room", (req, res) => {
  return deleteRoom(req, res);
});

if (process.env.DEPLOY === "true") {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });

  const httpsServer = https.createServer(
    { key: privateKey, cert: certificate },
    app
  );
  httpsServer.listen(443, () => console.log("✓ Production: 443"));
} else {
  app.listen(443, () => console.log("✓ Running on port 443 in dev mode"));
}

io.listen(8000);
console.log("✓ Socket.io listening on port 8000");
