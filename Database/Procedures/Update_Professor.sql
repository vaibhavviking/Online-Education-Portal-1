/*Update Professor*/
delimiter //
create procedure Update_Professor(
in empid int,
in name varchar(40),
in dob date,
in gender varchar(1),
in post varchar(30),
in dept_id int,
in cid varchar(7)
)
begin
update Professor set P_Name=name, DOB=dob, Gender=gender, Post=post, Department_ID=dept_id where Professor.Employee_ID=empid;
call Add_Professor_Course(cid,empid,@did,@rif);  
end //
delimiter ;
/*Execute*/
call Update_Professor(1,'A','1982-11-25','F','Assistant Professor',1,'CS 207'); /*Employee ID, Name, DOB, Gender, Post, dept id, course id*/
/*End*/
