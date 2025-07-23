import mysql from "mysql2"

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rootsql', //can be anything you want
    database: 'baywatchDB'
}).promise()

