/* Unassign Time Slot*/
delimiter //
create procedure Unassign_Time_Slot(
in code varchar(7),
in day varchar(20),
in t varchar(5)
)
begin
delete from Courses_Time_Slots_Relation where Courses_Time_Slots_Relation.Course_Code=code and Courses_Time_Slots_Relation.Day=day 
and Courses_Time_Slots_Relation.Time=t; 
end //
delimiter ;
/*Execute*/
call Unassign_Time_Slot('CS 207','Monday','17:00');
/*End*/