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

create temporary table Attended_By_Students
select a.Date, count(a.Time) as No_Of_Classes
from Attendance_Marked as a 
where a.Roll_No=rollno and a.CID=cid 
group by a.Date;

create temporary table Classes_For_A_Course_In_A_Week
select b.Day, count(b.Time) as No_Of_Classes
from Courses_Time_Slots_Relation as b 
where b.Course_Code=cid 
group by b.Day;

select a.Starting_Date into sd from Sem_Dates as a;
select a.Ending_Date into ed from Sem_Dates as a;

create temporary table Classes_For_A_Course(
Date date,
Status int,
primary key(Date)
);

set temp=date(sd);
while temp<=date(ed) do
	select b.No_Of_Classes into val1 from Classes_For_A_Course_In_A_Week as b where b.Day=dayname(temp);
    case
		when val1>0 then
			select a.No_Of_Classes into val2 from Attended_By_Students where date(a.Date)=temp;
			case
				when val2=0 then
					insert into Classes_For_A_Course values(temp, 0);
				when val2<val1 then
					insert into Classes_For_A_Course values(temp, 1);
				when val2=val1 then
					insert into Classes_For_A_Course values(temp, 2);
				else
					set waste=1;
			end case;
		else 
			set waste=1;
	end case;
    set temp=temp+1;
end while;    
end //
delimiter ;
/*Execute*/
call Attendance_In_Student(1,'CS 207');  /* Roll No, Course Code */
/*End*/