/*Remove All Professor Courses*/
delimiter //
create procedure Remove_All_Professor_Courses(
in empid int
)
begin
delete from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid; 
end //
delimiter ;
/*Execute*/
call Remove_All_Professor_Courses(1); /*Employee ID*/
/*End*/