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
drop procedure Delete_Dept;

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

 


