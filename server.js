require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
require("./mongo");

app.get("/testing", (req, res)=>{
    res.send("Test");
});

app.listen(port, ()=> console.log(`Listening on port ${port}`));