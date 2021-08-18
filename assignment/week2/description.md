# 과제 2.

### 현재 경로에 상관 없이 mysql, nginx를 조작할 수 있는 쉘 스크립트와 명령어를 작성하라.

<br>

- start mysql(or nginx) : mysql(nginx)을 시작, start.sh를 작성
- stop mysql(or nginx) : mysql(nginx)을 중지, stop.sh를 작성
- restart mysql(or nginx) : mysql(nginx)을 재시작, restart.sh를 작성

<br>

---

## 예외 처리

```sh
# Handling Exceptions
if [ $# -lt 1 ]; then
    echo "Input Option."
    echo "Usage: Start < mysql || nginx >"
    exit 0

elif [ $1 != "mysql" ] && [ $1 != "nginx" ]; then
    echo "Input correct option"
    echo "Usage: Start < mysql || nginx >"
    exit 0

elif [ $# -gt 2 ]; then
    echo "Choose one or two option(s)."
    echo "Usage: Start < mysql || nginx >"
    exit 0
fi
```

- 변수가 없는 경우
- 옵션 명령어(parameter)가 틀린 경우
- 3개 이상의 옵션을 지정한 경우

<br><br>

## 키워드 변경

```sh
# mysql --> mysqld
options=($@)
cnt=0
for opt in ${options[@]}
do
    if [ $opt == "mysql" ]; then
        options[$cnt]="mysqld"
    fi
    cnt=$(($cnt+1))
done
```

- mysql 실행시 systemctl을 이용하면 mysqld로 입력
- 명령어 옵션은 mysql 이므로 mysqld로 변경

<br><br>

## 명령 실행

```sh
docker="ssacdev"
ncloud="ssac"
ip=ssach

if [ `uname -n` == $docker ]; then
    for opt in ${options[@]}
    do ssh -p 50000 root@$ip "systemctl restart $opt"
    done

elif [ `uname -n` == $ncloud ]; then
    for opt in ${options[@]}
    do systemctl restart $opt
    done
fi
```

- Local 환경은 Docker Container에 구축함.
- Nginx, MySQL은 Naver Cloud Platform 서버에 구축함.
- Docker 과 NCP 원격서버 어디에 있든지 동작할 수 있음.
- **단, 쉘 스크립트와 alias 설정을 Docker와 원격서버 양쪽에 모두 위치시켜야 함.**

<br>

## Etc.

```sh
rsync -avz -e 'ssh -p 50000' ~/bin root@ssach:~
```

```sh
alias start='~/bin/start.sh'
alias stop='~/bin/stop.sh'
alias restart='~/bin/restart.sh'
```

- Rsync를 이용하여 로컬환경에서 작성한 코드를 원격서버로 전송.
- ~/.bashrc 파일에 Alias 설정
