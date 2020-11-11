/*Retrieve Professor Study Material*/
delimiter //
create procedure Retrieve_Professor_Study_Material(
in empid int
)
begin
select a.Material_No, a.Course_Code, a.Link
from Study_Material as a
where a.Course_Code in (select b.Course_Code from Courses_Professor_Relation as b where b.Employee_ID=empid );
end //
delimiter ;
/*Execute*/
call Retrieve_Professor_Study_Material(1); /*Employee ID*/
/*End*/
