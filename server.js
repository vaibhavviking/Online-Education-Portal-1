
const express = require('express');
const ejs = require('ejs');
var session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
var mysql = require('mysql');
const cookieParser = require('cookie-parser');
const { promises, readdirSync, link } = require('fs');
const { get } = require('http');
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
    multipleStatements: true,
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

function GET_ID() {
    return new Promise((resolve, reject) => {
        var sql1 = 'select User_ID from current_session';
        // var id;
        connection.query(sql1, (err, results1) => {
            if (err) throw err;
            if (results1.length > 0) {
                // id = results1[0].User_ID;
                // console.log(id,'here');
                console.log(results1[0].User_ID);
                resolve(results1[0].User_ID);

            } else {
                resolve(-1);
            }
            // console.log(results1[0].User_ID);
        })
    })
}
let get_id = new Promise((resolve, reject) => {
    var sql1 = 'select User_ID from current_session';
    // var id;
    connection.query(sql1, (err, results1) => {
        if (err) throw err;
        if (results1.length > 0) {
            // id = results1[0].User_ID;
            console.log(results1[0].User_ID);
            resolve(results1[0].User_ID);

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
    res.render('teacher_login.ejs');
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
        res.redirect('/');
    }
    res.end();
});

app.get('/teacher_login', (req, res) => {
    res.render('teacher_login.ejs');
})

app.get('/admin_login', (req, res) => {
    res.render('admin_login.ejs');
})

app.post('/admin_login', (req, res) => {
    var username = req.body.name;
    var passsword = req.body.password;

    admin_authenticate(username, passsword, res, req);
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

app.get('/student_timetable', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        // res.render('student_home.ejs');
        student_timetable(req, res);
    } else {
        res.redirect('/');
    }

})

app.get('/delete_student', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('delete_student.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/delete_student', (req, res) => {
    var Rno = req.body.Rno;
    var sql = 'call Delete_Student(?)';
    connection.query(sql, [Rno], (err, results) => {
        if (err) throw err;
        console.log('Student Removed');
        res.redirect('/admin_home');
    })
})

app.get('/delete_prof', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('delete_teacher.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/delete_prof', (req, res) => {
    var empid = req.body.emp_id;
    var sql = 'call Delete_Professor(?)';
    connection.query(sql, [empid], (err, results) => {
        if (err) throw err;
        console.log('Professor Removed');
        res.redirect('/admin_home');
    })
})

app.post('/delete_course', (req, res) => {

    var course_code = req.body.course_code;
    var sql = 'call Delete_Course(?,@rif); select @rif';
    connection.query(sql, [course_code], (err, results) => {
        if (err) throw err;
        console.log(results[1][0]['@rif']);
        if(results[1][0]['@rif']!=null){
            console.log(results[1][0]['@rif']);
            res.send('rif detected');
            // res.end();
        }else{
        console.log('Course Deleted');
        res.redirect('/admin_home');
        }    
    })
    
})

app.post('/delete_dept', (req, res) => {
    var deptid = req.body.deptid;
    var sql = 'call Delete_Dept(?,@rif); select @rif';
    connection.query(sql, [deptid], (err, results) => {
        if (err) throw err;
        console.log(results[1][0]['@rif']);
        if(results[1][0]['@rif']!=null){
            // console.log(results[1][0]['@rif']);
            res.send('rif detected');
            console.log('Department not Deleted');
            // res.end();
        }else{
        console.log('Department Deleted');
        res.redirect('/admin_home');
        }    
    })
})

app.post('/delete_admin', (req, res) => {
    var adminid = req.body.adminid;
    var sql = 'call Delete_Admin(?)';
    connection.query(sql, [adminid], (err, results) => {
        if (err) throw err;
        console.log('Admin Removed');
        res.redirect('/admin_home');
    })
})

app.get('/add_student', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('add_student.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/all_courses', (req, res) => {
    var sql = 'select * from Courses';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.render('all_courses.ejs', { data: results });
    })
})

app.get('/delete_dept', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('delete_dept.ejs');
    } else {
        res.redirect('/admin_login');
    }
})

app.get('/delete_course', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('delete_course.ejs');
    } else {
        res.redirect('/admin_login');
    }
})

app.get('/delete_admin', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('delete_admin.ejs');
    } else {
        res.redirect('/admin_login');
    }
})

app.post('/add_student', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        // res.render('student_home.ejs');
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
        var sql = 'call Insert_Student(?,?,?,?,?,?,?,@did,@rif); select @did; select @rif';
        connection.query(sql, [Rno, name, prog, year, Dep, user_id, pass], (err, results2) => {
            if (err) throw err;
        
            console.log(results2);
            if(results2[1][0]['@did']!=null){
                res.send('duplicate entry detected');
            }else if(results2[2][0]['@rif']!=null){
                res.send('rif detected');
            }else{
            arr.forEach((item) => {
                if (item != undefined) {
                    var sql = 'call Add_Student_Course(?,?,100,0,@did,@rif,@inv);select @did;select @rif;select @inv';
                    
                    connection.query(sql, [item, Rno], (err, results) => {
                        if(err) throw err;
                        console.log(results)
                        if(results[1][0]['@did']!=null){
                            res.send('duplicate entry detected');
                        }else if(results[2][0]['@rif']!=null){
                            res.send('referential integrity breached');
                        }else if(results[3][0]['@inv']!=null){
                            res.send('Invalid attendance value.Please try again.')
                        }else{
                            console.log('Course addded : ',item)
                        }
                    })
                }
            })
            console.log('student added');
            res.redirect('/admin_home');
        }
        })
    } else {
        res.redirect('/');
    }

})

app.get('/add_admin', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('add_admin.ejs');
    } else {
        res.redirect('/admin_login');
    }
})

app.post('/add_admin', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var admin_id = req.body.admin_id;
    var sql = 'call Insert_Admin(?,?,?,@duplicate_key)';
    connection.query(sql, [admin_id, username, password], (err, results) => {
        if (err) throw err;
        var sql1 = 'select @duplicate_key';
        connection.query(sql1, (err, results1) => {
            if (results1[0]['@duplicate_key'] > 0) {
                res.send('Username or Admin ID already taken');
                res.end();
            }
        })
        console.log('admin added');
        res.redirect('/admin_home');
    })
})

app.get('/add_dept', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('add_dept.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/add_course', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('add_course.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/add_dept', (req, res) => {
    var dept_id = req.body.dept_id;
    var dept_name = req.body.dept_name;
    add_dept(req, res, dept_id, dept_name);
})
app.post('/add_course', (req, res) => {
    var course_code = req.body.course_code;
    var course_name = req.body.course_name;
    var class_link = req.body.class_link;
    var credits = req.body.credits;

    add_course(req, res, course_code, course_name, class_link, credits);
})
app.get('/add_prof', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        // res.render('student_home.ejs');
        res.render('add_prof.ejs');
    } else {
        res.redirect('/');
    }
})
app.post('/add_prof', (req, res) => {
    var name = req.body.Name;
    var empid = req.body.empid;
    var user_id = req.body.uid;
    var Dep = req.body.Department;
    var post = req.body.post;
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
    var sql = 'call Insert_Professor(?,?,?,?,?,?,@did,@rif); select @did; select @rif';
    connection.query(sql, [empid, name, post, Dep, user_id, pass], (err, results2) => {
        if (err) throw err;
        
            console.log(results2);
            if(results2[1][0]['@did']!=null){
                res.send('duplicate entry detected');
            }else if(results2[2][0]['@rif']!=null){
                res.send('rif detected');
            }else{
        arr.forEach((item) => {
            if (item != undefined) {
                var sql = 'call Add_Professor_Course(?,?,@did,@rif); select @did; select @rif;';
                connection.query(sql, [item, empid], (err, results) => {
                    if(err) throw err;
                        console.log(results)
                        if(results[1][0]['@did']!=null){
                            res.send('duplicate entry detected');
                        }else if(results[2][0]['@rif']!=null){
                            res.send('referential integrity breached');
                        }else{
                            console.log('Course addded : ',item)
                        }

    
                })
            }
        })
    }
        console.log('Professor added');
        res.redirect('/admin_home');
    })
})
app.get('/student_courses', (req, res) => {
    get_student_courses(req, res,)
})
app.get('/teacher_home', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('teacher_home.ejs');
    } else {
        res.redirect('/');
    }
    res.end();
})

app.get('/admin_home', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('Admin_home.ejs');
    } else {
        res.redirect('/');
    }
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
    if (req.session.loggedin && req.session.user) {
        prof_timetable(req, res);
    } else {
        res.redirect('/');
    }
})

app.get('/study_material', (req, res) => {


    Get_Student_Material(req, res);
})

app.get('/student_courses', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        get_student_courses(req, res);
    } else {
        res.redirect('/');
    }
})
app.get('/prof_courses', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        get_prof_courses(req, res);
    } else {
        res.redirect('/');
    }
})
app.listen(port, () => {
    console.log("application started successfully")
})

app.get('/ongoing_classes', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        get_ongoing_courses(req, res);
    } else {
        res.redirect('/');
    }

})
app.use(express.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

async function add_dept(req, res, dept_id, dept_name) {
    var sql = 'call Insert_Dept(?,?,@did)';
    connection.query(sql, [dept_id, dept_name], (err, results) => {
        if (err) throw err;
        var sql2 = 'select @did';
        connection.query(sql2, (err, results1) => {
            if (results1[0]['@did'] > 0) {
                res.send('Duplicate Entry detected');
                res.end();
            }
        })
        console.log('Department added');
        res.redirect('/admin_home');
    })
}
async function add_course(req, res, course_code, course_name, class_link, credits) {
    var sql = 'call Insert_Course(?,?,?,?,@did)';
    connection.query(sql, [course_code, course_name, class_link, credits], (err, results) => {
        if (err) throw err;
        var sql2 = 'select @did';
        connection.query(sql2, (err, results1) => {
            if (results1[0]['@did'] > 0) {
                res.send('Duplicate Entry detected');
                res.end();
            }
        })
        console.log('Course added');
        res.redirect('/admin_home');
    })
}
async function showAllStudents(req, res) {
    connection.query('SELECT * FROM student', (err, results, fields) => {
        if (err) throw err;
        console.log(results);
        res.render('student_list.ejs', { data: results });
    })
}

async function student_authenticate(username, password, res, req) {
    if (username && password) {

        let sql = `call Retrieve_ID(?,?,@ID,@t); select @ID; select @t;`
        connection.query(sql, [username, password], (err, result, fields) => {
            if (err) throw err
            if(result[1][0]['@ID']==-1 || result[2][0]['@t']!='Student'){
                res.send('Wrong username/password');
            }else{
                console.log(result);
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
                connection.query(query2, [req.sessionID, result[1][0]['@ID']], (err, results1) => {
                    if (err) throw err;
                    console.log(result[1][0]['@ID']);
                    console.log('Instance created');
                })
                res.redirect('/student_home');
            }
        })
    } else {
        res.send('enter login credentials');
        res.end();
    }
}

async function teacher_authenticate(username, password, res, req) {
    if (username && password) {

        let sql = `call Retrieve_ID(?,?,@ID,@t); select @ID; select @t;`
        connection.query(sql, [username, password], (err, result, fields) => {
            if (err) throw err
            if(result[1][0]['@ID']==-1 || result[2][0]['@t']!='Professor'){
                res.send('Wrong username/password');
            }else{
                console.log(result);
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
                connection.query(query2, [req.sessionID, result[1][0]['@ID']], (err, results1) => {
                    if (err) throw err;
                    console.log(result[1][0]['@ID']);
                    console.log('Instance created');
                })
                res.redirect('/teacher_home');
            }
        })
    } else {
        res.send('enter login credentials');
        res.end();
    }
}
async function admin_authenticate(username, password, res, req) {
    if (username && password) {

        let sql = `call Retrieve_ID(?,?,@ID,@t); select @ID; select @t;`
        connection.query(sql, [username, password], (err, result, fields) => {
            if (err) throw err
            if(result[1][0]['@ID']==-1 || result[2][0]['@t']!='Admin'){
                res.send('Wrong username/password');
            }else{
                console.log(result);
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
                connection.query(query2, [req.sessionID, result[1][0]['@ID']], (err, results1) => {
                    if (err) throw err;
                    console.log(result[1][0]['@ID']);
                    console.log('Instance created');
                })
                res.redirect('/admin_home');
            }
        })
    } else {
        res.send('enter login credentials');
        res.end();
    }
}

let get_prof_courses = async function (req, res) {
    let id = await GET_ID();
    console.log(id);
    if (id != undefined) {
        var sql = 'call Get_Professor_Courses(?)';
        connection.query(sql, [id], (err, results) => {
            if (err) throw err;
            console.log(results);
            res.render('courses.ejs', { data: results[0] });
        })
    }
}

let get_student_courses = async function (req, res) {
    let id = await GET_ID();
    console.log(id);
    if (id != undefined) {
        var sql = 'call Get_Student_Courses(?)';
        connection.query(sql, [id], (err, results) => {
            if (err) throw err;
            console.log(results);
            res.render('courses.ejs', { data: results[0] });
        })
    }
}


let get_ongoing_courses = async function (req, res) {
    let id = await GET_ID();
    if (id < 0) {
        res.redirect('/student_login');
        res.end();
    }
    console.log(id);
    var sql = 'call Student_Time_Table(?)';
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        // console.log(results);
        // var d=new Date();

        var count = 0;
        var d = new Date();
        var h = d.getHours();
        var day = d.getDay();
        var arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // var hr = document.getElementById('time').innerHTML.slice(-3);

        var data = results[0];
        // console.log(data);
        var course = null;
        var time;
        data.forEach((item) => {
            var hr = "";
            if (item.Time[0] != 0) {
                hr += item.Time[0];
            }
            hr += item.Time[1];
            var day2 = arr[day];
            course = item[`${day2}`];
            console.log(course);
            // console.log(h, "and", hr);
            if (h == parseInt(hr) && course != null) {
                count++;
                console.log('here');
                // course = item.Monday;

                time = item.Time;
            }
        })
        if (count == 0) {
            console.log(count);
            res.render("ongoing_classes.ejs", { error: 1, course1: null, time1: null });
            res.end();
        } else {
            console.log(count);
            res.render("ongoing_classes.ejs", { error: null, course1: course, time1: time })
            res.end();
        }

        // res.render('ongoing_classes.ejs', { data: JSON.stringify(results[0]),  date: d});
    })
}
let prof_timetable = async function (req, res) {
    let id = await GET_ID();
    if (id < 0) {
        res.redirect('/teacher_login');
        res.end();
    }
    var sql = 'call Professor_Time_Table(?)';
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        console.log(results);
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
let student_timetable = async (req, res) => {
    console.log('here');
    let id = await GET_ID();
    console.log(id);
    if (id < 0) {
        res.redirect('/student_login');
        res.end();
    }
    var sql = 'call Student_Time_Table(?)';
    connection.query(sql, [id], (err, results) => {
        if (err)
            throw err;
        console.log(results);
        results[0].forEach(element => {
            if (element.Monday == null) { element.Monday = '-'; }
            if (element.Tuesday == null) { element.Tuesday = '-'; }
            if (element.Wednesday == null) { element.Wednesday = '-'; }
            if (element.Thursday == null) { element.Thursday = '-'; }
            if (element.Friday == null) { element.Friday = '-'; }
            if (element.Saturday == null) { element.Saturday = '-'; }
            // console.log(element.Time);
        });
        res.render('Timetable.ejs', { data: results[0] });
    });
}

let Get_Student_Material = async function (req, res) {
    var sql = 'select * from Study_Material where COurse_Code in (select Course_Code from Courses_Student_Relation where Roll_No = ?)';
    let id = await GET_ID();
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        console.log(results);
        res.render("study_material.ejs", { data: results })
    })
}
