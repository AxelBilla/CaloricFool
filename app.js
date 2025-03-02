import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { main } from "./controllers/control.main.js";

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

app.post('/request', async function(req, res){
  const exec = await main(req.body);
  res.json(exec);
})

app.listen(8080);