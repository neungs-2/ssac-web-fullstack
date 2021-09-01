# MySQL-SQL 한방에 정리하기 Part2 - DML,T CL

<br>

## DML (Data Manipulation Language)

> insert, select, update, delete

<br>

```sql
#insert
insert into <table> (col1, col2, ..) values(val1, val2, ..);
insert into <table>  set col1=val1, col2=val2;
--cf. insert into <table> values (a,b), (c,d), (e,f)...;
insert into Test(name) select name from Student where id < 10;
insert ignore into Test(id, name) values(5, 'aaa');

#select
select * from <table> where ...

#update
update <table> set col1 = val1 where ...
update Dept set dname = '서버팀' where id =6;

#delete
delete from <table>
```

<br>

### 기타 구문

- like, in, between
- distinct, count(distinct col1)
- order by, rand()
  - order by col1 is null ASC, col1 ASC
  - order by rand() --> 무작위 정렬
- limit a, limit a, b
  - a 부터 b개를 반환
- group by, having
- case when ~ else ~ end
- on duplicate key update ...
  - unique index 를 걸어서 같은 값을 업로드 못할 때 새로운 값으로 업데이트 시킴
  - 아래는 서버팀이 이미 존재할 때 서버팀 -> 서버팀2 로 업데이트
  - `insert into Dept(pid, dname) values(2, '서버팀') on duplicate key update dname='서버팀2';`

<br>

---

## TCL (Transaction Control Language)

> begin transaction, commit, rollback, savepoint

<br>

---

## Note.

- 쿼리문 실행 순서
- FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY
- Select 절에서 정의한 Alias는 이후 절에서도 사용 가능.
