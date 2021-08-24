# Table Altering, Sample Data 자동 등록하기

<br>

## Table 생성, 제거

- MySQL Workbench에서는 좌측 테이블 목록을 우측 클릭, Alter Table ... 클릭!

```sql
Alter Table [Add | Modify | Change | Drop] Column … ;
Alter Table [Add | Drop] [Index | Constraint] … ;
Show index from <table-name>;
Show table status;
ALTER TABLE t1 ENGINE = InnoDB; -- MyIsam
ALTER TABLE t1 AUTO_INCREMENT = 13;
ALTER TABLE t1 COMMENT = 'New table comment';
ALTER TABLE t1 RENAME t2;
ALTER TABLE t1 ADD Constraint FOREIGN KEY (stu) REFERENCES Student(id);
```
