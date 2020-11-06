/* Get Professor's Class Links */
delimiter //
create procedure Get_Professor_Links(
in empid int
)
begin
select b.Course_Code, b.Class_Link
from Courses_Professor_Relation as a inner join Courses as b
on a.Course_Code=b.Course_Code
where a.Employee_ID=empid;
end //
delimiter ;
/*Execute*/
call Get_Professor_Links(20); /*Employee ID*/
/*End*/