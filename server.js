require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");
const https = require("https");

const app = express();
const { login } = require("./mongo");
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');

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

if(process.env.DEPLOY === "true"){
    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname+"/client/build/index.html"))
    });
    const httpsServer = https.createServer({key: privateKey, cert: certificate}, app);
    httpsServer.listen(443, ()=>console.log("Production: 443"));
} else {
    app.listen(443, ()=>  console.log("Running on port 443 in dev mode"));
}
