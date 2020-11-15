/* Student checking attendance */
delimiter //
create procedure Attendance_In_Student(
in rollno int,
in cid varchar(7)
)
begin
declare sd date;
declare ed date;
declare temp date;
declare val1 int;
declare val2 int;
declare waste int;

create temporary table Attended_By_Students as
select Attendance_Marked.Date, count(Attendance_Marked.Time) as No_Of_Classes
from Attendance_Marked  
where Attendance_Marked.Roll_No=rollno and Attendance_Marked.CID=cid 
group by Attendance_Marked.Date;

create temporary table Classes_For_A_Course_In_A_Week as
select Courses_Time_Slots_Relation.Day, count(Courses_Time_Slots_Relation.Time) as No_Of_Classes
from Courses_Time_Slots_Relation 
where Courses_Time_Slots_Relation.Course_Code=cid 
group by Courses_Time_Slots_Relation.Day;
case
	when 'Monday' not in (select Classes_For_A_Course_In_A_Week.Day from Classes_For_A_Course_In_A_Week) then
		insert into Classes_For_A_Course_In_A_Week values('Monday',0);
	else
		set waste=1;
end case; 
case
	when 'Tuesday' not in (select Classes_For_A_Course_In_A_Week.Day from Classes_For_A_Course_In_A_Week) then
		insert into Classes_For_A_Course_In_A_Week values('Tuesday',0);
	else
		set waste=1;
end case; 
case
	when 'Wednesday' not in (select Classes_For_A_Course_In_A_Week.Day from Classes_For_A_Course_In_A_Week) then
		insert into Classes_For_A_Course_In_A_Week values('Wednesday',0);
	else
		set waste=1;
end case; 
case
	when 'Thursday' not in (select Classes_For_A_Course_In_A_Week.Day from Classes_For_A_Course_In_A_Week) then
		insert into Classes_For_A_Course_In_A_Week values('Thursday',0);
	else
		set waste=1;
end case; 
case
	when 'Friday' not in (select Classes_For_A_Course_In_A_Week.Day from Classes_For_A_Course_In_A_Week) then
		insert into Classes_For_A_Course_In_A_Week values('Friday',0);
	else
		set waste=1;
end case; 
case
	when 'Saturday' not in (select Classes_For_A_Course_In_A_Week.Day from Classes_For_A_Course_In_A_Week) then
		insert into Classes_For_A_Course_In_A_Week values('Saturday',0);
	else
		set waste=1;
end case; 
case
	when 'Sunday' not in (select Classes_For_A_Course_In_A_Week.Day from Classes_For_A_Course_In_A_Week) then
		insert into Classes_For_A_Course_In_A_Week values('Sunday',0);
	else
		set waste=1;
end case;        

select Sem_Dates.Starting_Date into sd from Sem_Dates;
select Sem_Dates.Ending_Date into ed from Sem_Dates;

create temporary table Classes_For_A_Course(
Date date,
Status int,
primary key(Date)
);

set temp=sd;
while temp<=ed do
	select Classes_For_A_Course_In_A_Week.No_Of_Classes into val1 from Classes_For_A_Course_In_A_Week where Classes_For_A_Course_In_A_Week.Day=dayname(temp);
    case
		when val1!=0 then
			case
				when temp not in (select Attended_By_Students.Date from Attended_By_Students) then 
					insert into Classes_For_A_Course values(temp, 0);
				else 
					select Attended_By_Students.No_Of_Classes into val2 from Attended_By_Students where Attended_By_Students.Date=temp;
					case
						when val2<val1 then 
							insert into Classes_For_A_Course values(temp, 1);
						else
							insert into Classes_For_A_Course values(temp, 2);
                    end case;
			end case;
		else 
			set waste=1;
	end case;
    set temp=DATE_ADD(temp, INTERVAL 1 DAY);
    set val1=-1;
    set val2=-1;
end while;    
select * from Classes_For_A_Course;
drop table Attended_By_Students;
drop table Classes_For_A_Course_In_A_Week;
drop table Classes_For_A_Course;
end //
delimiter ;
/*Execute*/
call Attendance_In_Student(1,'CS 207');  /* Roll No, Course Code */
/*End*/
