/*Delete Session*/
delimiter //
create procedure Delete_Session(
in userid varchar(30)
)
begin
delete from current_session where current_session.User_ID_=userid;
end //
delimiter ;
/*Execute*/
call Delete_Session('1'); /*User_ID*/
/*End*/
drop procedure Delete_Session;