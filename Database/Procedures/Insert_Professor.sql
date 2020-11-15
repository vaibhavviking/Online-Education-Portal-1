/*Insert Professor*/
delimiter //
create procedure Insert_Professor(
in empid int,
in name varchar(40),
in dob date,
in gender varchar(1),
in post_ varchar(30),
in deptid int,
in email varchar(100),
in userid varchar(30),
in password varchar(100),
out did int,
out rif int,
out inv int
)
a:begin
declare val int;
declare exit handler for 1062
begin
set did=1;
end;
declare exit handler for 1452
begin
set rif=1;
end;
case
	-- when name not regexp '^[A-Za-z]+$' then set inv=1;
    when gender not regexp '[MF]' then set inv=2;
    else set inv=0;
end case;
case when inv!=0 then leave a;
else
insert into Professor values(empid, name, post_, dob, gender, deptid, email);
insert into Account values(userid, password, 'Professor');
insert into Professor_Account_Relation values(empid, userid);
select Post_Wise_Employees.No_Of_Employees into val from Post_Wise_Employees where Post_Wise_Employees.post=post_;
set val=val+1;
update Post_Wise_Employees set No_Of_Employees=val where Post_Wise_Employees.post=post_;
end case;
end //
delimiter ;
/*Execute*/
call Insert_Professor(4,'studious','2020-11-02','M','Assistant Professor',1,'P48@gmail.com','P4','a5c1f56f8b914e6da0f86af7b0612186',@did,@rif,@inv); /*Emp ID, Name, DOB, Gender, Post, Dept ID, Email, User ID, Password*/
select @did;                                                                 /* Duplicate ID (atleast one of Username and Employee ID ) */
select @rif;                                                                 /* Referential Integrity failure (Dept DNE) */
select @inv;
/*End*/

