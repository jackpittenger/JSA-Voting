require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
require("./mongo");

console.log(mongoose.connection.readyState);

app.get("/testing", (req, res)=>{
    res.send("Test");
});

app.listen(port, ()=> console.log(`Listening on port ${port}`));