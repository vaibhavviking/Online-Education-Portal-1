/*Delete Department*/
delimiter //
create procedure Delete_Dept(
in id int,
out rif int
)
begin
declare exit handler for 1451
begin
set rif=1;
end;
delete from Department where Department.Dept_ID=id;
end //
delimiter ;
/*Execute*/
call Delete_Dept(1,@rif); /*ID*/
select @rif;              /*Referential Integrity Failure*/
/*End*/