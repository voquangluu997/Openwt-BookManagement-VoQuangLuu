create table user(
	id serial not null primary key,
	email varchar(255) not null,
	password varchar(255) not null,
	first_name varchar(255),
	last_name varchar(255),
	enabled boolean not null,
	avatar varchar(255),
);
