
const express = require('express');
const ejs = require('ejs');
var session = require('cookie-session');
var schedule = require('node-schedule');
const bodyParser = require('body-parser');
const url = require('url');
var mysql = require('mysql');
const cookieParser = require('cookie-parser');
// const { promises, readdirSync, link } = require('fs');
// const { get } = require('http');
// const passport = require('passport');
// const Stratergy = require('passport-local').Stratergy;




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

// var db_config = {
//     multipleStatements: true,
//     host: 'us-cdbr-east-02.cleardb.com',
//     user: 'be25eca42b63ff',
//     password: '74074572',
//     database: 'heroku_ba6bdaf56728c3e',
//     // port: 3306
// };
var db_config = {
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'demo',
    port: 3306
};

// var connection = mysql.createConnection({
//     multipleStatements: true,
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'demo',
//     port: 3306
// });

function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

var port = process.env.PORT || 5000;




// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('connected as id ' + connection.threadId);
// });

app.set('view engine', 'ejs');

schedule.scheduleJob({hour : 0 , minute : 0},()=>{
    clear_Attendance();
});

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

function GET_User_ID() {
    return new Promise((resolve, reject) => {
        var sql1 = 'select session_id from current_session';
        // var id;
        connection.query(sql1, (err, results1) => {
            if (err) throw err;
            if (results1.length > 0) {
                // id = results1[0].User_ID;
                // console.log(id,'here');
                console.log(results1[0].session_id);
                resolve(results1[0].session_id);

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

app.get('/add_study_material',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('add_study_material.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/delete_study_material',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('delete_study_material.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/add_study_material',(req,res)=>{
    let code = req.body.code;
    let link=req.body.link;
    let sql = 'call Insert_Study_Material(?,?,@rif); select @rif;';
    connection.query(sql,[link,code],(err,results)=>{
        if(err) throw err;
        if(results[1][0]['@rif'] == 1){
            res.render('add_study_material.ejs',{error : "integrity constraint breached. Please check input"})
        }
        console.log(results);
        console.log('material added');
        res.redirect('/admin_home');
    })
})

app.get('/student_change_password',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('change_password.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/admin_change_password',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('change_password.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/prof_change_password',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('change_password.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/student_change_password',(req,res)=>{
    

    change_password_stud(req,res);
   
})

app.post('/admin_change_password',(req,res)=>{
    

    change_password_admin(req,res);
   
})

app.post('/prof_change_password',(req,res)=>{
    

    change_password_prof(req,res);
   
})

app.post('/delete_study_material',(req,res)=>{
    let code = req.body.code;
    let link=req.body.link;
    let sql = 'call Delete_Study_Material(?,?);';
    connection.query(sql,[code,link],(err,results)=>{
        if(err) throw err;
        console.log(results);
        console.log('material removed');
        res.redirect('/admin_home');
    })
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

app.get('/check_attendance',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('check_attendance.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/check_attendance',(req,res)=>{
    var course=req.body.course;
    var sql='call Check_Attendance(?)';
    connection.query(sql,[course],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render('check_attendance.ejs', {data : result[0]});
    })
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
        req.session=null
        // res.clearCookie('login');
        // res.clearCookie('user_id');
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
            res.render('delete_dept.ejs' , {error : 'rif detected'})
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
                res.render('add_student.ejs' , {error : 'Duplicate Entry detected'})
            }else if(results2[2][0]['@rif']!=null){
                res.render('add_student.ejs' , {error : 'Duplicate Entry detected'})
            }else{
            arr.forEach((item) => {
                if (item != undefined) {
                    var sql = 'call Add_Student_Course(?,?,100,0,@did,@rif,@inv);select @did;select @rif;select @inv';
                    
                    connection.query(sql, [item, Rno], (err, results) => {
                        if(err) throw err;
                        console.log(results)
                        if(results[1][0]['@did']!=null){
                            res.render('add_student.ejs' , {error : 'Duplicate Entry detected'})
                        }else if(results[2][0]['@rif']!=null){
                            res.render('add_student.ejs' , {error : 'referential integrity breached'})
                        }else if(results[3][0]['@inv']!=null){
                            res.render('add_student.ejs' , {error : 'Invalid attendance value.Please try again.'})
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
                res.render('add_admin.ejs' , {error : 'Username or Admin ID already taken'})
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

app.get('/today_attendance',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('attendance_today.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/today_attendance',(req,res)=>{
    let code = req.body.code;
    let sql =  'call Attendance_Today(?,?)';
    var arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let date = new Date();
    let day = arr[date.getDay()];
    console.log(day);
    connection.query(sql,[code,day],(err,results)=>{
        if(err) throw err;
        console.log(results);
        res.render('attendance_today.ejs',{data : results[0]});
    })
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
                res.render('add_prof.ejs' , {error : 'Duplicate Entry detected'})
            }else if(results2[2][0]['@rif']!=null){
                res.render('add_prof.ejs' , {error : 'referential integrity breached'})
            }else{
        arr.forEach((item) => {
            if (item != undefined) {
                var sql = 'call Add_Professor_Course(?,?,@did,@rif); select @did; select @rif;';
                connection.query(sql, [item, empid], (err, results) => {
                    if(err) throw err;
                        console.log(results)
                        if(results[1][0]['@did']!=null){
                            res.render('add_prof.ejs' , {error : 'Duplicate Entry detected'})
                        }else if(results[2][0]['@rif']!=null){
                            res.render('add_prof.ejs' , {error : 'referential integrity breached'})
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
    console.log("application started successfully",port)
})

app.get('/ongoing_classes', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        get_ongoing_courses(req, res);
    } else {
        res.redirect('/');
    }

})

app.get('/mark_attendance',(req,res)=>{
mark_attendance(req,res);
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
                // res.send('Duplicate Entry detected');
                res.render('add_dept.ejs' , {error : 'Duplicate Entry detected'})
                // res.end();
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
                res.render('add_course.ejs' , {error : 'Duplicate Entry detected'})
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
                res.render('teacher_login.ejs' , {error : "Wrong username or Password"});
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
                connection.query(query2, [req.session.user, result[1][0]['@ID']], (err, results1) => {
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
                res.render('teacher_login.ejs' , {error : "Wrong username or Password"});
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
                connection.query(query2, [req.session.user, result[1][0]['@ID']], (err, results1) => {
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
                res.render('admin_login.ejs' , {error : "Wrong username or Password"});
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
                connection.query(query2, [req.session.user, result[1][0]['@ID']], (err, results1) => {
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

async function clear_Attendance(){
    var sql = 'delete from Attendance_Marked';
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        console.log('Attendance cleared');
    })
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
            console.log(course);
            // console.log(h, "and", hr);
            if (h == parseInt(hr)) {
                course = item[day2];
                count++;
                console.log('here');
                // course = item.Monday;

                time = item.Time;
            }
        })
        if (count == 0 || course == null) {
            console.log(count);
            res.render("ongoing_classes.ejs", { error: "No ongoing classes at this moment" });
            res.end();
        } else if(count > 0 || course != null) {
            console.log(count);
            res.render("ongoing_classes.ejs", { course1: course, time1: time })
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

let mark_attendance = async function(req,res) {
    let id = await GET_ID();
    console.log(req.query);
    var course = req.query.course;
    var time = req.query['amp;time'];
    console.log(course,time,id);
    var sql='call Mark_Attendance(?,?,?,@did); select @did';
    connection.query(sql,[id,course,time],(err,result)=>{
        if(err) throw err
        if(result[1]['@did']==1){
            res.redirect('/student_home');

        }else{
            res.render('ongoing_classes.ejs', {error : "attendance marked successfully"});
            res.end();
        }
    })
}

let change_password_stud = async function(req,res) {
    let newpass = req.body.new_password;
    let oldpass = req.body.old_password;
    let connewpass = req.body.con_new_password;
    if(newpass != connewpass){
        res.render('change_password.ejs',{error : "password do not match"});
    }
    let id = await GET_User_ID();
    let sql = `select Password_ from Account where User_ID_= (?)`;
    connection.query(sql,[id],(err,result1)=>{
        if(err) throw err;
        console.log(result1);
        if(result1[0]['Password_'] != oldpass){
            res.render('change_password',{error : "Old Password is wrong"});
        }else{
            let sql2 = 'call Change_Password(?,?,?)';
            connection.query(sql2,[id,oldpass,newpass],(err2,result2)=>{
                if(err2) throw err2;
                console.log(result2,'password changed');
                res.redirect('/student_home')
            })
        }
    })
}

let change_password_prof = async function(req,res) {
    let newpass = req.body.new_password;
    let oldpass = req.body.old_password;
    let connewpass = req.body.con_new_password;
    if(newpass != connewpass){
        res.render('change_password.ejs',{error : "password do not match"});
    }
    let id = await GET_User_ID();
    let sql = `select Password_ from Account where User_ID_= (?)`;
    connection.query(sql,[id],(err,result1)=>{
        if(err) throw err;
        console.log(result1);
        if(result1[0]['Password_'] != oldpass){
            res.render('change_password',{error : "Old Password is wrong"});
        }else{
            let sql2 = 'call Change_Password(?,?,?)';
            connection.query(sql2,[id,oldpass,newpass],(err2,result2)=>{
                if(err2) throw err2;
                console.log(result2,'password changed');
                res.redirect('/teacher_home')
            })
        }
    })
}

let change_password_admin = async function(req,res) {
    let newpass = req.body.new_password;
    let oldpass = req.body.old_password;
    let connewpass = req.body.con_new_password;
    if(newpass != connewpass){
        res.render('change_password.ejs',{error : "password do not match"});
    }
    let id = await GET_User_ID();
    let sql = `select Password_ from Account where User_ID_= (?)`;
    connection.query(sql,[id],(err,result1)=>{
        if(err) throw err;
        console.log(result1);
        if(result1[0]['Password_'] != oldpass){
            res.render('change_password',{error : "Old Password is wrong"});
        }else{
            let sql2 = 'call Change_Password(?,?,?)';
            connection.query(sql2,[id,oldpass,newpass],(err2,result2)=>{
                if(err2) throw err2;
                console.log(result2,'password changed');
                res.redirect('/admin_home')
            })
        }
    })
}