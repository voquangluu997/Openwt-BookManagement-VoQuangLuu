create table role(
	id serial not null primary key,
	name varchar(255) not null
);

insert into role (name) values ('ADMIN'),('USER');
