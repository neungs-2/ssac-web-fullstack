# Table Altering, Sample Data 자동 등록하기

<br>

## Table 생성, 제거

- MySQL Workbench에서는 좌측 테이블 목록을 우측 클릭, Alter Table ... 클릭!

<br>

- Index
  - 인덱스는 목차로 데이터를 찾기 쉽게 함
  - 데이터는 디스크에 위치, 인덱스는 메모리에 위치
  - Workbench에서 Alter Table에서 Indexes 클릭

```sql
Alter Table [Add | Modify | Change | Drop] Column … ;
Alter Table [Add | Drop] [Index | Constraint] … ;
Show index from <table-name>;
Show table status;
ALTER TABLE t1 ENGINE = InnoDB; -- (데이터 분석에서는 MyIsam 많이 사용)
ALTER TABLE t1 AUTO_INCREMENT = 13;
ALTER TABLE t1 COMMENT = 'New table comment';
ALTER TABLE t1 RENAME t2;
ALTER TABLE t1 ADD Constraint FOREIGN KEY (stu) REFERENCES Student(id);

-- 인덱스 예시
ALTER TABLE `dooodb`.`Student`
ADD INDEX `index_student_addr` (`addr` ASC);
```

<br>

---

## Note.

<br>

- sample data 생성 후 db로 옮길때 보통 string으로 보냄
  - 데이터 전송 시 column type을 varchar 등으로 수정
  - 데이터 전송 완료 후 column 타입 다시 수정

```sql
-- replace 함수, substring 함수 예시
select birth, replace(substring(birth, 3)) from Student;

```
