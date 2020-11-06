/*Update Course*/
delimiter //
create procedure Update_Courses(
in cid varchar(7),
in name varchar(50),
in link varchar(200),
in credit varchar(5)
)
begin
update Courses set Course_Name=name, Class_Link=link, Credits=credit where Courses.Course_Code=cid;
end //
delimiter ;
/*Execute*/
call Update_Courses('CS 207', 'DBMS', 'Mahismati.com', '4-0-0'); /*Course Code, Course Name, Class Link, Credits */
/*End*/