/*Insert Programs*/
delimiter //
create procedure Insert_Program(
in name varchar(10),
in descr varchar(100),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
insert into Programs values(name, descr);
end //
delimiter ;
/*Execute*/
call Insert_Program('B.Tech', 'Bachelor of Technology', @did); /* Program Name, Program Description */
select @did;                         /* Duplicate Name */
/*End*/
drop procedure Insert_Program;