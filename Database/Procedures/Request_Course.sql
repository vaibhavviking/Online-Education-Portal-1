/*Requested course list*/
delimiter //
create procedure Request_Course(
in rollno int,
in code varchar(7)
)
begin
insert into Requested_Courses values(rollno, code);
end //
delimiter ;
/*Execute*/
call Request_Course(1,'CS 207'); /* Roll No, Course_Code */
/*End*/
