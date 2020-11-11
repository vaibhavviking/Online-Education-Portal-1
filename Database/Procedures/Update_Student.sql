/*Update Student*/
delimiter //
create procedure Update_Student(
in rollno int,
in name varchar(40),
in prog varchar(10),
in year int,
in dept_id int,
in cid varchar(7)
)
begin
update Student set S_Name=name, Program_Enrolled=prog, Year_Of_Study=year, Department_ID=dept_id where Student.Roll_No=rollno;
call Add_Student_Course(cid,rollno,1,1,@did,@rif,@inv);
end //
delimiter ;
/*Execute*/
call Update_Student(1,'A','B.Tech',2,1,'CS 207'); /*Roll No, Name, Program, year of study, dept id, course id*/
/*End*/