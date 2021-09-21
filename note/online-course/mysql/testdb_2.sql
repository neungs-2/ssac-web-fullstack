create view v_Emp AS
	select e.*, d.dname
	  from Emp e inner join Dept d on e.dept = d.id;

-- --- 서브쿼리 vs join -------
select *, (select count(*) from Emp where dept = d.id) empcnt from Dept d;

select d.*, count(*) as empcnt
  from Dept d inner join Emp e on d.id = e.dept   -- inner join 은 데이터가 없는 row는 출력이 되지 않음
  group by d.id;

select d.id, max(d.dname) dame, count(e.id) empcnt    -- group by 때문에 표준sql에 의해 max(d.dname) 사용
  from Emp e right outer join Dept d on e.dept = d.id -- count(*)는 join된 모든 row를 집계하므로 직원 수를 세려고 count(e.id) 
 group by d.id;
-- ------------------------------------------------

-- Try this
alter table Dept add column empcnt int not null default 0;
update Dept d set empcnt = (select count(*) from Emp where dept = d.id);

DELIMITER //
Create trigger Emp_AFTER_INSERT
AFTER insert
On Emp For each row
BEGIN
	update Dept set empcnt = empcnt + 1
     where id = New.dept;
END //
DELIMITER ;

insert into Emp(ename, dept, salary) values ('Test', 5, 300);
update Emp set dept=6 where id = 24;
delete from Emp where id=24;

select * from Dept;

-- @rownum

select s.*, (@rownum := @rownum +1) rownum
  from Emp s, (select @rownum := 0) rn;
  
-- function
select *, f_empcnt(id) empcnt2 from Dept;

-- procedure
call sp_emp_del(170, @empcnt);
select @empcnt;

-- Leave
select * from v_Emp where id between 1 and 7;
call sp_emp_range(5,1);

-- SQL by using String
call sp_count('Emp');
call sp_count('Dept');

-- Cursor
select * from Emp where id between -1 and 10;