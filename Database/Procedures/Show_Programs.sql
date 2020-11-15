/*Show Programs*/
delimiter //
create procedure Show_Programs()
begin
select Programs.Prog_Name, Programs.Description, Program_Wise_Students.No_Of_Students from 
Programs inner join Program_Wise_Students
on Programs.Prog_Name=Program_Wise_Students.program;
end //
delimiter ;
/*Execute*/
call Show_Programs();
/*End*/
