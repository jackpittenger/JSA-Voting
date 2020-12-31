const verifyJwt = require("./helpers/verifyJwt");
const toggleRoomValue = require("./helpers/toggleRoomValue");

const toggleOpen = async (_, res, decoded) => {
  return await toggleRoomValue(res, decoded, "open");
};

module.exports = verifyJwt(toggleOpen, 1);
