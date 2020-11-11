/* Check Attendance (for Professor)*/
delimiter //
create procedure Check_Attendance(
in code varchar(7)
)
begin
select a.Roll_No, a.S_Name, b.Days_Attended, b.Total_Days
from Student as a inner join Courses_Student_Relation as b
on a.Roll_No=b.Roll_No
where b.Course_Code=code
order by b.Total_Days DESC;
end //
delimiter ;
/*Execute*/
call Check_Attendance('CS 207'); /*Course Code*/
/*End*/