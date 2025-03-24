import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = require("path");

var express = require("express");
var app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(path.join(__dirname + '/')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + "/views/main.html"));
});

app.post('/login', async function(req, res){
  const login = await import("/controllers/control.login.js");
  const exec = await login.checkLogin(req.body); //only that for now
  res.json(exec);
})

app.post('/checkEmail', async function(req, res){
  const login = await import("/controllers/control.login.js");
  const exec = await login.getAccount(req.body); //only that for now
  res.json(exec);
})

app.post('/fetchInfos', async function(req, res){
  const user = await import("/controllers/control.user.js");
  const exec = await user.getInfos(req.body); //only that for now
  res.json(exec);
})

app.post('/newWeight', async function(req, res){
  const user = await import("/controllers/control.user.js");
  const exec = await user.getNewWeight(req.body); //only that for now
  res.json(exec);
})

app.listen(8080);