 create temporary table Attended_By_Students as
 select Attendance_Marked.Date, count(Attendance_Marked.Time) as No_Of_Classes
 from Attendance_Marked  
 where Attendance_Marked.Roll_No=1 and Attendance_Marked.CID='CS 207' 
 group by Attendance_Marked.Date;
 select * from Attended_By_Students;
create temporary table Classes_For_A_Course_In_A_Week as
 select Courses_Time_Slots_Relation.Day, count(Courses_Time_Slots_Relation.Time) as No_Of_Classes
 from Courses_Time_Slots_Relation 
 where Courses_Time_Slots_Relation.Course_Code='CS 207'
 group by Courses_Time_Slots_Relation.Day;

 select * from Classes_For_A_Course_In_A_Week;

 select Sem_Dates.Starting_Date from Sem_Dates;
select Sem_Dates.Ending_Date from Sem_Dates;
 -- create temporary table Classes_For_A_Course(
--  Date date,
--  Status int,
--  primary key(Date)
-- );

select Classes_For_A_Course_In_A_Week.No_Of_Classes from Classes_For_A_Course_In_A_Week where Classes_For_A_Course_In_A_Week.Day=dayname(select Sem_Dates.Starting_Date from Sem_Dates);
