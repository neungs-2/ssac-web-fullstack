# Table 생성, 한글 설정, Session 개념

<br>

## Table 생성, 제거

- [IF NOT EXISTS] : '없다면' 이라는 조건
- 보통 Primary key는 id로 생성
- unsigned : 음수는 취하지 않음 --> 음수가 사라진 부분만큼 양수를 더 많이 쓸 수 있음
- comment : 마우스 올려야 보이는 설명을 추가
- Auto_increment : 자동 증가
- current_timestamp : 현재 시간
- tinyint : 1 byte, tinyint(1) : 한자리 숫자만 입력 가능

<br>

```sql
CREATE TABLE [IF NOT EXISTS] Student (
    id int unsigned not null auto_increment COMMENT '학번',
    name varchar(31) not null COMMENT '학생명',
    createdate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    graduatedt varchar(10) DEFAULT NULL COMMENT '졸업일',
    auth tinyint(1) unsigned NOT NULL DEFAULT '9' COMMENT '0:sys, 1:super, ...',
    …,
    PRIMARY KEY (id),
    FOREIGN KEY <key-name>(col3)
    REFERENCES Tbl1(id) ON [DELETE|UPDATE] [CASCADE | SET NULL | NO ACTION | SET DEFAULT]
    UNIQUE KEY unique_stu_id_name (createdate, name)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

desc Student;

# A와 같은 구조의 테이블 만들기
create table <table-name> like A; -- 구조만 같고 row에 data는 복사되지 않음

# A와 같은 구조, 같은 데이터의 테이블 만들기
create table <table-name> AS
    select * from A;

# 테이블 제거
truncate table <table-name>; - 테이블 정의 유지
drop table <table-name>; - 테이블 정의 삭제
```

<br>

---

## Timestamp & Character set 설정

- MySQL 설치 이후 Timestamp, 한글 처리는 기본적으로 설정

<br>

```sql
select now(); -- 시간 출력

show variables like '%time_zone%'; -- (System) time zone 출력
select @@time_zone;                -- time zone 출력
select unix_timestamp();           -- System의 밀리세컨드(ms) 값

set time_zone = 'Asia/Seoul';      -- 현재 session의 time zone 한국시간으로 설정
set global time_zone = 'UTC';      -- 전체 time_zone을 UTC로 설정 (root 권한 필요)

Timestamp: DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- on update: 업데이트(수정) 될 때마다
-- CURRENT_TIMESTAMP 현재 시간으로 (바꿔라)
-- 주로 worktime 기록하기 위해 사용
```

```sql
# DB 생성 시 charset 지정 및 이후에 변경
CREATE DATABASE <db> DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER DATABASE <db> DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

# 테이블 정보 확인
show create table <table-name>;
desc <table name>;

```

<br>

## Session

---

- Session 은 DB가 특정 Client의 요청에 대한 응답을 보낼 위치
  - 프로그램 상에서는 소켓이라는 말 사용
- MySQL에 접속할 때 Client는 db, user_id, user_password 가지고 옴
  - ex) 예제에서는 dooodb, dooo, dooo!
- MySQL(3306) 접근하는 Client마다 1개의 Session 생성
- db에서 연산결과를 올바른 Client에게 주기 위해 Session id 확인
- 한개의 세션은 한개의 프로세스 (프로세스 기반)
  - 두 Session에서 동시에 요청했을 때 스레드 기반이면 느림 (프로세스를 나눠 써야 해서)
  - CPU 많을수록 유리
- Session 개수는 한정

<br>

- `show processlist;` 명령어로 db에 접속중인 session 정보 확인 가능

<br>

---

## Try This 예제

```sql
CREATE TABLE `dooodb`.`Student` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '학번',
  `name` VARCHAR(32) NOT NULL COMMENT '학생명',
  `addr` VARCHAR(30) NULL,
  `birth` DATE NULL,
  `tel` VARCHAR(15) NULL,
  `email` VARCHAR(31) NULL,
  `regdt` TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`)
);

INSERT INTO Student(name, addr, birth, tel, email)
            VALUES('김일수', '서울', '2003-01-02', '010-0000-0000', 'aaa@gmail.com');
```

<br>

---

## Note.

- MySQL, MsSQL 에서는 User는 User이고 DB와 별개
- Oracle에서 User는 DB

<br>

- Ignore : 무시, Replace : 대치
- Like <old_tbl_name> : 기존에 존재하는 <old_tbl_name>처럼 생성
- Collate : character set 지정 (UTF-8, EUC-KR 등)
- 공식문서 Pseudo Code에서 [ ... ]는 선택사항을 의미
- alphabet : 1개가 1 byte, 한글은 2~3 byte
  - utf8에서는 기본적으로 문자 3 byte

<br>

- Column Type
  - tinyint (1B), smallint(2B), mediumint(3B), int(4B), bigint(8B), float(M,D), decimal/numeric(M,D)
  - date(3B), time(3B), datetime(8B), timestamp(4B), year(1B)
    - date : 날짜, time : 시간, datetime : 날짜+시간
  - char(n) vs varchar(n)
    - tinytext(255B), text(65535B), mediumtext(16777215B), longtext(4294967295B)
    - char : 고정형, var : 가변형
    - 255B 이상이면 text로 자동으로 넘어감
  - binary(255B), varbinary(65535B), tinyblob(255B), mediumblob(16777215B), longblob(4294967295B)

<br>

- MySQL Workbench

  - ctrl + enter --> 한줄만 실행
  - ctrl + shift + enter --> 전체 실행
  - table 우측 클릭 > Alter table 클릭 --> collation, engine, Column 설정 등 - engine은 대부분 InnoDB 사용 - collation --> utf8(mb4)\_unicode_ci 설정 (unicode는 모든 언어 포함) - Column 속성 지정시 크기 잘 모르면 0으로 지정하면 default 값

  <br>

  - `desc <table name>;` : 특정 테이블에 어떤 칼럼이 있는지 구조가 무엇인지 조회
    - Workbench에서 많이 쓰임
  - `show create table <table name>;` : 테이블 만드는 명령어 보여줌
    - 쉘에서 많이 쓰임
    - workbench에서는 길어서 안보이면 우측클릭 > Copy Field 로 복붙할 것
    - workbench에서 혹은 좌측에서 테이블 우측 클릭 > copy&clipboard 메뉴 > statement 선택
  - Table Data Export Wizard : 테이블을 Dump 뜨는 것
  - Table Data Import Wizard: Dump 뜬 데이터를 넣는 것

<br>

- DB Column의 Datatype 수정 가능
  - 하지만 이미 입력된 data보다 작은 크기의 타입은 변경 불가
  - 무조건 더 큰 타입으로만 수정 가능 (같은 크기도 불가)
