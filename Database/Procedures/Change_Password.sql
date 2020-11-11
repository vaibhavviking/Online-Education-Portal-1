/*Change Password*/
delimiter //
create procedure Change_Password(
in userid varchar(30),
in old_p varchar(100),
in new_p varchar(100),
out matched int
)
begin
declare p varchar(30);
select Account.Password_ into p from Account where User_ID_=userid;
case
	when p=old_p then set matched=1;
    else set matched=0;
end case;
update Account set Password_=new_p where Account.User_ID_=userid and Account.Password_=old_p;
end //
delimiter ;
/*Execute*/
call Change_Password('A2','b1','b',@m); /* User_ID, Current Password, New Password */
select @m;
/*End*/
