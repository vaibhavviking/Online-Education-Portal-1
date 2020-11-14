/*Requested course list*/
delimiter //
create procedure Request_Course(
in rollno int,
in code varchar(7),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
insert into Requested_Courses values(rollno, code);
end //
delimiter ;
/*Execute*/
call Request_Course(1,'CS 207',@did); /* Roll No, Course_Code */
select @did;                          /* Duplicate record */
/*End*/
