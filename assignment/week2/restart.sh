#!/bin/bash

# Handling Exceptions
if [ $# -lt 1 ]; then
    echo "Input Option."
    echo "Usage: Start < mysql || nginx >"
    exit 0

elif [ $1 != "mysql" ] && [ $1 != "nginx" ]; then
    echo "Input correct option"
    echo "Usage: Start < mysql || nginx >"
    exit 0

elif [ $# -eq 2 ]; then
    if [ $2 != "mysql" ] && [ $2 != "nginx" ]; then
        echo "Input correct option"
        echo "Usage: Start < mysql || nginx >"
        exit 0
    fi

elif [ $# -gt 2 ]; then
    echo "Choose one or two option(s)."
    echo "Usage: Start < mysql || nginx >"
    exit 0
fi

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

# do restart
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

