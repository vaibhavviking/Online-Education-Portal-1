/*Insert Session*/
delimiter //
create procedure Insert_Session(
in SID varchar(50),
in userid varchar(30),
out rif int
)
begin
declare exit handler for 1062
begin
delete from current_session where current_session.User_ID_=userid;
insert into current_session values(SID, userid);
end;
declare exit handler for 1452
begin 
set rif=1;
end;
insert into current_session values(SID, userid);
end //
delimiter ;
/*Execute*/
call Insert_Session('123','A1',@rif); /*Session_ID, User_ID*/
select @rif;
/*End*/
