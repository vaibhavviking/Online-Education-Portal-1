/*Remove All Student Courses*/
delimiter //
create procedure Remove_All_Student_Courses(
in rollno int
)
begin
delete from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno; 
end //
delimiter ;
/*Execute*/
call Remove_All_Student_Courses(1); /*Roll No*/
/*End*/