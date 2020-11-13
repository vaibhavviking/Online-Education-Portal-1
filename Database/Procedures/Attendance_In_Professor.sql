/*Check Attendance for Professor*/
delimiter //
create procedure Attendance_In_Professor(
in code varchar(7),
in Date date
)
begin
select a.Roll_No, b.S_Name, a.Time 
from Student as b join Attendance_Marked as a
on a.Roll_No=b.Roll_No
where a.CID=code and a.Date=date(Date)
order by a.Time ASC;
end //
delimiter ;
/*Execute*/
call Attendance_In_Professor('CS 207','2020-11-13'); /*Course Code, Date */
/*End*/
