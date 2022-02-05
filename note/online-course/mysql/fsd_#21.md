# MySQL - JSON 데이터 타입 사용하기

## JSON 데이터 다루기

- 데이터 = 정형 데이터 + 비정형 데이터
  - 비정형 데이터의 필요성 급증
  - 비정형 데이터를 마치 정형 테이블 처럼 --> 정형 테이블, 비정형 테이블 조인

<br>

- MySQL JSON Data Type
  - Binary 타입 : LONGBLOB, LONGTEXT
  - Key나 Array Index로 직접적인 접근 가능
  - JSON 함수를 이용한 빠르고 효과적인 처리
  - JSON 형태로 바로 반환
  - MySQL X DevAPI 사용

<br><br>

## JSON Function

- `JSON_VALID()` : 제이슨 데이터의 유효성 검사
- `JSON_PRETTY()` : 들여쓰기를 포함, 보기 좋게 JSON 출력
- `JSON_OBJECT()` : 문자열 형태가 아닌 key, value 쌍 JSON 생성
- `JSON_ARRAY()` : JSON을 배열 형태로 작성 및 변환
- `JSON_EXTRACT()` : 인라인 패스(->, ->>)처럼 특정값만 추출
- `JSON_VALUE()` : 특정 값 추출, 출력 타입 정의 가능
- `JSON_QUOTE()` : 특정 값 추출 + 큰 따옴표
- `JSON_UNQUOTE()` : 특정 값 추출 + 큰 따옴표 제거
- `JSON_LENGTH()` : JSON key 개수
- `JSON_DEPTH()` : JSON 깊이, 계층
- `JSON_KEYS()` : JSON key들만 추출
- `JSON_TYPE()` : JSON 데이터 타입 출력
- `JSON_SEARCH()` : 특정 값으로 JSON 위치 검색
- `JSON_CONTAINS()` : JSON에 특정 값의 존재 여부 확인
- `JSON_REPLACE()` : JSON에 특정 값 변경
- `JSON_INSERT()` : JSON 데이터에 특정 key, value 쌍을 추가
- `JSON_SET()` : JSON 데이터에서 특정 key에 해당되는 값만 변경
- `JSON_REMOVE()` : JSON에 특정 key, value 제거
- `JSON_MERGE()` : JSON에 값 추가 (MySQL8에서 deprecated로 변경)
- `JSON_MERGE_PRESERVE()` : JSON의 특정 위치 값 변경 (기존 값 유지)
- `JSON_MERGE_PATCH()` : JSON의 특정 위치 값 변경 (기존 값 대치)
- `JSON_TABLE()` : JSON을 테이블 형태로 정의
- `JSON_ARRAYAGG()` : 전체 JSON을 취합하여 배열로 출력
- `JSON_OBJECTAGG()` : 전체 JSON을 취합하여 Object로 출력
- `JSON_STORAGE_SIZE()` : JSON 데이터가 차지하는 크기
- `JSON_STORAGE_FREE()` : JSON 컬럼의 여유공간, JSON 있으면 항상 0

<br>

**_JSON_VALID()_**

- 유효성 검사
- key 값에 **따옴표** 썼는지 확인
- `key: value` 형태인지
- 유효하면 1 (true), 유효하지 않으면 0 (false)

<br>

**_JSON_OBJECT()_**

```sql
-- remark는 JSON 데이터가 있는 attribute
-- 기존 입력 형태
Update Emp set remark = '{"addr":"서울", "age":28}';

-- json_object 사용
Update Emp set remark = json_object("addr", "서울", "age", 28);
```

<br>

**_JSON_EXTRACT() / JSON_VALUE()_**

- 인라인 패스처럼 특정값 추출 / + 출력 형태 지정
  - 인라인 패스: -> , ->>

```sql
-- '{"addr":"서울", "age":28}'
-- $는 루트 위치를 나타냄
select remark -> '$.addr' from emp; --"서울"
select remark ->> '$.addr' from emp; -- 서울 (따옴표 제거)

select json_extract(remark, '$.addr') from emp; -- "서울"
select json_unquote(select json_extract(remark, '$.addr') from emp); -- 서울

select json_value(remark, '$.age') from emp; -- 28
select json_value(remark, '$.age' returning decimal(4,2)) from emp; --28.00
```

<br>

**_JSON_SEARCH()_**

```sql
--'{"addr":"서울", "age":28, "family":[{"name":"논개", "relation":"모"}]}'
select json_search(remark, 'one', '모') from emp; --"$.family[0].relation"
select json_value(remark, "$.famaily[0].relation") from emp; -- "모"
```

<br>

**_JSON_CONTAINS()_**

```sql
-- String이면 따옴표 내부에 쌍따옴표, Integer에는 따옴표만
select json_contains(remark, '"서울"', '$.addr') from Emp; -- 1 (true)
select json_contains(remark, '48', '$.age') from Emp; -- 0 (false)

-- 조건으로 사용하는 방법
select * from Emp where json_contains(remark, '28', '$.age');
-- 위와 같은 쿼리들
select * from Emp where json_value(remark, '$.age') = 28;
select * from Emp where remark ->> '$.age' = 28;
```

<br>

**_JSON_REPLACE vs JSON_INSERT vs JSON_SET_**

```sql
-- JSON_REPLACE는 이미 존재하는 JSON 내부 값을 변경
select json_replace(remark, '$.age', remark ->> '$.age' * 100)
  from Emp
 where remark ->> '$.age' = 48;

-- JSON_INSERT는 해당 값이 없다면 삽입, 기존에 있던 row는 덮어쓰지 않고 유지
select json_insert(remark, '$.age', 10)
  from Emp
 where remark is not null;

-- JSON_SET은 해당 값이 없다면 삽입, 있다면 덮어쓰기! --> 많이 씀

select json_set(remark, '$.age', 10)
  from Emp
 where remark is not null;
```

<br>

**_JSON_MERGE_PRESERVE vs JSON_MERGE_PATCH_**

```sql
-- JSON_MERGE_PRESERVE는 복수의 JSON을 합병하되 기존에 있던 값은 덮어쓰지 않고 유지
select json_merge_preserve(remark, json_object('id',id), json_object('addr', '대구'))
  from Emp
 where remark is not null;

---JSON_MERGE_PATCH는 복수의 JSON을 합병하되 기존에 있던 값을 갱신
select json_merge_patch(remark, json_object('id',id), json_object('addr', '대구'))
  from Emp
 where remark is not null;
```
