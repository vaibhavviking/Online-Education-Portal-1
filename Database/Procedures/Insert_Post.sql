/*Insert Posts*/
delimiter //
create procedure Insert_Post(
in name varchar(30),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
insert into Posts values(name);
insert into Post_Wise_Employees values(name, 0);
end //
delimiter ;
/*Execute*/
call Insert_Post('Professor', @did); /* Program Name */
select @did;                         /* Duplicate Name */
/*End*/
