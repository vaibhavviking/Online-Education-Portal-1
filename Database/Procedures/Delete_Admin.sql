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