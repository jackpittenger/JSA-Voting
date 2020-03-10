require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const { login } = require("./mongo");

app.use(bodyParser.json());

app.get("/testing", (req, res)=>{
    res.send("Test");
});

app.post("/api/login", (req, res)=>{
    login(req.body.token, req.body.pin)
        .then(ret=>console.log(ret));
    return res.send("Hi!");
});

app.listen(port, ()=> console.log(`Listening on port ${port}`));