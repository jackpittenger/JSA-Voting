const verifyJwt = require("./helpers/verifyJwt");
const toggleRoomValue = require("./helpers/toggleRoomValue");

const toggleVoting = async (_, res, decoded) => {
  return await toggleRoomValue(res, decoded, "votingOpen");
};

module.exports = verifyJwt(toggleVoting, 1);
