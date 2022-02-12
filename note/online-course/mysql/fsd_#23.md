# **Index & Partition (성능 향상 기법)**

- 속도와 시스템 부하 --> 성능
- 데이터가 많아질수록 성능 저하를 체감하게 됨
- 성능 향상 기법을 적용

## **Index**

- 추가적인 쓰기 작업과 저장 공간을 활용하여 데이터베이스 테이블의 검색 속도를 향상시키기 위한 자료구조

![image](https://user-images.githubusercontent.com/60606025/153536484-da220c37-f364-48a0-b518-ac1abe1c6fac.png)

<br>

- 장점
  - 테이블을 **검색**하는 **속도와 성능 향상**
  - 시스템의 전반적인 부하를 줄여줌
  - 인덱스에 의해 데이터가 정렬된 형태를 갖게 됨
    - 기존에는 Full Table Scan이 필요
    - 인덱스 이용 시 데이터가 정렬되어 빠른 검색 가능

<br>

- 단점
  - 인덱스 관리를 위한 추가 작업 필요
    - 인덱스를 정렬된 상태로 유지하기 위한 작업
      - 삽입: 새로운 데이터에 대한 인덱스 추가
      - 삭제: 삭제하는 데이터의 인덱스를 사용하지 않기 위한 작업
      - 수정: 기존의 인덱스를 사용하지 않음 처리, 갱신된 데이터 인덱스 추가
  - 추가 저장공간 필요
  - 잘못 사용 시 오히려 검색 성능 저하

<br>

### Index Scan vs Table Scan (Full Table Search)

- **Index Scan**
  - PK 인덱스 등으로 인덱스 영역만 읽는 것
- **Table Scan**
  - where 조건 등으로 테이블 전체를 읽는 것
    <br>

### Clustered Index vs Non-Clustered(Secondary) Index

- **Clusterd Index**
  - Primary Key / Unique Key 처럼 물리적인 데이터와 연관이 되는 인덱스 (PK 순서대로 데이터 정렬 = 인덱스 순서)
  - 테이블 데이터를 지정된 컬럼에 대해 물리적으로 재배열
  - 테이블 당 한개씩만 존재 (가장 효율적인 컬럼으로 지정)
  - 인덱스 자체에 데이터 포함
  - 데이터가 많은 상태에서 Clusterd Index 지정 시 많은 리소스 차지
    - 사용자 많은 시간대 꼭 피할 것
  - 물리적으로 정렬되어 있어 검색 속도가 Non-Clustered Index 보다 빠름
    - 같은 이유로 입력, 수정, 삭제 속도는 더 느림

![image](https://user-images.githubusercontent.com/60606025/153539936-71486400-2f84-497e-b43d-403429582bd9.png)

<br>

- **Non-Clustered Indx**
  - 데이터 페이지를 건드리지 않고 별도의 장소에 인덱스 페이지 생성 (데이터 페이지와 독립적)
  - Key 값과 RID로 구성
  - 인덱스의 리프페이지는 데이터가 아닌 데이터가 위치하는 포인터
  - 테이블 당 여러개 존재 가능

![image](https://user-images.githubusercontent.com/60606025/153540326-16a1ed97-f82f-49e8-838c-2157dc3c8eab.png)

<br>

### Cardinality

- 전체 행에 대한 특정 컬럼의 중복 수치
- 중복도가 높으면 Cardinality가 낮음
- **Cardinality가 높을수록 인덱스가 효과적**
  - ex) 남/여로 나누기 --> Cardinality 낮음
  - ex) ID로 나누기 --> Cardinality 높음

---

<br>

## **B(Balanced)-Tree**

- Root/ Branches / Leaves Node로 구성
- Node는 페이지를 의미
- 1 Page = 16KB
- 페이지 분할은 50%로 분할
- Leaf Node
  - Clustrered Index --> Data (disk에 위치)
  - Non-Clustered Index --> RID (링크를 지님)

<br>

- 새로운 원소는 Leaf node에 삽입
- Node에 overflow 발생 시 Split point를 parent로 하고 노드 분할
  - 차수가 홀수이면 가운데 값, 짝수이면 왼쪽 그룹의 최대값 --> Split point
- Node 내의 key값들은 오름차순
- 모든 leaf node들은 같은 level에 존재

![image](https://user-images.githubusercontent.com/60606025/153542417-233f5aed-b02f-403a-bfa5-9337b00645bd.png)

---

<br>

## **Fast Optimizer & Execution Plan**

- `explain SQL문(select...from...where)`
  - 실행 계획 등 보여줌

![image](https://user-images.githubusercontent.com/60606025/153544299-7b94e43f-0a50-41ea-9eaa-02a59a6c5fe0.png)

- possible_keys: 사용가능한 인덱스(key) 목록
- key_len: 인덱스(key)의 길이
  - Int: 4byte
  - TinyInt: 2byte
- type
  - const : PK or Unique index (유일값)
  - ALL : 테이블 전체 탐색 (인덱스를 타지 못했을 때)
  - ref : Unique 하지 않은 인덱스를 탔을 때
  - range : 특정 범위
  - index : 특정 인덱스
  - fulltext : fulltext 인덱스
- Extra
  - Using where: 인덱스를 타지 못한 경우 --> where 조건 이용한 Full Table Scan
  - Using Index: 인덱스를 사용하는 경우
  - Using filesort: Non-Clustered Index 타는 등 sort 하는 경우

<br>

- `SHOW INDEX FROM <table name>`
  - 잡혀있는 인덱스 보여줌

<br>

- `SHOW TABLE STATUS WHERE Name in (column1, column2, ...)`
  - Data Size = rows \* Avg_row_length
  - **Index Size** = **Clustered Index Size**(Data_length) + **Non-Clustered Index Size**(Index_length)
  - Index Size가 Data Size의 10% ~ 15%를 넘지 않아야 보조 index 사용이 효과적

![image](https://user-images.githubusercontent.com/60606025/153547579-07a26f71-5c91-4fdf-b512-46e143810dd0.png)

<br>

### Index 정리

- 클러스터(Clustered) 인덱스는 데이터 파일과 직접 연관.
- 데이터 크기가 너무 크면 페이지 분할이 빈번하여 쓰기 성능 절하.
  - 모든 column을 index로 지정 시 의미 없음.
  - 꼭 필요한 column만 지정
- 인덱스는 카디널리티(Cardinality)가 높을수록 유리.
- 클러스터 인덱스는 읽기 성능은 보조 인덱스보다 빠르지만 쓰기는 느림.
- 페이지 분할은 시스템 부담! (Clustered Index가 없는게?!)
- 다중 컬럼 인덱스는 순서를 고려해서.
- 인덱스는 꼭 필요한 것만.
- 전체 테이블의 10~15% 이상을 읽을 경우 보조 인덱스 사용 안함!

---

<br>

## **Sargable (Search ARGument ABLE) Query**

- Sargable: 검색 시 인덱스를 효율적으로 타는지
  - `explain <쿼리>`로 인덱스 타는지 확인 가능

![image](https://user-images.githubusercontent.com/60606025/153549079-442ff1eb-00dd-486f-a382-f46b2e0e12be.png)

- where 절에 **함수, 연산, Like(시작 부분 %)문**이 있으면 index를 타지 않기 때문
- like 사용 시 %가 맨 처음에 오면 인덱스를 잡지 못함.
- offset이 크면 건너뛰기 위해 읽어야 할 row가 많음
  - 건너 뛰는 것도 읽은 후 건너뛴다고 생각

---

<br>

## **Fulltext Index (Text Search)**

- `%`로 검색 시 원하는 결과가 나오지 않는 경우가 많음
  - `%검색어`는 인덱스를 잡지 못함
  - `%조선%`을 Like로 검색 시 조선말고 고조선도 나옴
  - 이런 경우 Fulltext Index 사용

<br>

- **Fulltext Index**
  - char, varchar, text 타입
  - 여러 컬럼을 동시에 인덱스 생성 가능
  - 기본 3글자 이상

<br>

- **불용어**
  - '은/는/이/가' 등 조사나 '가까스로' 같은 단어들
  - 불용어 설정 시 인덱싱에서 제외되어 인덱스 크기도 줄일 수 있음
  - 기본 불용어는 영어로 되어있음

<br>

- **불용어 추가**
  - 불용어 조회: `select * from information_schema.innodb_ft_default_stopword;`
  - 정보 조회: `show variables like 'innodb_ft%';`
  - 설정: `/etc/my.cnf`, 설정 이후 재시작 `systemctl restart mysqld`
  - 한글 불용어를 위한 설정 ![image](https://user-images.githubusercontent.com/60606025/153691261-9bb1492e-78df-453f-9d4d-3eb341d83e81.png)
  - 불용어 테이블 생성
    - ex) `CREATE TABLE StopWord (VALUE VARCHAR(31) NOT NULL);`
  - 불용어 추가
    - ex) `INSERT INTO StopWord(value) VALUES ('가까스로'),('가령'),('각자'),('각종')...`

<br>

- **Fulltext Index 추가 방법**

  - Fulltext Index 생성

    ```sql
      -- When Creation
      CREATE TABLE ... (col1 ..,col2 .., FULLTEXT <index-name> (col-name, ..));

      -- When Altering
      ALTER TABLE ... ADD FULLTEXT (col..);

      -- Create Index
      CREATE FULLTEXT INDEX <index-name> ON <table-name> (col-name, ..);
    ```

  - `innodb_ft_aux_table`에 테이블 지정

    ````sql
    set global innodb_ft_aux_table = '<Schema명>/<table명>'; -- global 실행 안되면 root 계정으로 시도
    show variables like 'innodb_ft%'; --aux table 변경 확인

          -- optimaize 적용 (Fulltext Index만 적용하기 위해 아래와 같이 함)
          SET GLOBAL innodb_optimize_fulltext_only = ON;
          OPTIMIZE TABLE <table명>;
          SET GLOBAL innodb_optimize_fulltext_only = OFF;

          select * from information_schema.innodb_ft_index_table; -- 적용됐는지 확인
        ```

    <br>
    ````

- **Fulltext Index 검색**

  - 검색 옵션

    - `In Natural Language Mode` : 자연어 검색모드 (일반적인 단어 검색)
    - `In Query Expansion`: 단어 사전 사용 (단, 영어 버전만 존재)
      - ex) Database 검색 시 MySQL, MsSQL, Oracle, MongoDB 등 조회
    - `In Boolean Mode`: Search Expansion 사용 (조건 검색)
      - `*`: partial search, `+`: required search, `-`: excluded search

    ```sql
    WHERE MATCH(index_columns..) AGAINST (expr search_modifier)
      search_modifier
      { [IN NATURAL LANGUAGE MODE]  -- default option
        | IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION
        | IN BOOLEAN MODE
        | WITH QUERY EXPANSION
      }

    -- example
    select title, contents
      from Notice
     where match(title, contents) against('조선*' IN BOOLEAN MODE);

    ```

---

<br>

## **Partition (Big Table Partitioning)**

- 테이블에 데이터가 많이 쌓일 시 테이블을 쪼개서 관리하는 것
- FK 지정 불가, FK 없어야만 Partition 나눌 수 있음
- **Partition Key**: 나누는 기준
- PK 지정할 경우 PK가 **Partition Key**가 됨
- 아래 예시에서 `enteryear`가 Partition key로 2000년 미만, 2010년 미만 그 이상으로 나뉨

```sql
-- example
create table PartiRangeTest (
  studentno varchar(7) not null,
  enteryear smallint not null,
  studentname varchar(31) not null
  )

Partition by RANGE(enteryear) (
  partition p1 values less than(2000),
  partition p2 values less than(2010),
  partition p3 values less than MAXVALUE
);

-- p3를 2020년 기준으로 다시 쪼개기
Alter table PartiRangeTest
  REORGANIZE Partition p3 INTO (
    partition p3 values less than (2020),
    partition p4 values less than MAXVALUE
  );

optimize table PartiRangeTest; -- optimize 해줘야 인식함

-- p1, p2 합치기
Alter table PartiRangeTest
REORGANIZE Partition p1, p2 INTO (
  partition p1_2 values less than(2010)
);

optimize table PartiRangeTest;

-- partition 삭제
Alter table PartiRangeTest DROP Partition p1_2;

optimize table PartiRangeTest;

```

<br>

**_Partition Type_**

- **Range** : 특정 row 값 기준으로 나눔
- **List Column** : 특정 column item 종류로 나눔
- 거의 위의 두개를 씀, 아래의 방법은 어느 파티션에 어느 데이터가 들어갔는지 알 수 없어서 잘 안씀
- **Hash** : 해싱 알고리즘으로 알아서 나뉨
- **Key** : Partition key 없어도 Mysql이 알아서 나눠줌

<br>

- 파티션을 나누고 조건문에 Partition key를 기준으로 탐색
- 실제 directory (/var/lib/mysql/<schema명>) 보면 테이블 별 파일 쪼개져 있음

  ```sql
  select *
    from information_schema.partitions
  where table_name='PartiRangeTest';

  explain select * from PartiRangeTest
          where enteryear = 2018;
  ```

---

<br>

## Tips

- Index 걸고 난 후 `optimize table <table 명>;` 쿼리를 쳐서 적용!
  - optimize 이후 `analyze table <table 명>;` 적용하면 인덱스 선택이 빨라짐
  - MySQL 8 이후 옵티마이저 자체가 좋아져서 안해도 큰 상관은 없음

<br>

- Index 걸 때 실행 순서에 맞게 우선순위를 주어 Index 설정해야 효율적
  - 실행순서가 where 조건 걸고 group by 적용 후 select 이므로 순서에 맞게 index를 지정해야 효과가 좋음 (사용되는 Column 순서대로)
