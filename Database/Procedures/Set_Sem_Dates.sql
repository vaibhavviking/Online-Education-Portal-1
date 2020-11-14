/*Set Sem Dates*/
delimiter //
create procedure Set_Sem_Dates(
in sd date,
in ed date,
out inv int
)
begin
case when date(sd)>=date(ed) then set inv=1;
else 
delete from Sem_Dates;
insert into Sem_Dates values(sd,ed);
end case;  
end //
delimiter ;
/*Execute*/
call Set_Sem_Dates('2020-08-15','2020-12-05',@inv); /* Starting Date, Ending Date */
select @inv;
/*End*/