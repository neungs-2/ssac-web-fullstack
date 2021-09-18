# MySQL - JSON 데이터 타입 사용하기

## JSON 데이터 다루기

- 데이터 = 정형 데이터 + 비정형 데이터
  - 비정형 데이터의 필요성 급증
  - 비정형 데이터를 마치 정형 테이블 처럼 --> 정형 테이블, 비정형 테이블 조인

<br>

- MySQL JSON Data Type
  - Binary 타입 : LONGBLOB, LONGTEXT
  - Key나 Array Index로 직접적인 접근 가능
  - JSON 함수를 이용한 빠르고 효과적인 처리
  - JSON 형태로 바로 반환
  - MySQL X DevAPI 사용

<br><br>

## JSON Function

- `JSON_VALID()` : 제이슨 데이터의 유효성 검사
- `JSON_PRETTY()` : 들여쓰기를 포함, 보기 좋게 JSON 출력
- `JSON_OBJECT()` : 문자열 형태가 아닌 key, value 쌍 JSON 생성
- `JSON_ARRAY()` : JSON을 배열 형태로 작성 및 변환
- `JSON_EXTRACT()` : 인라인 패스(->, ->>)처럼 특정값만 추출
- `JSON_VALUE()` : 특정 값 추출, 출력 타입 정의 가능
- `JSON_QUOTE()` : 특정 값 추출 + 큰 따옴표
- `JSON_UNQUOTE()` : 특정 값 추출 + 큰 따옴표 제거
- `JSON_LENGTH()` : JSON key 개수
- `JSON_DEPTH()` : JSON 깊이, 계층
- `JSON_KEYS()` : JSON key들만 추출
- `JSON_TYPE()` : JSON 데이터 타입 출력
- `JSON_SEARCH()` : 특정 값으로 JSON 위치 검색
- `JSON_CONTAINS()` : JSON에 특정 값의 존재 여부 확인
- `JSON_REPLACE()` : JSON에 특정 값 변경
- `JSON_SET()` : JSON에 특정 key, value 제거
- `JSON_REMOVE()` : JSON에 특정 key, value 제거
- `JSON_MERGE()` : JSON에 값 추가 (MySQL8에서 deprecated로 변경)
- `JSON_MERGE_PRESERVE()` : JSON의 특정 위치 값 변경 (기존 값 유지)
- `JSON_MERGE_PATCH()` : JSON의 특정 위치 값 변경 (기존 값 대치)
- `JSON_TABLE()` : JSON을 테이블 형태로 정의
- `JSON_ARRAYAGG()` : 전체 JSON을 취합하여 배열로 출력
- `JSON_OBJECTAGG()` : 전체 JSON을 취합하여 Object로 출력
- `JSON_STORAGE_SIZE()` : JSON 데이터가 차지하는 크기
- `JSON_STORAGE_FREE()` : JSON 컬럼의 여유공간, JSON 있으면 항상 0
