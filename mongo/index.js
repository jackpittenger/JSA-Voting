const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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
  .then((r) => console.log("Mongoose ✓"));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected successfully!");
});

const User = require("./User").User;
const Room = require("./Room").Room;

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
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Internal error, please try again" });
    });
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
        .then((doc) => {
          return res.status(200).json({ pin: doc.pin });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: "Error while creating a user" });
        });
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
            usr.save((err) => {
              if (err)
                return res.status(500).send({ error: "Error creating room" });
              res.status(201).send({ code: pin });
            });
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).send({ error: "Error creating room" });
          });
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
          console.log(doc._id);
          return Room.findOne({ owner: doc._id })
            .then((room) => room)
            .then((room) => {
              console.log(room._id);
              return res.status(200).send({
                id: room.id,
                users: room.users,
                accessCode: room.accessCode,
                owner: room.owner,
              });
            });
        });
    }
  );
};

module.exports.authenticateCode = (req, res) => {
  return res.sendStatus(200);
};

function _generatePIN(length) {
  let result = "";
  let characters = "0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
