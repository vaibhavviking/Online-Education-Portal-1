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
delete from Posts where Posts.P_Name=name;
end //
delimiter ;
/*Execute*/
call Delete_Post('Assistant Professor', @rif); /* Post name */
select @rif;                                   /* Referential Integrity Failure */
/*End*/
