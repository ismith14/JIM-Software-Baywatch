const express = require("express")
const path = require('path')
const mysql = require('mysql2')

const app = express()

let publicpath = path.join(__dirname)

var user = ''

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

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(`${publicpath}/public/frontPage.html`)
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

app.post('/api/login', (req, res) =>{
    var sql = "select exists (select username from users where username = ? ) as usernameExists;"
    con.query(sql, [req.body.first], (err, result) =>{
        if(err) throw err;
        else if(result[0].usernameExists === 0){
            console.log('Invalid Username: ' + req.body.first)
            res.send([{ message: "Invalid Username"}])
        }else{
            sql = "select exists (select password from users where password = ? )  as passwordExists;"
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

app.post('/api/createUser', (req, res) =>{
    var sql = "Insert into users values ( ? , ? );"
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

app.get('/api/getUser', (req, res) => {
    if(user == ''){
        res.send([{message: user}])
    }else{
        console.log(user)
        res.send([{message: user}])
    }
})

app.get('/api/userLogout', (req,res) =>{
    user = ''
    console.log(user)
    res.send([{message: user}])
})

app.listen(3000, () => {
    console.log('server listen on port 3000')
})