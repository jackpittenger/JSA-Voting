require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import https from "https";
import socket from "socket.io";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

import { errorHandler } from "./routes/middleware/errors";

const io = socket();
const app = express();
const prisma = new PrismaClient();

const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.crt", "utf8");

io.origins("*:*");
app.use(cookieParser());
//require("./middleware/socket").setup(io);
app.use(bodyParser.json());

import Account from "./routes/account";
import Convention from "./routes/convention";
import Room from "./routes/room";
import Voter from "./routes/voter";

const account = new Account(prisma);
const convention = new Convention(prisma);
const room = new Room(prisma);
const voter = new Voter(prisma);

app.use("/api/account", account.setup());
app.use("/api/convention", convention.setup());
app.use("/api/room", room.setup());
app.use("/api/voter", voter.setup());

app.use(errorHandler);
/*
app.get("/api/get_speakers", getSpeakers);
app.get("/api/page/:page", page);
app.get("/api/rooms_open", roomsOpen);
app.get("/api/total_pages", getTotalPages);
app.post("/api/add_speaker", addSpeaker);
app.post("/api/speaker_vote", speakerVote);
app.post("/api/submit_form", submitForm);
app.post("/api/toggle_open", toggleOpen);
app.post("/api/toggle_voting", toggleVoting);
app.delete("/api/remove_speaker", removeSpeaker);
*/
if (process.env.DEPLOY === "true") {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });

  const httpsServer = https.createServer(
    { key: privateKey, cert: certificate },
    app
  );
  httpsServer.listen(443, () => console.log("✓ Production: 443"));
  const ioserver = https.createServer(
    { key: privateKey, cert: certificate },
    app
  );
  ioserver.listen(8443);
  io.listen(ioserver);
  console.log("\x1b[32m✓\x1b[0m Socket.io listening on port 8443");
} else {
  app.listen(443, () =>
    console.log("\x1b[32m✓\x1b[0m Running on port 443 in dev mode")
  );
  io.listen(8000);
  console.log("\x1b[32m✓\x1b[0m Socket.io listening on port 8000");
}