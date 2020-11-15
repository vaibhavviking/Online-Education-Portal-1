/*Update Student In Sem*/
delimiter //
create procedure Update_Student_In_Sem(
in rollno int,
in name varchar(40),
in dob date,
in gender varchar(1),
in prog varchar(10),
in year int,
in dept_id int,
in email varchar(100),
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
	-- when name not regexp '^[A-Za-z]+$' then set inv=2;
    when gender not regexp '[MF]' then set inv=3;
    when year not regexp '^[0-9]+$' then set inv=4;
    else set inv=0;
end case;
case when inv!=0 then leave a;
else
update Student set S_Name=name, DOB=dob, Gender=gender, Program_Enrolled=prog, Year_Of_Study=year, Department_ID=dept_id, Email=email where Student.Roll_No=rollno;
end case;
end //
delimiter ;
/*Execute*/
call Update_Student_In_Sem(1,'A','2002-02-28','M','B.Tech',2,1,'A@iiti.ac.in',@did,@rif,@inv); /*Roll No, Name, DOB, Gender, Program, year of study, dept id, Email*/
select @did;
select @rif;
select @inv;
/*End*/
drop procedure Update_Student_In_Sem;

