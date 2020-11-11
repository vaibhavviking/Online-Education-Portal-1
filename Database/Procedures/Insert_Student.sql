/*Insert Student*/
delimiter //
create procedure Insert_Student(
in rollno int,
in name varchar(40),
in prog varchar(10),
in year int,
in deptid int,
in userid varchar(30),
in password varchar(100),
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
