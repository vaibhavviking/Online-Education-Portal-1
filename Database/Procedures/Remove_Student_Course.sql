/* Delete Student's Course */
delimiter //
create procedure Remove_Student_Course(
in rollno int,
in code varchar(7)
)
begin
delete from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno and Courses_Student_Relation.Course_Code=code;
update Course_Wise_Members set No_Of_Students=No_Of_Students-1 where Course_Wise_Members.CID=code;
end //
delimiter ;
/* Execute */
call Remove_Student_Course(1,'MA 205'); /* Roll No, Course Code */
/*End*/
drop procedure Remove_Student_Course;

