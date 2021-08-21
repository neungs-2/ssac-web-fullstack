# 리눅스(Linux)-실무에서 꼭 필요한 기술(2/2)

## vmstat (Virtual Memory STATistics)

- 가장 많이 쓰는 모니터링 도구

<br>

### Column item 설명

- procs : 프로세스(CPU)
  - r : runnable(실행 대기) queue에 쌓인 process 수
  - b : blocked(인터럽트할 수 없는 sleep된) process 수

<br>

- --memory-- : 메모리 사용
  - swpd : swapped memory size
  - free : free(미사용) memory size
  - buff : buffered(사용중인 버퍼) size
  - cache : cached memory size

<br>

- ---swap-- : 메모리 swapping 상태
  - si :swapped in - 1초간 load된 size
  - so :swapped out -1초간 write된 size

<br>

- ---io--- : Block I/O
  - bi : block in - 1초간 디바이스로부터 read된 size
  - bo : block out - 1초간 디바이스로 write된 size

<br>

- --system-- : interrupt나 context switch
  - in : interrupt - 1초간 interrupted 횟수
  - cs : context switch - 1초당 context switch 횟수

<br>

- ----cpu---- : cpu 가동 상황
  - us : User application 실행 비율
  - sy : System Kernel 실행 비율
  - id : CPU idle time
  - wa : I/O waiting time
  - st : stolen - 가상 머신 실행 비율

### 옵션

```sh
$user> vmstat          # 한번만 출력
$user> vmstat 1        # 1초에 한번씩 출력
$user> vmstat -a
$user> vmstat -d
$user> vmstat -s
```

- -a : memory를 inactive vs active 로 표현
  - inact : 사용되지 않는 메모리의 양
  - active : 사용중인 메모리의 양

<br>

- -d: disk 사용량 보여줌

  - Reads (읽기)

    - total : 성공한 모든 읽기 작업 개수
    - merged : 하나의 I/O로 묶은 읽기 작업 수
    - sectors : 성공적으로 읽은 섹터 수
    - ms : 읽기 작업을 하는데 소요된 시간(밀리초)

  - Wrties (쓰기)

    - total : 성공한 모든 쓰기 작업 개수
    - merged : 하나의 I/O로 묽은 쓰기 작업 수
    - sectors : 성공적으로 쓴 섹터 수
    - ms : 쓰기 작업을 하는데 소요된 시간(밀리초)

  - I/O (입출력)
    - cur : 현재 수행 중인 I/O 수
    - sec : I/O를 수행하는데 소요된 시간(초)

<br>

- -s : total stat

<br>

---

## sar (System Activity Reporter)

- 과거의 시스템 상태를 보기 위해 사용
  - vmstat은 현재상태
- log 데이터가 있는 /var/log에 위치

```sh
# CPU average
$user> sar
$user> sar -f /var/log/sa/sa20  #20일의 데이터

# memory average
$user> sar -r
$user> sar -f /var/log/sa/sa20 -r

# load average
$user> sar -q

```

<br>

---

## netstat (NETwork STATistics) & ss

<br>

- 네트워크 모니터링을 위해서 사용
- 고객들이 접속 안될 때 vmstat, sar에서 시스템 문제 발견 못했다면 --> 네트워크 문제
- 더 자세히, 빠르게 보고 싶을 때 ss 사용

```sh
# install in docker
$user> yum install net-tools -y

# netstat
$user> netstat
$user> netstat -a | more
$user> netstat -an
$user> netstat -anl
$user> netstat -an | grep 3306

# cf. ss (more fast)
$user> ss -an | grep 3306

```

<br>

---

## Load Balancing

- 다수의 중앙처리장치 혹은 저장장치와 같은 컴퓨터 자원들에게 작업을 나누는 것
- 서버를 여러대 두어 특정 방식에 따라 작업, 부하를 나눔
- 가용성과 응답시간을 최대화

<br>

### L/B Algorithm Type

- Round Robin
- Least Connection
- Weighted Least Connection
- Fastest Least Connection
- Adaptive
- Fixed

- 이외에도 다양한 종류 존재
  - Hashing
  - Min Misses
  - Random
  - URL-based
  - Cookie
  - SSL session ID

<br>

---

## NFS (Network File System) 구성하기

<br>

- 한 시스템(클라이언트)에서 다른 시스템(서버)의 자원을 자신의 자원처럼 사용이 가능하도록 하는 것
- 여러명이 같이 사용하는 프로그램, 데이터들을 하나의 호스트에 넣어두고 각 클라이언트들이 호스트의 디렉토리를 마운트하여 사용

```sh
# install both (nfs server & client)
$user> yum install net-tools -y

# server (nfs server)
$user> yum install nfs-utils rpc-bind -y
$user> mkdir /upload
$user> chmod 757 /upload
$user> vi /etc/exports
# /upload <client-ip>(rw,sync) ---> exports에 입력

$user> systemctl start nfs-server    # or systemctl restart nfs
$user> systemctl enable nfs-server
$user> exportfs -v  # --> 설정 잘 됐는지 확인
# 방화벽(ACG): TCP/UDP(111, 2049)

# client (nfs client: other server)
$user> mount -t nfs <server-ip>:<server-mount-path> <client-mount-path>
$user> df -h      # umount <client-mount-path> --> 마운트 해제


```

<br>

---

## Note.

- Blocked/Wating Process
  - 입출력 연산 완료처럼 어떤 이벤트 발생까지 수행 불가한 프로세스<br><br>
- Buffer
  - 데이터를 한 곳에서 다른 한 곳으로 전송하는 동안 일시적으로 그 데이터를 보관하는 메모리의 영역 (= Queue 형태)<br><br>
- swap
  - 메모리가 부족할 때 디스크를 메모리처럼 쓰는 것<br><br>
- context switch
  - 멀티태스킹 컨텍스트에서, 한 태스크에 대해 시스템 상태를 저장하여 작업을 일시 중지하고 다른 태스크가 재개되도록 하는 프로세스<br><br>
