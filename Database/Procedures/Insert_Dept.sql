/*Insert Department*/
delimiter //
create procedure Insert_Dept(
in id int,
in name varchar(40),
out duplicate_id int
)
begin
declare exit handler for 1062
    begin
 	set duplicate_id=1;
    end;
insert into Department values(id,name);
end //
delimiter ;
/*Execute*/
call Insert_Dept(2,'EE',@did); /*Department_ID, Department_Name*/
select @did;                    /*Duplicate ID check*/
/*End*/