
const express = require('express');
const ejs = require('ejs');
var session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
var mysql = require('mysql');
const cookieParser = require('cookie-parser');
const { promises } = require('fs');
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

let get_id = new Promise((resolve, reject) => {
    var sql1 = 'select User_ID from current_session';
    var id;
    connection.query(sql1, (err, results1) => {
        if (err) throw err;
        if (results1.length > 0) {
            id = results1[0].User_ID;
            // console.log(id);
            resolve(id);

        }
        // console.log(results1[0].User_ID);
    })

    // console.log('outside',id);
})
app.get('/student_login', (req, res) => {
    var query = 'DELETE FROM current_session';
    connection.query(query, (err, results) => {
        if (err) throw err;
        else console.log('session refreshed');
    })
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
    res.render('teacher_login.ejs');
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
    }
    res.redirect('/');
})
app.post('/teacher_login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username, password);
    teacher_authenticate(username, password, res, req);
})

app.get('/timetable', (req, res) => {
    var sql1 = 'select User_ID from current_session';
    var id;
    connection.query(sql1, (err, results1) => {
        if (err) throw err;
        if (results1.length > 0) {
            id = results1[0].User_ID;
            console.log(id);
            var sql = 'call Student_Time_Table(?)';
            connection.query(sql, [id], (err, results) => {
                if (err) throw err;
                // console.log(results);
                results[0].forEach(element => {
                    if (element.Monday == null) { element.Monday = '-' }
                    if (element.Tuesday == null) { element.Tuesday = '-' }
                    if (element.Wednesday == null) { element.Wednesday = '-' }
                    if (element.Thursday == null) { element.Thursday = '-' }
                    if (element.Friday == null) { element.Friday = '-' }
                    if (element.Saturday == null) { element.Saturday = '-' }
                    // console.log(element.Time);
                });
                res.render('Timetable.ejs', { data: results[0] });
            })
        } else {
            res.send('lol');
        }
        // console.log(results1[0].User_ID);
    })

    // console.log('outside',id);

})

app.get('/add_student', (req, res) => {
    // if (req.session.loggedin && req.session.user) {
    //     res.render('add_student.ejs');
    // } else {
    //     res.send('please login first');
    // }
    res.render('add_student.ejs');
})

app.get('/all_courses', (req, res) => {
    var sql = 'select * from Courses';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.render('all_courses.ejs', { data: results });
    })
})

app.post('/add_student', (req, res) => {

    var name = req.body.Name;
    var Rno = req.body.Rno;
    var user_id = req.body.uid;
    var year = req.body.year;
    var Dep = req.body.Department;
    var prog = req.body.Program;
    var course1 = req.body.course1;
    var course2 = req.body.course2;
    var course3 = req.body.course3;
    var course4 = req.body.course4;
    var course5 = req.body.course5;
    console.log(Dep);
    // console.log(course1);
    var arr = [];
    arr.push(course1);
    arr.push(course2);
    arr.push(course3);
    arr.push(course4);
    arr.push(course5);
    var pass = req.body.password;
    var sql = 'call Insert_Student(?,?,?,?,?,?,?,@did,@rif)';
    // var sql=`call Insert_Student(${Rno},'${name}','${prog}',${year},${Dep},'${user_id}','${pass}',@did,@rif)`;
    connection.query(sql, [Rno, name, prog, year, Dep, user_id, pass], (err, results2) => {
        if (err) throw err;
        connection.query('select @did;', (err, results1) => {
            if (err) throw err;
            if (results1[0]['@did'] == 1) {
                res.send('Dpulicate Entry Detected');
                res.end();
            }
        })
        connection.query('select @rif;', (err, results3) => {
            if (err) throw err;
            if (results3[0]['@rif'] == 1) {
                res.send('Referential Integrity Compromised.Please check the inputs');
                res.end();
            }
        })

        arr.forEach((item) => {
            if (item != undefined) {
                var sql = 'call Add_Student_Course(?,?,100,0,@did,@rif,@inv)';
                connection.query(sql, [item, Rno], (err, results) => {
                    if (err) throw err;
                    connection.query('select @did;', (err, results1) => {
                        if (err) throw err;
                        if (results1[0]['@did'] == 1) {
                            res.send('Duplicate Entry Detected');
                            res.end();
                        }
                    })
                    connection.query('select @rif;', (err, results2) => {
                        if (err) throw err;
                        if (results2[0]['@rif'] == 1) {
                            res.send('Referential Intigrity Breached');
                            res.end();
                        }
                    })
                    connection.query('select @inv;', (err, results3) => {
                        if (err) throw err;
                        if (results3[0]['@inv'] == 1) {
                            res.send('Invalid Attendance Input');
                            res.end();
                        }
                    })

                    console.log('course added');
                })
            }
        })
        console.log('student added');
        res.redirect('/');
    })

})

app.get('/student_courses', (req, res) => {
    get_student_courses(req, res,)
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

app.get('/prof_timetable', (req, res) => {
    timetable(req,res);
})

app.get('/student_courses',(req,res)=>{
    get_student_courses(req,res);
})
app.get('/prof_courses', (req, res) => {
    get_prof_courses(req, res);
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
            if (err) res.redirect('/student_login');

            connection.query('SELECT @ID', (err, results, fields) => {
                if (err) throw err;
                else if (results[0]['@ID'] == -1) {
                    res.send('Wrong username/Password');
                    res.end();
                } else if (results[0]['@ID'] > 0) {
                    console.log(results);
                    var Rno = req.body.Rno;
                    req.session.user = username;
                    req.session.loggedin = true;
                    req.session.username = username;
                    var sql2 = 'delete from current_session';
                    connection.query(sql2, (err, results) => {
                        if (err) throw err;
                        console.log('cache cleared');
                    })
                    var query2 = 'INSERT INTO current_session VALUES (?,?)';
                    connection.query(query2, [req.sessionID, Rno], (err, results) => {
                        if (err) throw err;
                        console.log('Instance created');
                    })
                    res.redirect('/student_home');
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
            if (err) res.redirect('/teacher_login');

            connection.query('SELECT @ID', (err, results, fields) => {
                if (err) throw err;
                else if (results[0]['@ID'] == -1) {
                    res.send('Wrong username/Password');
                    res.end();
                } else if (results[0]['@ID'] > 0) {
                    console.log(results);
                    var Rno = req.body.Rno;
                    req.session.user = username;
                    req.session.loggedin = true;
                    req.session.username = username;
                    var sql2 = 'delete from current_session';
                    connection.query(sql2, (err, results) => {
                        if (err) throw err;
                        console.log('cache cleared');
                    })
                    var query2 = 'INSERT INTO current_session VALUES (?,?)';
                    connection.query(query2, [req.sessionID, results[0]['@ID']], (err, results) => {
                        if (err) throw err;
                        console.log('Instance created');
                    })
                    res.redirect('/teacher_home');
                }
                res.end();
            })
        })
    } else {
        res.send('enter login credentials');
        res.end();
    }
}

async function get_prof_courses(req, res) {
    let id = await get_id;
    if (id != undefined) {
        var sql = 'call Get_Professor_Courses(?)';
        connection.query(sql, [id], (err, results) => {
            if (err) throw err;
            console.log(results);
            res.render('courses.ejs', { data: results[0] });
        })
    }
}

async function get_student_courses(req,res){
    let id = await get_id;
    if (id != undefined) {
        var sql = 'call Get_Student_Courses(?)';
        connection.query(sql, [id], (err, results) => {
            if (err) throw err;
            console.log(results);
            res.render('courses.ejs', { data: results[0] });
        })
    }
}
async function timetable(req, res) {
    let id = await get_id;
    var sql = 'call Professor_Time_Table(?)';
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        // console.log(results);
        results[0].forEach(element => {
            if (element.Monday == null) { element.Monday = '-' }
            if (element.Tuesday == null) { element.Tuesday = '-' }
            if (element.Wednesday == null) { element.Wednesday = '-' }
            if (element.Thursday == null) { element.Thursday = '-' }
            if (element.Friday == null) { element.Friday = '-' }
            if (element.Saturday == null) { element.Saturday = '-' }
            // console.log(element.Time);
        });
        res.render('Timetable.ejs', { data: results[0] });
    })
}
