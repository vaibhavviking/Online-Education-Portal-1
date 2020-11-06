/* Assign Time Slot */
delimiter //
create procedure Assign_Time_Slot(
in code varchar(7),
in day varchar(20),
in time varchar(5),
out rif int
)
begin
declare exit handler for 1452
begin
set rif=1;
end;
insert into Courses_Time_Slots_Relation values(code,day,time);
end //
delimiter ;
/*Execute*/
call Assign_Time_Slot('CS 207','Monday','17:00',@rif);
select @rif;
/*End*/