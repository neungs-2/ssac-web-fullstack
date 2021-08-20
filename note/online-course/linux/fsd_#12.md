# 리눅스(Linux)-실무에서 꼭 필요한 기술(1/2)

## Sudo 권한 부여

- 다른 계정에게 **sudo** 권한을 줘야할 때
  1. root 계정으로 `visudo` 입력
  2. wheel 관련 검색어 찾기 위해 `/wheel` 입력
  3. 명령어 1, 2를 주석 해제 (# 지워주기)
  4. `usermod -aG wheel <user명>` 으로 user에게 sudo 권한 주기

```bash
$root> visudo
# 명령어1: %wheel  ALL=(ALL)       ALL
# 명령어2: %wheel  ALL=(ALL)       NOPASSWD: ALL
$root> usermod -aG wheel <user>

# sudo 권한 사용 가능
$user> sudo bash
$user> sudo vi /etc/hosts
```

<br>

---

## 파일 압축

<br>

### gzip, xz, bzip2

- **gzip** 많이 쓰임
- 성능 좋은 순서: **xz > bzip2 > gzip**

```sh
$user> gzip x.log         # 압축: x.log → x.log.gz
$user> gzip x.log.gz -d   # 압축풀기: x.log.gz → x.log
$user> gzip x.log.gz -l   # compress status & list

# gzip 자리에 xz, bzip2 넣어서 쓰면 동일함
```

<br>

### zip

- Windows 호환을 위해 **zip** 사용
- 성능은 gzip과 비슷함
- gzip 등과 다르게 원본파일을 보존하면서 압축파일 새롭게 생성

```sh
$user> zip x.log.zip x.log        # zip <만들파일명> <압축할 파일명>
$user> unzip x.log.zip            # unzip <압축 풀 파일명>
$user> zip -P "암호" x.zip x/*    # 암호 걸어야 할 때
```

<br>

### tar

- 다수의 파일을 묶어서 압축
- 명령어 뒤의 z를 풀면 묶고 풀기만 하고 압축은 안함
- 현장에서 많이 씀
- **[옵션]**
  - c : 다수 파일을 .tar로 묶기
  - x : .tar를 다수 파일로 풀기
  - v : 명령어 실행과정을 자세히 보고 싶을 때
  - f : default 명령어로 무조건 붙여야 함
  - z : gzip으로 압축/풀기
  - J : xz로 압축/풀기
  - j : bzip2로 압축/ 풀기

```sh
$> tar cvfz xxx.tar.gz *.log # 압축: cvfz(J,j) <만들 파일명> <압축할 파일들>
$> tar xvfz xxx.tar.gz       # 압축풀기: xvfz(J,j) <압축 풀 파일명>

# *.log는 log 확장자를 가진 모든 파일을 의미
```

<br>

---

## ftp sftp

<br>

### ssh 기반의 ftp인 sftp 설정하기

1. ftp 계정 생성 (선택사항, 보안 목적)
   - `useradd -s /bin/false <user명>
   - 이후 비밀번호도 수정하기 `passwd <user명>`
2. /etc/ssh/sshd_config 설정
   - `Subsystem sftp /usr/libexec/openssh/sftp-server` 의 경로를 다음과 같이 변경
   - `Subsystem sftp internal-sftp` --> 변경 후
   - Match Group sftp 블록을 이용한 다양한 설정
     > 참조: https://wiki.archlinux.org/title/SFTP_chroot
3. sshd 재시작하여 설정 적용
   - `$> systemctl restart sshd`

<br>

```sh
# 외부업체가 ftp 열어달라고 할 때 ssh 로그인이 불가한 계정으로 생성해서 줌 (/bin/false)
$user> useradd -s /bin/false ftpuser
$user> vi /etc/ssh/sshd_config

# 아래 명령어 원래 실행되야 하는데 WSL 기반 Docker 사용중이라면 안될 수도 있다.
# 그럴 때는 /sbin을 이용한 컨테이너를 다시 생성해야 함.
# https://galid1.tistory.com/323 참고

$user> systemctl restart sshd
```

<br>

### sftp 사용법

- get : 다운로드
- put : 업로드

```sh
# connect to sftp server
$> sftp -P 50000 ftpuser@106.10.46.114
sftp> help
sftp> get <file>
sftp> get -r <directory>
sftp> put <file>           #cf. put -r <directory>

# for local
sftp> lls
sftp> lpwd
sftp> lcd
sftp> bye
```

MAC, Window 라면 FTP 프로그램 사용이 더 편리해보임

<br>
<br>

---

## 지난 log 파일 정리하기

<br>

- 일정 시간 지난 파일 제거하는 shell script 작성
- 작성 후에는 실행권한 줘야 함 `chmod +x <파일경로>`
- cron 을 이용해서 일정 주기마다 쉘을 자동 실행
  - at를 이용해서 일회성으로 실행할 수도 있음.

```sh
$user> find . -name "*.gz"           # 압축된 파일 찾기 (다 로그 파일이라고 가정)
$user> find . -name "*.gz" | wc -l   # 개수 세기
$user> find . -name "*.gz" | sort
$user> find . -name "*.gz" -mtime +30   # 30일 이상 경과된 파일 찾기
$user> find . -name "*.gz" -mtime +30 -delete  # 30일 넘은 파일 제거

# sort, uniq (누가 감히 어뷰징을?!)
$user> cd /var/log/nginx
$user> cat access.log | awk '{print $1}' | sort | uniq
$user> cat access.log | awk '{print $1}' | sort | uniq -c

#cf. cat access.log | awk '{print $1}' | sort | uniq -c | sort -r
#cf. at -f /root/bin/rmoldlogs.sh 19:27

```

<br>

---

## Name Server - DNS (resolv.conf)

- `$> nslookup <도메인>` 명령어 출력
  - 상단 Server, Address 는 주소를 알려준 서버 정보 (NCP의 Name server)
  - 하단 Name, Address는 내 공인 IP (NCP 공인 IP)
- Name Server (=DNS 서버) 정보 위치 `/etc/resolv.conf`
- 기본 DNS 서버가 죽으면 보조 DNS 서버가 알려줌
- DNS 서버 설정이 잘못되어 있으면 계속 느려짐.
  - resolv.conf에서 재설정

<br>

---

## Note.

- **at** 는 crontab과 유사하지만 일회성으로 동작
- rsync 와 ftp
  - rsync는 택배처럼 내가 파일을 바로 쏴주는 형태
  - ftp는 드롭박스처럼 파일을 게시하면 유저가 받아가는 형태
