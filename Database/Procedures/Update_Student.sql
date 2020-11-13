/*Update Student*/
delimiter //
create procedure Update_Student(
in rollno int,
in name varchar(40),
in dob date,
in gender varchar(1),
in prog varchar(10),
in year int,
in dept_id int,
in cid varchar(7),
in enrol date,
in unenrol date,
out did int,
out rif int,
out inv int
)
a:begin
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
case
	when name not regexp '^[A-Za-z]+$' then set inv=2;
    when gender not regexp '[MF]' then set inv=3;
    when year not regexp '[1234]' then set inv=4;
    else set inv=0;
end case;
case when inv!=0 then leave a;
else
update Student set S_Name=name, DOB=dob, Gender=gender, Program_Enrolled=prog, Year_Of_Study=year, Department_ID=dept_id where Student.Roll_No=rollno;
call Add_Student_Course(cid,rollno,1,1,enrol,unenrol,@did,@rif,@inv);
end case;
end //
delimiter ;
/*Execute*/
call Update_Student(1,'A','2002-02-28','M','B.Tech',2,1,'CS 207',@did,@rif,@inv); /*Roll No, Name, DOB, Gender, Program, year of study, dept id, course id*/
select @did;
select @rif;
select @inv;
/*End*/

