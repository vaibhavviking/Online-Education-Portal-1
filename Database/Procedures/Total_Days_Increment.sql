/*Total Days Incrementer*/
delimiter //
create procedure Total_Days_Increment(
    in course varchar(7)
)
begin
update Courses_Student_Relation
set Courses_Student_Relation.Total_Days=Courses_Student_Relation.Total_Days+1
where Courses_Student_Relation.Course_Code=course;
end //
delimiter ;
/*Execute*/
call Total_Days_Increment();
/*End*/
