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

module.exports.login = (req, res) => {
    return User.findOne({"token":req.body.token})
        .then(doc=>doc)
        .then(doc=>{
            if(!doc) return res.status(401).json({error: "Invalid login credentials"});
            if(doc.pin === req.body.pin) {
                let payload = {token: req.body.token};
                let jwtToken = jwt.sign(payload, process.env.SECRET, {
                    expiresIn: '1h'
                });
                res.cookie('token', jwtToken, {httpOnly: true}).send();
            } else return res.status(401).json({error: "Invalid login credentials"});
        })
        .catch(err=>{
            console.error(err);
            return res.status(500).json({error: "Internal error, please try again"});
        });
};
