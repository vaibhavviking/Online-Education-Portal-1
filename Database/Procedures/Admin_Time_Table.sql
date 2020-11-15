/* Admin Time Table */
delimiter //
create procedure Admin_Time_Table(
in cid varchar(7)
)
begin

declare sd date;
declare ed date;
declare temp date;
declare val1 int;
declare waste int;

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
No_Of_Classes int,
primary key(Date)
);

set temp=sd;
while temp<=ed do
	select Classes_For_A_Course_In_A_Week.No_Of_Classes into val1 from Classes_For_A_Course_In_A_Week where Classes_For_A_Course_In_A_Week.Day=dayname(temp);
	case 
		when val1=0 then
			insert into Classes_For_A_Course values(temp, 0);
		when val1=1 then
			insert into Classes_For_A_Course values(temp, 1);
		when val1>1 then
			insert into Classes_For_A_Course values(temp, 2);
		else
			set waste=1;
    end case;
    set temp=DATE_ADD(temp, INTERVAL 1 DAY);
    set val1=-1;
end while;
select * from Classes_For_A_Course;
drop table Classes_For_A_Course_In_A_Week;
drop table Classes_For_A_Course;
end //
delimiter ;
/* Execute */
call Admin_Time_Table('CS 207');  /*Course Code */
/*End*/