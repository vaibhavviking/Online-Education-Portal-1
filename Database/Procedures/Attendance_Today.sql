/*Check Today's Attendance*/
delimiter //
create procedure Attendance_Today(
in code varchar(7),
in day varchar(20)
)
begin
select c.Roll_No, c.S_Name, a.Time 
from Student as c join Attendance_Marked as b join Courses_Time_Slots_Relation as a
on c.Roll_No=b.Roll_No and b.Time=a.Time
where a.Course_Code=code and a.Day=day;   
end //
delimiter ;
/*Execute*/
call Attendance_Today('CS 207','Monday'); /*Course Code, Day */
/*End*/