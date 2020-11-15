/*Remove All Student Courses*/
delimiter //
create procedure Remove_All_Student_Courses(
in rollno int
)
begin
delete from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno; 
update Course_Wise_Members set No_Of_Students=No_Of_Students-1 where Course_Wise_Members.CID in 
(select Courses_Student_Relation.Course_Code from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno);
end //
delimiter ;
/*Execute*/
call Remove_All_Student_Courses(1); /*Roll No*/
/*End*/
drop procedure Remove_All_Student_Courses;