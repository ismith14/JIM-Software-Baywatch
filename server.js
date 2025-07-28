const express = require("express")
const path = require('path')
const mysql = require('mysql2')

const app = express()

let publicpath = path.join(__dirname)

var user = ''

//establishes database credentials
//uses MySql
//database was tested locally, requires locally run database to connect
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootsql',
    database: 'baywatchdb'
})

//establish connection to database for the server
con.connect((err) => {
    try{
        if(err){
            throw err;
        }
        console.log("connected")
    }catch(err){
        console.log("Unable to connect to database")
    }   
})

app.use(express.static('public'))

app.use(express.json())

//default page for application
app.get('/', (req, res) => {
    res.sendFile(`${publicpath}/public/frontPage.html`)
})

//retrieves all locations with the database and returns them to frontend for display in dropdown menu
app.get('/api/main', (req, res) => {
    var sql = 'select * from locations'
    con.query(sql, (err, result) => {
        if(err) throw err;
        else{
            console.log("Result: " + result)
            res.json(result)
        }
    })
})

//retrieves all data about a select location from database and returns data to frontend for display
app.get('/api/locationData/:locationName', (req, res)=>{
    var locationName = req.params.locationName
    var sql = "SELECT * FROM locations JOIN datalogs ON datalogs.locationName = locations.locationName WHERE locations.locationName = ? ORDER BY logDate DESC LIMIT 1" 
    con.query(sql, [locationName], (err, result) => {
        if(err) throw err;
        else{
            console.log("Result: " + result)
            res.json(result)
        }
    })
})

app.get('/api/locationData/:locationLat/:locationlon', (req, res) => {
    var lat = req.params.locationLat
    var lon = req.params.locationlon
    var sql = "SELECT * FROM locations JOIN datalogs ON datalogs.locationName = locations.locationName WHERE locations.latitude = ? AND locations.longitude = ? ORDER BY logDate DESC LIMIT 1;"
    con.query(sql, [lat, lon], (err, result) => {
        if(err) throw err;
        else{
            console.log(result)
            res.json(result)
        }
    })
})

//performs queries for the username and password to see if the correct username and password were inputted
app.post('/api/login', (req, res) =>{
    var sql = "SELECT EXISTS (SELECT username FROM users WHERE username = ? ) AS usernameExists;"
    con.query(sql, [req.body.first], (err, result) =>{
        if(err) throw err;
        else if(result[0].usernameExists === 0){
            console.log('Invalid Username: ' + req.body.first)
            res.send([{ message: "Invalid Username"}])
        }else{
            sql = "SELECT EXISTS (SELECT password FROM users WHERE password = ? )  AS passwordExists;"
            con.query(sql, [req.body.password], (err, result) =>{
                if(err) throw err;
                else if(result[0].passwordExists === 0){
                    console.log('Invalid Password: ' + req.body.password)
                    res.send([{ message: "Invalid Password"}])
                }else{
                    console.log("Info valid")
                    user = req.body.first
                    res.send([{message: "Successful"}])
                }
            })
        }
    })
})
//tries to insert new user data into database, if not unique then will give error to user
app.post('/api/createUser', (req, res) =>{
    var sql = "INSERT INTO users VALUES ( ? , ? );"
        try{
        con.query(sql, [req.body.username, req.body.password], (err, result) =>{
            if(err){ 
                res.send([{message: 'Duplicate Entry'}])
            }
            else{
            console.log("Record Inserted")
            res.send([{message: "Successful"}])
            }
        })
    }catch(err){
        res.send({message: 'Duplicate Entry'})
    }
})
//gives the currently logged in user to frontend
app.get('/api/getUser', (req, res) => {
    if(user == ''){
        res.send([{message: user}])
    }else{
        res.send([{message: user}])
    }
})
//allows user to logout
app.get('/api/userLogout', (req,res) =>{
    user = ''
    console.log(user)
    res.send([{message: user}])
})
//port the server.js listens to run locally
app.listen(3000, () => {
    console.log('server listen on port 3000')
})