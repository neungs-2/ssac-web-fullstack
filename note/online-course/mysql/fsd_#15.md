# MySQL-SQL 한방에 정리하기 Part1 - DCL,DDL

<br>

## DCL (Data Control Language)

> Grant, Revoke, Deny

<br>

### Grant

```sql
# 권한 부여
mysql> grant all privileges on *.* to '<user-name>'@'<host>';
mysql> grant all privileges on *.* to 'dooo'@'%';

# 특정 DB 권한 부여
mysql> grant all privileges on <DB>.* to '<user-name>'@'<host>';
mysql> grant all privileges on dooodb.* to 'dooo'@'%';

# 적용하기
mysql> flush privileges;
```

- host에 %를 주면 어느 ip에서나 접속 가능
- 가능하면 사무실 ip만 가능하도록 설정하고 특히 root 계정은 조심

<br>

### Revoke

```sql
# 권한 삭제(취소)
mysql> revoke all privileges on <db-name>.* from <user-name>@'<host>';
mysql> revoke all privileges on dooodb.* from dooo@'%';
```

<br>

### Tip. 현재 접속 유저 확인

```sql
mysql> select current_user();
```

<br><br>

## DDL (Data Definition Language)

> Create, Alter, Drop, Rename, Truncate

<br>

### Create

```sql
# User 생성
mysql> create user <user-name>@'<host>' identified by '<password>';
mysql> create user dooo@'%' identified by 'dooo!';
mysql> create user dooo@'211.234.55.66' identified by 'dooo!';

# db 생성
mysql> create database <db-name>;

# Table 생성
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
create table <table-name> like A;

# A와 같은 구조, 같은 데이터의 테이블 만들기
create table <table-name> AS select * from A;

# 생성 소스 보기
show create table <table-name>;

```

- CREATE ~ AS
  - 테이블 구조, 데이터 복사
  - Index, foreign key는 복사되지 않음

<br>

### Alter

```sql
Alter Table [Add | Modify | Change | Drop] Column …
Alter Table [Add | Drop] [Index | Constraint] …
Show index from <table-name>;
Show table status;

ALTER TABLE t1 ENGINE = InnoDB; -- MyIsam
ALTER TABLE t1 AUTO_INCREMENT = 13;
ALTER TABLE t1 COMMENT = 'New table comment';
ALTER TABLE t1 RENAME t2;
ALTER TABLE t1 ADD Constraint FOREIGN KEY (stu) REFERENCES Student(id);

# 테이블 수정 예시
alter table Dept add column workdate timestamp not null default current_timestamp
    on update current_timestamp;
-- on update : 데이터 수정 시 값 업데이트

# Foreign key 설정 예시
ALTER TABLE `testdb`.`Test`
ADD INDEX `ref_test_dept_idx` (`dept` ASC) VISIBLE;

ALTER TABLE `testdb`.`Test`
ADD CONSTRAINT `ref_test_dept`
  FOREIGN KEY (`dept`)
  REFERENCES `testdb`.`Dept` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

# delete 이후 index 1로 초기화
ALTER TABLE `testdb`.`Test`
AUTO_INCREMENT = 1 ;
-- 혹은 table 설정창 option에서 auto increment 1로 변경
```

<br>

### Drop

```sql
# User 삭제
mysql> drop user '<사용자>'@'<host>';
mysql> drop user dooo@'%';

# Table 삭제
mysql> drop table <table-name>;
```

<br>

### Truncate

```sql
Truncate <table-name>;
```

- Delete
  - 용량 감소되지 않음
  - 원하는 데이터만 삭제 가능
  - 되돌리기 가능
- truncate
  - 용량 감소
  - 인덱스 모두 삭제
  - 데이터 한번에 모두 삭제
  - 되돌리기 불가능
- Drop
  - 테이블 전체를 삭제
  - 객체, 공간 자체를 삭제
  - 되돌리기 불가능

<br><br>

---

## Column Type

- 숫자
  - tinyint (1B), smallint(2B), mediumint(3B), int(4B), bigint(8B), float(M,D), decimal/numeric(M,D)
  - M: 정수 자리수, D: 소수점 자리수
- 날짜
  - date(3B), time(3B), datetime(8B), timestamp(4B), year(1B)
  - 시/분/초 까지 나타낼 때는 datetme, timestamp 사용
  - **global 서비스** 시 나라별 시간을 나타낼 때 timestamp
- 글자
  - char(n) : 고정형, varchar(n) : 가변형 자리수
  - tinytext(255B), text(65535B), mediumtext(16777215B), longtext(4294967295B)
- 바이너리
  - binary(255B), varbinary(65535B), tinyblob(255B), mediumblob(16777215B), longblob(4294967295B)
  - blob이 붙은 것은 모두 바이너리 데이터
  - 음악, 영상 등 --> blob
  - 조회 시에는 좋지만 용량이 커서 주의해야 함

```sql
# System time zone 조회 (KST 같은 것)
show variables like '%time_zone%';
select @@time_zone;

# System time zone 변경
set time_zone = 'Asia/Seoul';  (same as KST)
set global time_zone = 'UTC';    -- root authority

```

<br><br>

---

## Tip.

```sql
update Test set dept = f_rand1('34567');
```

위의 쿼리가 실행 오류가 난다면?

- Safe Update 옵션 때문.
- restrict 없이 update or delete가 되지 않음

해결 방법

1. 쿼리 뒤에 `where id > 0;` 의 제약조건을 걸어준다
2. Workbench 옵션 중 `Edit > Preference > SQL Editor` 에서 safe updates 클릭 해제 후 재접속

![image](https://user-images.githubusercontent.com/60606025/131638951-c1cf2580-bece-472b-a47c-e0e7c77ea67e.png)

<br>

---

## Note.

- 현업에서는 MySQL ver. 5, 8 둘 다 사용할 수 있음
  - 이런 경우 버전 별 workbench를 따로 설치
- 쿼리 작성 시 테이블 조회를 먼저 하고 작성해야 실수를 줄일 수 있음
- 명령 실행 뒤 write 관련된 것은 주석처리로 바꾸는 것 추천
