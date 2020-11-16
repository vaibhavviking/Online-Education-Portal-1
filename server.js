
const express = require('express');
var multer = require("multer");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
const ejs = require('ejs');
var session = require('express-session');
var schedule = require('node-schedule');
const bodyParser = require('body-parser');
const url = require('url');
const md5 = require('md5');
const nodemailer = require('nodemailer');
var keys = require('./keys.js')
var mysql = require('mysql');
const cookieParser = require('cookie-parser');
const e = require('express');
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

var db_config = {
    multipleStatements: true,
    host: keys.db_host,
    user: keys.db_user,
    password: keys.db_password,
    database: keys.db_name
    // port: 3306
};
// var db_config = {
//     multipleStatements: true,
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'demo',
//     port: 3306
// };

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

    connection.connect(function (err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
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

// schedule.scheduleJob({ hour: 0, minute: 0 }, () => {
//     clear_Attendance();
// });

schedule.scheduleJob({ minute: 0 }, () => {
    increment_days();
})

schedule.scheduleJob('*/15* * * *', () => {
    clear_token();
})

app.use(express.static('views'));
app.set('views', __dirname + '/views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

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

// let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// let timeslots=['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00',];
// let sw=0,code;
// days.forEach((day)=>{
    
    
//     timeslots.forEach((slot)=>{
        
//         if(sw%2 == 0){
//             console.log(sw,'up');
//             sw++;
//             let sql = 'call Assign_Time_Slot("CS 207",?,?,@rif);'
//         connection.query(sql,[day,slot],(err,results)=>{
//             if(err) throw err;
//             console.log('CS 207',day,slot,'slot added');
//         })
//         }else{
//             console.log(sw,'down');
//             sw++;
//             let sql = 'call Assign_Time_Slot("CS 201",?,?,@rif);'
//         connection.query(sql,[day,slot],(err,results)=>{
//             if(err) throw err;
            
//             console.log('CS 201',day,slot,'slot added');
//         })
//         }
        
//     })
// })

app.get('/student_login', (req, res) => {
    var query = 'DELETE FROM current_session';
    connection.query(query, (err, results) => {
        if (err) throw err;
        else console.log('session refreshed');
    })
    res.render('student_login.ejs');
})

app.get('/add_study_material', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('add_study_material.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/delete_study_material', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('delete_study_material.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/add_study_material', (req, res) => {
    let code = req.body.code;
    let link = req.body.link;
    let sql = 'call Insert_Study_Material(?,?,@rif); select @rif;';
    connection.query(sql, [link, code], (err, results) => {
        if (err) throw err;
        if (results[1][0]['@rif'] == 1) {
            res.render('add_study_material.ejs', { error: "integrity constraint breached. Please check input" })
        }
        console.log(results);
        console.log('material added');
        res.redirect('/admin_home');
    })
})

app.get('/students_list', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        let sql = 'select * from Student';
        connection.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.render('student_list.ejs', { data: results });
        })
    } else {
        res.redirect('/');
    }
})

app.get('/prof_list', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        let sql = 'select * from Professor';
        connection.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.render('Professor_list.ejs', { data: results });
        })
    } else {
        res.redirect('/');
    }
})

app.get('/dept_list', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        let sql = 'select * from Department';
        connection.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.render('Dept_list.ejs', { data: results });
        })
    } else {
        res.redirect('/');
    }
})

app.get('/student_change_password', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('change_password.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/admin_change_password', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('change_password.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/prof_change_password', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('change_password.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/student_change_password', (req, res) => {


    change_password_stud(req, res);

})

app.post('/admin_change_password', (req, res) => {


    change_password_admin(req, res);

})

app.post('/prof_change_password', (req, res) => {


    change_password_prof(req, res);

})

app.post('/delete_study_material', (req, res) => {
    let code = req.body.code;
    let link = req.body.link;
    let sql = 'call Delete_Study_Material(?,?);';
    connection.query(sql, [code, link], (err, results) => {
        if (err) throw err;
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

        let rno = req.query.rollno;
        load_student_home(req, res, rno);
        // let sql = `select * from Student where Roll_No = ${rno}`;
        // connection.query(sql, (err, result) => {
        //     if (err) throw err;
        //     console.log(result);
        //     let idate = result[0].DOB;
        //     console.log(idate);
        //     let month = idate.getMonth() + 1;
        //     let day = idate.getDate();
        //     let year = idate.getFullYear();
        //     // console.log(month>10,day>10);
        //     month < 10 ? month = '0' + month : month = month;
        //     day < 10 ? day = '0' + day : day = day;
        //     let fdate = day + '-' + month + '-' + year;
        //     console.log(fdate);
        //     let rdate = year + '-' + month + '-' + day;
        //     res.render('student_home.ejs', { data: result[0], fdate: fdate });
        // })
    } else {
        res.redirect('/');
    }
});

app.get('/teacher_login', (req, res) => {
    res.render('teacher_login.ejs');
})

app.get('/check_attendance', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('check_attendance.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/check_attendance', (req, res) => {
    var course = req.body.course;
    var sql = 'call Check_Attendance(?)';
    connection.query(sql, [course], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('check_attendance.ejs', { data: result[0] });
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
        req.session = null;
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
        if (results[1][0]['@rif'] != null) {
            console.log(results[1][0]['@rif']);
            res.send('rif detected');
            // res.end();
        } else {
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
        if (results[1][0]['@rif'] != null) {
            // console.log(results[1][0]['@rif']);
            res.send('rif detected');
            res.render('delete_dept.ejs', { error: 'rif detected' })
            console.log('Department not Deleted');
            // res.end();
        } else {
            console.log('Department Deleted');
            res.redirect('/admin_home');
        }
    })
})

app.get('/program_list',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        let sql = 'call Show_Programs()';
        connection.query(sql,(err,results)=>{
            if(err) throw err;
            res.render('program_list.ejs',{data : results[0]});
        })
    } else {
        res.redirect('/');
    }
})

app.get('/update_student_1', (req, res) => {
    let error;
    if (req.session.loggedin && req.session.user) {
        // if(req.query.error != undefined){
        //     error = req.query.error;
        //     res.render('update_student_1.ejs',{error : error});
        // }else{
        res.render('update_student_1.ejs');

    } else {
        res.redirect('/');
    }
})

app.post('/update_student_1', (req, res) => {
    let rollno = req.body.Rollno;
    if (rollno != undefined) {
        let tdate = new Date();
        let sql = `select * from Student where Roll_No=${rollno}; call Get_Student_Courses(${rollno}); select * from Sem_Dates;`;
        connection.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            console.log(results[1].length);
            if (results[0].length > 0) {
                let sdate = results[3][0].Starting_Date;
                let edate = results[3][0].Ending_Date;
                console.log(results[0]);
                let idate = results[0][0].DOB;
                console.log(idate);
                let month = idate.getMonth() + 1;
                let day = idate.getDate();
                let year = idate.getFullYear();
                // console.log(month>10,day>10);
                month < 10 ? month = '0' + month : month = month;
                day < 10 ? day = '0' + day : day = day;
                let fdate = day + '-' + month + '-' + year;
                let rdate = year + '-' + month + '-' + day;
                // console.log(fdate,rdate);
                if (1) {
                    console.log('after sem');
                    res.render('update_student_after_sem.ejs', { data1: results[0][0], data2: results[1], rollno: rollno, clen: results[1].length, fdate: fdate, rdate: rdate });
                } else {
                    res.render('update_student_in_sem.ejs', { data1: results[0][0], data2: results[1], rollno: rollno, clen: results[1].length, fdate: fdate, rdate: rdate })
                }
            } else {
                // window.alert('Invalid ID');
                res.render('update_student_1.ejs', { error: "Invalid ID.Please try again" })

            }
        })
    } else {
        console.log(req.body);
        let rollno = req.body.rollno;
        let name = req.body.username;
        let program = req.body.program;
        let gender = req.body.gender;
        let email = req.body.email;
        let dob = req.body.dob;
        let year = req.body.year;
        let depid = req.body.depid;
        var course = req.body['course[]'];
        var old_course = req.body['old_courses[]'];
        let old_arr=[];
        let arr = [];
        if (typeof course == 'object') {
            arr = course;
        } else {
            arr[0] = course;
        }
        if (typeof old_course == 'object') {
            old_arr = old_course;
        } else {
            old_arr[0] = old_course;
        }
        let cc=0;
        arr.forEach((temp)=>{
            if(temp!=''){
                cc++;
            }
        })
        console.log(typeof course);
        let sql = `call Remove_All_Student_Courses(${rollno})`;

        connection.query('select * from Sem_Dates', (err, results) => {
            if (err) throw err;
            let sdate = results[0].Starting_Date;
            let edate = results[0].Ending_Date;
            let tdate = new Date();
            // tdate < sdate || tdate > edate
            console.log(cc)
            if (1 && course != '' && typeof course != 'undefined' && cc!=0) {
                connection.query(sql, (err, results) => {
                    if (err) throw err;
                    console.log('Courses Removed');
                });
                let sql2 = 'call Update_Student_After_Sem(?,?,?,?,?,?,?,?,?,@did,@rif,@inv,@rif1); select @did,@rif,@inv,@rif1';
                let e=0;
                let c=0;
                arr.forEach((item) => {
                    if (item !== undefined) {

                        connection.query(sql2, [rollno, name, dob, gender, program, year, depid, email, item], (err, results) => {
                            c++;
                            if (err) throw err;
                            console.log(results);
                            if (results[1][0]['@did'] != null) {
                                e++;
                                if(e!=0 && c==arr.length){

                                    let sql3 ='call Add_Student_Course(?,?,?,?,@did,@rif,@inv)';
                                    old_arr.forEach((inf)=>{
                                        connection.query(sql3,[inf,rollno,0,0],(err3,results3)=>{
                                            if(err3) throw err3;
                                            console.log(inf,': course restored');
                                        })
                                    })
                                    res.render('update_student_1.ejs', { error: "duplicate entry detected" })
                                }
                            } else if (results[1][0]['@rif'] != null) {
                                e++;
                                if(e!=0 && c==arr.length){
                                    res.render('update_student_1.ejs', { error: "Referential integrity breached. Please Check Input." })
                                }
                            } else if (results[1][0]['@inv'] != 0) {
                                e++;
                                if(e!=0 && c==arr.length){
                                    let sql3 ='call Add_Student_Course(?,?,?,?,@did,@rif,@inv)';
                                    old_arr.forEach((inf)=>{
                                        connection.query(sql3,[inf,rollno,0,0],(err3,results3)=>{
                                            if(err3) throw err3;
                                            console.log(inf,': course restored');
                                        })
                                    })
                                    res.render('update_student_1.ejs', { error: "Invalid entries detected." })
                                }
                            } else if(results[1][0]['@rif1'] != null){
                                e++;
                                if(e!=0 && c==arr.length){
                                    let sql3 ='call Add_Student_Course(?,?,?,?,@did,@rif,@inv)';
                                    old_arr.forEach((inf)=>{
                                        connection.query(sql3,[inf,rollno,0,0],(err3,results3)=>{
                                            if(err3) throw err3;
                                            console.log(inf,': course restored');
                                        })
                                    })
                                    res.render('update_student_1.ejs', { error: "Referential integrity breached.Please Check Input" })
                                }
                            }else {
                                console.log(item,': course updated after sems');
                                if(c==arr.length){
                                    res.redirect('/admin_home');
                                }
                            }
                        })
                    }
                })
                // res.redirect('/admin_home');
            } else {
                let sql = `call Remove_All_Student_Courses(${rollno})`;
                connection.query(sql, (err, results) => {
                    if (err) throw err;
                    console.log('Courses Removed');
                });
                let sql2 = 'call Update_Student_In_Sem(?,?,?,?,?,?,?,?,@did,@rif,@inv,@rif1); select @did,@rif,@inv,@rif1;';
                connection.query(sql2, [rollno, name, dob, gender, program, year, depid, email], (err, results) => {
                    if (err) throw err;
                    console.log(results);
                    if (results[1][0]['@did'] != null) {
                        res.render('update_student_1.ejs', { error: "duplicate entry detected" })
                    } else if (results[1][0]['@rif'] != null) {
                        res.render('update_student_1.ejs', { error: "Referential integrity breached. Please Check Input." })
                    } else if (results[1][0]['@inv'] != 0) {
                        res.render('update_student_1.ejs', { error: "Invalid entries detected." })
                    } else {
                        console.log('data updated in sems');
                        res.redirect('/admin_home');
                    }
                })
            }
        })


    }
})

app.get('/update_prof_1', (req, res) => {
    let error;
    if (req.session.loggedin && req.session.user) {
        // if(req.query.error != undefined){
        //     error = req.query.error;
        // }
        res.render('update_prof_1.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/update_prof_1', (req, res) => {
    let empid = req.body.Empid;
    if (empid != undefined) {
        let sql = `select * from Professor where Employee_ID=${empid}; call Get_Professor_Courses(${empid});`;
        connection.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            if (results[0].length > 0 && results[0].length > 0) {
                console.log(results[1]);
                let idate = results[0][0].DOB;
                console.log(idate);
                let month = idate.getMonth() + 1;
                let day = idate.getDate();
                let year = idate.getFullYear();
                // console.log(month>10,day>10);
                month < 10 ? month = '0' + month : month = month;
                day < 10 ? day = '0' + day : day = day;
                let fdate = day + '-' + month + '-' + year;
                let rdate = year + '-' + month + '-' + day;
                res.render('update_prof.ejs', { data1: results[0][0], data2: results[1], empid: empid, clen: results[1].length, fdate: fdate, rdate: rdate });
            } else {
                // window.alert('Invalid ID');
                res.render('update_prof_1.ejs', { error: "Invalid ID. Please try again" });
            }
        })
    } else {
        console.log(req.body);
        let empid = req.body.empid;
        let name = req.body.username;
        let post = req.body.post;
        let dob = req.body.dob;
        let email=req.body.email;
        let gender = req.body.gender;
        let depid = req.body.depid;
        var course = req.body['course[]'];
        var old_course = req.body['old_courses[]'];
        let old_arr=[];
        let arr = [];
        if (typeof course == 'object') {
            arr = course;
        } else {
            arr[0] = course;
        }
        if (typeof old_course == 'object') {
            old_arr = old_course;
        } else {
            old_arr[0] = old_course;
        }
        let sql = `call Remove_All_Professor_Courses(${empid})`;
            connection.query(sql, (err, results) => {
                if (err) throw err;
                console.log('Courses Removed');
            })
            let cc=0;
            arr.forEach((item)=>{
                if(item!=''){
                    cc++;
                }
            })
        if(typeof course != 'undefined' && cc!=0 && course!='' ){
            
            let e=0;
            let c=0;
            let sql2 = 'call Update_Professor(?,?,?,?,?,?,?,?,@did,@rif,@inv,@rif1); select @did,@rif,@inv,@rif1';
            arr.forEach((item) => {
                if (item !== undefined) {
    
                    connection.query(sql2, [empid, name, dob, gender, post, depid, email,item], (err, results) => {
                        c++;
                        if (err) throw err;
                        console.log(e,c,'compare');
                        if (results[1][0]['@did'] != null) {
                            e++;
                            if(e!=0 && c==arr.length){
                                let sql3 ='call Add_Professor_Course(?,?,@did,@rif)';
                                        old_arr.forEach((inf)=>{
                                            connection.query(sql3,[inf,empid,0,0],(err3,results3)=>{
                                                if(err3) throw err3;
                                                console.log(inf,': course restored');
                                            })
                                        })
                                res.render('update_prof_1.ejs', { error: "duplicate entry detected" })
                            }
                        } else if (results[1][0]['@rif'] != null) {
                            e++;
                            if(e!=0 && c==arr.length){
                                res.render('update_prof_1.ejs', { error: "Referential integrity breached. Please Check Input." })
                            }
                        } else if (results[1][0]['@inv'] != 0) {
                            e++;
                            if(e!=0 && c==arr.length){
                                let sql3 ='call Add_Professor_Course(?,?,@did,@rif)';
                                        old_arr.forEach((inf)=>{
                                            connection.query(sql3,[inf,empid,0,0],(err3,results3)=>{
                                                if(err3) throw err3;
                                                console.log(inf,': course restored');
                                            })
                                        })
                                res.render('update_prof_1.ejs', { error: "Invalid entries detected." })
                            }
                        } else if(results[1][0]['@rif1'] != null){
                            e++;
                            if(e!=0 && c==arr.length){
                                let sql3 ='call Add_Professor_Course(?,?,@did,@rif)';
                                        old_arr.forEach((inf)=>{
                                            connection.query(sql3,[inf,empid,0,0],(err3,results3)=>{
                                                if(err3) throw err3;
                                                console.log(inf,': course restored');
                                            })
                                        })
                                res.render('update_prof_1.ejs', { error: "Referential integrity breached.Please Check Input" })
                            }
                        }else {
                            console.log(item,': course updated');
                            if(e==0 && c==arr.length){
                                res.redirect('/admin_home');
                            }
                        }
                        // console.log('course updated');
                    })
                }
            })
        }else{
            
            let sql2 = 'call Update_Professor_Bio(?,?,?,?,?,?,?,@did,@rif,@inv); select @did,@rif,@inv';
                    connection.query(sql2, [empid, name, dob, gender, post, depid, email], (err, results) => {
                        
                        if (err) throw err;
                        // console.log(e,c,'compare');
                        console.log(results);
                        if (results[1][0]['@did'] != null) {
                            
                            res.render('update_prof_1.ejs', { error: "duplicate entry detected" })
                        } else if (results[1][0]['@rif'] != null) {
                           
                            res.render('update_prof_1.ejs', { error: "Referential integrity breached. Please Check Input." })
                        } else if (results[1][0]['@inv'] != 0) {
                            
                            res.render('update_prof_1.ejs', { error: "Invalid entries detected." })
                        }else {
                
                            res.redirect('/admin_home');
                        }
                        // console.log('course updated');
                    })
                
            
        }
       
        // res.redirect('/admin_home');
    }
})

app.get('/update_dept_1', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('update_dept_1.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/update_dept_1', (req, res) => {
    let depid = req.body.Depid;
    if (depid != undefined) {
        let sql = `select D_Name from Department where Dept_ID=${depid};`;
        connection.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            if (results.length > 0) {
                res.render('update_dept.ejs', { data1: results[0], depid: depid });
            } else {
                res.render('update_dept_1.ejs', { error: "Invalid Department name. Please try again" });
            }
        })
    } else {
        console.log(req.body);
        let depid = req.body.depid;
        let name = req.body.name;
        let sql2 = 'call Update_Department(?,?)';
        connection.query(sql2, [depid, name], (err, results) => {
            if (err) throw err;
            console.log('Department updated');
        })
        res.redirect('/admin_home');
    }

})

app.get('/update_course_1', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('update_course_1.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/update_course_1', (req, res) => {
    let cid = req.body.Cid;
    // res.redirect(`/update_course/?cid=${cid}`);
    if (cid != undefined) {
        let sql = `select Course_Name,Course_Code, Class_Link, Credits from Courses where Course_Code=?;`;
        connection.query(sql, [cid], (err, results) => {
            if (err) throw err;
            console.log(results);
            if (results.length > 0) {
                res.render('update_course.ejs', { data1: results[0], cid: cid });
            } else {
                res.render('update_course_1.ejs', { error: "Invalid Course. Please try again" });
            }
        })
    } else {
        console.log(req.body);
        let cid = req.body.cid;
        let name = req.body.name;
        let link = req.body.link;
        let credits = req.body.credits;
        let sql2 = 'call Update_Courses(?,?,?,?)';
        console.log(cid, name, link, credits);
        connection.query(sql2, [cid, name, link, credits], (err, results) => {
            if (err) throw err;
            console.log('Course Updated');
        })
        res.redirect('/admin_home');
    }

})

app.post('/delete_admin', (req, res) => {
    var adminid = req.body.adminid;
    delete_admin(req,res,adminid);
    // var sql = 'call Delete_Admin(?)';
    // connection.query(sql, [adminid], (err, results) => {
    //     if (err) throw err;
    //     console.log('Admin Removed');
    //     res.redirect('/admin_home');
    // })
})

let delete_admin = async function(req,res,adminid){
    var sql = 'call Delete_Admin(?)';
    let id = await GET_User_ID();
    console.log(adminid,id);
    if(id!=adminid){
        connection.query(sql, [adminid], (err, results) => {
            if (err) throw err;
            console.log('Admin Removed');
            res.redirect('/admin_home');
        })
    }else{
        res.redirect('/delete_admin/?error="You cannot remove yourself"');
    }
}

app.get('/add_student', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        // connection.query('select * from Sem_Dates', (err, results) => {
        //     if (err) throw err;
        //     let sdate = results[0].Starting_Date;
        //     let edate = results[0].Ending_Date;
        //     let tdate = new Date();
        //     if (tdate < sdate || tdate > edate) {
        //         res.render('add_student.ejs');
        //     } else {
        //         res.render('add_student_error.ejs', { error: "Students cannot be added during a semester" });
        //     }
        // })

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
        let error=req.query.error;
        res.render('delete_admin.ejs',{ error : error});
    } else {
        res.redirect('/admin_login');
    }
})

app.post('/add_student', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        console.log(req.body);
        var name = req.body.Name;
        var Rno = req.body.Rno;
        var user_id = req.body.uid;
        var email = req.body.email;
        var year = req.body.year;
        var Dep = req.body.Department;
        var prog = req.body.Program;
        var gender = req.body.gender;
        var dob = req.body.dob;
        console.log(Dep);
        var course = req.body['course[]'];
        let arr = [];
        if (typeof course == 'object') {
            arr = course;
        } else {
            arr[0] = course;
        }
        var pass = req.body.password;
        console.log(arr);
        pass = md5(md5(md5(pass)));
        var sql = 'call Insert_Student(?,?,?,?,?,?,?,?,?,?,@did,@rif,@inv); select @did; select @rif; select @inv';
        connection.query(sql, [Rno, name, dob, gender, prog, year, Dep, email, user_id, pass], (err, results2) => {
            if (err) throw err;
            console.log(results2);
            if (results2[1][0]['@did'] != null) {
                res.render('add_student.ejs', { error: 'Duplicate Entry detected' })
            } else if (results2[2][0]['@rif'] != null) {
                res.render('add_student.ejs', { error: 'Refrential Integrity failure Detected' })
            } else if (results2[3][0]['@inv'] != 0) {
                let error;
                if (results2[3][0]['@inv'] == 1) {
                    error = 'Entered name is not valid';
                } else if (results2[3][0]['@inv'] == 2) {
                    error = 'Entered gender is not valid';
                } else if (results2[3][0]['@inv'] == 3) {
                    error = 'Entered Date of Birth is not valid';
                }
                res.render('add_student.ejs', { error: error });
            } else {
                let e=0;
                let c=0;
                arr.forEach((item) => {
                    
                    if (item != undefined) {
                        var sql = 'call Add_Student_Course(?,?,0,0,@did,@rif,@inv);select @did;select @rif;select @inv';

                        connection.query(sql, [item, Rno], (err, results) => {
                            c++;
                            if (err) throw err;
                            console.log(c,arr.length, 'compare');
                            console.log(results)
                            if (results[1][0]['@did'] != null) {
                                e++;
                                // res.render('add_student.ejs', { error: 'Duplicate Entry' })
                                if(e==0 && c==arr.length){
                                    res.redirect('/admin_home/?error="Professor was added"')
                                }else if(e!=0 && c==arr.length){
                                    res.redirect('/admin_home/?error="Professor was added but some courses were not added"');
                                } 
                            } else if (results[2][0]['@rif'] != null) {
                                e++;
                                // res.render('add_student.ejs', { error: 'referential integrity breached' })
                                if(e==0 && c==arr.length){
                                    res.redirect('/admin_home/?error="Student was added"')
                                }else if(e!=0 && c==arr.length){
                                    res.redirect('/admin_home/?error="Student was added but some courses were not added"');
                                } 
                            } else if (results[3][0]['@inv'] != 0) {
                                e++;
                                // res.render('add_student.ejs', { error: 'Invalid attendance value.Please try again.' })
                                if(e==0 && c==arr.length){
                                    res.redirect('/admin_home/?error="Student was added"')
                                }else if(e!=0 && c==arr.length){
                                    res.redirect('/admin_home/?error="Student was added but some courses were not added"');
                                } 
                            } else {
                                console.log('Course addded : ', item)
                                if(e==0 && c==arr.length){
                                    res.redirect('/admin_home/?error="Student was added"')
                                }else if(e!=0 && c==arr.length){
                                    res.redirect('/admin_home/?error="Student was added but some courses were not added"');
                                } 
                            }
                        })
                    }
                })
                console.log('student added');
                // res.redirect('/admin_home');
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
    var email = req.body.email;
    password = md5(md5(md5(password)));
    var sql = 'call Insert_Admin(?,?,?,?,@duplicate_key)';
    connection.query(sql, [admin_id, username, password, email], (err, results) => {
        if (err) throw err;
        var sql1 = 'select @duplicate_key';
        connection.query(sql1, (err, results1) => {
            if (results1[0]['@duplicate_key'] > 0) {
                res.render('add_admin.ejs', { error: 'Username or Admin ID already taken' })
            }
        })
        console.log('admin added');
        res.redirect('/admin_home');
    })
})

app.get('/admin_change_email', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('admin_change_email.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/admin_change_email', (req, res) => {
    let email = req.body.Email;
    admin_change_email(req, res, email);
})

let admin_change_email = async function (req, res, email) {
    let id = await GET_ID();
    console.log(email);
    let sql = 'Update Administration set Email = ? where Admin_ID=?';
    connection.query(sql, [email, id], (err, results) => {
        if (err) throw err;
        console.log('Details Updated');
        res.redirect('/admin_home');
    })
}

app.get('/admin_time_table',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('admin_time_table.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/admin_time_table',(req,res)=>{
    let code = req.body.code;
    let sql= 'call Admin_Time_Table(?)';
    connection.query(sql,[code],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render('admin_time_table.ejs', { data : result[0]});
    })
})

app.get('/add_dept', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('add_dept.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/posts_list',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        let sql = 'select * from Post_Wise_Employees';
        connection.query(sql,(err,results)=>{
            if(err) throw err;
            console.log(results);
            res.render('posts_list.ejs', {data : results});
        })
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

app.get('/prof_study_material', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        professor_study_material(req, res);
    } else {
        res.redirect('/');
    }
})

app.post('/prof_study_material', (req, res) => {
    Prof_Insert_Study_Material(req, res);
})

app.post('/add_dept', (req, res) => {
    var dept_id = req.body.dept_id;
    var dept_name = req.body.dept_name;
    add_dept(req, res, dept_id, dept_name);
})

app.get('/datewise_attendance', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('datewise_attendance.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/datewise_attendance', (req, res) => {
    let code = req.body.code;
    let date = (req.body.date).toString();
    
    let sql = `call Attendance_In_Professor(?,?)`;
    const arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date();
    console.log(date,'date');
    connection.query(sql,[code,date], (err, results) => {
        if (err) throw err;
        console.log(results);
        res.render('datewise_attendance.ejs', { data: results[0] });
    })
})

app.get('/assign_time_slot', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('assign_time_slot.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/assign_time_slot', (req, res) => {
    let code = req.body.code;
    let time = req.body.time;
    let oldcourse;
    let day = req.body.day;
    let sql = 'select Course_Code from Courses_Time_Slots_Relation where Day=? and Time=?';
    connection.query(sql, [day, time], (err, results) => {
        if (err) throw err;
        console.log(results);
        if (results.length > 0) {
            oldcourse = results[0].Course_Code;
        } else {
            oldcourse = undefined;
        }


        if (oldcourse != undefined) {
            let sql2 = 'call Unassign_Time_Slot(?,?,?); call Assign_Time_Slot(?,?,?,@rif); select @rif';
            connection.query(sql2, [oldcourse, day, time, code, day, time], (err2, results2) => {
                if (err2) throw err2;
                console.log(results2);
                if (results2[2][0]['@rif'] != null) {
                    res.render('assign_time_slot.ejs', { error: "Referential Integrity Breached. Please Check Input" });
                } else {
                    console.log('Course Reassigned');
                    res.redirect('/admin_home');
                }
            })
        } else {
            let sql2 = 'call Assign_Time_Slot(?,?,?,@rif); select @rif;';
            connection.query(sql2, [code, day, time], (err3, results3) => {
                if (err3) throw err3;
                console.log(results3);
                if (results3[1][0]['@rif'] != null) {
                    res.render('/assign_time_slot.ejs', { error: "Referential Integrity Breached. Please Check Input" })
                } else {
                    console.log('Course assigned');
                    res.redirect('/admin_home');
                }
            })
        }
    })
})

app.get('/unassign_time_slot', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('unassign_time_slot.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/unassign_time_slot', (req, res) => {
    let code = req.body.code;
    let day = req.body.day;
    let time = req.body.time;

    let sql = 'call Unassign_time_slot(?,?,?)';
    connection.query(sql, [code, day, time], (err, results) => {
        if (err) throw err;
        console.log('Course Unassigned');
        res.redirect('/admin_home');
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
    console.log(req.body);
    console.log('here');
    var name = req.body.Name;
    var empid = req.body.empid;
    var user_id = req.body.uid;
    var Dep = req.body.Department;
    var post = req.body.post;
    var dob = req.body.dob;
    var email = req.body.email;
    var gender = req.body.gender;
    var course = req.body['course[]'];
    let arr = [];
    if (typeof course == 'object') {
        arr = course;
    } else {
        arr[0] = course;
    }
    var pass = req.body.password;
    pass = md5(md5(md5(pass)));
    var sql = 'call Insert_Professor(?,?,?,?,?,?,?,?,?,@did,@rif,@inv); select @did; select @rif; select @inv';
    console.log(name,empid,user_id,Dep,post,dob,email,gender,course,arr);
    connection.query(sql, [empid, name, dob, gender, post, Dep, email, user_id, pass], (err, results2) => {
        if (err) throw err;

        console.log(results2);
        if (results2[1][0]['@did'] != null) {
            res.render('add_prof.ejs', { error: 'Duplicate Entry detected' })
        } else if (results2[2][0]['@rif'] != null) {
            res.render('add_prof.ejs', { error: 'referential integrity breached' })
        } else if (results2[3][0]['@inv'] != 0) {
            let error;
            if (results2[3][0]['@inv'] == 1) {
                error = 'Entered name is not valid';
            } else if (results2[3][0]['@inv'] == 2) {
                error = 'Entered gender is not valid';
            } else if (results2[3][0]['@inv'] == 3) {
                error = 'Entered Date of Birth is not valid';
            }
            res.render('add_prof.ejs', { error: error });
        } else {
            let e=0;
            let c=0;
            arr.forEach((item) => {
                if (item != undefined) {
                    var sql = 'call Add_Professor_Course(?,?,@did,@rif); select @did; select @rif;';
                    connection.query(sql, [item, empid], (err, results) => {
                        c++;
                        if (err) throw err;
                        console.log(results)
                        if (results[1][0]['@did'] != null) {
                            e++;
                            if(e==0 && c==arr.length){
                                res.redirect('/admin_home/?error="Professor was added"')
                            }else if(e!=0 && c==arr.length){
                                res.redirect('/admin_home/?error="Professor was added but some courses were not added"');
                            } 
                            // res.render('add_prof.ejs', { error: 'Duplicate Entry detected' })
                            // res.end();
                        } else if (results[2][0]['@rif'] != null) {
                            e++;
                            if(e==0 && c==arr.length){
                                res.redirect('/admin_home/?error="Professor was added"')
                            }else if(e!=0 && c==arr.length){
                                res.redirect('/admin_home/?error="Professor was added but some courses were not added"');
                            } 
                            // res.render('add_prof.ejs', { error: 'referential integrity breached. please check input.' })
                            // res.end();
                        } else {
                            console.log('Course addded : ', item)
                            if(e==0 && c==arr.length){
                                res.redirect('/admin_home/?error="Professor was added"')
                            }else if(e!=0 && c==arr.length){
                                res.redirect('/admin_home/?error="Professor was added but some courses were not added"');
                            }   
                        }


                    })
                }
            })
            console.log('Professor added');
            // res.redirect('/admin_home');
        }
    })
})

app.get('/student_courses', (req, res) => {
    get_student_courses(req, res,)
})

app.get('/teacher_home', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        load_teacher_home(req, res);
    } else {
        res.redirect('/');
    }

})

app.get('/admin_home', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        let error = req.query.error;
        res.render('Admin_home.ejs', {error : error});
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

app.get('/prof_study_selected', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        let data = req.query.data;
        console.log(data);
        data.forEach((item) => {
            let sql = 'call Delete_Study_Material(?)';
            connection.query(sql, [item], (err, results) => {
                if (err) throw err;
                console.log('Material Removed');
            })
        })
        res.redirect('/prof_study_material');
    } else {
        res.redirect('/');
    }
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
    console.log("application started successfully", port)
})

app.get('/ongoing_classes', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        get_ongoing_courses(req, res);
    } else {
        res.redirect('/');
    }

})

app.get('/mark_attendance', (req, res) => {
    mark_attendance(req, res);
})

app.get('/add_student_excel', (req, res) => {
    res.render('add_student_excel');
    // if (req.session.loggedin && req.session.user) {
    // } else {
    //     res.redirect('/');
    // }
})

app.get('/add_teacher_excel', (req, res) => {
    res.render('add_teacher_excel');
    // if (req.session.loggedin && req.session.user) {
    // } else {
    //     res.redirect('/');
    // }
})

app.get('/add_post', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('add_post.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/delete_post', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('delete_post.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/add_program', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('add_program.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/delete_program', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('delete_program.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/add_post', (req, res) => {
    let post = req.body.post;
    let sql = 'call Insert_Post(?,@did); select @did';
    connection.query(sql, [post], (err, result) => {
        if (err) throw err;
        if (result[1][0]['@did'] == 1) {
            res.render('add_post.ejs', { error: "Post already exists" });
        } else {
            console.log(post, " : post added");
            res.redirect('/admin_home');
        }
    })
})

app.post('/delete_post', (req, res) => {
    let post = req.body.post;
    let sql = 'call Delete_Post(?,@rif); select @rif';
    connection.query(sql, [post], (err, result) => {
        if (err) throw err;
        if (result[1][0]['@rif'] == 1) {
            res.render('delete_post.ejs', { error: "Entered Post cannot be removed." });
        } else {
            console.log(post, " : post removed");
            res.redirect('/admin_home');
        }
    })
})

app.post('/add_program', (req, res) => {
    let pcode = req.body.code;
    let pname=req.body.name;
    let sql = 'call Insert_Program(?,?,@did); select @did';
    connection.query(sql, [pcode,pname], (err, result) => {
        if (err) throw err;
        if (result[1][0]['@did'] == 1) {
            res.render('add_program.ejs', { error: "Program already exists" });
        } else {
            console.log(pcode, " : program added");
            res.redirect('/admin_home');
        }
    })
})

app.get('/set_sem_dates', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        res.render('set_sem_dates.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/set_sem_dates', (req, res) => {
    let date1 = req.body.dates1;
    let date2 = req.body.dates2;
    let sql = 'call Set_Sem_Dates(?,?,@inv); select @inv';
    connection.query(sql, [date1, date2], (err, result) => {
        if (err) throw err;
        if (result[1][0]['@inv'] == 1) {
            res.render('set_sem_dates.ejs', { error: "Invalid Dates" });
        } else {
            res.redirect('/admin_home');
        }
    })
})

app.post('/delete_program', (req, res) => {
    let program = req.body.program;
    let sql = 'call Delete_Program(?,@rif); select @rif';
    connection.query(sql, [program], (err, result) => {
        if (err) throw err;
        if (result[1][0]['@rif'] == 1) {
            res.render('delete_program.ejs', { error: "Entered Program doesn't exists" });
        } else {
            console.log(program, " : program removed");
            res.redirect('/admin_home');
        }
    })
})

app.get('/forgot_password', (req, res) => {
    res.render('forgot_password.ejs');
})

app.post('/forgot_password', (req, res) => {
    let id = req.body.id;
    let sql = 'call Retrieve_Email(?,@email);select @email';
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        console.log(results);
        if (results.length > 0) {
            let email = results[1][0]['@email'];
            forgot_password(req, res, email, id);
        } else {
            res.render('forgot_password.ejs', { error: "Entered ID is invalid" });
        }
    })
})

app.get('/reset_password', (req, res) => {
    let id = req.query.id;
    let token = req.query.token;
    let error= req.query.error;
    res.render('reset_password.ejs', { token: token, id: id , error : error});
})

app.post('/reset_password', (req, res) => {
    let token = req.body.token;
    let id = req.body.id;
    let newpass = req.body.new_password;
    let connewpass = req.body.con_new_password;
    console.log('reset kar rhe hai', newpass, connewpass, token, id);
    if (newpass != connewpass) {
        let error = 'password do not match';
        res.redirect('/reset_password/?token='+token+'&id='+id+'&error='+error);
    } else {
        let sql1 = 'select * from Reset_Token where Token = ?';
        connection.query(sql1, [token], (err, result) => {
            if (err) throw err
            console.log(result);
            if (result.length > 0) {
                newpass = md5(md5(md5(newpass)));
                let sql = 'update Account set Password_=? where Account.User_ID_=?';
                let sql2 = 'delete from Reset_Token where Token = ?';
                connection.query(sql, [newpass, id], (err2, results) => {
                    if (err2) throw err2;
                    console.log(results);
                    
                })
                connection.query(sql2,[token],(err,results2)=>{
                    if(err) throw err;
                    console.log('token cleared');
                    res.redirect('/reset_password/?error="Your password has been reset. You can close this window now."');
                })
                
                
            } else {
                let error = 'Token has expired. Please Try Again';
                res.redirect('/reset_password/?token='+token+'&id='+id+'&error='+error);
            }
        })

    }
})

app.get('/student_request_course', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        // res.render('set_sem_dates.ejs');
        // let tdate = new Date();
        // let sql = 'select * from Sem_Dates';
        // connection.query(sql,(err,results)=>{
        //     if(err) throw err;
        //     let sdate = results[0].Starting_Sate;
        //     let edate = results[0].Ending_Date;
        //     if(tdate < sdate || tdate > edate){
        //         let error=req.query.error;
        //         let info=req.query.info;
        //         load_request_list(req,res,info,error);
        //     }else{
        //     }
        // })
        // res.render('student_request_course.ejs', { error: "Cannot Request Course During Semester" });
        let error = req.query.error;
        let info=req.query.info;
        load_request_list(req,res,info,error);
    } else {
        res.redirect('/');
    }
})

app.get('/admin_request_course', (req, res) => {
    if (req.session.loggedin && req.session.user) {
        connection.query('select * from Requested_Courses', (err, results) => {
            if (err) throw err;
            console.log(results);
            let error=req.query.error;
            let info=req.query.info;
            if(results.length >0){
                res.render('admin_request_course.ejs', { data: results, info : info , error : error });
            }else{
                res.render('admin_request_course.ejs');
            }
        })
        // res.render('admin_request_course.ejs');
    } else {
        res.redirect('/');
    }
})

app.get('/admin_accept_course',(req,res)=>{
    let code=req.query.code;
    let id = req.query.id;


    let sql='delete from Requested_Courses where Course_Code=? and Roll_No=?';
    connection.query(sql,[code,id],(err,result)=>{
        if(err) throw err;
        console.log('Requested Rejected');
        let sql2='call Add_Student_Course(?,?,0,0,@did,@rif,@inv); select @did,@rif,@inv';
    connection.query(sql2,[code,id],(err,result)=>{
        if(err) throw err;
        if(result[1][0]['@did']==1){
            res.redirect('/admin_request_course/?error="Duplicate Entry detected"');
        }else if(result[1][0]['@rif']==1){
            res.redirect('/admin_request_course/?erro="refrential integerity breached"');
        }else if(result[1][0]['@inv']==1){
            res.redirect('/admin_request_course/?error="Invalid entry for attendance"');
        }else{
            console.log('request accepted');
            res.redirect('/admin_request_course/?info="Request Accepted"');
        }
    })
        // res.redirect('/admin_request_course');
    })


    
})

app.get('/admin_reject_course',(req,res)=>{
    let code=req.query.code;
    let id = req.query.id;
    let sql='delete from Requested_Courses where Course_Code=? and Roll_No=?';
    connection.query(sql,[code,id],(err,result)=>{
        if(err) throw err;
        console.log('Requested Rejected');
        res.redirect('/admin_request_course/?info="Request Rejected"');
    })
})

app.get('/request_Course', (req, res) => {
    let id = req.query.id;
    let code = req.query.code;
    let sql = 'call Request_Course(?,?,@did); select @did';
    console.log(id,code);
    connection.query(sql, [id,code], (err, results) => {
        if (err) throw err;
        if(results[1][0]['@did']==1){
            res.redirect('/student_request_course/?error="Course Already Requested"');
        }else{
            res.redirect('/student_request_course/?info="' + code + ' requested"');
        }
    })
})

app.get('/student_attendance',(req,res)=>{
    if (req.session.loggedin && req.session.user) {
        res.render('student_attendance.ejs');
    } else {
        res.redirect('/');
    }
})

app.post('/student_attendance',(req,res)=>{
    let code=req.body.code;
    student_attendance(req,res,code);
})

let student_attendance = async function (req,res,code){
    let sql = 'call Attendance_In_Student(?,?); select * from Courses_Student_Relation where Roll_No = ?';
    let id = await GET_ID();
    connection.query(sql,[id,code,id],(err,results)=>{
        if(err) throw err;
        console.log(results);
        console.log(results[0]);
        console.log(results[2][0]);
        res.render('calender_attendance.ejs', { data : results[0] , sdata : results[2]});
    })
}

let load_request_list = async function (req, res, info, error) {
    let id = await GET_ID();
    let sql = 'call Request_Course_List(?)';
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        console.log(results);
        if (results[0].length > 0) {
            res.render('student_request_course.ejs', { data: results[0], id: id, info: info, error: error });
        }else{
            res.render('student_request_course.ejs')
        }
        // res.redirect('/student_home');
    })
}

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
                res.render('add_dept.ejs', { error: 'Duplicate Entry detected' })
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
                res.render('add_course.ejs', { error: 'Duplicate Entry detected' })
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
        password = md5(md5(md5(password)));
        let sql = `call Retrieve_ID(?,?,@ID,@t); select @ID; select @t;`
        connection.query(sql, [username, password], (err, result, fields) => {
            if (err) throw err
            if (result[1][0]['@ID'] == -1 || result[2][0]['@t'] != 'Student') {
                res.render('student_login.ejs', { error: "Wrong username or Password" });
            } else {
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
                    res.redirect('/student_home');
                })
            }
        })
    } else {
        res.send('enter login credentials');
        res.end();
    }
}

async function teacher_authenticate(username, password, res, req) {
    if (username && password) {
        password = md5(md5(md5(password)));
        let sql = `call Retrieve_ID(?,?,@ID,@t); select @ID; select @t;`
        connection.query(sql, [username, password], (err, result, fields) => {
            if (err) throw err
            if (result[1][0]['@ID'] == -1 || result[2][0]['@t'] != 'Professor') {
                res.render('teacher_login.ejs', { error: "Wrong username or Password" });
            } else {
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
                // res.redirect('/teacher_home');
            }
        })
    } else {
        res.send('enter login credentials');
        res.end();
    }
}
async function admin_authenticate(username, password, res, req) {
    if (username && password) {
        password = md5(md5(md5(password)));
        let sql = `call Retrieve_ID(?,?,@ID,@t); select @ID; select @t;`
        connection.query(sql, [username, password], (err, result, fields) => {
            if (err) throw err
            if (result[1][0]['@ID'] == -1 || result[2][0]['@t'] != 'Admin') {
                res.render('admin_login.ejs', { error: "Wrong username or Password" });
            } else {
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

async function clear_Attendance() {
    var sql = 'delete from Attendance_Marked';
    connection.query(sql, (err, result) => {
        if (err) throw err;
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
            res.render('prof_courses.ejs', { data: results[0] });
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
            res.render('student_courses.ejs', { data: results[0] });
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
        } else if (count > 0 || course != null) {
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
        res.render('prof_timetable.ejs', { data: results[0] });
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
        res.render('student_timetable.ejs', { data: results[0] });
    });
}

let Get_Student_Material = async function (req, res) {
    var sql = 'select * from Study_Material where Course_Code in (select Course_Code from Courses_Student_Relation where Roll_No = ?)';
    let id = await GET_ID();
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        console.log(results);
        res.render("study_material.ejs", { data: results })
    })
}

let mark_attendance = async function (req, res) {
    let id = await GET_ID();
    let date = new Date();
    console.log(req.query);
    var course = req.query.course;
    var time = req.query['amp;time'];
    console.log(course, time, id);
    var sql = 'call Mark_Attendance(?,?,?,?,@did); select @did';
    connection.query(sql, [id, course, time, date], (err, result) => {
        if (err) throw err
        if (result[1]['@did'] == 1) {
            res.redirect('/student_home');

        } else {
            res.render('ongoing_classes.ejs', { error: "attendance marked successfully" });
        }
    })
}

let change_password_stud = async function (req, res) {
    let newpass = req.body.new_password;
    let oldpass = req.body.old_password;
    let connewpass = req.body.con_new_password;
    newpass = md5(md5(md5(newpass)))
    oldpass = md5(md5(md5(oldpass)))
    connewpass = md5(md5(md5(connewpass)))
    if (newpass != connewpass) {
        res.render('change_password.ejs', { error: "password do not match" });
    } else {
        let id = await GET_User_ID();
        let sql = 'call Change_Password(?,?,?,@m); select @m';
        connection.query(sql, [id, oldpass, newpass], (err, results) => {
            if (err) throw err;
            if (results[1][0]['@m'] != 1) {
                res.render('change_password.ejs', { error: "Old Password is incorrect" });
            } else {
                res.redirect('/student_home');
                console.log('password Changed');
                res.end();
            }
        })
    }
}

let professor_study_material = async function (req, res) {
    let id = await GET_ID();
    let sql = 'call Retrieve_Professor_Study_Material(?)';
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.render('prof_study_material.ejs', { data: results[0] })
    })
}

let change_password_prof = async function (req, res) {
    let newpass = req.body.new_password;
    let oldpass = req.body.old_password;
    let connewpass = req.body.con_new_password;
    newpass = md5(md5(md5(newpass)))
    oldpass = md5(md5(md5(oldpass)))
    connewpass = md5(md5(md5(connewpass)))
    if (newpass != connewpass) {
        res.render('change_password.ejs', { error: "password do not match" });
    } else {
        let id = await GET_User_ID();
        let sql = 'call Change_Password(?,?,?,@m); select @m';
        connection.query(sql, [id, oldpass, newpass], (err, results) => {
            if (err) throw err;
            if (results[1][0]['@m'] != 1) {
                res.render('change_password.ejs', { error: "Old Password is incorrect" });
            } else {
                res.redirect('/teacher_home');
                console.log('password Changed');
                res.end();
            }
        })
    }
}

let change_password_admin = async function (req, res) {
    let newpass = req.body.new_password;
    let oldpass = req.body.old_password;
    let connewpass = req.body.con_new_password;
    newpass = md5(md5(md5(newpass)))
    oldpass = md5(md5(md5(oldpass)))
    connewpass = md5(md5(md5(connewpass)))
    if (newpass != connewpass) {
        res.render('change_password.ejs', { error: "password do not match" });
    } else {
        let id = await GET_User_ID();
        let sql = 'call Change_Password(?,?,?,@m); select @m';
        connection.query(sql, [id, oldpass, newpass], (err, results) => {
            if (err) throw err;
            if (results[1][0]['@m'] != 1) {
                res.render('change_password.ejs', { error: "Old Password is incorrect" });
            } else {
                res.redirect('/admin_home');
                console.log('password Changed');
                res.end();
            }
        })
    }
}

let Prof_Insert_Study_Material = async function (req, res) {
    let id = await GET_ID();
    let code = req.body.code;
    let link = req.body.link;
    let sql = 'call Insert_Study_Material(?,?,?,@rif,@inv); select @rif; select @inv';
    connection.query(sql, [link, code, id], (err, results) => {
        if (err) throw err;
        if (results[1][0]['@rif'] != null) {
            res.send('Referential integrity breached');

        } else if (results[1][0]['@inv'] != null) {
            res.send('Entered Course is out of your domain');
        } else {
            res.redirect('/prof_study_material');
        }
    })
}

let increment_days = function () {
    let d = new Date();
    let h = d.getHours();
    let h2 = `${h}`;
    let h3 = '';
    console.log(h2.length);
    if (h2.length === 1) {
        h3 += 0;
        h3 += h2[0]
    } else {
        h3 += h2[0];
        h3 += h2[1];
    }
    h3 += ':00';
    let day = d.getDay();
    var arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let day2 = arr[day];
    let sql = 'select Course_Code from Courses_Time_Slots_Relation where Day= ? and Time = ?';
    connection.query(sql, [day2, h3], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            let course = results[0].Course_Code;
            let sql2 = 'call Total_Days_Increment(?)';
            connection.query(sql2, [course], (err2, results2) => {
                if (err2) throw err2;
                console.log(course, ': total classes incremented');
            })
        }
    })
}

app.post('/add_student_excel', (req, res) => {
    var exceltojson;
    upload(req, res, function (err) {
        if (err) {
            res.render('add_student_excel', { error: "There was a problem while uploading the file." })
            // res.json({error_code:1,err_desc:err});
            return;
        }
        if (!req.file) {
            res.render('add_student_excel', { error: "No file was passed" })
            // res.json({error_code:1,error_desc:"No File Passed"});
            return;
        }
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null,
                lowerCaseHeaders: true
            }, function (err, result) {
                if (err) {
                    return res.render('add_student_excel', { error: "There was a problem while converting the file" });
                    // return res.json({error_code:1,err_desc:err,data: null});
                }
                // res.json({ error_code: 0, err_desc: null, data: result });
                console.log(result);
                // res.json({error_code:0,err_desc:null,data:result});
                let failed = [];
                result.forEach((item) => {
                    var name = item.name;
                    var rno = item.rollno;
                    var user_id = item.userid;
                    var Dep = item.depid;
                    var year = item.year;
                    var prog = item.program;
                    var dob = item.dob;
                    var gender = item.gender;
                    var email = item.email;
                    gender == "Male" ? gender = "M" : gender = "F";
                    var arr = item.courses.split(',');
                    // let arr=[];
                    // if(typeof course == 'object'){
                    //     arr=course;
                    // }else{
                    //     arr[0]=course;
                    // }
                    var pass = item.password;
                    console.log(rno, name, dob, gender, prog, year, Dep, email, user_id, pass);
                    pass = md5(md5(md5(pass)));
                    var sql = 'call Insert_Student(?,?,?,?,?,?,?,?,?,?,@did,@rif,@inv); select @did; select @rif; select @inv';
                    connection.query(sql, [rno, name, dob, gender, prog, year, Dep, email, user_id, pass], (err, results2) => {
                        if (err) throw err;

                        console.log(results2);
                        if (results2[1][0]['@did'] != null) {
                            // res.render('add_prof.ejs', { error: 'Duplicate Entry detected' })
                            failed.push(name);
                            console.log('error 1');
                        } else if (results2[2][0]['@rif'] != null) {
                            // res.render('add_prof.ejs', { error: 'referential integrity breached' })
                            failed.push(name);
                            console.log('error 2');
                        } else if (results2[3][0]['@inv'] != 0) {
                            let error;
                            if (results2[3][0]['@inv'] == 1) {
                                error = 'Entered name is not valid';
                            } else if (results2[3][0]['@inv'] == 2) {
                                error = 'Entered gender is not valid';
                            } else if (results2[3][0]['@inv'] == 3) {
                                error = 'Entered Date of Birth is not valid';
                            }
                            // res.render('add_prof.ejs', {error : error});
                            failed.push(name);
                            console.log('error 3');
                        } else {
                            arr.forEach((item) => {
                                if (item != undefined) {
                                    var sql = 'call Add_Student_Course(?,?,0,0,@did,@rif,@inv); select @did; select @rif; select @inv';
                                    connection.query(sql, [item, rno], (err, results) => {
                                        if (err) throw err;
                                        console.log(results)
                                        if (results[1][0]['@did'] != null) {
                                            console.log('error 3');
                                            // res.render('add_prof.ejs', { error: 'Duplicate Entry detected' })
                                            failed.push(name);
                                        } else if (results[2][0]['@rif'] != null) {
                                            console.log('error 4');
                                            // res.render('add_prof.ejs', { error: 'referential integrity breached' })
                                            failed.push(name);
                                        } else if (results[3][0]['@inv'] != null) {
                                            console.log('error 5');
                                            failed.push(name);
                                        } else {
                                            console.log('Course addded : ', item)
                                        }


                                    })
                                }
                            })
                        }
                    })
                })
                console.log('added');
                res.redirect('/admin_home');
                // res.send('check console');
                console.log(result);
                console.log(failed);
                // console.log(result[1].courses.split(','));
            });
        } catch (e) {
            res.render('add_student_excel', { error: "Corrupted excel file" });
        }
    })
});

app.post('/add_teacher_excel', (req, res) => {
    var exceltojson;
    upload(req, res, function (err) {
        if (err) {
            res.render('add_teacher_excel', { error: "There was a problem while uploading the file." })
            // res.json({error_code:1,err_desc:err});
            return;
        }
        if (!req.file) {
            res.render('add_teacher_excel', { error: "No file was passed" })
            // res.json({error_code:1,error_desc:"No File Passed"});
            return;
        }
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null,
                lowerCaseHeaders: true
            }, function (err, result) {
                if (err) {
                    return res.render('add_teacher_excel', { error: "There was a problem while converting the file" });
                    // return res.json({error_code:1,err_desc:err,data: null});
                }
                // res.json({error_code:0,err_desc:null,data:result});
                let failed = [];
                result.forEach((item) => {
                    var name = item.name;
                    var empid = item.empid;
                    var user_id = item.userid;
                    var Dep = item.depid;
                    var post = item.post;
                    var dob = item.dob;
                    var gender = item.gender;
                    var email = item.email;
                    gender == "Male" ? gender = "M" : gender = "F";
                    var arr = item.courses.split(',');
                    // let arr=[];
                    // if(typeof course == 'object'){
                    //     arr=course;
                    // }else{
                    //     arr[0]=course;
                    // }
                    var pass = item.password;
                    console.log(empid, name, dob, gender, post, Dep, email, user_id, pass);
                    pass = md5(md5(md5(pass)));
                    var sql = 'call Insert_Professor(?,?,?,?,?,?,?,?,?,@did,@rif,@inv); select @did; select @rif; select @inv';
                    connection.query(sql, [empid, name, dob, gender, post, Dep, email, user_id, pass], (err, results2) => {
                        if (err) throw err;

                        console.log(results2);
                        if (results2[1][0]['@did'] != null) {
                            // res.render('add_prof.ejs', { error: 'Duplicate Entry detected' })
                            failed.push(name);
                            console.log('error 1');
                        } else if (results2[2][0]['@rif'] != null) {
                            // res.render('add_prof.ejs', { error: 'referential integrity breached' })
                            failed.push(name);
                            console.log('error 2');
                        } else if (results2[3][0]['@inv'] != 0) {
                            let error;
                            if (results2[3][0]['@inv'] == 1) {
                                error = 'Entered name is not valid';
                            } else if (results2[3][0]['@inv'] == 2) {
                                error = 'Entered gender is not valid';
                            } else if (results2[3][0]['@inv'] == 3) {
                                error = 'Entered Date of Birth is not valid';
                            }
                            // res.render('add_prof.ejs', {error : error});
                            failed.push(name);
                            console.log('error 3');
                        } else {
                            arr.forEach((item) => {
                                if (item != undefined) {
                                    var sql = 'call Add_Professor_Course(?,?,@did,@rif); select @did; select @rif;';
                                    connection.query(sql, [item, empid], (err, results) => {
                                        if (err) throw err;
                                        console.log(results)
                                        if (results[1][0]['@did'] != null) {
                                            console.log('error 3');
                                            // res.render('add_prof.ejs', { error: 'Duplicate Entry detected' })
                                            failed.push(name);
                                        } else if (results[2][0]['@rif'] != null) {
                                            console.log('error 4');
                                            // res.render('add_prof.ejs', { error: 'referential integrity breached' })
                                            failed.push(name);
                                        } else {
                                            console.log('Course addded : ', item)
                                        }


                                    })
                                }
                            })
                        }
                    })
                })
                console.log('added');
                res.redirect('/admin_home');
                // res.send('check console');
                console.log(result);
                console.log(failed);
                // console.log(result[1].courses.split(','));
            });
        } catch (e) {
            res.render('add_teacher_excel', { error: "Corrupted excel file" });
            // res.json({error_code:1,err_desc:"Corrupted excel file"});
        }
    })
});


let forgot_password = async function (req, res, email, id) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (var i = 20; i > 0; --i) {
        token += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    await insert_token(token, id);
    var transporter = nodemailer.createTransport({
        // host: "smtp.mailtrap.io",
        // port: 2525,
        // auth: {
        //   user: "4296bacd5c5756",
        //   pass: "7b902144b75d84"
        // }
        service: 'gmail',
        auth: {
            user: keys.ac_user,
            pass: keys.ac_pass
        },
        // enable_starttls_auto: true
    });
    let link = 'localhost:5000/reset_password/?s=' + token + '&id=' + id;
    var mailOptions = {
        from: 'no-reply@gmail.com',
        to: email,
        subject: 'Reset Password',
        // text: 'http://' + req.headers.host + '/reset_password/?s=' + token + '&id='+id+'\n\n' ,
        // html: '<p>Click the link given below to reset your password</p><a href="'+link+'">Click here</a>'
        // html: '<p>Click the link given below to reset your password</p><a href='"+link+'">Click here</a>';
        html: "To reset your password, click this <a href='" + "http://localhost:5000/reset_password/?token=" + token + "&id=" + id + "'><span>link</span></a>.<br>This is a <b>test</b> email."
        // html: "To reset your password, click this <a href='" + "https://mysterious-beyond-20244.herokuapp.com/reset_password/?token=" + token + "&id=" + id + "'><span>link</span></a>.<br>This is a <b>test</b> email."

        // html: `<p>Click the link given below to reset your password</p><a href="">Click here</a>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) { throw err; }
        else {
            console.log("email sent:" + info.response);
            //   res.redirect('/');
            res.render('forgot_password.ejs', { error: "Password reset mail has been sent to your email." });
        }
    })
}

let insert_token = async function (token, id) {
    let sql = 'insert into Reset_Token values (?,?)';
    connection.query(sql, [id, token], (err, result) => {
        if (err) throw err;
        console.log('token inserted');
    })
}

let load_teacher_home = async function (req, res) {
    let id = await GET_ID();
    console.log(id, 'first');
    let sql2 = 'select * from Professor where Employee_ID = ?';
    connection.query(sql2, [id], (err2, result) => {
        if (err2) throw err2;
        console.log(result, 'third');
        let idate = result[0].DOB;
        console.log(idate);
        let month = idate.getMonth() + 1;
        let day = idate.getDate();
        let year = idate.getFullYear();
        // console.log(month>10,day>10);
        month < 10 ? month = '0' + month : month = month;
        day < 10 ? day = '0' + day : day = day;
        let fdate = day + '-' + month + '-' + year;
        console.log(fdate);
        let rdate = year + '-' + month + '-' + day;
        res.render('teacher_home.ejs', { data: result[0], fdate: fdate });
    })
}


let load_student_home = async function (req, res) {
    let id = await GET_ID();
    console.log(id, 'first');
    let sql2 = 'select * from Student where Roll_No = ?';
    connection.query(sql2, [id], (err2, result) => {
        if (err2) throw err2;
        console.log(result, 'third');
        let idate = result[0].DOB;
        console.log(idate);
        let month = idate.getMonth() + 1;
        let day = idate.getDate();
        let year = idate.getFullYear();
        // console.log(month>10,day>10);
        month < 10 ? month = '0' + month : month = month;
        day < 10 ? day = '0' + day : day = day;
        let fdate = day + '-' + month + '-' + year;
        console.log(fdate);
        let rdate = year + '-' + month + '-' + day;
        res.render('student_home.ejs', { data: result[0], fdate: fdate });
    })

}

let clear_token = async function(){
    let sql = 'delete from Reset_Token';
    connection.query(sql,(err,token)=>{
        if(err) throw err;
        console.log('tokens cleared');
    })
}
// forgot_password('chandravaibhav65@gmail.com');