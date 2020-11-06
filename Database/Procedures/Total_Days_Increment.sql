/*Total Days Incrementer*/
delimiter //
create procedure Total_Days_Increment()
begin
update Courses_Student_Relation as a
set a.Total_Days=a.Total_Days+1;
end //
delimiter ;
/*Execute*/
call Total_Days_Increment();
/*End*/