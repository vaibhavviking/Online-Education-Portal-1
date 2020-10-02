const express = require('express');
const ejs = require('ejs');
var session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
var mysql = require('mysql');
const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const Stratergy = require('passport-local').Stratergy;


var port = process.env.PORT || 3000;

var app = express();
app.use(cookieParser());
app.use(session({
    name: 'login',
    key: 'user_id',
    secret: 'patanjali',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 3600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_id && !req.session.user) {
        res.clearCookie('user_id');
    }
    next();
});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'demo',
    port: 3306
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

app.set('view engine', 'ejs');


app.use(express.static('views'));
app.set('views', __dirname + '/views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/student_login', (req, res) => {
    res.render('login.ejs');
})

app.get('/student_list', (req, res) => {
    showAllStudents(req, res);
})

app.post('/student_login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    student_authenticate(username, password, res, req);
});

app.get('/student_home', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('student_home.ejs');
    } else {
        res.send('please login first');
    }
    res.send();
});

app.get('/teacher_login', (req, res) => {
    res.render('login.ejs');
})

app.get('/admin_login', (req, res) => {
    res.render('login.ejs');
})

app.get('/logout', (req, res) => {
    var query = 'DELETE FROM current_session';
    connection.query(query, (err, results) => {
        if (err) throw err;
        else console.log('session refreshed');
    })
    if (req.session.loggedin) {
        req.session.destroy();
        res.clearCookie('login');
        res.clearCookie('user_id');
        res.redirect('/');
    } else {
        res.send('please login first');
    }
})
app.post('/teacher_login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    teacher_authenticate(username, password, res, req);
})

app.get('/add_student', (req, res) => {
    res.render('add_student.ejs');
})

app.post('/add_student', (req, res) => {
    var name = req.body.Name;
    var Rno = req.body.Rno;
    var year = req.body.year;
    var Dep = req.body.Department;
    var prog = req.body.Program;
    var course1 = req.body.course1;
    var course2 = req.body.course2;
    var course3 = req.body.course3;
    var course4 = req.body.course4;
    var course5 = req.body.course5;
    console.log(Dep);
    console.log(course1);
    var arr = [];
    arr.push(course1);
    arr.push(course2);
    arr.push(course3);
    arr.push(course4);
    arr.push(course5);
    var pass = req.body.password;
    var query = 'INSERT INTO student VALUES (?,?,?,?,?)';


    connection.query(query, [Rno, name, prog, year, Dep], (err, result) => {
        if (err) console.log(err.message);
        else console.log('Added to Student Table');
    })

    query = 'INSERT INTO Account VALUES  (?,?,"student")';

    connection.query(query, [name, pass], (err, result) => {
        if (err) console.log(err.message);
        else console.log('Added to Account Table');
    })

    query = 'INSERT INTO Student_Account_Relation VALUES (?,?)';

    connection.query(query, [Rno, name], (err, reuslt) => {
        if (err) console.log(err.message);
        else console.log('Added to account-student relation');
    })

    arr.forEach((data) => {
        if (data != undefined) {
            query = 'INSERT INTO Courses_Student_Relation VALUES (?,?,?)';
            connection.query(query, [data, Rno, 0], (err, result) => {
                if (err) console.log(err.message);
                else console.log('Added to courses-student relation');
            })
        }
    })
})

app.get('/student_courses', (req, res) => {
    student_courses(req, res,)
})
app.get('/teacher_home', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('teacher_home.ejs');
    } else {
        res.send('please login first');
    }
    res.send();
})

app.get('/admin_home', (req, res) => {
    res.send('admin home');
})

app.get('/', (req, res) => {
    var query = 'DELETE FROM current_session';
    connection.query(query, (err, results) => {
        if (err) throw err;
        else console.log('session refreshed');
    })
    res.render('homepage.ejs');
})


app.post('/admin.ejs', (req, res) => {

})

app.listen(port, () => {
    console.log("application started successfully")
})


app.use(express.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

async function showAllStudents(req, res) {
    connection.query('SELECT * FROM student', (err, results, fields) => {
        if (err) throw err;
        console.log(results);
        res.render('student_list.ejs', { data: results });
    })
}

async function student_authenticate(username, password, res, req) {
    if (username && password) {

        let sql = `call Retrieve_ID(?,?,@ID)`
        connection.query(sql, [username, password], (err, result, fields) => {
            if (err) res.redirect('/student_login') ;

            connection.query('SELECT @ID', (err, results, fields) => {
                if (err) throw err;
                if (results.length > 0) {
                    console.log(results);
                    var Rno = req.body.Rno;
                    req.session.user = username;
                    req.session.loggedin = true;
                    req.session.username = username;
                    var query2 = 'INSERT INTO current_session VALUES (?,?)';
                    connection.query(query2, [req.sessionID, Rno], (err, results) => {
                        if (err) throw err;
                        console.log('Instance created');
                    })
                    res.redirect('/student_home');
                } else {
                    res.send("Wrong Username or Password");
                }
                res.end();
            })
        })
    } else {
        res.send('enter login credentials');
        res.end();
    }
}

async function teacher_authenticate(username, password, res, req) {
    if (username && password) {

        let sql = `call Retrieve_ID(?,?,@ID)`
        connection.query(sql, [username, password], (err, result, fields) => {
            if (err) res.send('wrong username/password');

            connection.query('SELECT @ID', (err, results, fields) => {
                if (err) throw err;
                if (results.length > 0) {
                    console.log(results);
                    var Rno = req.body.Rno;
                    req.session.user = username;
                    req.session.loggedin = true;
                    req.session.username = username;
                    var query2 = 'INSERT INTO current_session VALUES (?,?)';
                    connection.query(query2, [req.sessionID, Rno], (err, results) => {
                        if (err) throw err;
                        console.log('Instance created');
                    })
                    res.redirect('/teacher_home');
                } else {
                    res.send("Wrong Username or Password");
                }
                res.end();
            })
        })
    } else {
        res.send('enter login credentials');
        res.end();
    }
}
