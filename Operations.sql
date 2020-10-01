use demo;
set sql_safe_updates=0;

/*Insert Admin*/
delimiter //
create procedure Insert_Admin(
in Admin_ID int,
in User_ID_ varchar(30),
in Password_ varchar(30)
)
begin
insert into Administration values(Admin_ID);
insert into Account values(User_ID_,Password_,'Admin');
insert into Admin_Account_Relation values(Admin_ID,User_ID_);
begin catch
print 'Admin_ID or User_ID already exists...'
end catch
end //
delimiter ;
/*Execute*/ 
Call Insert_Admin (  400,'F' ,'f' );
/*End*/

/*Delete Admin*/
delimiter //
create procedure Delete_Admin(
in x int
)
begin
delete Admin_Account_Relation, Account  
from Account inner join Admin_Account_Relation 
on Account.User_ID_=Admin_Account_Relation.User_ID_
where Admin_Account_Relation.Admin_ID=x;
delete from Administration where Administration.Admin_ID=x;
end //
delimiter ;
/*Execute*/
call Delete_Admin(400);
/*End*/

/*Retrieve ID*/
delimiter //
create procedure Retrieve_ID(
in u varchar(30),
in p varchar(30),
out account_id varchar(15)
)
begin
declare t varchar(15);
select Type_ into t from Account where User_ID_=u and Password_=p;
case
	when t='Admin' then 
    select Admin_ID into account_id from Account inner join Admin_Account_Relation 
    on Account.User_ID_=Admin_Account_Relation.User_ID_ 
    where Account.User_ID_=u and Account.Password_=p;
    when t='Student' then 
    select Roll_No into account_id from Account inner join Student_Account_Relation 
    on Account.User_ID_=Student_Account_Relation.User_ID_ 
    where Account.User_ID_=u and Account.Password_=p;
    when t='Professor' then 
    select Employee_ID into account_id from Account inner join Professor_Account_Relation 
    on Account.User_ID_=Professor_Account_Relation.User_ID_ 
    where Account.User_ID_=u and Account.Password_=p;
end case;
end //
delimiter ;
/*Execute*/
call Retrieve_ID('G','g',@ID);
select @ID;
/*End*/
