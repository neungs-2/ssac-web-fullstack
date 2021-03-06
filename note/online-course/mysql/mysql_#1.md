# Database 및 User 생성하기

<br>

## Install MySQL

- Docker Container에 구축

```sh
$user> docker search mysql
$user> docker pull mysql:5.7 # 5.7버전
$user> docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=r! --name <container name> mysql:5.7
# hostname 도 설정해주면 좋을듯
```

<br>

---

## 접속하기

```sh
$user> docker start <container name>
$user> docker exec -it <container name> bash
$user> mysql -u <user> -p
```

<br>

---

## DB 생성하기

```sql
mysql> create database <db-name>;
mysql> show databases;
mysql> use <db-name>;
mysql> show tables;

# ex) CREATE DATABASE <db> DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

# DB 삭제
mysql> drop database <db-name>;
```

<br>

---

## User, Host 생성하기

- 특정 서버, PC에서만 접속하게 하려면 host에 ip를 입력하여 user 생성
- localhost의 ip: 127.0.0.1

<br>

```sql
# User 생성
mysql> create user <user-name>@'<host>' identified by '<password>';

# User 삭제
mysql> drop user '<사용자>'@'<host>';
```

<br>

---

## 권한 부여하기

- {DB}.{table} 이므로 *.*은 모든 db, 모든 table
- all privileges는 모든 권한을 의미

<br>

```sql
# 권한 부여
mysql> grant all privileges on *.* to '<user-name>'@'<host>';

# 특정 DB 권한 부여
mysql> grant all privileges on <DB>.* to '<user-name>'@'<host>';

# 적용하기
mysql> flush privileges;

# 권한 확인
mysql> show grants for '<user-name>'@'<host>';  -- @<host> 생략시 모든 host에 대해 조회

# 권한 삭제(취소)
mysql> revoke all privileges on <db-name>.* from <user-name>@'<host>';
```

<br>

---

## Note.

- Oracle : SQL developer 공식 tool
- MySQL : MySQL Workbench 공식 tool
- show databases; 하면 해당 user의 권한이 있는 db만 나옴
- host가 달라지면 같은 user라도 다른 계정처럼 보임
