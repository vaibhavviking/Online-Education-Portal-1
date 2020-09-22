const express = require('express');
const ejs = require('ejs');
var session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
var mysql = require('mysql');
// const passport = require('passport');
// const Stratergy = require('passport-local').Stratergy;


var port = process.env.PORT || 3000;

var app = express();

app.use(session({
    secret:'patanjali',
    resave: true,
    saveUninitialized: true
}));

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'nodelogin'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  
    console.log('connected as id ' + connection.threadId);
  });

app.set('view engine', 'ejs');


app.use(express.static('views'));
app.set('views',__dirname + '/views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/student_login', (req,res)=>{
    res.render('index.ejs');
})

async function student_authenticate(username,password,res,req){
    if(username && password){
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?' , [username,password], (err,results,fields)=>{
            if(results.length > 0){
                console.log(results);
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/student_home');
            }else{
                res.send('Wrong username/password');
            }
            res.end();
        });
    }else{
        res.send('enter login credentials');
        res.end();
    }
}
app.post('/student_login',(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    student_authenticate(username,password,res,req);
});

app.get('/student_home',(req,res)=>{
    if(req.session.loggedin){
        res.send('welcome'+req.session.username+'!');
    }else {
        res.send('please login first');
    }
    res.send();
});

app.get('/teacher_home', (req,res)=>{
    res.send('teacher home');
})

app.get('/admin_home', (req,res)=>{
    res.send('admin home');
})

app.get('/', (req,res)=>{
    res.render('homepage.ejs');
})

app.listen(port, ()=>{
    console.log("application started successfully")
    })


 app.use(express.urlencoded({extended : false}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
