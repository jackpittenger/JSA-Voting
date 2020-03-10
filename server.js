require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const port = 80;
const { login } = require("./mongo");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client/build')));

app.get("/testing", (req, res)=>{
    res.send("Test");
});

app.post("/api/login", (req, res)=>{
    login(req.body.token, req.body.pin)
        .then(ret=>console.log(ret));
    return res.send("Hi!");
});

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname+"/client/build/index.html"))
});

app.listen(port, ()=> console.log(`Listening on port ${port}`));