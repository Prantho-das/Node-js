
import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql";

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});
//var con;
export default con;
