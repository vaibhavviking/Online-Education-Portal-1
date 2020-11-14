/* Insert Student's Course */
delimiter //
create procedure Add_Student_Course(
in code varchar(7),
in rollno int,
in total int,
in attend int,
out did int,
out rif int,
out inv int
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
declare exit handler for 3819
begin
set inv=1;
end;
insert into Courses_Student_Relation values(code,rollno,total,attend);
end //
delimiter ;
/* Execute */
call Add_Student_Course('CS 207',1,100,98,@did,@rif,@inv); /* Course Code, Roll No., Total class days, Classes attended */
select @did;                                                /* Duplicate ID problem */
select @rif;                                                /* Referential Integrity Problem( Student or Course DNE ) */
select @inv;                                                /* Invalid entry of attendance */
/*End*/

