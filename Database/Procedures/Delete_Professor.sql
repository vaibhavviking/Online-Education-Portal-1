/*Delete Professor*/
delimiter //
create procedure Delete_Professor(
in empid int
)
begin
delete Account, Professor_Account_Relation
from Professor_Account_Relation inner join Account
on Professor_Account_Relation.User_ID_=Account.User_ID_
where Professor_Account_Relation.Employee_ID=empid;
delete from Courses_Professor_Relation where Courses_Professor_Relation.Employee_ID=empid;
delete from Professor where Professor.Employee_ID=empid;
end //
delimiter ;
/*Execute*/
call Delete_Professor(10);  /* Employee ID */
/*End*/