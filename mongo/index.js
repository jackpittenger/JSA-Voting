const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:27017/${process.env.DB_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected successfully!")
});

const User = require('./User').User;
const Room = require('./Room').Room;

module.exports.login = (req, res) => {
    return User.findOne({"token":req.body.token})
        .then(doc=>doc)
        .then(doc=>{
            if(!doc) return res.status(401).json({error: "Invalid login credentials"});
            if(doc.pin === req.body.pin) {
                let payload = {token: req.body.token, permissions: doc.permissions};
                let jwtToken = jwt.sign(payload, process.env.SECRET, {
                    expiresIn: '1h'
                });
                res.json({token: jwtToken, message: "Success"}).send();
            } else return res.status(401).json({error: "Invalid login credentials"});
        })
        .catch(err=>{
            console.error(err);
            return res.status(500).json({error: "Internal error, please try again"});
        });
};

module.exports.createUser = (req, res)=> {
    jwt.verify(req.header("Authorization"), process.env.SECRET, (err, decoded)=>{
        if(err) {
            console.error(err);
            return res.status(401).json({error: "JWT not verified"});
        }
        switch(req.body.type) {
            case "mod":
                return res.status(501).json({error: "Not Implemented"});
            case "admin":
                if(decoded.permissions.indexOf("Dev") === -1) return res.status(401).json({error: "Not authorized"});
                if(!req.body.name || req.body.name.length > 24 || req.body.name.length < 5)
                    return res.status(422).json({error: "Invalid name"});
                let pin = _generatePIN(7);
                User.create({token: req.body.name, pin: pin, permissions: ["Admin"]})
                    .then(doc=>{
                        console.log("Sending");
                       return res.status(200).json({pin: doc.pin});
                    })
                    .catch(err=>{
                        console.error(err);
                        return res.status(500).json({error: "Error while creating a user"})
                    });
                break;
            default:
                return res.status(501).json({error: "Not Implemented"});
        }
    })
};

function _generatePIN(length) {
    let result = '';
    let characters = '0123456789';
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}