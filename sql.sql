use hoa

create table users(
    id_user int identity(1,1) primary key,
    user_name nvarchar (23),
    user_password nvarchar(22)
)

insert into users (user_name, user_password) values ('Miguel', 'hello')