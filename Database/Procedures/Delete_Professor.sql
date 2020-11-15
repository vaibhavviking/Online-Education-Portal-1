/*Delete Professor*/
delimiter //
create procedure Delete_Professor(
in empid int
)
begin
declare p varchar(30);
update Course_Wise_Members set No_Of_Professors=No_Of_Professors-1 where Course_Wise_Members.CID in
(select Courses_Professor_Relation.Course_Code from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid); 
select Professor.Post into p from Professor where Professor.Employee_ID=empid;
delete Account, Professor_Account_Relation
from Professor_Account_Relation inner join Account
on Professor_Account_Relation.User_ID_=Account.User_ID_
where Professor_Account_Relation.Employee_ID=empid;
delete from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid;
delete from Professor where Professor.Employee_ID=empid;
update Post_Wise_Employees set No_Of_Employees=No_Of_Employees-1 where Post_Wise_Employees.post=p;
end //
delimiter ;
/*Execute*/
call Delete_Professor(10);  /* Employee ID */
/*End*/
drop procedure Delete_Professor;
