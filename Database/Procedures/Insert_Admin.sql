/*Insert Admin*/
delimiter //
create procedure Insert_Admin(
in Admin_ID int,
in User_ID_ varchar(30),
in Password_ varchar(100),
in email varchar(100),
out duplicate_key int
)
begin
declare exit handler for 1062
    begin
 	set duplicate_key=1;
    end;
insert into Administration values(Admin_ID, email);
insert into Account values(User_ID_,Password_,'Admin');
insert into Admin_Account_Relation values(Admin_ID,User_ID_);
end //
delimiter ;
/*Execute*/ 
call Insert_Admin (  200,'A2' ,'b', 'Admin2@iiti.ac.in', @duplicate_key);  /*Enter Admin_ID, User_ID, Password, Email */
select @duplicate_key;
/*End*/

