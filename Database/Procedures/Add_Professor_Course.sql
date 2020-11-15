/* Insert Professor's Course */
delimiter //
create procedure Add_Professor_Course(
in code varchar(7),
in empid int,
out did int,
out rif int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
insert into Courses_Professor_Relation values(code,empid);
update Course_Wise_Members set No_Of_Professors=No_Of_Professors+1 where Course_Wise_Members.CID=code;
end //
delimiter ;
/* Execute */
call Add_Professor_Course('CS 207',20,@did,@rif);           /* Course Code, Employee ID */
select @did;                                                /* Duplicate ID problem */
select @rif;                                                /* Referential Integrity Problem( Professor or Course DNE ) */
/*End*/
drop procedure Add_Professor_Course;