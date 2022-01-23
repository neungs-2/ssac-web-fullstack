# MySQL-SQL 한방에 정리하기 Part3 - View, Trigger, Function, Procedure

<br>

## DML (Data Manipulation Language)

### View

- 사용하기 편하게, 쉽게 만드는 가상 테이블
- 저장공간이 따로 없고 텍스트로 저장

```sql
# 뷰 생성
CREATE VIEW <view-name> AS
    SELECT …  ;

create view v_Emp AS
	select e.*, d.dname
	  from Emp e inner join Dept d on e.dept = d.id;

# 뷰 조회
SELECT * FROM <view-name>;

# 뷰 갱신
UPDATE <view-name> SET …;

# 뷰 정보 조회
select *
  from information_schema.views
 where table_schema='<Database-name>';
```

<br>

- 장점

  - 특정 사용자에게 필요한 필드만 제공 (Security)
  - 쿼리 단순화 (Simplicity)
  - 재사용 가능
  - 성능 향상 (Performance)
    - Mysql은 예외지만 일반적 DB는 쿼리를 미리 컴파일하기 때문

- 단점
  - 독립적 인덱스를 가질 수 없음
  - 뷰의 정의 변경 불가능
  - 삽입, 삭제, 갱신 (DML)에 제약 존재

<br><br>

---

## Trigger

<br>

```sql
DELIMITER //
Create Trigger <trigger-name>
{ BEFORE | AFTER } { INSERT | UPDATE | DELETE } -- 1
{ PRECEDES | FOLLOWS } other-trigger-name -- 2
On <table-name> FOR EACH ROW
BEGIN
    … OLD.<col>  … NEW.<col>; -- 3
END //
DELIMITER ;
```

- 1 : 어떤 이벤트 앞/뒤에 실행할지
- 2 : other-trigger 가 실행되기 전/후에 트리거 실행
- 3 : OLD 변경 이전 값, NEW 변경 이후 값

<br>

### Try This

```sql
# empcnt 나오게 쿼리 작성

-- 서브쿼리 사용
select *, (select count(*) from Emp where dept = d.id) empcnt
  from Dept d;

-- inner join 사용 (데이터 null 값 때문에 사용 못함)
select d.*, count(*) as empcnt
  from Dept d inner join Emp e on d.id = e.dept   -- inner join 은 데이터가 없는 row는 출력이 되지 않음
  group by d.id;

-- outer join 사용
select d.id, max(d.dname) dame, count(e.id) empcnt    -- group by 때문에 표준sql에 의해 max(d.dname) 사용
  from Emp e right outer join Dept d on e.dept = d.id -- count(*)는 join된 모든 row를 집계하므로 직원 수를 세려고 count(e.id)
 group by d.id;


 -- Trigger 생성
DELIMITER //
Create trigger Emp_AFTER_INSERT
AFTER insert On Emp For each row
BEGIN
	update Dept set empcnt = empcnt + 1
     where id = New.dept;
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER Emp_AFTER_UPDATE
AFTER UPDATE ON Emp FOR EACH ROW
BEGIN
	IF OLD.dept != NEW.dept THEN    -- 불필요하게 트리거 실행하지 않도록 조건 추가
		update Dept set empcnt = empcnt - 1
		 where id = Old.dept;

		update Dept set empcnt = empcnt + 1
		 where id = New.dept;
	END IF;
END //
DELIMITER ;
```

<br>

---

## Union (All)

<br>

- Union : 중복 값 제거하고 두 쿼리 결과 합치기
- Union all : 중복 제거 없이 두 쿼리 결과 합치기

<br>

---

## Variables

<br>

- View, function 등 변수에 값 할당해서 사용 가능

```sql
-- 변수 선언
DECLARE <var-name> <type> [default ..];
(ex. declare v_i int default 0)

-- 변수 값 할당
SET <var-name> = <value>;
SELECT <col> INTO <var-name> from …;

-- ex.
declare v_addr varchar(255);
set v_i = 1;
select addr into v_addr from Student where id = v_i;

-- cf. session variable
-- 선언 없이 바로 사용, 외부에서 설정한 값이 들어갈 수 있어서 위험
set @var = 'aaa';

```

<br>

---

## @rownum

- 행번호 등 튜플마다 값이 변할 때 사용

```js
select s.*, (@rownum := @rownum +1) rownum
  from Emp s, (select @rownum := 0) rn;
```

<br>

---

## Function

<br>

```sql

DELIMITER $$
CREATE Function <function-name>(<param> <type>, ..)
RETURNS <return-type>
BEGIN
...
RETURN <return-value>;
END $$
DELIMITER ;

select <function-name>();


-- ex)
-- SELECT INTO 는 한 테이블에서 새로운 테이블로 정보를 복사
-- count(*) 값을 v_ret에 할당시키는 역할
CREATE FUNCTION `f_empcnt`(_dept tinyint)
RETURNS int
BEGIN
  declare v_ret int;
  select count(*) into v_ret
    from Emp
   where dept = _dept;

RETURN v_ret;
END
```

<br><br>

---

### 프로시저 (Stored Procedure)

<br>

- 정석적으로는 소스코드가 쿼리를 포함하는 것이 바람직함
  - 하지만 프로시저 사용이 편한 경우 존재
- 매개변수의 3가지 모드
  - IN : 기본 모드, 사용자가 프로시저 호출 시 매개변수 값 할당
  - OUT : 프로시저 실행 후 변수에 특정 값 할당
  - INOUT : IN + OUT

```sql
DROP Procedure IF EXISTS <procedure-name>;        -- cf, Alter procedure
DELIMITER $$
CREATE Procedure <procedure-name>([IN | OUT | INOUT] <param> <type>, ..)
BEGIN
...	...
END $$
DELIMITER ;

call <procedure-name>([IN parameters]);   -- 실행


-- ex)
CREATE PROCEDURE `sp_emp_del`(_empid int, OUT _empcnt int)
BEGIN
	declare v_deptid tinyint;
    select dept into v_deptid from Emp where id = _empid;

    delete from Emp where id = _empid;

    select empcnt into _empcnt from Dept where id = v_deptid;
END

call sp_emp_del(170, @empcnt);
```

<br>

### Tip.

- **OUT 파라미터 모드 사용하는 경우**
  - 단일 프로시저만 사용하는 경우 마지막에 into로 안 담아도 상관 없음
  - 여러 프로시저 사용 시 OUT으로 내보낸 값을 세션 변수에 할당
  - 다음 프로시저의 INPUT 등으로 사용

<br>

- **프로시저 장점**
  - Security : 프로시저를 작성해서 소스코드 접근 권한 없는 사람은 프로시저 호출로 기능만 사용하도록 하여 소스를 보호
  - Performance : 컴파일 되어서 올라가기 때문에 빠르다
  - Maintenance : 소스가 조금 변경되어도 SQL 쿼리만 변경하면 되기 때문에 수정 용이
  - Modularization : 모듈화 가능
  - Procedural Batch Job : 절차적인 batch job 할 때 프로시저로 짜 놓으면 편함

<br>

- **프로시저 단점**
  - 검증 없이 Apply 시 바로 반영되어 서비스에 오류 발생

<br><br>

---

## Leave (exit)

- 조건 발생 시 프로시저, 루프 등을 빠져나오는 용도 (break 같은 것)
- 프로시저에서는 Begin에 Label 지정 후 조건 충족 시 빠져나감

```sql
CREATE Procedure <procedure-name>()
'<Label>':BEGIN
  ...
  IF <condition> THEN
  leave '<Label>';
  END IF;
  ...
END


--ex)
CREATE PROCEDURE `sp_emp_range`(_sid int, _eid int)
prox:BEGIN
  declare v_sid int default _sid;
  declare v_eid int default _eid;

  IF _sid <0 AND _eid <0 THEN
    leave prox;
  END IF;

  IF _sid > _eid THEN
  set v_sid = _eid;
      set v_eid = _sid;
  END IF;

    select * from v_Emp where id between v_sid and v_eid;
END
```

<br>

---

## IF

<br>

```sql
IF … THEN
	...
ELSEIF ..  THEN
	...
ELSE
	...
END IF;
```

<br>

---

## CASE

<br>

```sql
CASE
  WHEN ( "<condition>" ) THEN …;
  WHEN ( "<condition>" ) THEN …;
  ...
  ELSE ....
END CASE;
```

<br>

---

## While

<br>

```sql
WHILE ( "<Condition>" )
DO ...
END WHILE;

-- ex.
WHILE (i < 10)
DO
…
set i = i + 1
END WHILE;
```

<br>

---

## Make SQL by using String

<br>

- String을 input 받아서 쿼리를 만듬
- 아래 쿼리는 String으로 프로시저 만드는 예제

```sql
CREATE PROCEDURE `sp_count` (_table varchar(31))
BEGIN
	SET @sql = CONCAT('select count(*) cnt from ', _table);

	PREPARE myQuery from @sql;		-- 메모리 할당
	EXECUTE myQuery;				-- 쿼리로 변경되어 실행
	DEALLOCATE PREPARE myQuery;		-- 메모리 비우기
END
```

---

## Cursor

<br>

- Cursor
  - 쿼리문에 의해서 반환되는 결과값들을 저장하는 메모리공간
  - 결과 값에서 각 튜플값을 컨트롤할 때 주로 사용

<br>

- Fetch
  - 커서에서 원하는 결과값을 추출하는 것

<br>

- 명시적(Explicit) 커서
  - 사용자가 선언해서 생성 후 사용하는 SQL 커서
  - 주로 여러개의 행을 처리하고자 할 경우 사용.

<br>

- 묵시적(Implicit) 커서
  - 오라클에서 자동으로 선언해주는 SQL 커서
  - 사용자는 생성 유무를 알 수 없음

<br>

```sql
-- Declare ⇒ Declare Continue Handler ⇒ OPEN ⇒ Fetch ⇒ Close

Declare <cursor-name> CURSOR FOR   -- declare 들은 맨 상단에 써줘야 함
    select ....;

Declare Continue Handler
    For Not Found SET <end-flag> := True;

OPEN <cursor-name>;

    <cursor-loop-var>: LOOP
        Fetch <cursor-name> into <var-name>, ...;
        IF <end-flag> THEN
            LEAVE <cursor-loop-var>;
        END IF;
        ...
    END LOOP <cursor-loop-var>;

CLOSE <cursor-name>;


-- Cursor Template (사용 편의를 위해 만든 템플릿)
Declare _done boolean default False;

Declare _cur CURSOR FOR
    select ....;
Declare Continue Handler
    For Not Found SET _done := True;
OPEN _cur;

    cur_loop: LOOP
        Fetch _cur into <var-name>, ...;
        IF _done THEN
            LEAVE cur_loop;
        END IF;
        ...
    END LOOP cur_loop;

CLOSE _cur;


-- ex) 영상 설명 44:40

CREATE DEFINER=`ssac`@`%` PROCEDURE `sp_emp_range`(_sid int, _eid int)
prox:BEGIN
	declare v_sid int default _sid;
    declare v_eid int default _eid;

    -- cursor 임시변수
    declare v_empid int;
    declare v_ename varchar(31);
    declare v_dname varchar(31);

	-- cursor 종료 플래그
    declare _done boolean default False;

    Declare _cur CURSOR FOR
		select id, ename, dname from v_Emp where id between v_sid and v_eid;

	Declare Continue Handler
		For Not Found SET _done := True;

    IF _sid <0 AND _eid <0 THEN
		leave prox;
    END IF;

    IF _sid > _eid THEN
		set v_sid = _eid;
        set v_eid = _sid;
    END IF;

	drop table IF Exists Tmp;

	create temporary table Tmp(
		empid int,
		edname varchar(63)
	);

	OPEN _cur;

		cur_loop: LOOP
			Fetch _cur into v_empid, v_ename, v_dname;
			IF _done THEN
				LEAVE cur_loop;
			END IF;

			insert into Tmp(empid, edname) values(v_empid, concat(v_ename, '-',ifnull(v_dname, '소속팀없음')));

		END LOOP cur_loop;

	CLOSE _cur;

	select * from Tmp;

END
```

- OPEN / CLOSE : 메모리에 커서 할당/반환

<br><br>

---

## Exception Handling

- <code> : 에러 코드 ex) 1501

```sql
START TRANSACTION
DECLARE {EXIT | CONTINUE} HANDLER FOR [ SQLEXCEPTION | <code>]
BEGIN
  SHOW ERRORS;
    SELECT '에러발생' as 'Result';
    ROLLBACK;
END;
-- CONTINUE 라고 선언했다면, 오류 발생해도 아래 계속 수행!
-- EXIT 선언 시 종료
COMMIT;

```
