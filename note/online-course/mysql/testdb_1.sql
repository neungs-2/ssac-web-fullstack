select current_user();

create table Dept2 like Dept;
create table Dept3 As select * from Dept;

create table Emp2 As select * from Emp;

drop table Dept2;
drop table Dept3;
drop table Emp2;

show variables like '%time_zone%';
select @@time_zone;

alter table Dept add column workdate timestamp not null default current_timestamp on update current_timestamp;

create table Test(
	id int unsigned not null auto_increment,
    ttt varchar(31) not null,
    primary key(id)
);

insert into Test(ttt, dept) values ('aa1', 3), ('aa2', 4), ('aa3', 5), ('aa4', 6), ('aa5', 7);
select * from Test;

update Test set dept = f_rand1('34567');

show create table Test;
delete from Test where id > 0;
truncate Test;

insert into Test(ttt, dept) values ('이모티콘🌝',4);

create table Student(
	id int unsigned not null auto_increment comment '학번',
    name varchar(32) not null comment '학생명',
    addr varchar(30) not null comment '주소',
    birth date not null comment '생년월일',
    tel varchar(15) comment '전화번호', 
    email varchar(31) comment '이메일',
    regdt timestamp not null default current_timestamp comment '등록일시' ,
    primary key(id)
);

insert into Student(name, addr, birth, tel, email) values ('폰 노이만', '뉴욕', 19030101,'011-234-5678','comfather@google.com');
insert into Student(name, addr, birth, tel, email) values ('존 메카시', '실리콘벨리', 19270101,'016-543-9876','AIfather@google.com');
insert into Student(name, addr, birth, tel, email) values ('제임스 고슬링', '테헤란벨리', 19550101,'018-012-9999','javafather@google.com');

set foreign_key_checks=0;
insert into Emp(ename, dept, salary) values ('김둘리', 10, 5000);
set foreign_key_checks=1;

-----------------------------------------------------------------------------
select e.*, d.dname
  from Dept d inner join Emp e on d.id = e.dept
 order by e.id;
 
select e.*, d.dname
  from Dept d left outer join Emp e on d.id != e.dept
 order by e.id;

select *
  from Emp
 where Emp.ename = '김종능';
 -----------------------------------------------------------------------------

-- outer join 예제

desc Emp;
select * from Dept;
-- alter table Dept add column captain int;
-- alter table Dept modify column captain int unsigned;

update Dept d
   set captain = (select id from Emp where dept = d.id order by rand() limit 1);

select *, (select dept from Emp where id=d.captain) as eee from Dept d;
-- update Dept set captain = null 
where id = 6;

select *
  from Dept d left outer join Emp e on d.captain = e.id;
  
select *
  from Dept d right outer join Emp e on d.captain = e.id;
  
-----------------------------------------------------------------------

