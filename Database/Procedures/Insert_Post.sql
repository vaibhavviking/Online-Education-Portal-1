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
end //
delimiter ;
/*Execute*/
call Insert_Post('Assistant Professor', @did); /* Program Name */
select @did;                         /* Duplicate Name */
/*End*/