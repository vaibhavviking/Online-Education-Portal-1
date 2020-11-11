/*Retrieve ID*/
delimiter //
create procedure Retrieve_ID(
in u varchar(30),
in p varchar(30),
out account_id varchar(15),
out t varchar(15)
)
begin
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
call Retrieve_ID('P1','a',@ID,@t); /* User_ID, Password */
select @ID;                        /* Duplicate User ID Check */
select @t;                         /*Type*/
/*End*/