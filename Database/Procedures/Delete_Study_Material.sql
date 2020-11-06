/*Delete Study Material */
delimiter //
create procedure Delete_Study_Material(
in id int
)
begin
delete from Study_Material where Study_Material.Material_No=id;
end //
delimiter ;
/*Execute*/
call Delete_Study_Material(1); /* Material No. */
/*End*/