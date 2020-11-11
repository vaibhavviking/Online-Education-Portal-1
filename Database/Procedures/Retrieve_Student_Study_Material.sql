/*Retrieve Student Study Material*/
delimiter //
create procedure Retrieve_Student_Study_Material(
in rollno int
)
begin
select a.Course_Code, a.Link
from Study_Material as a
where a.Course_Code in (select b.Course_Code from Courses_Student_Relation as b where b.Roll_No=rollno );
end //
delimiter ;
/*Execute*/
call Retrieve_Student_Study_Material(1); /*Roll No.*/
/*End*/