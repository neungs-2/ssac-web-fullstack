# 내장함수와 트렌젝션(Transaction)

<br>

## Standard Function

### 여러가지 함수

- sum, avg, min, max, mod, count, stddev, var_samp
  - mod : 나머지 값
  - stddev : 표준편차
  - var_samp : 분산
- sin, cos, tan, acos, asin, atan, atan2, exp, ln, log, log2, log10
- ceil, floor, round, abs, power, sqrt, mod(%), rand()
- bin, hex, oct, conv('EF', 16, 10)

### 형변환

- cast (AS)
- convert ( , )
- str_to_date

```sql
select CAST('2018-12-25 11:22:22.123' AS DATETIME);
select CAST( 1.467 AS Signed Integer )

CONVERT( 1.567, Signed Integer);

select str_to_date('2018-12-03', '%Y-%m-%d');  -- same as date_format
```

### 요소 붙이기

- concat : 요소들을 구분자 없이 붙임
- concat_ws : 요소들을 구분자로 구분해서 붙임
- group_concat : group by 시 select에 써서 요소들을 붙여서 반환

```sql
select addr, group_concat(name) as 'student names' from Student group by addr;
```

### IF문

- IF(조건, 참일때, 거짓일때) : 조건의 참/거짓에 따른 실행
- IfNull(expr1, expr2) : expr1이 Null이면 expr2 반환, not Null이면 expr1 반환
- NullIf(expr1, expr2) : expr1 = expr2 가 참이면 Null 반환, 거짓이면 expr1 반환

```sql
-- NullIf(expr1, expr2)와 같은 식
CASE WHEN expr1=expr2 THEN NULL
     ELSE expr1 END
```

<br>

## TCL : Commit & Rollback

- Transaction은 Session 단위로 제어
- Transaction

  - DML이 모인 하나의 작업 단위
  - 하나의 세션에는 여러 트렌젝션 존재

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
