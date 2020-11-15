/*Delete Student*/
delimiter //
create procedure Delete_Student(
in rollno int
)
begin
declare p varchar(10);
update Course_Wise_Members set No_Of_Students=No_Of_Students-1 where Course_Wise_Members.CID in
(select Courses_Student_Relation.Course_Code from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno);
select Student.Program_Enrolled into p from Student where Student.Roll_No=rollno;
delete Account, Student_Account_Relation 
from Student_Account_Relation inner join Account
on Student_Account_Relation.User_ID_=Account.User_ID_
where Student_Account_Relation.Roll_No=rollno;
delete from Courses_Student_Relation where Courses_Student_Relation.Roll_No=rollno;
delete from Student where Student.Roll_No=rollno;
update Program_Wise_Students set No_Of_Students=No_Of_Students-1 where Program_Wise_Students.program=p;
end //
delimiter ;
/*Execute*/
call Delete_Student(2);  /* Roll No. */
/*End*/
drop procedure Delete_Student;