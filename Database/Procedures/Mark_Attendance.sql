/* Mark Attendance */
delimiter //
create procedure Mark_Attendance(
in rollno int,
in code varchar(7),
in time time,
in date date,
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
update Courses_Student_Relation as a 
set a.Days_Attended=a.Days_Attended+1
where a.Roll_No=rollno and a.Course_Code=code;
insert into Attendance_Marked values(rollno,code,time,date);
end //
delimiter ;
/*Execute*/
call Mark_Attendance(1,'CS 207','17:00','2020-11-13',@did);   /*Roll No, Course Code, Time, Date */
select @did;
/*End*/
drop procedure Mark_Attendance;