/* Get Professor's Courses */
delimiter //
create procedure Get_Professor_Courses(
in empid int
)
begin
select b.Course_Code, b.Course_Name, b.Credits
from Courses_Professor_Relation as a inner join Courses as b
on a.Course_Code=b.Course_Code
where a.Employee_ID=empid;
end //
delimiter ;
/*Execute*/
call Get_Professor_Courses(20); /*Employee_ID*/
/*End*/