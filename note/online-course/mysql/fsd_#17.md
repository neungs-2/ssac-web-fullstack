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

  - 특정 사용자에게 필요한 필드만 제공
  - 쿼리 단순화
  - 쿼리 재사용

- 단점
  - 독립적 인덱스를 가질 수 없음
  - 뷰의 정의 변경 불가능
  - 삽입, 삭제, 갱신 (DML)에 제약 존재
