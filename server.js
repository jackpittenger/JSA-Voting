require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const https = require("https");
const io = require("socket.io")();
const cookieParser = require("cookie-parser");

const app = express();
const {
  login,
  createUser,
  authenticateCode,
  createRoom,
  getRoom,
  deleteRoom,
  submitForm,
  toggleOpen,
} = require("./mongo");
const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.crt", "utf8");

app.use(cookieParser());
require("./middleware/socket").setup(io);
app.use(bodyParser.json());

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

app.post("/api/toggle_open", (req, res) => {
  return toggleOpen(req, res);
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
  app.listen(443, () =>
    console.log("\x1b[32m✓\x1b[0m Running on port 443 in dev mode")
  );
}

io.listen(8000);
console.log("\x1b[32m✓\x1b[0m Socket.io listening on port 8000");
