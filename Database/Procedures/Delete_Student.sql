/*Delete Student*/
delimiter //
create procedure Delete_Student(
in rollno int
)
begin
delete Account, Student_Account_Relation 
from Student_Account_Relation inner join Account
on Student_Account_Relation.User_ID_=Account.User_ID_
where Student_Account_Relation.Roll_No=rollno;
delete from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno;
delete from Student where Student.Roll_No=rollno;
end //
delimiter ;
/*Execute*/
call Delete_Student(2);  /* Roll No. */
/*End*/