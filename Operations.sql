use demo;
set sql_safe_updates=0;

/*Insert Admin*/
delimiter //
create procedure Insert_Admin(
in Admin_ID int,
in User_ID_ varchar(30),
in Password_ varchar(30),
out duplicate_key int
)
begin
declare exit handler for 1062
    begin
 	set duplicate_key=1;
    end;
insert into Administration values(Admin_ID);
insert into Account values(User_ID_,Password_,'Admin');
insert into Admin_Account_Relation values(Admin_ID,User_ID_);
end //
delimiter ;
/*Execute*/ 
call Insert_Admin (  600,'H' ,'f', @duplicate_key);  /*Enter Admin_ID, User_ID, Password */
select @duplicate_key;
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
call Delete_Admin(1000); /* Admin_ID */
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
    
    else set account_id=-1;
end case;
end //
delimiter ;
/*Execute*/
call Retrieve_ID('G','g',@ID); /* User_ID, Password */
select @ID;
/*End*/
