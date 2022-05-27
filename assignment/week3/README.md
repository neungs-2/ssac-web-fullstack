# 과제 3.

### 숫자 야구 게임.

<br>

- 컴퓨터는 3자리의 랜덤 숫자를 생성합니다
- ( ex. 123(⭕), 539(⭕), 112(❌), 012(❌) )
- 플레이어는 3자리의 숫자를 입력합니다.
- 컴퓨터가 생각하는 값과 사용자가 입력한 값의 숫자와 자리를 비교합니다.
- 숫자와 자리가 같으면 Strike, 숫자는 존재하나 자리수가 다르면 Ball을 반환합니다.
- (ex. 컴퓨터-> 249/ 플레이어-> 204 라면 숫자와 자릿수가 같은 2=>1Strike,
  숫자는 있지만 자리는 다른 4 => 1Ball, 반환값: 1S 1B)
- 플레이어는 지정된 라운드까지 반복하여 컴퓨터가 정한 숫자 값을 찾습니다.
- 지정한 라운드 이내에 사용자가 3Strike를 찾아내지 못하면 사용자는 패배합니다.

<br>

---

![Hnet-image](https://user-images.githubusercontent.com/60606025/154853345-b6c124e8-81d0-47b8-8b25-43682b19f189.gif)

<br>

## **Link** : https://baseball.techfulness.kr

<br>

---

## 기능 요소

<br>

### 점수판

- 회차 별 점수 출력

<br>

### 숫자 입력창

- 숫자만 입력되게 구현
- 3 자리가 넘어가지 못하게 구현

<br>

### Check 버튼

- Strike와 Ball 여부를 판단
- 숫자 미입력 시 Alert
- 1 ~ 2 자리 숫자 입력 시 Alert
- 9회차 클릭 시
  - 승/패 여부 및 정답Alert
  - 초기화

<br>

### Restart 버튼

- 초기화

<br>

---

## 발생 이슈

- \<td>를 제거하여 점수판을 초기화 할 때 결함 발생
- Ball 행의 점수가 삭제되지 않는 경우 발생
- 결함은 불규칙적으로 발생

![image](https://user-images.githubusercontent.com/60606025/131172350-4ce1fe25-608c-4b85-a02f-b66fa645e82d.png)

<br>

### 해결

- td 추가 메서드 변경
  - `appendChild(domObject)` --> `insertCell(-1)`
- td 제거 메서드 변경
  - `removeChild(parent.childNodes[n])` --> `deleteCell(1)`

<br>

---

## Etc.

<br>

### File Copy Local to Docker Container

```bash
$> docker cp <파일 경로> <컨테이너명>:<복사할 경로>
```

<br>

### File Copy Docker to NCP Server

```bash
$> rsync -avz -e 'ssh -p <port number>' <File> <hostname>@<IP>:<경로>
```
