const mongoose = require('mongoose');

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

module.exports.login = (token, pin) => {
    return User.findOne({"token":token, "pin":pin})
        .then(doc=>doc)
        .then(doc=>{
            if(!doc) return false;
            return doc.token;
        })
        .catch(err=>console.error(err));
};


// User.find({token: "admin"},(err,doc)=>{
//     console.log(doc);
// });
// console.log(test.token);
