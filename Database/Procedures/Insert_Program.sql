/*Insert Programs*/
delimiter //
create procedure Insert_Program(
in name varchar(10),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
insert into Programs values(name);
end //
delimiter ;
/*Execute*/
call Insert_Program('B.Tech', @did); /* Program Name */
select @did;                         /* Duplicate Name */
/*End*/
