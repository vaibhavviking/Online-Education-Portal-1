/* Update Professor bio */
delimiter //
create procedure Update_professor_Bio(
in empid int,
in name varchar(40),
in dob date,
in gender varchar(1),
in post varchar(30),
in dept_id int,
in email varchar(100),
out did int,
out rif int,
out inv int
)
a:begin
declare p varchar(30);
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
case
	-- when name not regexp '^[A-Za-z]+$' then set inv=1;
    when gender not regexp '[MF]' then set inv=2;
    else set inv=0;
end case;
case when inv!=0 then leave a;
else
select Professor.Post into p from Professor where Professor.Employee_ID=empid;
update Professor set P_Name=name, DOB=dob, Gender=gender, Post=post, Department_ID=dept_id, Email=email where Professor.Employee_ID=empid;
update Post_Wise_Employees set No_Of_Employees=No_Of_Employees-1 where Post_Wise_Employees.post=p;
update Post_Wise_Employees set No_Of_Employees=No_Of_Employees+1 where Post_Wise_Employees.post=post;
end case;
end //
delimiter ;
/*Execute*/
call Update_Professor_Bio(1,'A','1982-11-25','F','Assistant Professor',1,'A@iiti.ac.in',@did,@rif,@inv); /*Employee ID, Name, DOB, Gender, Post, dept id, Email*/
select @did;
select @rif;
select @inv;
/*End*/
drop procedure Update_Professor_Bio;
