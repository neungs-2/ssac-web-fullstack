# MySQL-유용한 내장 함수들

## Standard Functions

[목록]

```sql
sum, avg, min, max, mod, count, stddev, var_samp
sin, cos, tan, acos, asin, atan, atan2, exp, ln, log, log2, log10

ceil, floor, round, abs, power, sqrt, mod(%), rand()
bin, hex, oct, conv('EF', 16, 10)

select CAST('2018-12-25 11:22:22.123' AS DATETIME);
select CAST( 1.467 AS Signed Integer ), CONVERT( 1.567, Signed Integer);

select str_to_date('2018-12-03', '%Y-%m-%d');  -- same as date_format
concat, concat_ws, group_concat -- ex. 지역별 학생명단
select addr, group_concat(name) as 'student names' from Student group by addr;

IF(식, 참일때, 거짓일때), IfNull(col1, 'aa'), NULLIF(col1, col2)

```

- mod(=%) : 나머지 값 구하기
- stddev : 표준편차
- var_samp : 분산
- cast , convert : 형변환
- str_to_date : string을 지정된 양식의 date로 변경
- concat : 원소들을 붙임
- concat_ws(구분자, expr1, ...,) : 지정된 구분자로 원소들을 붙임 (python join 느낌)
- group_concat : group by 할 때 원소들을 붙여서 보여주는 것
- if : 참/ 거짓에 따라 값 반환 `select if(조건문, 참값, 거짓값)`
- IFNULL(expr1, expr2) : expr1이 NULL이면 expr2를 리턴하고, NULL이 아니면 expr1을 리턴
- NULLIF(expr1, expr2) : expr1 = expr2가 TRUE이면 NULL을 리턴하고, 그렇지 않으면 expr1을 리턴
  - CASE WHEN expr1=expr2 THEN NULL ELSE expr1 END 와 동일
  - nullif와 where의 조합으로 필터링 가능.
  - null 반환하는 col을 nullif로 select에 추가하고 그 열에 is null 걸면 필터링 된다

```sql
select * from(
  select if, dname, nullif(120, captain) nn from Dept) sub
 where sub.nn is not null;

```

<br>
<br>

- ascii('A’) --> 65
- char(65, 66) --> A, B
- length(‘문자’) : ‘문자’의 실제 바이트 수
- bit_length(‘문자’) : ‘문자’의 실제 비트 수
- char_length(‘문자’) : 실제 길이
- elt(idx, 값1, 값2, …) : idx 번째 값을 반환
- field(찾는값, 값1, 값2, …) : 찾는 값이 몇 번째 인덱스에 있는지 반환
- find_in_set(찾는값, ‘값1,값2,값3,…’) : 여러값을 하나의 문자열로 줘서 몇번째에 있는지 반환 --> group_concat으로 반환한 결과에 적용
- instr(‘문자’, ‘글자’) : 문자열에서 특정 글자 위치
- locate(‘타겟 문자‘,’문자’ ) : 문자열에서 타겟 문자 위치
- insert(‘문자’,시작위치,개수,삽입 문자) : 문자열에서 시작위치부터 n개 글자를 지우고 문자 - 삽입
- format : 날짜 문자열 변환, 수치값 천단위 콤마 찍기, 수치값 소수점 반올림 등
- truncate : 잘라내기
- lpad, rpad(문자, 자리수, 자리채울 문자) : (왼쪽, 오른쪽을 채움) 문자를 정해진 자리수로 - 만들기 위해 문자를 채움
- replace : 문자열 교체
- (l/r)trim : 공백 제거
- substring : 시작위치부터 끝위치의 문자 반환
- substring_index : 문자를 정해진 구분자로 잘라서 정해진 위치 값을 반환

```sql
ascii('A'), char(65, 66)
length, char_length, bit_length, sign
elt(<idx>, 'str1', 'str2', ..), field('s1', 's0', 's1', 's2')
find_in_set('s1', 's0,s1,s2')
instr('str', 't'), locate('s1', 's0s1s2'), insert('12345', 3, 0, '/')
format(123456789,0), format(789.012356, 4), truncate(789.012356, 4)
left('abc', 2), upper, lower, lpad('5', 2, '0'), rpad('15', 3, '0')
reverse, repeat, space, replace('abcdefg', 'cde', 'xxx')
trim, trim([both|leading|trailing] 's' from 'ssstrss'), ltrim, rtrim
substring('str', <idx>, <length>)
substring_index('a,b,c', ',', 2)  -- a,b (,를 기준으로 두번째까지)
substring_index('a,b,c', ',', -1) -- c  (-1은 ,로 잘라낸 마지막 값)
substring_index( substring_index('a,b,c', ',', 2), ',', -1)

```
