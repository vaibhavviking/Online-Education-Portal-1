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
    select Email into email from Administration inner join Admin_Account_Relation 
    on Administration.Admin_ID=Admin_Account_Relation.Admin_ID 
    where Admin_Account_Relation.User_ID_=u;
    
    when t='Student' then 
    select Email into email from Student inner join Student_Account_Relation 
    on Student.Roll_No=Student_Account_Relation.Roll_No 
    where Student_Account_Relation.User_ID_=u;
    
    when t='Professor' then 
    select Email into email from Professor inner join Professor_Account_Relation 
    on Professor.Employee_ID=Professor_Account_Relation.Employee_ID 
    where Professor_Account_Relation.User_ID_=u;
    
    else set email='NOT FOUND';
end case;
end //
delimiter ;
/*Execute*/
call Retrieve_Email('P1',@email); /* User_ID */
select @email;                    /* Email */
/*End*/
