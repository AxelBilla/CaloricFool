import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { sign } from "./controllers/control.sign.js"
import { user } from "./controllers/control.user.js"
import { entry } from "./controllers/control.entry.js"

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = require("path");

const bcrypt = require('bcrypt');
const saltRounds = 13;

const fs = require('fs');
const https = require('https');
const privateKey  = fs.readFileSync('../certs/sslkey.key', 'utf8');
const certificate = fs.readFileSync('../certs/sslcert.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var express = require("express");
var app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(path.join(__dirname + '/')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + "/views/main.html"));
});

app.post('/login', async function(req, res){
  const exec = await sign.login(req.body); 
  res.json(exec);
})

app.post('/register', async function(req, res){
  req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  const exec = await sign.register(req.body); 
  res.json(exec);
})

app.post('/tokenLog', async function(req, res){
  const exec = await sign.tokenLog(req.body); 
  res.json(exec);
})

app.post('/getLastInfo', async function(req, res){
  const exec = await user.getLastInfo(req.body); 
  res.json(exec);
})

app.post('/newWeight', async function(req, res){
  const exec = await user.getNewWeight(req.body); 
  res.json(exec);
})

app.post('/getSettings', async function(req, res){
  const exec = await user.getSettings(req.body); 
  res.json(exec);
})

app.post('/getName', async function(req, res){
  const exec = await user.getName(req.body); 
  res.json(exec);
})

app.post('/getEntries', async function(req, res){
  const exec = await entry.getEntries(req.body); 
  res.json(exec);
})

app.post('/getEntriesFrom', async function(req, res){
  const exec = await entry.getEntriesFrom(req.body); 
  res.json(exec);
})

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443);