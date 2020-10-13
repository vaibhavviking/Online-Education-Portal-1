use demo;
set sql_safe_updates=0;

/*Insert Admin*/
delimiter //
create procedure Insert_Admin(
in Admin_ID int,
in User_ID_ varchar(30),
in Password_ varchar(30),
out duplicate_key int
)
begin
declare exit handler for 1062
    begin
 	set duplicate_key=1;
    end;
insert into Administration values(Admin_ID);
insert into Account values(User_ID_,Password_,'Admin');
insert into Admin_Account_Relation values(Admin_ID,User_ID_);
end //
delimiter ;
/*Execute*/ 
call Insert_Admin (  200,'A2' ,'b', @duplicate_key);  /*Enter Admin_ID, User_ID, Password */
select @duplicate_key;
/*End*/

/*Delete Admin*/
delimiter //
create procedure Delete_Admin(
in x int
)
begin
delete Admin_Account_Relation, Account  
from Account inner join Admin_Account_Relation 
on Account.User_ID_=Admin_Account_Relation.User_ID_
where Admin_Account_Relation.Admin_ID=x;
delete from Administration where Administration.Admin_ID=x;
end //
delimiter ;
/*Execute*/
call Delete_Admin(1000); /* Admin_ID */
/*End*/

/*Retrieve ID*/
delimiter //
create procedure Retrieve_ID(
in u varchar(30),
in p varchar(30),
out account_id varchar(15)
)
begin
declare t varchar(15);
select Type_ into t from Account where User_ID_=u and Password_=p;
case
	when t='Admin' then 
    select Admin_ID into account_id from Account inner join Admin_Account_Relation 
    on Account.User_ID_=Admin_Account_Relation.User_ID_ 
    where Account.User_ID_=u and Account.Password_=p;
    
    when t='Student' then 
    select Roll_No into account_id from Account inner join Student_Account_Relation 
    on Account.User_ID_=Student_Account_Relation.User_ID_ 
    where Account.User_ID_=u and Account.Password_=p;
    
    when t='Professor' then 
    select Employee_ID into account_id from Account inner join Professor_Account_Relation 
    on Account.User_ID_=Professor_Account_Relation.User_ID_ 
    where Account.User_ID_=u and Account.Password_=p;
    
    else set account_id=-1;
end case;
end //
delimiter ;
/*Execute*/
call Retrieve_ID('P1','a',@ID); /* User_ID, Password */
select @ID;                    /* Duplicate User ID Check */
/*End*/

/*Change Password*/
delimiter //
create procedure Change_Password(
in userid varchar(30),
in old_p varchar(30),
in new_p varchar(30)
)
begin
update Account set Password_=new_p where Account.User_ID_=userid and Account.Password_=old_p;
end //
delimiter ;
/*Execute*/
call Change_Password('A2','b1','b'); /* User_ID, Current Password, New Password */
/*End*/

/*Insert Department*/
delimiter //
create procedure Insert_Dept(
in id int,
in name varchar(40),
out duplicate_id int
)
begin
declare exit handler for 1062
    begin
 	set duplicate_id=1;
    end;
insert into Department values(id,name);
end //
delimiter ;
/*Execute*/
call Insert_Dept(2,'EE',@did); /*Department_ID, Department_Name*/
select @did;                    /*Duplicate ID check*/
/*End*/

/*Delete Department*/
delimiter //
create procedure Delete_Dept(
in id int,
out rif int
)
begin
declare exit handler for 1451
begin
set rif=1;
end;
delete from Department where Department.Dept_ID=id;
end //
delimiter ;
/*Execute*/
call Delete_Dept(1,@rif); /*ID*/
select @rif;              /*Referential Integrity Failure*/
/*End*/

/*Insert Student*/
delimiter //
create procedure Insert_Student(
in rollno int,
in name varchar(40),
in prog varchar(10),
in year int,
in deptid int,
in userid varchar(30),
in password varchar(30),
out did int,
out rif int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
insert into Student values(rollno, name, prog, year, deptid);
insert into Account values(userid, password, 'Student');
insert into Student_Account_Relation values(rollno, userid);
end //
delimiter ;
/*Execute*/
call Insert_Student(2,'BC','M.Tech',3,2,'S2','b',@did,@rif); /*Roll no, Name, Program, Year of study, Dept ID, User ID, Password*/
select @did;                                                 /* Duplicate ID (atleast one of Username and Roll no. ) */
select @rif;                                                 /* Referential Integrity failure (Dept DNE) */
/*End*/

/*Delete Student*/
delimiter //
create procedure Delete_Student(
in rollno int
)
begin
delete Account, Student_Account_Relation 
from Student_Account_Relation inner join Account
on Student_Account_Relation.User_ID_=Account.User_ID_
where Student_Account_Relation.Roll_No=rollno;
delete from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno;
delete from Student where Student.Roll_No=rollno;
end //
delimiter ;
/*Execute*/
call Delete_Student(2);  /* Roll No. */
/*End*/

/*Insert Professor*/
delimiter //
create procedure Insert_Professor(
in empid int,
in name varchar(40),
in post varchar(30),
in deptid int,
in userid varchar(30),
in password varchar(30),
out did int,
out rif int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
insert into Professor values(empid, name, post, deptid);
insert into Account values(userid, password, 'Professor');
insert into Professor_Account_Relation values(empid, userid);
end //
delimiter ;
/*Execute*/
call Insert_Professor(30,'XW','Professor',3,'P3','c',@did,@rif); /*Emp ID, Name, Post, Dept ID, User ID, Password*/
select @did;                                                                 /* Duplicate ID (atleast one of Username and Employee ID ) */
select @rif;                                                                 /* Referential Integrity failure (Dept DNE) */
/*End*/

/*Delete Professor*/
delimiter //
create procedure Delete_Professor(
in empid int
)
begin
delete Account, Professor_Account_Relation
from Professor_Account_Relation inner join Account
on Professor_Account_Relation.User_ID_=Account.User_ID_
where Professor_Account_Relation.Employee_ID=empid;
delete from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid;
delete from Professor where Professor.Employee_ID=empid;
end //
delimiter ;
/*Execute*/
call Delete_Professor(10);  /* Employee ID */
/*End*/

/*Insert Course*/
delimiter //
create procedure Insert_Course(
in code varchar(7),
in name varchar(50),
in link varchar(200),
in credit varchar(5),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
insert into Courses values(code, name, link, credit); 
end //
delimiter ;  
/* Execute */
call Insert_Course('CS 207','Database','xyz.com','3-0-0',@did); /* Course Code, Course Name, Class link, Credits */
select @did;                                                    /* Duplicate ID problem */
/* End */

/*Delete Course*/
delimiter //
create procedure Delete_Course(
in code varchar(7),
out rif int
)
begin
declare exit handler for 1451
begin
set rif=1;
end;
delete from Courses where Courses.Course_Code=code;
end //
delimiter ;
/*Execute*/
call Delete_Course('CS 207',@rif);   /* Course Code */
select @rif;                         /* Referential Integrity failure( In case any student or professor associated with course ) */
/*End*/

/* Insert Student's Course */
delimiter //
create procedure Add_Student_Course(
in code varchar(7),
in rollno int,
in total int,
in attend int,
out did int,
out rif int,
out inv int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
declare exit handler for 3819
begin
set inv=1;
end;
insert into Courses_Student_Relation values(code,rollno,total,attend);
end //
delimiter ;
/* Execute */
call Add_Student_Course('CS 207',1,100,98,@did,@rif,@inv); /* Course Code, Roll No., Total class days, Classes attended */
select @did;                                                /* Duplicate ID problem */
select @rif;                                                /* Referential Integrity Problem( Student or Course DNE ) */
select @inv;                                                /* Invalid entry of attendance */
/*End*/

/* Delete Student's Course */
delimiter //
create procedure Remove_Student_Course(
in rollno int,
in code varchar(7)
)
begin
delete from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno and Courses_Student_Relation.Course_Code=code;
end //
delimiter ;
/* Execute */
call Remove_Student_Course(1,'CS 207'); /* Roll No, Course Code */
/*End*/

/* Insert Professor's Course */
delimiter //
create procedure Add_Professor_Course(
in code varchar(7),
in empid int,
out did int,
out rif int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
insert into Courses_Professor_Relation values(code,empid);
end //
delimiter ;
/* Execute */
call Add_Professor_Course('CS 207',20,@did,@rif);           /* Course Code, Employee ID */
select @did;                                                /* Duplicate ID problem */
select @rif;                                                /* Referential Integrity Problem( Professor or Course DNE ) */
/*End*/

/* Delete Professor's Course */
delimiter //
create procedure Remove_Professor_Course(
in empid int,
in code varchar(7)
)
begin
delete from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid and Courses_Professor_Relation.Course_Code=code;
end //
delimiter ;
/* Execute */
call Remove_Professor_Course(20,'CS 207'); /* Employee ID, Course Code */
/*End*/

/*Insert TimeSlot*/
delimiter //
create procedure Insert_Time_Slot(
in day varchar(20),
in time varchar(5),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
insert into Time_Slots values(day,time);
end //
delimiter ;
/*Execute*/
call Insert_Time_Slot('Monday','17:00',@did); /* Day, Time */
select @did;                                  /* Time Slot already exists */
/* End */

/*Insert Study Material */
delimiter //
create procedure Insert_Study_Material(
in link varchar(200),
in code varchar(7),
out rif int
)
begin
declare exit handler for 1452
begin
set rif=1;
end;
insert into Study_Material(Link, Course_Code) values(link,code);
end //
delimiter ;
/*Execute*/
call Insert_Study_Material('xyz.com','CS 207',@rif); /* Link, Course Code */
select @rif;                                         /* Referential Integrity Failure(Course DNE)*/ 
/*End*/

/*Delete Study Material */
delimiter //
create procedure Delete_Study_Material(
in code varchar(7),
in link varchar(200)
)
begin
delete from Study_Material where Study_Material.Course_Code=code and Study_Material.Link=link;
end //
delimiter ;
/*Execute*/
call Delete_Study_Material('CS 207','xyz.com'); /* Course Code, Link */
/*End*/

/* Assign Time Slot */
delimiter //
create procedure Assign_Time_Slot(
in code varchar(7),
in day varchar(20),
in time varchar(5),
out rif int
)
begin
declare exit handler for 1452
begin
set rif=1;
end;
insert into Courses_Time_Slots_Relation values(code,day,time);
end //
delimiter ;
/*Execute*/
call Assign_Time_Slot('CS 207','Monday','17:00',@rif);
select @rif;
/*End*/

/* Unassign Time Slot*/
delimiter //
create procedure Unassign_Time_Slot(
in code varchar(7),
in day varchar(20),
in time varchar(5)
)
begin
delete from Courses_Time_Slots_Relation as a where a.Course_Code=code and a.Day=day and a.Time=time; 
end //
delimiter ;
/*Execute*/
call Unassign_Time_Slot('CS 207','Monday','17:00');
/*End*/

/* Get Student Time Table */
delimiter //
create procedure Student_Time_Table(
in rollno int
)
begin
declare val1 varchar(7);
declare val2 varchar(7);
declare val3 varchar(7);
declare val4 varchar(7);
declare val5 varchar(7);
declare val6 varchar(7);
create temporary table temp
select a.Course_Code as Course, b.Day as Day, b.Time as Time 
from Courses_Student_Relation as a join Courses_Time_Slots_Relation as b
on a.Course_Code=b.Course_Code
where a.Roll_No=rollno
order by b.Day, b.Time ASC;
create temporary table Time_Table(
Time varchar(5),
Monday varchar(7),
Tuesday varchar(7),
Wednesday varchar(7),
Thursday varchar(7),
Friday varchar(7),
Saturday varchar(7)
);
select Course into val1 from temp where temp.Day='Monday' and temp.Time='08:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='08:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='08:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='08:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='08:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='08:00';
insert into Time_Table values('08:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='09:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='09:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='09:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='09:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='09:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='09:00';
insert into Time_Table values('09:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='10:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='10:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='10:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='10:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='10:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='10:00';
insert into Time_Table values('10:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='11:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='11:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='11:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='11:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='11:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='11:00';
insert into Time_Table values('11:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='12:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='12:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='12:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='12:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='12:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='12:00';
insert into Time_Table values('12:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='13:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='13:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='13:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='13:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='13:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='13:00';
insert into Time_Table values('13:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='14:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='14:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='14:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='14:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='14:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='14:00';
insert into Time_Table values('14:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='15:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='15:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='15:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='15:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='15:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='15:00';
insert into Time_Table values('15:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='16:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='16:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='16:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='16:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='16:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='16:00';
insert into Time_Table values('16:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='17:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='17:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='17:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='17:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='17:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='17:00';
insert into Time_Table values('17:00',val1,val2,val3,val4,val5,val6);
select * from Time_Table;
drop table temp;
drop table Time_Table;
end //
delimiter ;
/*Execute*/
call Student_Time_Table(1); /* Roll no. */
/*End*/

/* Get Professor Time Table */
delimiter //
create procedure Professor_Time_Table(
in empid int
)
begin
declare val1 varchar(7);
declare val2 varchar(7);
declare val3 varchar(7);
declare val4 varchar(7);
declare val5 varchar(7);
declare val6 varchar(7);
create temporary table temp
select a.Course_Code as Course, b.Day as Day, b.Time as Time 
from Courses_Professor_Relation as a join Courses_Time_Slots_Relation as b
on a.Course_Code=b.Course_Code
where a.Employee_ID=empid
order by b.Day, b.Time ASC;
create temporary table Time_Table(
Time varchar(5),
Monday varchar(7),
Tuesday varchar(7),
Wednesday varchar(7),
Thursday varchar(7),
Friday varchar(7),
Saturday varchar(7)
);
select Course into val1 from temp where temp.Day='Monday' and temp.Time='08:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='08:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='08:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='08:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='08:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='08:00';
insert into Time_Table values('08:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='09:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='09:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='09:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='09:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='09:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='09:00';
insert into Time_Table values('09:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='10:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='10:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='10:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='10:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='10:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='10:00';
insert into Time_Table values('10:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='11:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='11:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='11:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='11:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='11:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='11:00';
insert into Time_Table values('11:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='12:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='12:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='12:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='12:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='12:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='12:00';
insert into Time_Table values('12:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='13:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='13:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='13:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='13:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='13:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='13:00';
insert into Time_Table values('13:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='14:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='14:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='14:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='14:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='14:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='14:00';
insert into Time_Table values('14:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='15:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='15:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='15:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='15:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='15:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='15:00';
insert into Time_Table values('15:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='16:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='16:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='16:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='16:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='16:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='16:00';
insert into Time_Table values('16:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='17:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='17:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='17:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='17:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='17:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='17:00';
insert into Time_Table values('17:00',val1,val2,val3,val4,val5,val6);
select * from Time_Table;
drop table temp;
drop table Time_Table;
end //
delimiter ;
/*Execute*/
call Professor_Time_Table(1); /* Employee ID */
/*End*/


/* Total_Days_Increment called everytime when class occurs for a course*/
/* Mark Attendance will be executed for only those students who have pressed the button */
/*Total Days Incrementer*/
delimiter //
create procedure Total_Days_Increment()
begin
update Courses_Student_Relation as a
set a.Total_Days=a.Total_Days+1;
end //
delimiter ;
/*Execute*/
call Total_Days_Increment();
/*End*/

/* Mark Attendance */
delimiter //
create procedure Mark_Attendance(
in rollno int,
in code varchar(7),
in time varchar(5),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
update Courses_Student_Relation as a 
set a.Days_Attended=a.Days_Attended+1
where a.Roll_No=rollno and a.Course_Code=code;
insert into Attendance_Marked values(rollno,time);
end //
delimiter ;
/*Execute*/
call Mark_Attendance(1,'CS 207','17:00',@did);   /*Roll No, Course Code, Time */
select @did;
/*End*/

/* Check Attendance (for Professor)*/
delimiter //
create procedure Check_Attendance(
in code varchar(7)
)
begin
select a.Roll_No, a.S_Name, b.Days_Attended, b.Total_Days
from Student as a inner join Courses_Student_Relation as b
on a.Roll_No=b.Roll_No
where b.Course_Code=code
order by b.Total_Days DESC;
end //
delimiter ;
/*Execute*/
call Check_Attendance('CS 207');
/*End*/

/* Get Student's Courses */
delimiter //
create procedure Get_Student_Courses(
in rollno int
)
begin
select b.Course_Code, b.Course_Name, b.Credits
from Courses_Student_Relation as a inner join Courses as b
on a.Course_Code=b.Course_Code
where a.Roll_No=rollno;
end //
delimiter ;
/*Execute*/
call Get_Student_Courses(1);
/*End*/

/* Get Professor's Courses */
delimiter //
create procedure Get_Professor_Courses(
in empid int
)
begin
select b.Course_Code, b.Course_Name, b.Credits
from Courses_Professor_Relation as a inner join Courses as b
on a.Course_Code=b.Course_Code
where a.Employee_ID=empid;
end //
delimiter ;
/*Execute*/
call Get_Professor_Courses(20);
/*End*/

/* Get Student's Class links */
delimiter //
create procedure Get_Student_Links(
in rollno int
)
begin
select b.Class_Link
from Courses_Student_Relation as a inner join Courses as b
on a.Course_Code=b.Course_Code
where a.Roll_No=rollno;
end //
delimiter ;
/*Execute*/
call Get_Student_Links(1);
/*End*/

/* Get Professor's Class Links */
delimiter //
create procedure Get_Professor_Links(
in empid int
)
begin
select b.Class_Link
from Courses_Professor_Relation as a inner join Courses as b
on a.Course_Code=b.Course_Code
where a.Employee_ID=empid;
end //
delimiter ;
/*Execute*/
call Get_Professor_Links(20);
/*End*/

/*Insert Session*/
delimiter //
create procedure Insert_Session(
in SID varchar(50),
in userid varchar(30),
out rif int
)
begin
declare exit handler for 1062
begin
delete from Session where Session.User_ID_=userid;
insert into Session values(SID, userid);
end;
declare exit handler for 1452
begin 
set rif=1;
end;
insert into Session values(SID, userid);
end //
delimiter ;
/*Execute*/
call Insert_Session('123','1',@rif); /*Session_ID, User_ID*/
select @rif;
/*End*/

/*Delete Session*/
delimiter //
create procedure Delete_Session(
in userid varchar(30)
)
begin
delete from Session where Session.User_ID_=userid;
end //
delimiter ;
/*Execute*/
call Delete_Session('1'); /*User_ID*/
/*End*/

/*Check Today's Attendance*/
delimiter //
create procedure Attendance_Today(
in code varchar(7),
in day varchar(20)
)
begin
declare val int;
select count(d.Time) into val from Courses_Time_Slots_Relation as d where d.Course_Code=code and d.Day=day;
case 
when val=1 then
select c.Roll_No, c.S_Name from Student as c where c.Roll_No in
(select b.Roll_No from Attendance_Marked as b where b.Time in
(select a.Time from Courses_Time_Slots_Relation as a where a.Course_Code=code and a.Day=day));
else 
select c.Roll_No, c.S_Name, a.Time from Student as c where c.Roll_No in
(select b.Roll_No from Attendance_Marked as b where b.Time in
(select a.Time from Courses_Time_Slots_Relation as a where a.Course_Code=code and a.Day=day));
end case;
end //
delimiter ;
/*Execute*/
call Attendance_Today('CS 207','Monday'); /*Course Code, Day */
/*End*/

/*Retrieve Study Material*/
delimiter //
create procedure Retrieve_Study_Material(
in rollno int
)
begin
select a.Course_Code, a.Link
from Study_Material as a
where a.Course_Code in (select b.Course_Code from Courses_Student_Relation as b where b.Roll_No=rollno );
end //
delimiter ;
/*Execute*/
call Retrieve_Study_Material(1); /*Roll No.*/
/*End*/