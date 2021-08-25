const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'mydb1'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

app.set('pages',path.join(__dirname,'pages'));
			

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/',(req, res) => {
    // HOME PAGE TO PERFORM ALL CRUD OPERATIONS
    let sql = "SELECT * FROM apply";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('home_page', {
            title : 'PERFORM ALL CRUD OPERATIONS HERE',
            apply : rows
        });
    });
});


app.get('/add',(req, res) => {
    res.render('new_user', {
        title : 'ADD A NEW ENTRY HERE'
    });
});
//ADD A NEW ENTRY HERE
app.post('/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO apply SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from apply where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('edit_details', {
            title : 'MODIFY A PREVIOUS ENTRY HERE',
            user : result[0]
        });
    });
});

//UPDATE PREVIOUS RECORDS
app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update apply SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
      
    });
});

//DELETE PREVIOUS RECORDS
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from apply where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


app.listen(3000, () => {
    console.log('Server is running at port 3000');
});