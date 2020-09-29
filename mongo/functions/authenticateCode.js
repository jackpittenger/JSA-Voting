const jwt = require("jsonwebtoken");
const newVoter = require("../../middleware/socket").newVoter;

const Room = require("../models/Room");
const Voter = require("../models/Voter");

module.exports = async (req, res) => {
  Voter.findOne({
    firstName: req.body.first_name,
    code: req.body.code,
    lastName: req.body.last_name,
    school: req.body.school,
  })
    .then((doc) => doc)
    .then((doc) => {
      if (doc)
        return res
          .status(409)
          .json({ error: "User already registered for this room!" });
      Room.findOne({ accessCode: req.body.code })
        .populate("owner")
        .then((room) => room)
        .then((room) => {
          if (!room) return res.status(409).json({ error: "Incorrect code!" });
          else if (!room.open)
            return res
              .status(401)
              .json({ error: "This room is closed for new voters!" });
          Voter.create({
            firstName: req.body.first_name,
            code: req.body.code,
            lastName: req.body.last_name,
            school: req.body.school,
          }).then((usr) => {
            room.users.push(usr._id);
            room.save();
            let payload = {
              firstName: usr.firstName,
              code: usr.code,
              lastName: usr.lastName,
              school: usr.school,
            };
            newVoter(payload, room.owner);
            let jwtToken = jwt.sign(payload, process.env.SECRET, {
              expiresIn: "1h",
            });
            return res
              .status(201)
              .send({ token: jwtToken, message: "Success" });
          });
        });
    })
    .catch(() => {
      return res.status(500).json({ error: "Error fetching voter" });
    });
};
