/* Get Professor Time Table */
delimiter //
create procedure Professor_Time_Table(
in empid int
)
begin
declare val1 varchar(7);
declare val2 varchar(7);
declare val3 varchar(7);
declare val4 varchar(7);
declare val5 varchar(7);
declare val6 varchar(7);
create temporary table temp
select a.Course_Code as Course, b.Day as Day, b.Time as Time 
from Courses_Professor_Relation as a join Courses_Time_Slots_Relation as b
on a.Course_Code=b.Course_Code
where a.Employee_ID=empid
order by b.Day, b.Time ASC;
create temporary table Time_Table(
Time varchar(5),
Monday varchar(7),
Tuesday varchar(7),
Wednesday varchar(7),
Thursday varchar(7),
Friday varchar(7),
Saturday varchar(7)
);
select Course into val1 from temp where temp.Day='Monday' and temp.Time='08:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='08:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='08:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='08:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='08:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='08:00';
insert into Time_Table values('08:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='09:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='09:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='09:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='09:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='09:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='09:00';
insert into Time_Table values('09:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='10:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='10:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='10:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='10:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='10:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='10:00';
insert into Time_Table values('10:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='11:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='11:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='11:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='11:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='11:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='11:00';
insert into Time_Table values('11:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='12:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='12:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='12:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='12:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='12:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='12:00';
insert into Time_Table values('12:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='13:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='13:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='13:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='13:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='13:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='13:00';
insert into Time_Table values('13:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='14:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='14:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='14:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='14:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='14:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='14:00';
insert into Time_Table values('14:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='15:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='15:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='15:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='15:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='15:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='15:00';
insert into Time_Table values('15:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='16:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='16:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='16:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='16:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='16:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='16:00';
insert into Time_Table values('16:00',val1,val2,val3,val4,val5,val6);
set val1= null;
set val2= null;
set val3= null;
set val4= null;
set val5= null;
set val6= null;
select Course into val1 from temp where temp.Day='Monday' and temp.Time='17:00';
select Course into val2 from temp where temp.Day='Tuesday' and temp.Time='17:00';
select Course into val3 from temp where temp.Day='Wednesday' and temp.Time='17:00';
select Course into val4 from temp where temp.Day='Thursday' and temp.Time='17:00';
select Course into val5 from temp where temp.Day='Friday' and temp.Time='17:00';
select Course into val6 from temp where temp.Day='Saturday' and temp.Time='17:00';
insert into Time_Table values('17:00',val1,val2,val3,val4,val5,val6);
select * from Time_Table;
drop table temp;
drop table Time_Table;
end //
delimiter ;
/*Execute*/
call Professor_Time_Table(1); /* Employee ID */
/*End*/