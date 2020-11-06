/*Insert TimeSlot*/
delimiter //
create procedure Insert_Time_Slot(
in day varchar(20),
in time varchar(5),
out did int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
insert into Time_Slots values(day,time);
end //
delimiter ;
/*Execute*/
call Insert_Time_Slot('Monday','17:00',@did); /* Day, Time */
select @did;                                  /* Time Slot already exists */
/* End */