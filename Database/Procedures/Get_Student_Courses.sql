/* Get Student's Courses */
delimiter //
create procedure Get_Student_Courses(
in rollno int
)
begin
select b.Course_Code, b.Course_Name, b.Credits
from Courses_Student_Relation as a inner join Courses as b
on a.Course_Code=b.Course_Code
where a.Roll_No=rollno;
end //
delimiter ;
/*Execute*/
call Get_Student_Courses(1); /*Roll_No*/
/*End*/