/*Insert Course*/
delimiter //
create procedure Insert_Course(
in code varchar(7),
in name varchar(50),
in link varchar(200),
in credit varchar(5),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
insert into Courses values(code, name, link, credit); 
insert into Course_Wise_Members values(code, 0, 0);
end //
delimiter ;  
/* Execute */
call Insert_Course('CS 207','Database','xyz.com','3-0-0',@did); /* Course Code, Course Name, Class link, Credits */
select @did;                                                    /* Duplicate ID problem */
/* End */


