import postgres from 'postgres'

const sql = postgres({
  host                 : 'localhost',            // Postgres ip address[s] or domain name[s]
  port                 : 5432,          // Postgres server port[s]
  database             : 'db_cal',            // Name of database to connect to
  username             : 'db_cal',            // Username of database user
  password             : 'Mar.N10fer2',            // Password of database user
})

export default sql