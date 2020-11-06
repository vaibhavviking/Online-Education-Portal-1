/*Update Department*/
delimiter //
create procedure Update_Department(
in deptid int,
in dname varchar(40)
)
begin
update Department set D_Name=dname where Dept_ID=deptid;
end //
delimiter ;
/*Execute*/
call Update_Department(1, 'AI');  /*Dept_Id, New Dept Name*/
/*End*/