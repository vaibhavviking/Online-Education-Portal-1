/*Delete Course*/
delimiter //
create procedure Delete_Course(
in code varchar(7),
out rif int
)
begin
declare exit handler for 1451
begin
set rif=1;
end;
delete from Course_Wise_Members where Course_Wise_Members.CID=code;
delete from Courses where Courses.Course_Code=code;
end //
delimiter ;
/*Execute*/
call Delete_Course('CS 207',@rif);   /* Course Code */
select @rif;                         /* Referential Integrity failure( In case any student or professor associated with course ) */
/*End*/
drop procedure Delete_Course;
