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
  - 실제 동작이 insert 실행(오류), 삭제, 새로운 값으로 업데이트
    - 따라서 id(index)가 건너뛰어진 것 처럼 보임

<br>

---

## TCL (Transaction Control Language)

> begin transaction, commit, rollback, savepoint

- Transaction
  - DML이 모인 하나의 작업 단위
  - 하나의 세션에는 여러 트렌젝션 존재
  - Session 단위로 제어

<br>

- Session
  - 어떤 활동을 위한 시간, 기간
  - DB에서 접속 ~ 접속 종료까지의 기간

<br>

- Commit & Rollback
  - 작업 중 실수로 데이터 손실을 발생시키지 않기 위해 사용
  - Table Create 등의 DDL에는 Rollback 적용 안됨!

<br>

```sql
-- AutoCommit 확인하기
show variables like '%commit%';
select @@autocommit;

-- Transaction
START TRANSACTION; -- >> Set Autocommit = FALSE;
명령문
COMMIT; (or ROLLBACK;)

-- SavePoint
SavePoint x;
명령문
rollback to savepoint x;
COMMIT;  또는  ROLLBACK;
```

<br>

---

## Note.

- 쿼리문 실행 순서
- FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY
- Select 절에서 정의한 Alias는 이후 절에서도 사용 가능.
- OR Mapping(ORM) 때문에 Join 사용 빈도수가 많지 않을 것.
- `select 그냥, from 2칸 공백, where 1칸 공백`으로 하면 보기 좋음
