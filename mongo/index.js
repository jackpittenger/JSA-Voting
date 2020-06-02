const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { newVoter, vote } = require("../middleware/socket");

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

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("\x1b[32m✓\x1b[0m Mongoose Open");
});

const User = require("./User").User;
const Room = require("./Room").Room;
const Voter = require("./Voter").Voter;

module.exports.login = (req, res) => {
  return User.findOne({ token: req.body.token })
    .then((doc) => doc)
    .then((doc) => {
      if (!doc)
        return res.status(401).json({ error: "Invalid login credentials" });
      if (doc.pin === req.body.pin) {
        let payload = { token: req.body.token, permissions: doc.permissions };
        let jwtToken = jwt.sign(payload, process.env.SECRET, {
          expiresIn: "1h",
        });
        res.status(202).send({ token: jwtToken, message: "Success" });
      } else
        return res.status(401).json({ error: "Invalid login credentials" });
    })
    .catch(() =>
      res.status(500).json({ error: "Internal error, please try again" })
    );
};

module.exports.createUser = (req, res) => {
  jwt.verify(
    req.header("Authorization"),
    process.env.SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "JWT not verified" });
      } else if (req.body.type !== "admin" && req.body.type !== "mod") {
        return res.status(501).json({ error: "Not Implemented" });
      } else if (
        (req.body.type === "admin" &&
          decoded.permissions.indexOf("Dev") === -1) ||
        (req.body.type === "mod" && decoded.permissions.indexOf("Admin") === -1)
      ) {
        return res.status(401).json({ error: "Not authorized" });
      } else if (
        !req.body.name ||
        req.body.name.length > 24 ||
        req.body.name.length < 5
      ) {
        return res.status(422).json({ error: "Invalid name" });
      }

      let pin = _generatePIN(7);
      User.create({
        token: req.body.name,
        pin: pin,
        permissions: [
          req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1),
        ],
      })
        .then((doc) => res.status(200).json({ pin: doc.pin }))
        .catch(() =>
          res.status(500).json({ error: "Error while creating a user" })
        );
    }
  );
};

module.exports.createRoom = (req, res) => {
  jwt.verify(
    req.header("Authorization"),
    process.env.SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "JWT not verified" });
      } else if (decoded.permissions.indexOf("Mod") === -1) {
        return res.status(401).json({ error: "Not authorized" });
      }

      return User.findOne({ token: decoded.token }, (er, usr) => {
        if (er)
          return res.status(500).send({ error: "User account not found!" });
        if (usr.room)
          return res.status(409).send({ error: "Already assigned to a room!" });
        let pin = _generatePIN(7);
        Room.create({ id: req.body.name, accessCode: pin, owner: usr._id })
          .then(() => {
            usr.room = req.body.name;
            usr
              .save()
              .then(() =>
                res
                  .status(201)
                  .send({ id: req.body.name, accessCode: pin, users: [] })
              )
              .catch(() =>
                res.status(500).send({ error: "Error creating room" })
              );
          })
          .catch(() => res.status(500).send({ error: "Error creating room" }));
      });
    }
  );
};

module.exports.getRoom = (req, res) => {
  jwt.verify(
    req.header("Authorization"),
    process.env.SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "JWT not verified" });
      } else if (decoded.permissions.indexOf("Mod") === -1) {
        return res.status(401).json({ error: "Not authorized" });
      }
      return User.findOne({ token: decoded.token })
        .then((doc) => doc)
        .then((doc) => {
          if (!doc)
            return res.status(403).json({ error: "Current user not found!" });
          return Room.findOne({ owner: doc._id })
            .populate("users")
            .then((room) => room)
            .then((room) => {
              if (!room)
                return res.status(206).json({ error: "No current room!" });
              return res.status(200).send({
                id: room.id,
                users: room.users,
                accessCode: room.accessCode,
              });
            });
        });
    }
  );
};

module.exports.deleteRoom = (req, res) => {
  jwt.verify(
    req.header("Authorization"),
    process.env.SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "JWT not verified" });
      } else if (decoded.permissions.indexOf("Mod") === -1) {
        return res.status(401).json({ error: "Not authorized" });
      }
      User.findOne({ token: decoded.token })
        .then((doc) => doc)
        .then((doc) => {
          if (!doc)
            return res.status(403).json({ error: "Current user not found!" });
          else if (doc.room !== req.body.room)
            return res.status(401).json({ error: "You do not own this room!" });
          Room.findOneAndDelete({ id: req.body.room })
            .then((room) => {
              doc.room = null;
              doc.save();
              Voter.deleteMany({
                _id: { $in: room.users.map((v) => mongoose.Types.ObjectId(v)) },
              })
                .then(() => {
                  return res.status(200).json({ success: true });
                })
                .catch(() => {
                  return res
                    .status(500)
                    .json({ error: "Unable to delete Voter!" });
                });
            })
            .catch(() => res.status(500).json({ error: "Unable to delete!" }));
        })
        .catch(() => res.status(401).json({ error: "User not found!" }));
    }
  );
};

module.exports.authenticateCode = (req, res) => {
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

module.exports.submitForm = (req, res) => {
  jwt.verify(
    req.header("Authorization"),
    process.env.SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "JWT not verified" });
      }
      Voter.findOne({
        firstName: decoded.firstName,
        code: decoded.code,
        lastName: decoded.lastName,
        school: decoded.school,
      })
        .then((doc) => {
          if (doc.vote != null)
            return res.status(403).json({ error: "You've already voted!" });
          doc.vote = req.body.vote;
          return doc
            .save()
            .then(() => res.status(202).json({ success: "Saved" }))
            .then(async () =>
              vote(
                [
                  decoded.firstName,
                  decoded.lastName,
                  decoded.school,
                  req.body.vote,
                ],
                await Room.findOne({ accessCode: decoded.code })
              )
            );
        })
        .catch((err) => {
          console.error(err);
          res.status(401).json({ error: "Voter not found!" });
        });
    }
  );
};

function _generatePIN(length) {
  let result = "";
  let characters = "0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
