import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { sign } from "./controllers/control.sign.js"
import { user } from "./controllers/control.user.js"
import { entry } from "./controllers/control.entry.js"
import { info } from "./controllers/control.info.js"

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = require("path");

const bcrypt = require('bcrypt'); // Using BCrypt to hash passwords
const saltRounds = 13;

const fs = require('fs');
const https = require('https');
const privateKey  = fs.readFileSync('../certs/sslkey.key', 'utf8'); // Cert & Private Key I made with Let's Encrypt
const certificate = fs.readFileSync('../certs/sslcert.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var express = require("express");
var app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(path.join(__dirname + '/'))); // Sets it so the root path is always this current folder (hence why some files in "./views/" can directly access assets with the bare "/assets/" path)

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + "/views/main.html")); // Sends out our html first thing first
});

// SIGN

app.post('/login', async function(req, res){
  const exec = await sign.login(req.body); // Sends out our endpoint's request
  res.json(exec); // Send back the results of our script's execution
})

app.post('/register', async function(req, res){
  req.body.password = await bcrypt.hash(req.body.password, saltRounds); // Hashed right away for security reasons
  const exec = await sign.register(req.body); 
  res.json(exec);
})

app.post('/tokenLog', async function(req, res){
  const exec = await sign.tokenLog(req.body); 
  res.json(exec);
})

// USER

app.post('/getName', async function(req, res){
  console.log("\n\n---tr---\n getName \n----tr----\n", req.body) // Left as is for debugging purposes (while it would be possible to just do "fs.appendFile(...)" to get proper logs, it's just a waste of time to get a proper logging system running considering I'm under a strict deadline)
  const exec = await user.getName(req.body); 
  res.json(exec);
})

app.post('/getSettings', async function(req, res){
  console.log("\n\n---tr---\n getSettings \n----tr----\n", req.body)
  const exec = await user.getSettings(req.body); 
  res.json(exec);
})

app.post('/editSettings', async function(req, res){
  console.log("\n\n---tr---\n editSettings \n----tr----\n", req.body)
  const exec = await user.editSettings(req.body); 
  res.json(exec);
})

// INFO

app.post('/getLastInfo', async function(req, res){
  console.log("\n\n---tr---\n getLastInfo \n----tr----\n", req.body)
  const exec = await info.getLastInfo(req.body); 
  res.json(exec);
})

app.post('/getInfoFrom', async function(req, res){
  console.log("\n\n---tr---\n getInfoFrom \n----tr----\n", req.body)
  const exec = await info.getInfoFrom(req.body); 
  res.json(exec);
})

app.post('/addInfo', async function(req, res){
  console.log("\n\n---tr---\n addInfo \n----tr----\n", req.body)
  const exec = await info.addInfo(req.body); 
  res.json(exec);
})

// ENTRY

app.post('/getEntries', async function(req, res){
  console.log("\n\n---tr---\n getEntries \n----tr----\n", req.body)
  const exec = await entry.getEntries(req.body); 
  res.json(exec);
})

app.post('/getEntriesFrom', async function(req, res){
  console.log("\n\n---tr---\n getEntriesFrom \n----tr----\n", req.body)
  const exec = await entry.getEntriesFrom(req.body); 
  res.json(exec);
})

app.post('/addEntry', async function(req, res){
  console.log("\n\n---tr---\n addEntry \n----tr----\n", req.body)
  const exec = await entry.addEntry(req.body); 
  res.json(exec);
})

app.post('/editEntry', async function(req, res){
  console.log("\n\n---tr---\n editEntry \n----tr----\n", req.body)
  const exec = await entry.editEntry(req.body); 
  res.json(exec);
})

app.post('/deleteEntry', async function(req, res){
  console.log("\n\n---tr---\n deleteEntry \n----tr----\n", req.body)
  const exec = await entry.deleteEntry(req.body); 
  res.json(exec);
})

const httpsServer = https.createServer(credentials, app); // Use our credentials to create our HTTPS server
httpsServer.listen(443); // Listens to the default 443, was planning on having it run on one of the >=8443 ports. However, Cloudflare's tunnel thingy fucked me so fucking hard I just burned out and went with the easy way out (for now, might actually deal with it later on when I want to host another server OR decide to actually maintain this app)