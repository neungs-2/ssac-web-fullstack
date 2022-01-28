# MySQL-SQL 한방에 정리하기 Part2 - DML,TCL

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

- group by ~ having
  - from절 subquery에서 사용한 alias는 본문에서도 사용됨
  - group by에서는 상단에서 (select ~) 사용한 alias를 적용 가능 
    - 상단의 sql문이 group by의 서브 쿼리처럼 동작
- column name = alias라면 같은 column이 두개 생성되므로 alias를 유니크하게 지어라.

- case when ~ else ~ end
- on duplicate key update ...
  - unique index 를 걸어서 같은 값을 업로드 못할 때 새로운 값으로 업데이트 시킴
  - 아래는 서버팀이 이미 존재할 때 서버팀 -> 서버팀2 로 업데이트
  - `insert into Dept(pid, dname) values(2, '서버팀') on duplicate key update dname='서버팀2';`
  - 실제 동작이 insert 실행(오류), 삭제, 새로운 값으로 업데이트
    - 따라서 id(index)가 건너뛰어진 것 처럼 보임

<br><br>

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
  - Table Create 등의 **DDL에는 Rollback 적용 안됨!**

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

<br><br>

---

## Join

- MySQL에서 full (outer join) 예약어는 먹히지 않음

<br>

### Inner Join

```sql
#과목별 담당 교수명
select s.*, p.name as 'prof. name'
  from Subject s inner join Prof p on s.prof = p.id;

#과목별 학생수
select e.subject, max(s.name) as 'subject name', count(*) as '학생수'
  from Enroll e inner join Subject s on e.subject = s.id
 group by e.subject;

#역사 과목의 학생 목록
select s.name, s.birth
  from Enroll e inner join Student s on e.student = s.id
                inner join Subject sbj on e.subject = sbj.id
 where sbj.name = '역사';

#특정과목(국어)과목을 듣는 서울 거주 학생 목록 (과목명, 학번, 학생명)
select sbj.name, s.id, s.name
  from Enroll e inner join Student s on e.student = s.id
                inner join Subject sbj on e.subject = sbj.id
 where sbj.name = '국어' and s.addr = '서울';

#역사 과목을 수강중인 지역별 학생수 (지역, 학생수)
select substring(s.addr,1,2) as a, count(*) as student_cnt
  from Enroll e inner join Student s on e.student = s.id
                inner join Subject sbj on e.subject = sbj.id
 where sbj.name = '역사' group by a;
```

<br>

### Outer Join

- left, right 기준에 따라 조건(where)에 해당하는 기준 테이블 값은 모두 반환
- 기준 테이블 이외의 테이블 값은 없으면 null

```sql
# 결과 튜플이 Dept의 레코드 개수만큼 반환
select *
  from Dept d left outer join Emp e on d.captain = e.id;

# 결과 튜플이 Emp의 레코드 개수만큼 반환
select *
  from Dept d right outer join Emp e on d.captain = e.id;
```

<br>

#### Tip.

- 쿼리 성능을 위해서 outer join은 무조건 뒤로 빼주는 것이 좋음
- inner join 연산들 사이에 위치하면 성능 낮아짐
- 서브쿼리보다 inner join 성능이 우수
- join 하는 테이블(데이터)에 데이터가 없을 경우
  - inner join 사용 시 기준이 되는 테이블의 행이 표시되지 않음
  - 데이터가 없을 경우 0으로 표시하고 싶다면 outer join을 사용

<br>

### Full Outer Join

- mysql에는 Full Outer Join이 없음
- Left Outer Join과 Right Outer Join의 **Union**으로 구현

```sql
select * from Dept d left outer join Emp e on d.captain = e.id
Union
select * from Dept d right outer join Emp e on d.captain = e.id;
```

<br>

### Cross Join

- CROSS JOIN = 상호 조인
- 한 쪽 테이블의 모든 행들과 다른 테이블의 모든 행을 조인
- 결과 개수는 두 테이블의 행의 개수를 곱한 개수

```sql
select *
  from Dept cross join Emp;

-- from에서의 , 는 cross join과 같음
select * from Dept, Emp;
```

<br><br>

---

## Note.

- 쿼리문 실행 순서
- FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY
- Select 절에서 정의한 Alias는 이후 절에서도 사용 가능.
- OR Mapping(ORM) 때문에 Join 사용 빈도수가 많지 않을 것.
- `select 그냥, from 2칸 공백, where 1칸 공백`으로 하면 보기 좋음
- MySQL에서 full outer join 명령어는 먹히지 않음
- 관계형 DB 용어
  - table = relation
  - row = tuple = record
  - column = attribute = field

<br>

- foreign key ON/OFF

```sql
set foreign_key_checks=0; -- OFF
set foreign_key_checks=1; -- ON
```

- table 구조 보기

```sql
desc <table-name>; -- descend 아니고 "describe" 약어.
```
