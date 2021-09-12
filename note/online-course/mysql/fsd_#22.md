# MySQL - 데이터 모델 설계

<br>

## S/W Development

<br>

1. 계획 / 기획 (interview)
2. 분석 및 Ideation
   - Usecase Diagram 작성
3. UI / UX 설계
4. DB 설계 (모델링)
   - Usecase 기반으로 ERD(EERD) 작성
5. S/W 및 인프라(Infra) 설계
   - Class Diagram 작성
   - 인프라 견적
6. 구현
   - 코딩 규약, 언어/DB 종류, 스타일 규약 등 약속 후 구현
7. 테스트 및 통합
   - TDD(테스트 주도 개발) 사용한다면 코딩 전에 유닛 테스트 먼저 만들고 구현
8. 오픈(Release)
9. 유지보수(운영)

<br>

---

## Database Modeling

<br>

1. 개념적(Conceptual, Contextual) 모델링→ Entity 도출
2. 논리적(Logical) 모델링→ Data 구조 및 속성 정의→ 무결성 정의 및 정규화(Normal Form, NF)
3. 물리적(Physical) 모델링→ Schema, Table, Index 생성

<br>

---

## 데이터 모델 설계

1. 요구 사항 분석
2. UseCase Diagram 작성
3. Entities, Functions 도출
4. Relationships - E(E)RD 작성
5. 생성 (Pysical Modeling)

<br>

---

## S/W 설계

UseCase Diagram (요구 사항 분석)

- 명사 : entities
- 동사 : queries
  <br>

(UseCase Diagram 바탕으로 S/W 설계)

- Deployment Diagram
- Sequence Diagram
- Class Diagram
- State Diagram / Flow Chart

<br>

---

## 정규화

- 정규화의 목적, 목표
  - 중복 데이터를 없애고 관계를 단순하게
- **제1정규화(1NF)** : 원자성
  - 모든 속성은 하나의 값만 갖는다! - 예) `물건`에 소유자 '홍길동,김길동'?!
- **제2정규화(2NF)** : 완전 함수적 종속 (부분 종속 제거)
  - 모든 속성은 기본키에 종속되어야 한다! - 예) `계약`에 임대인 연락처?!
- **제3정규화(3NF)** : 이행 종속 제거
  - 기본키가 아닌 모든 속성 간에는 서로 종속될 수 없다! - 예) 우편번호와 기본 주소?!
- cf. **BCNF(Boyce and Codd Normal Form)**
  - 모든 결정자는 후보키에 속해야 한다! - 예) 임차인은 1개의 물건만 올린다고 했을 때, `물건`에 임차인 이름?!

<br>

---

## 반정규화

- 반정규화는 성능은 높여주지만 값 하나가 변하면 나머지도 모두 같이 변해야 함
- 관리를 잘 해줘야 하므로 유지보수 계획 잘 세워야 함.
- 뷰를 두는 방법도 있지만, 뷰를 두어도 성능이 모자라다면 반정규화

<br>

- **테이블 반정규화**
  - 중복 : 1대1 관계인 두 테이블이 빈번히 join이 일어나면 두 테이블 합치는 것
  - 통계 : 성능을 위해 통계치를 따로 저장해두는 것 (진짜 필요할 때만)
  - 이력 : (변경에 대한) 이력만 따로 저장
- **컬럼 반정규화**
  - 여러 요소가 매번 같이 조회된다면 여러 데이터 요소를 한 컬럼에 합쳐서 테이블에 저장
- **관계 반정규화**
  - 여러 테이블을 조인해야 한다면 조인할 컬럼을 다른 테이블에 중복으로 생성

<br>

---

## 모델링 요령

- PK가 가장 중요!
  - 유일값 갖는 기본키 필수
  - 변경 없는 안정적인 값 & not null
  - 가능한 1개 컬럼, 실수보다는 정수형(Auto Increment)
- 적절한 정규화
  - 1NF 최대한 준수, 중복 데이터 없도록
  - 계산 결과 컬럼은 최대한 자제
  - Nullable 할 필요 없다면 Not Null로
- 참조 무결성을 위해 FK 정의
- 서로 다른 성격의 컬럼들은 테이블 분리
- Column이 Row보다 비용이 비쌈

<br>

---

## Note.

### UseCase Diagram 작성

- Tools
  - https://app.diagrams.net/ (draw.io)
  - https://staruml.io/ (for Desktop)
  - Online Visual-Paradigm (for Web)
- draw.io에서 Blank Diagram으로 그릴 수 있음
- UML 탭에서 아이콘 선택

### ERD/EERD

- Workbench 이용하여 쉽게 작성 가능
- forward engineering 으로 바로 테이블 생성 가능
- reverse engineering 으로 검토
