/*Retrieve Email*/
delimiter //
create procedure Retrieve_Email(
in u varchar(30),
out email varchar(100)
)
begin
declare t varchar(15);
select Type_ into t from Account where User_ID_=u;
case
	when t='Admin' then 
    select Email into email from Account inner join Admin_Account_Relation 
    on Account.User_ID_=Admin_Account_Relation.User_ID_ 
    where Account.User_ID_=u;
    
    when t='Student' then 
    select Email into email from Account inner join Student_Account_Relation 
    on Account.User_ID_=Student_Account_Relation.User_ID_ 
    where Account.User_ID_=u;
    
    when t='Professor' then 
    select Email into email from Account inner join Professor_Account_Relation 
    on Account.User_ID_=Professor_Account_Relation.User_ID_ 
    where Account.User_ID_=u;
    
    else set email='NOT FOUND';
end case;
end //
delimiter ;
/*Execute*/
call Retrieve_Email('P1',@email); /* User_ID */
select @email;                    /* Email */
/*End*/