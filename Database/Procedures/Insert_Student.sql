/*Insert Student*/
delimiter //
create procedure Insert_Student(
in rollno int,
in name varchar(40),
in dob date,
in gender varchar(1),
in prog varchar(10),
in year int,
in deptid int,
in email varchar(100),
in userid varchar(30),
in password varchar(100),
out did int,
out rif int,
out inv int
)
a:begin
declare val int;
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
case
	-- when name not regexp '^[A-Za-z_ ]+$' then set inv=1;
    when gender not regexp '[MF]' then set inv=2;
    when year not regexp '^[0-9]+$' then set inv=3;
    else set inv=0;
end case;
case when inv!=0 then leave a;
else
insert into Student values(rollno, name, dob, gender, prog, year, deptid, email);
insert into Account values(userid, password, 'Student');
insert into Student_Account_Relation values(rollno, userid);
select Program_Wise_Students.No_Of_Students into val from Program_Wise_Students where Program_Wise_Students.program=prog;
set val=val+1;
update Program_Wise_Students set No_Of_Students=val where Program_Wise_Students.program=prog;
end case;
end //
delimiter ;
/*Execute*/
call Insert_Student(100,'Test','2000-01-15','M','123',3,2,'Test@iiti.ac.in','S2','b',@did,@rif,@inv); /*Roll no, Name, DOB(Y-M-D), Gender, Program, Year of study, Dept ID, Email, User ID, Password*/
select @did;                                                 /* Duplicate ID (atleast one of Username and Roll no. ) */
select @rif;                                                 /* Referential Integrity failure (Dept DNE) */
select @inv;                                                 /* Invalid entry */
/*End*/
drop procedure Insert_Student;
