import postgres from 'postgres'
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const fs = require('node:fs');
const credentials = JSON.parse(fs.readFileSync('./models/db/.env/db.env.json', 'utf8'));

const sql = postgres({
    host                 : 'localhost',            // Postgres ip address[s] or domain name[s]
    port                 : 5432,          // Postgres server port[s]
    database             : credentials.name,            // Name of database to connect to
    username             : credentials.name,            // Username of database user
    password             : credentials.password,            // Password of database user
})

export default sql;