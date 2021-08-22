# {Tip & Tech - linux} getopts, getopt - 셸 스크립트에 우아한 옵션 주기

<br>

## 셸 스크립트나 함수가 파라미터(argument)를 받는 기본 방식

- $@ : 모든 옵션(파라미터)
- $# : 파라미터 개수
- $1, $2, ... $n : n번째 파라미터

<br>

---

## getopts

- option_string

  - 옵션을 정의하는 문자
  - 뒤에 콜론(:) 존재 시 옵션값을 받음
  - (d:u:f:h)이면 h는 값을 받지 않음

- varname
  - 옵션 명(d,u,f,h)을 받을 변수
  - OPTARG 변수에는 실제 옵션의 값이 세팅

<br>

```sh
#!/bin/bash

print_try() {
    echo "Try 'datefmt2.sh -h' for more information"
    exit 1
}

print_help() {
    echo "usage: datefmt2.sh -d <diffs> -u <unit> [-f format]"
    exit 1
}

while getopts d:u:f:h opt
do
    echo "opt=$opt, OPTARG=$OPTARG"
    case $opt in
        d)
            D=$OPTARG;;
        u)
            U=$OPTARG;;
        f)
            F=$OPTARG;;
        h)
            print_help;;
        *)
            print_try;;
    esac
done

# Format 주어지지 않았을 때 default option 설정
if [ -z $F ]; then
    F="+%m-%d"
fi

RET=`date $F --date="$D $U"`
echo "$RET"
```

<br>

---

## getopt

`getopt -o|--options shortopts [-l|--longoptions longopts] [-n|--name progname] [--] parameters`

- shortopts
  - 옵션을 정의하는 문자
- longopts
  - 긴 옵션을 정의하는 문자 (--diffs와 같은 긴 옵션 정의)
  - 콤마(,)로 구분
- progname
  - 오류 발생시 리포팅할 프로그램 명칭 (현재 셸 스크립트 파일명)
- parameters
  - 옵션에 해당하는 실제 명령 구문 (보통 $@ 사용)

```sh
#!/bin/bash

print_try() {
    echo "Try 'datefmt3.sh -h|--help' for more information"
    exit 1
}

print_help() {
    echo "usage: datefmt3.sh -d|--diffs <diffs> -u|--unit <unit> [-f|--format format]"
    exit 1
}

options="$(getopt -o d:u:f:h -l diffs:,unit:,format:,help -n $0 -- "$@")"
eval set -- $options

while true
do
    case $1 in          # $1 : -d or -diffs
        -d|--diffs)
            D=$2        # $2 : <diffs>
            shift 2;;   # set 시킨게 2개 이동 ==> $1 = $3(-u|--unit)으로 바뀜
        -u|--unit)
            U=$2
            shift 2;;
        -f|--format)
            F=$2
            shift 2;;
        h|--help)
            print_help;;
        --)
            break;;
        *)
            print_try;;
    esac
done

RET=`date $F --date="$D $U"`
echo "$RET"

# $> ./datefmt3.sh -d 3 --unit month --format +%Y-%m-% 실행시
# date +%Y-%m-%d --month 3 이 실행된 결과가 출력
```

<br>

---

## set

<br>

- 위치 매개변수 $1, $2, $3, ...을 설정
- -a 처럼 하이픈이 있으면 설정으로 인식
  - --을 앞에 붙여주면 하이픈도 문자로 인식
- `set [-options] [-o option-name] [--] [arg ...] option_string varname`

```sh
$> set a b c
$> echo $1   # a
$> echo $2   # b
$> echo $@   # a b c

$> set -a b c
$> echo $@   # b c

$> set -- -a b c
$> echo $@   # -a b c
```

```sh
# set 이용하면 간단한 코드 작성 가능
$> date | awk '{print $5}'  # 시간:분:초

$> set $(date)
$> echo $5    # 시간:분:초
```

<br>

---

## Shell Script를 명령으로 등록하기

<br>

### 방법 1. alias를 이용하는 방식

- `.bashrc`나 `.bash_profile` 에 해당 셸 스크립트의 alias를 주어 등록
  - ex) alias datefmt='/root/bin/datefmt.sh'

<br>

### 방법 2. 시스템 명령 디렉토리에 셸 스크립트를 위치시키거나 심볼릭 링크를 거는 방식

<br>

sbin: 시스템 관리와 관련된 명령 위치<br>
bin: 일반적인 명령 위치<br>

- **/sbin** or **/bin**
  -/bin/sh, /bin/bash처럼 시스템(커널)에 가장 가까운 명령들이 위치하는 대표적인 시스템 명령의 경로

  - 이들은 자체 디렉토리로도 사용가능하지만, 보통 각각 /usr/sbin, /usr/bin으로 심볼릭 링크를 걸어 놓음

- **/usr/sbin** or **/usr/bin**

  - grep, ln, ls, cat, find, yum 등 모두를 위한 명령 (일반적 리눅스 명령)들이 위치
  - 개인이 만든 명령은 위치하지 않음

- **/usr/local/sbin** or **/usr/local/bin**
  - 사용자가 만든 시스템 관리에 사용되는 명령들을 가질 시스템 디력토리
  - 사용자가 만든 일반적인 명령들을 가진 디렉토리

<br>
