/* Delete Professor's Course */
delimiter //
create procedure Remove_Professor_Course(
in empid int,
in code varchar(7)
)
begin
delete from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid and Courses_Professor_Relation.Course_Code=code;
update Course_Wise_Members set No_Of_Professors=No_Of_Professors-1 where Course_Wise_Members.CID=code;
end //
delimiter ;
/* Execute */
call Remove_Professor_Course(20,'CS 207'); /* Employee ID, Course Code */
/*End*/
drop procedure Remove_Professor_Course;