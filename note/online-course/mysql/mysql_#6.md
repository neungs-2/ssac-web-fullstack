# Join Tables 테이블 조인하기

<br>

## (Inner) Join

```sql

-- 과목별 담당 교수명
select s.*, p.name as 'prof. name'  from Subject s inner join Prof p on s.prof = p.id;

-- 과목별 학생수
select e.subject, max(s.name) as 'subject name', count(*) as '학생수'
from Enroll e inner join Subject s on e.subject = s.id  group by e.subject;

-- 역사 과목의 학생 목록
select s.name, s.birth
from Enroll e inner join Student s on e.student = s.id
              inner join Subject sbj on e.subject = sbj.id
where sbj.name = '역사';

-- 특정과목(국어)과목을 듣는 서울 거주 학생 목록 (과목명, 학번, 학생명)
select sbj.name, s.id, s.name
from Enroll e inner join Student s on e.student = s.id
              inner join Subject sbj on e.subject = sbj.id
where sbj.name = '국어' and s.addr = '서울';

-- 역사 과목을 수강중인 지역별 학생수 (지역, 학생수)
select substring(s.addr,1,2) as a, count(*) as student_cnt
from Enroll e inner join Student s on e.student = s.id
              inner join Subject sbj on e.subject = sbj.id
where sbj.name = '역사' group by a;


```

<br>

---

## Outer Join

- 기준이 되는, 보고자 하는 테이블 쪽으로
- [ Left | Right | Full ] outer join ... on ...

```sql

-- 동아리(Club) 전체 목록에 리더(학생) 이름 함께 출력
select c.*, s.name from Club c left outer join Student s on c.leader = s.id;

-- 교수 전체 목록에 담당 교과가 있으면 교과명도 함께 출력
select p.*, sbj.name from Subject sbj right outer join Prof p on sbj.prof = p.id;

```

<br>

---

## Note.

- 사고, 연산의 과정이 From부터 시작하므로 SQL문 작성 시 From부터 작성
- 경우에 따라 join을 select, from, where 어디든 쓸 수 있음
- 성호님은 주로 From에 쓰는 편
