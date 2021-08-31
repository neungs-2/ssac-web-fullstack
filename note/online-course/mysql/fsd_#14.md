# MySQL 시작 - 샘플데이터 생성

<br>

## DB 생성

- Workbench에는 주로 user 계정만 등록, root는 접근 X로 설정
- root 계정 조작을 위해 쉘을 이용해 직접 DB에 접근
- testdb 생성 후 workbench에 추가

```sh
$docker> ssh root@<접속용 IP> -p <외부포트>

$ncloud> mysql -u root -p

mysql> show Databases
mysql> create database testdb;
```

<br>

## 사용자 추가(권한 부여)

- 만들었던 계정 조회 방법
  - `use mysql;`
  - `select user, host from user;`

```sql
mysql> create user 사용자ID; -- 사용자 추가
mysql> create user userid@localhost identified by '비밀번호'; -- 추가 + 비밀번호 설정
mysql> create user userid@'%' identified by '비밀번호'; -- % = 외부 접근 허용


mysql> grant all privileges on testdb.* to ssac@'%'; -- 계정에 권한 부여
mysql > GRANT ALL PRIVILEGES ON DB명.테이블 TO 계정아이디@host IDENTIFIED BY '비밀번호';
mysql> GRANT ALL privileges ON DB명.* TO 계정아이디@locahost IDENTIFIED BY '비밀번호'; -- 'identified by '비밀번호' 부분을 추가 시 비밀번호가 변경

flush privileges; -- 권한 적용
```

<br>

## Table 추가

- workbench에서 db명 Bold체 --> default db
  - `use DB명;`으로 변경 가능
- **_int 타입_**
  - mysql에서 int 타입은 배정수(=8byte)
  - null 이 존재해도 not null을 걸고 default를 0으로 지정해주는 것 권유
    - avg 등 계산할 때 오류를 최소화하기 위한 방법

```sql
create table Dept(
	id tinyint unsigned not null auto_increment,
    pid tinyint unsigned not null default 0 comment '상위부서id',
    dname varchar(31) not null,
    primary key(id)
);

create table Emp(
	id int unsigned not null auto_increment,
    ename varchar(31) not null,
    dept tinyint unsigned not null,
    salary int not null default 0,
    primary key(id),
    foreign key(dept) references Dept(id)
);

...
```

<br>

---

## 샘플 데이터 추가

<br>

### 부서 생성

```sql
insert into Dept(pid, dname) values (0, '영업부'), (0, '개발부');

insert into Dept(pid, dname) values (1, '영업1팀'), (1, '영업2팀'), (1, '영업3팀'), (2, '서버팀'), (2, '클라이언트팀');
```

<br>

### 직원 생성

- 문자열 받아서 한글자를 무작위로 반환하는 함수 생성

```sql
CREATE FUNCTION `f_rand1`(_str varchar(255))
RETURNS varchar(31)
BEGIN
    declare v_ret varchar(31);
    declare v_len tinyint;

    set v_len = char_length(_str);
    set v_ret = substring(_str, CEIL(rand() * v_len), 1);

RETURN v_ret;
END
```

<br>

- 이름을 만들기 위한 함수

```sql
CREATE FUNCTION `f_randname`()
RETURNS varchar(31)
BEGIN
	declare v_ret varchar(31);
    declare v_lasts varchar(255) default '김이박조최전천방지마유배원';
    declare v_firsts varchar(255) default '순신세종형성호지혜가은권능한은경민희가나다라마태';

    set v_ret = concat( f_rand1(v_lasts), f_rand1(v_firsts), f_rand1(v_firsts) );

RETURN v_ret;
END
```

<br>

- Emp table 데이터 삽입을 위한 프로시저

```sql
CREATE PROCEDURE `sp_test_emp` (_cnt int)
BEGIN
	declare v_idx int default 0;

    while v_idx < _cnt
    do
		insert into Emp(ename, dept, salary) values ( f_randname(), f_rand1('34567'), f_rand1('123456789') * 100 );

        set v_idx = v_idx + 1;
	end while;
END
```

<br>

- Emp 데이터 삽입

```sql
call sp_test_emp(250);
```

<br>

---

### Tip. 함수 생성 시 ERROR 1418 발생

- 함수 설정 오류
- root 계정으로 다음 쿼리를 실행

```sql
-- function 생성 권한 확인 (ON 이어야 생성 가능)
show global variables like 'log_bin_trust_function_creators';

-- 설정 변경
SET GLOBAL log_bin_trust_function_creators=1;
또는
SET GLOBAL log_bin_trust_function_creators='ON';
```

<br>

#### 해결

![image](https://user-images.githubusercontent.com/60606025/131535906-cefdfa1e-4bc8-428e-918d-411292ed2740.png)

<br>

---

## Note.

- 변수 규칙 등을 만드는 것이 좋음
  - ex) parameter는 *로 시작, 내부변수는 v*로 시작
- 한글은 1글자에 3바이트, 영문은 1바이트
  - `select length('한들abc')` --> 9
- length는 바이트 수, char_length는 글자 길이 수
  - `select char_length('한들abc')` --> 5
