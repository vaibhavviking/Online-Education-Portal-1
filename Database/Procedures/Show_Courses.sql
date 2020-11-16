/* Show all Courses */
delimiter //
create procedure Show_Courses()
begin
select Courses.Course_Code, Courses.Course_Name, Courses.Credits, Course_Wise_Members.No_Of_Students, Course_Wise_Members.No_Of_Professors
from Courses inner join Course_Wise_Members
on Courses.Course_Code=Course_Wise_Members.CID;
end //
delimiter ;
/*Execute*/
call Show_Courses();
/*End*/

