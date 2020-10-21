const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:27017/${process.env.DB_DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("\x1b[32m✓\x1b[0m Mongoose"));

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", function () {
  console.log("\x1b[32m✓\x1b[0m Mongoose Open");
});

module.exports.addSpeaker = require("./functions/addSpeaker");
module.exports.authenticateCode = require("./functions/authenticateCode");
module.exports.concludeRoom = require("./functions/concludeRoom");
module.exports.createRoom = require("./functions/createRoom");
module.exports.createUser = require("./functions/createUser");
module.exports.deleteRoom = require("./functions/deleteRoom");
module.exports.deleteUser = require("./functions/deleteUser");
module.exports.getRoom = require("./functions/getRoom");
module.exports.getSpeakers = require("./functions/getSpeakers");
module.exports.getTotalPages = require("./functions/getTotalPages");
module.exports.login = require("./functions/login");
module.exports.page = require("./functions/page");
module.exports.removeSpeaker = require("./functions/removeSpeaker");
module.exports.speakerVote = require("./functions/speakerVote");
module.exports.submitForm = require("./functions/submitForm");
module.exports.toggleOpen = require("./functions/toggleOpen");
module.exports.toggleVoting = require("./functions/toggleVoting");
module.exports.updateRoomByline = require("./functions/updateRoomByline");
