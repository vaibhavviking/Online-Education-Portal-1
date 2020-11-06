/*Insert Study Material */
delimiter //
create procedure Insert_Study_Material(
in link varchar(200),
in code varchar(7),
in empid int,
out rif int,
out inv int
)
x:begin
declare exit handler for 1452
begin
set rif=1;
end;
case
	when code not in (select a.Course_Code from Courses_Professor_Relation as a where a.Employee_ID=empid) then set inv=1;
    else set inv=0;
end case;
case
	when inv!=1 then insert into Study_Material(Link, Course_Code) values(link,code);
    else leave x;
end case;
end //
delimiter ;
/*Execute*/
call Insert_Study_Material('xyz.com','CS 207',1,@rif,@inv); /* Link, Course Code, Employee_ID */
select @rif;                                         /* Referential Integrity Failure(Course DNE)*/
select @inv;                                         /* Professor not authorised */
/*End*/