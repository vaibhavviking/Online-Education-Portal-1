/*Check Attendance for Professor*/
delimiter //
create procedure Attendance_In_Professor(
in code varchar(7),
in Date date
)
begin
select Attendance_Marked.Roll_No, Student.S_Name, Attendance_Marked.Time 
from Student join Attendance_Marked 
on Attendance_Marked.Roll_No=Student.Roll_No
where Attendance_Marked.CID=code and Attendance_Marked.Date=date(Date)
order by Attendance_Marked.Time ASC;
end //
delimiter ;
/*Execute*/
call Attendance_In_Professor('CS 207','2020-11-02'); /*Course Code, Date */
/*End*/
