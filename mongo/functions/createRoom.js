const verifyJwt = require("./helpers/verifyJwt");
const generatePin = require("./helpers/generatePin");

const User = require("../models/User");
const Room = require("../models/Room");

const createRoom = async (req, res, decoded) => {
  return User.findOne({ token: decoded.token }, (er, usr) => {
    if (er) return res.status(500).send({ error: "User account not found!" });
    if (usr.room)
      return res.status(409).send({ error: "Already assigned to a room!" });
    let pin = generatePin(7);
    Room.create({ id: req.body.name, accessCode: pin, owner: usr._id })
      .then((room) => {
        usr.room = room._id;
        usr
          .save()
          .then(() =>
            res.status(201).send({
              id: req.body.name,
              accessCode: pin,
              users: [],
              open: true,
              votingOpen: false,
            })
          )
          .catch(() => res.status(500).send({ error: "Error creating room" }));
      })
      .catch(() => res.status(500).send({ error: "Error creating room" }));
  });
};

module.exports = verifyJwt(createRoom, 1);
