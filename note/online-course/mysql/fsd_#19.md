# MySQL - With-CTE로 복잡한 쿼리 쉽게 작성하기

## WITH-CTE

<br>

- MySQL 8.0 도입
- 메모리에 임시 결과 셋으로 올려놓고 재사용
- cte는 view처럼 인식됨
- View의 생성 및 변경(+쿼리문도 함께 변경)하는 유지보수 비용 절감
- 순서에 의한 절차적으로 작성

```sql
WITH [RECURSIVE]
    cte_name [(col_name [, col_name] ...)] AS (subquery)
    [, cte_name [(col_name [, col_name] ...)] AS (subquery)]
select * from cte_name;
```

<br>

- **기본 CTE (Common Table Expressions)**
  - 순차적으로 쿼리 작성 가능

```sql
WITH
    cte1 AS (SELECT a, b FROM table1),
    cte2 AS (SELECT c, d FROM table2)
SELECT b, d FROM cte1 INNER JOIN cte2
    ON cte1.a = cte2.c;

```

<br>

- **재귀 CTE (Recursive Common Table Expressions)**
  - 스스로 추가적인 Row 생성 가능
  - 실무에서 유용하게 쓰임
  - 첫번째 row를 초기값 세팅 (initial(root) row set)
  - UNION ALL 이후의 것은 재귀되어 호출되는 쿼리 (additional row sets)

```sql
WITH RECURSIVE cte (n) AS
(
    SELECT 1     -- initial(root) row set
    UNION ALL
    SELECT n + 1 FROM cte WHERE n < 5 -- additional row sets
)
SELECT * FROM cte;

```

<br><br>

---

## 기본 CTE 예시

<br>

[예제]

- 각 부서별 평균 salary가 가장 높은 부서와 가장 낮은 부서를 구하고, 평균 급여 차액을 구하시오.

| 구분 |     부서명     | 평균급여  |
| :--: | :------------: | :-------: |
| 최고 |     클라팀     | 5,534,483 |
| 최저 |    영업1팀     | 4,370,370 |
|      | 평균 급여 차액 | 1,164,113 |

<br>

```sql
WITH
AvgSal AS (select d.dname, format(avg(e.salary)*10000,0) avgsal
             from Dept d inner join Emp e on d.id = e.dept
            group by d.id;),
MaxAvgSal AS (select * from AvgSal order by avgsal desc limit 1;),
MinAvgSal AS (select * from AvgSal order by avgsal limit 1;),
    SumUp AS (select ‘최고’ as gb, m1.* from MaxAvgSal m1
              UNION
              select ‘최저’ as gb, m2.* from MinAvgSal m2)

select * from SumUp
UNION
select ‘’, ‘평균급여차액’, , format( max(avgsal) - min(avgsal)*10000, 0)
  from SumUp;

```

<br><br>

---

## 재귀 CTE 예시

<br>

[예제] 피보나치 수열 출력

```sql
WITH RECURSIVE fibonacci (n, fib_n, next_fib_n) AS(
    select 1, 0, 1
    UNION ALL
    select n+1, next_fib_n, fib_n + next_fib_n
      from fibonacci where n < 10;
)

select * from fibonacci;

```

<br>

[예제] Dept 테이블에 아래와 같이 서버팀과 클라팀 아래에 추가 셀(파트)을 등록한 후 부서의 트리 계층 구조(hierarchy)를 표현

```sql
With RECURSIVE CteDept(id, pid, pname, dname, d, h) AS(
    select id, pid, cast(‘’ as char(31)), dname, 0, cast(id as char(10))
      from Dept where pid = 0;
     UNION ALL
    select d.id, d.pid, cte.dname, d.dname, d+1, concat(cte.h, ‘-’, d.id)
      from Dept d inner join CteDept cte on d.pid = cte.id
)
select d, dname from CteDept order by h;
```

- 영업부, 개발부를 root로 보고 자식 row들을 재귀로 호출
- d 가 depth를 의미
- h가 tree의 구조

<br><br>

---

## 재귀 CTE에서 횟수 제한

<br>

- 무한 루프로 빠지지 않도록 횟수 제한
  - limit
  - SESSION변수
  - 힌트 (/_ session 변수 _/)
- 힌트의 우선순위가 최우선
- 기본 1000번 제한 있지만 크기가 큰 데이터는 횟수제한 거는 것이 좋음

```sql
-- Session 변수
SET SESSION cte_max_recursion_depth = 20;      -- 재귀 실행을 20회로 제한
SET SESSION cte_max_recursion_depth = 1000000; -- 재귀 실행을 1M로 제한
SET max_execution_time = 1000;                 -- 최대 실행을 1000번까지로 제한(디폴트)

-- limit, hint 예시
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte limit 10
)
SELECT /*+ SET_VAR(cte_max_recursion_depth = 20) */ * FROM cte;
```
