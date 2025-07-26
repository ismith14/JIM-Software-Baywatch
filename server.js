const express = require("express")
const path = require('path')
const mysql = require('mysql2')

const app = express()

let publicpath = path.join(__dirname)

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootsql',
    database: 'baywatchdb'
})

con.connect((err) => {
    if(err){
        throw err;
    }
    console.log("connected")
})

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(`${publicpath}/public/mainPage.html`)
})

app.get('/main', (req, res) => {
    var sql = 'select locationName from locations'
    con.query(sql, (err, result) => {
        if(err) throw err;
        else{
            console.log("Result: " + result)
            res.json(result)
        }
    })
})

app.get('/locationData/:locationName', (req, res)=>{
    var locationName = req.params.locationName
    var sql = "select * from locations join datalogs on datalogs.locationName = locations.locationName where locations.locationName = ? order by logDate desc limit 1" 
    con.query(sql, [locationName], (err, result) => {
        if(err) throw err;
        else{
            console.log("Result: " + result)
            res.json(result)
        }
    })
})

app.listen(3000, () => {
    console.log('server listen on port 8080')
})