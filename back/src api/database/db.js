import environments from "../config/environments.js";
import mysql from "mysql2/promise";

let {db} = environments;

let connection = mysql.createPool({
    host:db.host,
    database:db.name,
    user:db.user,
    password:db.password
})

