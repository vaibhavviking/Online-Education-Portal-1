/*Insert Professor*/
delimiter //
create procedure Insert_Professor(
in empid int,
in name varchar(40),
in post varchar(30),
in deptid int,
in userid varchar(30),
in password varchar(100),
out did int,
out rif int
)
begin
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
insert into Professor values(empid, name, post, deptid);
insert into Account values(userid, password, 'Professor');
insert into Professor_Account_Relation values(empid, userid);
end //
delimiter ;
/*Execute*/
call Insert_Professor(30,'XW','Professor',3,'P3','c',@did,@rif); /*Emp ID, Name, Post, Dept ID, User ID, Password*/
select @did;                                                                 /* Duplicate ID (atleast one of Username and Employee ID ) */
select @rif;                                                                 /* Referential Integrity failure (Dept DNE) */
/*End*/
