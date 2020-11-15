/*Remove All Professor Courses*/
delimiter //
create procedure Remove_All_Professor_Courses(
in empid int
)
begin
update Course_Wise_Members set No_Of_Professors=No_Of_Professors-1 where Course_Wise_Members.CID in 
(select Courses_Professor_Relation.Course_Code from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid);
delete from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid; 
end //
delimiter ;
/*Execute*/
call Remove_All_Professor_Courses(1); /*Employee ID*/
/*End*/
drop procedure Remove_All_Professor_Courses;