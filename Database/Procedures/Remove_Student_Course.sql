/* Delete Student's Course */
delimiter //
create procedure Remove_Student_Course(
in rollno int,
in code varchar(7)
)
begin
delete from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno and Courses_Student_Relation.Course_Code=code;
end //
delimiter ;
/* Execute */
call Remove_Student_Course(1,'CS 207'); /* Roll No, Course Code */
/*End*/