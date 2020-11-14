/*Request Course*/
delimiter //
create procedure Request_Course_List(
in rollno int
)
begin
select a.Course_Code, a.Course_Name, a.Credits 
from Courses as a
where a.Course_Code not in
(select b.Course_Code from Courses_Student_Relation as b where b.Roll_No=rollno);
end //
delimiter ;
/*Execute*/
call Request_Course_List(1);    /* Roll No */
/*End*/
