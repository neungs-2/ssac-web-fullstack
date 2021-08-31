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

### Deny

```sql

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
```

<br>

### Alter

```sql


```

<br>

### Drop

```sql
# User 삭제
mysql> drop user '<사용자>'@'<host>';
mysql> drop user dooo@'%';
```

<br>

### Rename

```sql


```

<br>

### Truncate

```sql


```

<br>

## Note.

- 현업에서는 MySQL ver. 5, 8 둘 다 사용할 수 있음
  - 이런 경우 버전 별 workbench를 따로 설치
