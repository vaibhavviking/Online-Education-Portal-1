/*Update Professor*/
delimiter //
create procedure Update_Professor(
in empid int,
in name varchar(40),
in post varchar(30),
in dept_id int,
in cid varchar(7)
)
begin
update Professor set P_Name=name, Post=post, Department_ID=dept_id where Professor.Roll_No=rollno;
call Add_Professor_Course(cid,empid,@did,@rif);  
end //
delimiter ;
/*Execute*/
call Update_Professor(1,'A','B.Tech',2,1,'CS 207'); /*Employee ID, Name, Post, dept id, course id*/
/*End*/