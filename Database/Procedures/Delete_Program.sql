/*Delete Program*/
delimiter //
create procedure Delete_Program(
in name varchar(10),
out rif int
)
begin
declare exit handler for 1451
begin
set rif=1;
end;
delete from Programs where Programs.P_Name=name;
end //
delimiter ;
/*Execute*/
call Delete_Program('B.Tech', @rif); /* Program name */
select @rif;                         /* Referential Integrity Failure */
/*End*/
