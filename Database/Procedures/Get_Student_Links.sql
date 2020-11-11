/* Get Student's Class links */
delimiter //
create procedure Get_Student_Links(
in rollno int
)
begin
select b.Course_Code, b.Class_Link
from Courses_Student_Relation as a inner join Courses as b
on a.Course_Code=b.Course_Code
where a.Roll_No=rollno;
end //
delimiter ;
/*Execute*/
call Get_Student_Links(1); /*Roll_No*/
/*End*/