const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    roomsOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "config",
  }
);

module.exports = mongoose.model("Config", configSchema);
