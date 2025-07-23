import mysql from "mysql2"

//to use mysql database: install mysql server and node

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rootsql', //can be anything you want
    database: 'baywatchDB'
}).promise()

