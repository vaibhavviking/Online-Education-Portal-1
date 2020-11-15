/*Delete Post*/
delimiter //
create procedure Delete_Post(
in name varchar(30),
out rif int
)
begin
declare exit handler for 1451
begin
set rif=1;
end;
delete from Post_Wise_Employees where Post_Wise_Employees.post=name;
delete from Posts where Posts.Post_Name=name;
end //
delimiter ;
/*Execute*/
call Delete_Post('Assistant Professor', @rif); /* Post name */
select @rif;                                   /* Referential Integrity Failure */
/*End*/
drop procedure Delete_Post;
