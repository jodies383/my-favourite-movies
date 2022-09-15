create table users(
	id serial not null primary key,
	username text not null,
	password text not null,
	first_name text not null,
    last_name text not null
);

create table playlists(
	id serial not null primary key,
	user_id int not null,
	playlist_name text not null,
    foreign key (user_id) references users(id) on delete cascade
);

create table playlist_titles(
	id serial not null primary key,
	playlist_id int not null,
	movie_id int not null,
	foreign key (playlist_id) references playlists(id) on delete cascade
);