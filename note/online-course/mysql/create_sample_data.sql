create table Dept(
	id tinyint unsigned not null auto_increment,
    pid tinyint unsigned not null default 0 comment '상위부서id',
    dname varchar(31) not null,
    primary key(id)
);

create table Emp(
	id int unsigned not null auto_increment,
    ename varchar(31) not null,
    dept tinyint unsigned not null,
    salary int not null default 0,
    primary key(id),
    foreign key(dept) references Dept(id)
);

insert into Dept(pid, dname) values (0, '영업부'), (0, '개발부');

insert into Dept(pid, dname) values (1, '영업1팀'), (1, '영업2팀'), (1, '영업3팀'), (2, '서버팀'), (2, '클라이언트팀');

select d1.dname as '상위부서', d2.*
from Dept d1 inner join Dept d2 on d1.id = d2.pid;

select * from Emp;

select CEIL(rand() *10);
select length('한들abc');

select f_rand1('김이박');
select f_randname();

insert into Emp(ename, dept, salary) values ( f_randname(), f_rand1('34567'), f_rand1('123456789') * 100 );

call sp_test_emp(250);

select * from Emp;
select dept, count(*) from Emp group by dept;