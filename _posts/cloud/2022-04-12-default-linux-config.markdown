---
title:  "리눅스 기본세팅 정리(+파티션 세팅)"
created:   2022-04-12 21:00:00 +0900
updated:   2022-04-20 18:00:00 +0900
author: namu
categories: cloud
permalink: "/cloud/:year/:month/:day/:title"
image: https://www.orangesputnik.eu/wp-content/webpc-passthru.php?src=https://www.orangesputnik.eu/wp-content/uploads/2020/04/ubuntu-20-04-fossa.jpg&nocache=1
image-view: true
image-author: www.orangesputnik.eu
image-source: https://www.orangesputnik.eu/ubuntu-20-04-lts-quick-review/
---

---

### 목차

1. [기본환경 설정](#1-기본환경-설정)
    - [서버 호스트명 설정](#서버-호스트명-설정), [패키지 업데이트 및 업그레이드](#패키지-업데이트-및-업그레이드),
    [접속 메시지 설정](#접속-메시지-설정), [셸 프롬프트 포맷 설정](#셸-프롬프트-포맷-설정), [서버시간 설정](#서버시간-설정),
    [한글 인코딩 설정](#한글-인코딩-설정), [시스템 로깅 설정](#시스템-로깅-설정), [히스토리 포맷 설정](#히스토리-포맷-설정)
2. [계정 설정](#2-계정-설정)
    - [admin, dev, 일반계정 생성 및 권한 설정](#admin-dev-일반계정-생성-및-권한-설정), [자동 로그아웃](#자동-로그아웃),
    [Alias 설정](#alias-설정)
3. [디스크 파티션 설정](#3-디스크-파티션-설정)
    - [디스크 추가 및 파티션 분할](#디스크-추가-및-파티션-분할), [/swap 파티션 설정](#swap-파티션-설정),
    [/tmp 보안 설정](#tmp-보안-설정), [/DATA 파티션 설정](#data-파티션-설정),
    [추가로 권장되는 파티션 설정](#추가로-권장되는-파티션-설정)
4. [패키지 관리](#4-패키지-관리)
    - [vi](#vi), [git](#git), [cron](#cron)
5. [보안](#5-보안)
    - [방화벽 및 SELinux 종료](#방화벽-및-selinux-종료),
    [SSH 설정 (port 변경, root 접속 불가)](#ssh-설정-port-변경-root-접속-불가), [SSH 서버 보안 (fail2ban)](#ssh-서버-보안-fail2ban)

### 참조

- <a href="https://victorydntmd.tistory.com/212" target="_blank">[CentOS] 리눅스 설치 후 기본적인 설정</a>
- <a href="https://javafactory.tistory.com/324" target="_blank">리눅스 기본 03 - 리눅스 설치 후 기본 세팅, 디렉토리</a>
- <a href="https://howcode.co.kr/main/adm_server/1125"
target="_blank">우분투 Ubuntu 20.04 서버 시간 / 타임존 변경하기 / Timezone 설정</a>
- <a href="https://webdir.tistory.com/112" target="_blank">[CentOS] /tmp 디렉토리 보안</a>

---

<br>
## 들어가며

AWS EC2 인스턴스를 생성하면 설치되는 리눅스 OS 에 기본적으로 필요한 세팅을 정리합니다.<br>
OS 버전은 **Ubuntu 20.04 LTS** 기준입니다.

[목차](#목차)에서 필요항목을 검색해 활용하시기 바랍니다.

<br>
## 1. 기본환경 설정

### 서버 호스트명 설정

```text
$ su - root
Password:
root@ip-10-20-110-110:~# 
root@ip-10-20-110-110:~# hostname
ip-10-20-110-110
root@ip-10-20-110-110:~# 
root@ip-10-20-110-110:~# hostnamectl set-hostname my-service
root@ip-10-20-110-110:~# hostname
my-service
root@ip-10-20-110-110:~# 
root@ip-10-20-110-110:~# exit
logout
$ su - root
Password:
root@my-service:~# 
root@my-service:~# cat /etc/hostname
my-service
```

root 로그인 후 hostname 확인, **hostnamectl** 커맨드로 변경 후 재로그인하여 프롬프트 확인합니다.
**/etc/hostname** 파일로 확인도 가능합니다. (이 파일을 직접 수정해도 됨)

<br>

---

<br>
### 패키지 업데이트 및 업그레이드

현재 OS 시스템에서 사용 가능한 패키지 정보를 업데이트합니다.

```text
[root@my-service: ~]# apt-get update
```

이후 업데이트된 정보를 바탕으로 설치된 모든 패키지들을 최신 버전으로 업그레이드합니다.

```text
[root@my-service: ~]# apt-get -y upgrade
```

다음으로 기본적인 패키지들을 설치합니다.
이미 설치된 패키지는 건너띄게 되니 아래 커맨드를 그대로 입력해도 무방합니다.

```text
[root@my-service: ~]# apt-get install -y vim curl git wget make llvm rsync net-tools rdate glances
```

여기에 필요로 하는 패키지들을 띄어쓰기로 구분해서 더 추가할 수 있습니다.

<br>

---

<br>
### 접속 메시지 설정

- **/etc/issue**: 로컬 접속시, 패스워드 로그인 전 메시지
- **/etc/issue.net**: 원격 접속시, 패스워드 로그인 전 메시지 (SSH, TELNET)
- **/etc/motd**: 접속 성공시 출력되는 메시지

SSH 원격접속 세팅을 위해 **/etc/issue.net**, **/etc/motd** 파일을 수정합니다.

```text
root@my-service:~# vim /etc/issue.net

```

In vim editor page,

```text
###################################################################
#                      Welcom to my service!                      #
#            All connections are monitored and recorded           #
#    Disconnect IMMEDIATELY if you are not an authorized user!    #
###################################################################

:wq
```

```text
root@my-service:~# vim /etc/motd

```

In vim editor page,

```text
###################################################################
#                      Welcom to my service!                      #
#            All connections are monitored and recorded           #
#    Disconnect IMMEDIATELY if you are not an authorized user!    #
###################################################################

:wq
```

메시지는 원하는 형태로 변형해도 무방합니다.

다음으로 SSH 설정파일을 수정하고 재기동합니다. (**/etc/ssh/sshd_config**)

```text
root@my-service:~# vim /etc/ssh/sshd_config

```

In vim editor page,

```text

...

Banner /etc/issue.net

...

PrintMotd yes

...

:wq
```

위와 같이 Banner, PrintMotd 설정을 입력한 후, SSH 서비스를 재기동합니다.

```text
root@my-service:~# 
root@my-service:~# systemctl restart sshd.service
root@my-service:~# 
```

<br>

---

<br>
### 셸 프롬프트 포맷 설정

셸 프롬프트 포맷인 **PS1** 환경변수를 설정하기 위해 각 레벨에 따른 환경설정 파일을 수정해야 합니다.

먼저 환경변수 파일의 인식 순서를 살펴봅시다

**<a href="https://zetawiki.com/wiki/Profile_bashrc_bash_profile_%EC%8B%A4%ED%96%89_%EC%88%9C%EC%84%9C"
target="_blank">[환경변수 파일의 인식 순서 - 제타위키]</a>**
```text
1. /etc/profile -> /etc/profile.d/*.sh
2. ~/.bash_profile or ~/.profile -> ~/.bashrc -> /etc/bashrc
```
(위 순서는 각 파일의 맨 윗부분에 실행 코드를 추가한 경우로, 파일 간 참조관계에 따라 호출 순서가 바뀔 수 있습니다.)

특정 유저의 셸 프롬프트를 설정하려면, **$HOME/** 디렉토리 하위의 설정파일을(**~/.bashrc**),<br>
전체 유저의 셸 프롬프트를 설정하려면, **/etc/** 디렉토리 하위의 설정파일을(**/etc/bashrc**) 수정합니다.

수정할 파일에 다음의 export 라인을 추가합니다.

```text
export PS1="[\[\e[1;31m\]\u\[\e[m\]@\[\e[1;32m\]\h\[\e[m\]: \[\e[1;36m\]\w\[\e[m\]]\$ "
```

- **요소 설명**
    - **\u**: 계정명
    - **\h**: 호스트명
    - **\w**: 현재 디렉토리
    - **\$**: root 유저인 경우(UID 가 0) '#' 출력, 아니라면 '$' 출력
    - **\[\e[1;31m\]**: 색상블록 시작
        - 1 은 굵기를 의미하고 30~37 까지 ANSI Foreground 색상을 뒤에 입력, m 은 색상의 변경을 의미
        - 30(검정, Black), 31(빨강, Red), 32(녹색, Green), 33(노랑, Yellow), 34(파랑, Blue), 35(보라, 자주색, Magenta),
        36(청록, Cyan), 37(하얀색, White)
    - **\[\e[m\]**: 색상블록 종료

이후 다음의 명령으로 셸 재적용합니다.

```text
root@my-service:~# source /etc/bashrc  // or ~/.bashrc
[root@my-service: ~]#   // <- 프롬프트 포맷, 색상 적용됨
```

<br>

---

<br>
### 서버시간 설정

Timezone 정보는 **```/usr/share/zoneinfo```** 디렉토리 내에 있습니다.
한국의 KST(+0900) 시간대 정보는 **```/usr/share/zoneinfo/Asia/Seoul```** 파일에 저장되어 있습니다.

서버의 시스템 Timezone 은 **```/etc/localtime```** 링크 파일로 연결합니다.

```text
[root@my-service: ~]# ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
[root@my-service: ~]# timedatectl
               Local time: Fri 2022-04-15 00:32:32 KST
           Universal time: Thu 2022-04-14 15:32:32 UTC
                 RTC time: Thu 2022-04-14 15:30:41
                Time zone: Asia/Seoul (KST, +0900)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
```

혹은 **timedatectl** 커맨드를 이용합니다.

```text
[root@my-service: ~]# timedatectl set-timezone 'Asia/Seoul'
[root@my-service: ~]# timedatectl
               Local time: Fri 2022-04-15 00:32:48 KST
           Universal time: Thu 2022-04-14 15:32:48 UTC
                 RTC time: Thu 2022-04-14 15:30:57
                Time zone: Asia/Seoul (KST, +0900)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
```

다음으로 **서버시간을 동기화**합니다. 시간 동기화 대상은 **time.bora.net** 입니다.<br>
**rdate** 툴을 활용합니다.

```text
[root@my-service: ~]# apt-get install rdate
[root@my-service: ~]# rdate -s time.bora.net
[root@my-service: ~]# date
Fri Apr 15 00:43:32 KST 2022
[root@my-service: ~]# 
[root@my-service: ~]# crontab -e
no crontab for root - using an empty one

Select an editor.  To change later, run 'select-editor'.
  1. /bin/nano        <---- easiest
  2. /usr/bin/vim.basic
  3. /usr/bin/vim.tiny
  4. /bin/ed

Choose 1-4 [1]: 3
```

3번 vim 에디터를 실행하고
**```00 00 * * * /usr/bin/rdate -s time.bora.net```** 크론탭 설정라인을 추가하여 하루에 한번씩 동기화가 진행되도록 합니다.<br>
(크론탭: min(0-59) hour(0-23) day(1-31) month(1-12) week(0-6, 0=Sunday))

<br>

---

<br>
### 한글 인코딩 설정

한글 인코딩이 설정되어 있지 않으면 파일 및 디렉토리 이름, 혹은 파일내용상 한글이 깨져서 나올 수 있습니다.
한글 인코딩 설정파일명은 **ko_KR.UTF-8** 입니다.

먼저 현재 인코딩 설정을 확인한 후 사용 가능한 인코딩 정보를 확인합니다.

```text
[root@my-service: ~]# echo $LANG
C.UTF-8
[root@my-service: ~]# 
[root@my-service: ~]# locale
LANG=C.UTF-8
LANGUAGE=
LC_CTYPE="C.UTF-8"
LC_NUMERIC="C.UTF-8"
LC_TIME="C.UTF-8"
LC_COLLATE="C.UTF-8"
LC_MONETARY="C.UTF-8"
LC_MESSAGES="C.UTF-8"
LC_PAPER="C.UTF-8"
LC_NAME="C.UTF-8"
LC_ADDRESS="C.UTF-8"
LC_TELEPHONE="C.UTF-8"
LC_MEASUREMENT="C.UTF-8"
LC_IDENTIFICATION="C.UTF-8"
LC_ALL=
[root@my-service: ~]# 
[root@my-service: ~]# locale -a
C
C.UTF-8
POSIX
en_US.utf8
[root@my-service: ~]# 
```

위 출력내용 중 **LC_ALL** 은 전역 locale 설정으로써 가장 높은 우선순위를 갖습니다. 여기서는 해당 설정값이 없습니다.<br>
**LANG** 도 전역 locale 이지만 다른 설정값이 없을 경우 우선순위를 갖습니다.

**```locale -a```** 결과 사용 가능한 한글 설정값이 없으므로 새로 설치 후 설정해줍니다.

```text
[root@my-service: ~]# locale-gen ko_KR.UTF-8
Generating locales (this might take a while)...
  ko_KR.UTF-8... done
Generation complete.
[root@my-service: ~]# dpkg-reconfigure locales
Generating locales (this might take a while)...
  en_US.UTF-8... done
  ko_KR.UTF-8... done
Generation complete.
[root@my-service: ~]# 
[root@my-service: ~]# locale -a
C
C.UTF-8
POSIX
en_US.utf8
ko_KR.utf8
[root@my-service: ~]# 
[root@my-service: ~]# localectl set-locale LANG=ko_KR.UTF-8
[root@my-service: ~]# 

------- 재로그인 혹은 재부팅 후 -------

[root@my-service: ~]# echo $LANG
ko_KR.UTF-8
```

**ko_KR.UTF-8** 인코딩셋을 새로 생성 및 설정 후 목록에 나타난다면 **localectl** 커맨드로 설정합니다.<br>
재로그인 후 확인하면 잘 변경된것을 볼 수 있습니다.

<br>

---

<br>
### 시스템 로깅 설정

시스템 로깅은 **rsyslog** 및 **logrotate** 프로그램에 의해 기본적으로 관리됩니다.
먼저 rsyslog 설정에 전체 시스템에 대한 값을 추가합니다.<br>
(**/etc/rsyslog.d/50-default.conf**: 어떤 시스템 로그를 어떻게 처리할 것인지 설정)

```text
[root@my-service: ~]# vim /etc/rsyslog.d/50-default.conf
```

In vim editor page.

```text
...
*.notice                        /var/log/messages
*.alert                         /dev/console

:wq
```

```text
[root@my-service: ~]# systemctl restart rsyslog
[root@my-service: ~]# chmod 640 /etc/rsyslog.conf
[root@my-service: ~]# chown root /var/log/messages
```

전체 서비스(*)의 'notice' 메시지는 **/var/log/messages** 에 추가되고,<br>
전체 서비스(*)의 'alert' 메시지는 **/dev/console** 에 추가됩니다.

rsyslog 의 conf 파일은 other 사용자들이 접근하지 못하게 권한을 변경하고,<br>
로깅 메시지의 소유권은 root 로 변경합니다.

다음으로 **logrotate** 는 로깅 파일의 주기적인 관리기능을 제공하는데,
rsyslog 의 경우 기본 주단위로 파일이 관리되도록 세팅됩니다.

보다 자세한 내용은 검색해보시기 바랍니다.

<br>

---

<br>
### 히스토리 포맷 설정

콘솔에서 **history** 커맨드를 입력하면 이전에 입력했던 커맨드 기록을 최대 1000 라인까지 출력합니다.
이 기록에는 입력한 시점의 정보가 기록되지 않아, **history** 의 기본적인 포맷을 지정하도록 하겠습니다.

**HISTTIMEFORMAT** 환경변수 정보를 우선순위가 높은 **/etc/profile** 에 추가합니다.

```text
[root@my-service: ~]# vim /etc/profile
```

In vim editor page.

```text
...
export HISTTIMEFORMAT="[%Y-%m-%d %H:%M:%S]: "

:wq
```

이후 셸을 재기동하여 확인합니다.

```text
[root@my-service: ~]# source /etc/profile
[root@my-service: ~]# history
...
  556  [2022-04-16 14:36:42]: vim /etc/profile
  557  [2022-04-16 14:37:27]: source /etc/profile
  558  [2022-04-16 14:37:29]: history
```

포맷이 잘 적용된것을 볼 수 있습니다.

<br><br>
## 2. 계정 설정

### admin, dev, 일반계정 생성 및 권한 설정

<br>

---

<br>
### 자동 로그아웃

시스템에 로그인한 사용자가 무기한 머무를 수는 없으므로,
동작이 없을 시 자동 로그아웃 설정이 필요합니다.

**TMOUT** 환경변수를 추가하면 되는데, 모든 사용자에 적용할 것이므로 전역적으로 설정합니다.

```text
[root@my-service: ~]# vim /etc/profile
```

In vim editor page.

```text
...
export TMOUT=300

:wq
```

환경변수 값을 300초로 설정하여 5분동안 아무 동작이 없으면 로그아웃되게 됩니다.

```text
[root@my-service: ~]# source /etc/profile
[root@my-service: ~]# 
[root@my-service: ~]# timed out waiting for input: auto-logout

```

세션 타임아웃 설정을 **SSH** 에도 적용할 수 있습니다.

```text
[root@my-service: ~]# vim /etc/ssh/sshd_config
```

In vim editor page

```text
...
ClientAliveInterval 300
ClientAliveCountMax 3

:wq
```

```text
[root@my-service: ~]# systemctl restart sshd.service
[root@my-service: ~]# 

```

인터벌 300초씩 총 3회 세션 체크하여 아무 동작이 없다면 세션을 종료시킵니다.

<br>

---

<br>
### Alias 설정

현재 **Alias** 정보를 확인합니다.

제가 자주 사용하는 'll' 도 지정되어 있음을 볼수 있습니다.

```text
[root@my-service: ~]# alias
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grep='grep --color=auto'
alias l='ls -CF'
alias la='ls -A'
alias ll='ls -alF'
alias ls='ls --color=auto'
```

**cp**, **mv**, **rm** 커맨드 수행 시 바로 수행될 가능성이 있으므로, 'cp -i' alias 를 추가로 지정하여 한번은 물어보도록 합니다.

alias 는 기본적으로 개인별 용도로 의도되었기 때문에 각 계정별 환경설정파일에 추가합니다.

```text
[root@my-service: ~]# vim ~/.bashrc
```

In vim editor page.

```text
...
alias cp='cp -i'
alias mv='mv -i'
alias rm='rm -i'

:wq
```

셸 재기동 후 커맨드 입력시 질문하는지 확인합니다.

```text
[root@my-service: ~]# source ~/.bashrc
[root@my-service: ~]# mv ./test_file.txt ./temp/
mv: overwrite './temp/test_file.txt'? y
[root@my-service: ~]# 
```

<br><br>
## 3. 디스크 파티션 설정

현재 리눅스 OS 시스템에서 권장하는 파티션 분할은 **/**, **/swap**, **/boot**, **/tmp**, **/var**, **/home**,
**/usr** 등이 있습니다.

파티션 분할의 이유는 보통 시스템 장애 및 용량부족에 따른 리스크를 줄이거나 보안적인 부분에 있습니다.
위 목록 중 어떤 것은 꼭 필요하고 어떤 것은 오히려 권장되지 않는 추세이기도 합니다.

저는 이중 **/swap**, **/tmp** 파티션과 서버 어플리케이션 실행용 공간인 **/DATA** 를 추가하겠습니다.

(파티션 개념에 대해서는
<a href="https://new-ngmon.tistory.com/23" target="_blank">이 글(파티션 특징)</a>을 참조하세요.)

<br>
### 디스크 추가 및 파티션 분할

파티션 분할을 위해 여유 하드디스크 10G 를 추가합니다.<br>
AWS EC2 의 경우 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#amazon-elastic-block-storage-ebs"
target="_blank">EBS 볼륨</a>**을 추가합니다.

이후 하드디스크가 인식되는지 확인합니다.
물리장치는 **/dev** 디렉토리에 나타납니다.

```text
[root@my-service: ~]# fdisk -l
Disk /dev/loop0: 24.10 MiB, 26189824 bytes, 51152 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes


Disk /dev/loop1: 26.65 MiB, 27930624 bytes, 54552 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes


Disk /dev/loop2: 44.65 MiB, 46804992 bytes, 91416 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes

...

Disk /dev/sda: 8 GiB, 8589934592 bytes, 16777216 sectors  << // 8G 짜리 디스크
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x24ca9e81

Device     Boot Start      End  Sectors Size Id Type
/dev/sda1 *     2048 16777182 16775135   8G 83 Linux

Disk /dev/sdb: 10 GiB, 10737418240 bytes, 20971520 sectors  << // 새로 추가한 10G 짜리 디스크
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xfc3be397

...
```

```text
[root@my-service: ~]# df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/root       7.7G  4.4G  3.4G  58% /  << // 약 8G root 할당됨
devtmpfs        2.0G     0  2.0G   0% /dev
tmpfs           2.0G     0  2.0G   0% /dev/shm
tmpfs           393M  872K  392M   1% /run
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup
/dev/loop0       25M   25M     0 100% /snap/amazon-ssm-agent/4046
/dev/loop1       27M   27M     0 100% /snap/amazon-ssm-agent/5163
/dev/loop3       56M   56M     0 100% /snap/core18/2344
/dev/loop4       68M   68M     0 100% /snap/lxd/22753
/dev/loop5       44M   44M     0 100% /snap/snapd/15177
/dev/loop6       56M   56M     0 100% /snap/core18/2284
/dev/loop7       62M   62M     0 100% /snap/core20/1376
/dev/loop8       68M   68M     0 100% /snap/lxd/22526
/dev/loop10      62M   62M     0 100% /snap/core20/1405
tmpfs           393M     0  393M   0% /run/user/1002
/dev/loop2       45M   45M     0 100% /snap/snapd/15314
```

우선 **/dev/sda 8GiB** 디스크가 **/dev/sda1 8G** 짜리 **Primary 파티션** 한개로 할당되어
**/** 루트 디렉토리에 마운트되어 있음을 볼 수 있습니다.
**/** 에는 Linux OS **/boot**, **/usr**, **/etc**, **/home** 등이 하위 디렉토리로 위치하고 있습니다.

또한 앞서 추가한 **10G 짜리 /dev/sdb** 디스크가 인식되지만, 아직 어떠한 파티션으로도 나뉘어있지 않습니다.
이것을 **/swap**, **/tmp**, **/DATA** 로 사용하기 위해서는
**파티션 분할**, **파일시스템 생성**, **디렉토리 마운트**, **/etc/fstab 등록** 의 작업을 거쳐야 합니다.

본 단계에서는 각 용도에 따른 **파티션 분할**까지 진행하겠습니다.

> **파티션의 종류**
> - 파티션은 크게 primary, extended, logical 있습니다. 이 중 primary 는 1-4의 총 네 개만 생성이 가능하고,
> - 그 이상은 extended 1개 파티션으로 확장하여 그 내부에 논리 파티션을 여러 개 구성합니다.
> 따라서 논리 파티션의 파티션 번호는 5번부터 출발합니다.
> - 논리 파티션을 12개 이상 만드는 것은 시스템에 좋지 않을 수 있어 권장되지 않습니다.

먼저 **swap** 용 파티션입니다.

```text
[root@my-service: ~]# fdisk /dev/sdb    << // 디스크 파티션 편집 모드로 진입

Welcome to fdisk (util-linux 2.34).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): p                 << // 선택한 디스크의 파티션 현황 출력 명령
Disk /dev/sdb: 10 GiB, 10737418240 bytes, 20971520 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xfc3be397

Device           Start      End  Sectors  Size Type  << // 분할된 파티션 아직 없음

Partition table entries are not in disk order.

Command (m for help): n                 << // 새 파티션 생성 명령
Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended
Select (default p): p                   << // primary 파티션 선택
Partition number (1-4, default 1): 1    << // 첫 파티션이므로 숫자 1번 입력
First sector (2048-20971510, default 2048):   << // 첫 섹터는 default 2048, 바로 엔터 입력하면 됨
Using default value 2048
Last sector, +sectors or +size{K, M, G} (2048-20971510, default 20971510): +1G  << // 첫 섹터로부터 1 GiB 만큼 할당
Partition 1 of type Linux and of size 1 GiB is set

Command (m for help): p                 << // 파티션 현황 출력하여 생성된 1번 파티션 확인
Disk /dev/sdb: 10 GiB, 10737418240 bytes, 20971520 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xfc3be397

Device    Start     End  Sectors  Size Type
/dev/sdb1  2048 2097150  2095102    1G Linux filesystem  << // 생성됨!

Partition table entries are not in disk order.

Command (m for help): t                 << // Linux 타입이므로, swap 용으로 변경이 필요함. 타입 변경 명령인 t 입력 
Selected partition 1                    << // 한개만 있으므로 1번이 바로 선택됨
Hex code (type L to list all codes): 82  << // swap 속성코드인 82 입력
Changed type of partition 'Linux' to 'Linux swap / Solaris'  << // 변경 완료

Command (m for help): p                 << // 파티션 현황 출력하여 swap 변경 확인
Disk /dev/sdb: 10 GiB, 10737418240 bytes, 20971520 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xfc3be397

Device    Start     End  Sectors  Size Type
/dev/sdb1  2048 2097150  2095102    1G Linux swap  << // 타입 변경됨!

Partition table entries are not in disk order.

Command (m for help): w                 << // 변경사항 저장 후 종료

The partition table has been altered
Syncing disks.

[root@my-service: ~]# 
```
<small>(섹터 크기나 할당량은 실제 차이가 있을 수 있음)</small>

생성된 1G 짜리 swap 파티션은 **/dev/sdb1** 입니다.<br>
(스왑 메모리는 보통 물리 메모리의 2배용량으로 지정하는 것이 권장되지만, 여기서는 테스트이므로 1G 만 합니다.)

다음으로 **/tmp** 용 파티션을 생성합니다.

```text
[root@my-service: ~]# fdisk /dev/sdb    << // 디스크 파티션 편집 모드로 진입

Welcome to fdisk (util-linux 2.34).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): n                 << // 새 파티션 생성 명령
Partition type:
   p   primary (1 primary, 0 extended, 3 free)
   e   extended
Select (default p): p                   << // primary 파티션
Partition number (2-4, default 2): 2    << // 두 번째 파티션
First sector (2097151-41943020, default 2097151):   << // 이번 섹터는 default 2097151, 바로 엔터 입력
Using default value 2097151
Last sector, +sectors or +size{K, M, G} (2097151-41943020, default 41943020): +2G  << // 1번 파티션의 다음 섹터부터 2 GiB 만큼 할당
Partition 2 of type Linux and of size 2 GiB is set

Command (m for help): p                 << // 파티션 현황 출력하여 생성된 2번 파티션 확인
Disk /dev/sdb: 10 GiB, 10737418240 bytes, 20971520 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xfc3be397

Device      Start      End  Sectors  Size Type
/dev/sdb1    2048  2097150  2095102    1G Linux swap
/dev/sdb2 2097151 41943020  4190204    2G Linux filesystem  << // 생성됨!

Partition table entries are not in disk order.

Command (m for help): w                 << // 변경사항 저장 후 종료

The partition table has been altered
Syncing disks.

[root@my-service: ~]# 
```
<small>(섹터 크기나 할당량은 실제 차이가 있을 수 있음)</small>

**/dev/sdb2** 로 2G **/tmp** 에 마운트될 파티션이 생성되었습니다.

이제 10G 중 나머지 용량은 **/DATA** 용 파티션으로 생성할건데, 이번에는 **extended 타입**으로 진행하겠습니다.
**extended** 파티션은 디스크당 단 한개만 생성할 수 있는 것이 특징입니다.

```text
[root@my-service: ~]# fdisk /dev/sdb    << // 디스크 파티션 편집 모드로 진입

Welcome to fdisk (util-linux 2.34).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): n                 << // 새 파티션 생성 명령
Partition type:
   p   primary (2 primary, 0 extended, 2 free)
   e   extended
Select (default p): e                   << // extended 파티션
Partition number (3,4, default 3): 3    << // 세 번째 확장 파티션
First sector (41943021-167772084, default 41943021):   << // 이번 섹터는 default 41943021, 바로 엔터 입력
Using default value 41943021
Last sector, +sectors or +size{K, M, G} (41943021-167772084, default 41943021):  << // 나머지 다 할당, 바로 엔터 입력
Partition 3 of type Linux and of size 7 GiB is set

Command (m for help): p                 << // 파티션 현황 출력하여 생성된 3번 파티션 확인
Disk /dev/sdb: 10 GiB, 10737418240 bytes, 20971520 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xfc3be397

Device       Start       End  Sectors  Size Type
/dev/sdb1     2048   2097150  2095102    1G Linux swap
/dev/sdb2  2097151  41943020  4190204    2G Linux filesystem
/dev/sdb3 41943021 167772084  8380408    7G Extended  << // 생성됨!

Partition table entries are not in disk order.

Command (m for help): n                 << // 새 파티션 생성 명령
Partition type:
   p   primary (2 primary, 1 extended, 1 free)
   l   logical (numbered from 5)
Select (default p): l                   << // extended 파티션
Adding logical partition 5
First sector (41943021-167772084, default 41943021):   << // default 41943021, 바로 엔터 입력
Using default value 41943021
Last sector, +sectors or +size{K, M, G} (41943021-167772084, default 41943021):  << // 나머지 다 할당, 바로 엔터 입력
Partition 5 of type Linux and of size 7 GiB is set

Command (m for help): p                 << // 파티션 현황 출력하여 생성된 5번 파티션 확인
Disk /dev/sdb: 10 GiB, 10737418240 bytes, 20971520 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xfc3be397

Device       Start       End  Sectors  Size Type
/dev/sdb1     2048   2097150  2095102    1G Linux swap
/dev/sdb2  2097151  41943020  4190204    2G Linux filesystem
/dev/sdb3 41943021 167772084  8380408    7G Extended
/dev/sdb5 41943021 167772084  8380408    7G Linux filesystem  << // 논리 파티션 생성됨!

Partition table entries are not in disk order.

Command (m for help): w                 << // 변경사항 저장 후 종료

The partition table has been altered
Syncing disks.

[root@my-service: ~]# 
```
<small>(섹터 크기나 할당량은 실제 차이가 있을 수 있음)</small>

**/dev/sdb3** 로 나머지 용량인 7G 의 extended 파티션 생성 후,<br>
**/dev/sdb5** 로 동일한 7G 용량의 logical 파티션을 생성했습니다.
이것은 차후 **/DATA** 디렉토리에 마운트됩니다.

논리 파티션은 확장 파티션 내 여러 개 생성할 수 있으며, 실제 활용되는 것은 논리 파티션임을 알아둡시다.

<br>
### /swap 파티션 설정

**/swap** 파티션은 유동적인 메모리 용량을 보다 안정적으로 유용하기 위해 사용되는 추가 메모리 영역입니다.
하드디스크 일부를 마치 메모리처럼 사용하는 것이 특징입니다.

스왑 파티션은 일반적으로 메모리 용량의 2배를 할당하지만, 여기서는 테스트를 위해 **/dev/sdb1 의 1G 파티션**만 할당했습니다.

앞서 파티션 타입을 Linux swap 으로 변경했는데, 이를 실제 커맨드를 통해 스왑 영역으로 활성화해야 합니다.

```text
[root@my-service: ~]# mkswap -c /dev/sdb1
[root@my-service: ~]# swapon /dev/sdb1
[root@my-service: ~]# swapon -s
Filename  Type      Size    Used    Priority
/dev/sdb1 partition   1G       0          -1
```

먼저 **mkswap** 커맨드로 스왑 파티션을 생성했습니다.

이후 **swapon** 커맨드로 스왑 파티션을 활성화시켰습니다. **-c** 옵션을 포함하면 스왑 파티션 생성 시 배드블록을 검사합니다.<br>
(배드블록: 충격이나 노후로 인해 손상된 하드디스크의 블록)

이후 해당 파티션을 **swapon -s** 커맨드로 현재 스왑 상태를 출력합니다.

만약 활성화된 스왑 영역을 비활성화 시키려면, **```# swapoff /dev/sdb1```** 커맨드를 실행하면 됩니다.

마지막으로 OS 부팅시에도 동일 설정이 적용되도록 해당 설정을 **/etc/fstab** 에 등록합니다.

```text
[root@my-service: ~]# vim /etc/fstab
```

In vim editor page,

```text
...
/dev/sdb1    none    swap    defaults    0 0

:wq
```

- defaults: rw, suid, dev, exec, auto, nouser, async

참고로 스왑 영역을 디스크 파티션이 아닌 **파일로 생성하는 방법**도 있으나, 자주 사용되지는 않습니다.

<br>
### /tmp 보안 설정

다음으로 **/dev/sdb2 2G 파티션**을 활용해 **/tmp** 디렉토리를 설정하겠습니다.

> **/tmp**
> - **/tmp** 는 임시파일 저장용으로 사용되는 디렉토리로써, OS 내에서 실행되는 모든 프로그램의 임시파일들이 생성됩니다.
> - 따라서 **모두에게 모든 권한이 허용된 Sticky-Bit 디렉토리(공유 디렉토리)**가 됩니다.
> - 이는 **외부 사용자에 의한 보안적 취약점**이 될 수 있으므로,
> **별도 디스크 파티션에 다시 마운트하여 메인 디스크와 물리적, 논리적으로 분리하는 것이 권장**됩니다.
>     - 취약점: 레이스 컨디션 공격(Race-Condition), 서비스 거부 공격(Denial-of-Service) 등

**/tmp** 는 메모리처럼 사용되는 스왑 영역과는 다르게 파일 및 디렉토리를 관리하는 일반적인 디스크로 만들 것이기 때문에,
디스크 내 **파일시스템 생성 및 설정**이 필요합니다.

파일시스템은 **ext4** 로 합니다.

```text
[root@my-service: ~]# mkfs.ext4 /dev/sdb2
mke2fs 1.42.9 (28-Dec-2013)
Filesystem label=
OS type: Linux

...

Writing inode tables: done
Writing superblocks and filesystem accounting information: done
```

본격적인 작업에 앞서 현재의 tmp 정보를 백업합니다.

```text
[root@my-service: ~]# cp -Rp /tmp /tmp-backup
[root@my-service: ~]# cp /etc/fstab /etc/fstab.backup
[root@my-service: ~]# 
```

**/dev/sdb2** 파티션을 **/tmp** 에 마운트합니다.

```text
[root@my-service: ~]# mount -t ext4 -o defaults,nodev,nosuid,noexec /dev/sdb2 /tmp
```

최소한의 권한 허용을 위해 다음의 마운트 옵션을 추가합니다.

- **nodev**: 장치 사용 금지
- **nosuid**: root 권한 금지(SUID, SGID 금지)
- **noexec**: bin 파일 실행 금지

동일 설정을 **/etc/fstab** 에도 입력합니다.

```text
[root@my-service: ~]# vim /etc/fstab
```

In vim editor page,

```text
...
/dev/sdb2    /tmp    ext4    defaults,nodev,nosuid,noexec    0 0

:wq
```

**/etc/fstab** 변경된 설정 확인을 위해 한번 더 마운트 해봅니다.

```text
[root@my-service: ~]# mount -o remount /tmp
```

마운트 성공한다면, **/tmp** 를 공용 디렉토리 권한 및 소유권으로 수정하고, 백업파일들을 **/tmp** 로 이전 후 삭제합니다.

```text
[root@my-service: ~]# chmod 1777 /tmp
[root@my-service: ~]# chown root.root /tmp
[root@my-service: ~]# 
[root@my-service: ~]# cp -Rp /tmp-backup/* /tmp/
[root@my-service: ~]# 
[root@my-service: ~]# rm -rf /tmp-backup
[root@my-service: ~]# rm /etc/fstab.backup
[root@my-service: ~]# 
```

그리고 **/tmp** 외에 공용 디렉토리로 사용되는 **/var/tmp** 디렉토리도 존재합니다.
이것도 방금 **/dev/sdb2** 파티션으로 마운트한 **/tmp** 영역으로 사용하기 위해 **심볼릭 링크 연결**합니다.

```text
[root@my-service: ~]# rm -rf /var/tmp
[root@my-service: ~]# ln -s /tmp/ /var/tmp
[root@my-service: ~]# 
[root@my-service: ~]# ls -l /var/tmp
lrwxrwxrwx 1 root root 15 Apr 20 17:50 /var/tmp -> /tmp/
[root@my-service: ~]# 
```

<br>
### /DATA 파티션 설정

다음으로 서버 어플리케이션 설치 및 실행을 위한 **/DATA** 디렉토리 설정을 진행합니다.

이를 위해 앞서 **/dev/sdb5 의 7G 논리 파티션**을 생성하였습니다. (**/dev/sdb3** 확장 파티션 내 생성)

이것도 파일 및 디렉토리를 다루는 일반적인 파티션이므로 **파일시스템 생성 및 설정**을 진행합니다.

```text
[root@my-service: ~]# mkfs.ext4 /dev/sdb5
mke2fs 1.42.9 (28-Dec-2013)
Filesystem label=
OS type: Linux

...

Writing inode tables: done
Writing superblocks and filesystem accounting information: done
```

**/DATA** 디렉토리를 생성하고 **/dev/sdb5** 파티션을 마운트합니다.

```text
[root@my-service: ~]# mkdir /DATA
[root@my-service: ~]# mount -t ext4 -o defaults /dev/sdb5 /DATA
```

동일 설정을 **/etc/fstab** 에도 입력합니다.

```text
[root@my-service: ~]# vim /etc/fstab
```

In vim editor page,

```text
...
/dev/sdb5    /DATA    ext4    defaults    0 0

:wq
```

**/etc/fstab** 변경된 설정 확인을 위해 한번 더 마운트 해봅니다.

```text
[root@my-service: ~]# mount -o remount /DATA
```

마운트 성공!

참고로 마운트하는 파티션은 **blkid** 커맨드로 UUID 를 알아내 'UUID=[알아낸 UUID]' 형식으로 입력해도 됩니다.

최종적으로 스왑 및 디렉토리 마운트 현황을 확인합니다.

```text
[root@my-service: ~]# free -m
          total   used    free    shared    buff/cache    available
  Mem:     7805    429    7152         3           224         7376
  Swap:    1024      0    1024                                      << 1GiB 스왑 영역
[root@my-service: ~]# 
[root@my-service: ~]# df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/root       7.7G  4.4G  3.4G  58% /                             << 'root' 디렉토리
devtmpfs        2.0G     0  2.0G   0% /dev
tmpfs           2.0G     0  2.0G   0% /dev/shm
tmpfs           393M  872K  392M   1% /run
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup
/dev/loop0       25M   25M     0 100% /snap/amazon-ssm-agent/4046
/dev/loop1       27M   27M     0 100% /snap/amazon-ssm-agent/5163
/dev/loop3       56M   56M     0 100% /snap/core18/2344
/dev/loop4       68M   68M     0 100% /snap/lxd/22753
/dev/loop5       44M   44M     0 100% /snap/snapd/15177
/dev/loop6       56M   56M     0 100% /snap/core18/2284
/dev/loop7       62M   62M     0 100% /snap/core20/1376
/dev/loop8       68M   68M     0 100% /snap/lxd/22526
/dev/sdb2       2.0G     0  2.0G   0% /tmp                          << 2GiB /tmp 디렉토리
/dev/sdb5       7.0G     0  7.0G   0% /DATA                         << 7GiB /DATA 디렉토리
/dev/loop10      62M   62M     0 100% /snap/core20/1405
tmpfs           393M     0  393M   0% /run/user/1002
/dev/loop2       45M   45M     0 100% /snap/snapd/15314
```

<br>
### 추가로 권장되는 파티션 설정

**/swap**, **/tmp**, **/DATA** 외에 추가적으로 권장되는 파티션 설정이 존재합니다.

- **/boot**
    - OS 시스템 부팅만을 위해 약 100M 정도 할당하면 좋습니다.
- **/var**
    - 메일서버의 **/var/spool** 스풀링 파일, **/var/log** 의 로깅파일, **/var/cache** 캐시파일 등이 생성되므로
    시스템에 크리티컬하지 않은 부수적인 파일들이 대량으로 생성된 가능성이 있습니다.
    - 이는 **디스크의 물리적인 가용량 부족으로 함께 연계된 다른 시스템 자원들에 영향을 미칠 위험**이 있습니다.
- **/home**
    - 동일 OS 를 여러 유저가 사용하는 경우, 각 사용자 디렉토리의 용량문제가 발생할 수 있습니다.
    - 사용자별 디스크 쿼터를 설정할 수도 있겠지만,
    근본적으로 디스크 파티션을 분리하여 파티션별 정책을 부여하는 등 위험을 줄이는 것이 권장됩니다.

<br><br>
## 4. 패키지 관리

### vi

<br>

---

<br>
### git

자주 사용하는 **git log** 의 graphical 커맨드에 대한 alias 를 설정 후 확인합니다.

```text
[root@my-service: ~]# git config --global alias.lg "log --oneline --all --graph --decorate"
[root@my-service: ~]# git config --global --list
user.name=
user.email=
user.signingkey=54***F0
commit.gpgsign=true
alias.lg=log --oneline --all --decorate --graph
[root@my-service: ~]# 
[root@my-service: ~]# git lg
* 979603c (HEAD -> post, origin/master) post: Add new post3
* ce0e8a5 post: Add new post2
*   4254eab Merge pull request #93 from [USER]/post
|\
| * fd178e7 (origin/post) post: Modify post1
|/
...
```

alias 설정한 "git lg" 만으로 아름다운 커밋로그를 확인할 수 있습니다.

<br>

---

<br>
### cron

설치여부 확인 후 설치 안되어 있으면 설치

<br><br>
## 5. 보안

### 방화벽 및 SELinux 종료

<br>

---

<br>
### SSH 설정 (port 변경, root 접속 불가)

SSH 는 secure shell 이지만, 외부에서 접속하는 기능을 제공하기 때문에 해커들의 공격통로로 흔히 사용됩니다.
따라서 SSH 의 설정을 변경하는 것이 좋습니다.

먼저 sshd 데몬의 포트정보가 22번인지 확인한 후 설정파일을 열어 수정합니다.
SSH 의 설정파일은 **/etc/ssh/sshd_config** 입니다.

```text
[root@my-service: ~]# netstat -nlpt | grep sshd
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      768/sshd: /usr/sbin
tcp6       0      0 :::22                   :::*                    LISTEN      768/sshd: /usr/sbin
[root@my-service: ~]# 
[root@my-service: ~]# vim /etc/ssh/sshd_config
```

In vim editor page

```text
...
Port 3322  # 22
...
PermitRootLogin no  # prohibit-password
...

:wq
```

접속포트는 **3322**번으로, root 로그인 허용여부를 결정하는 **PermitRootLogin** 값은 **no** 로 지정한 후 저장합니다.

다음으로 서비스를 재기동하고, 설정값이 적용되었는지 확인합니다.

```text
[root@my-service: ~]# systemctl restart sshd.service
[root@my-service: ~]# netstat -nlpt | grep ssh
tcp        0      0 0.0.0.0:3322            0.0.0.0:*               LISTEN      768/sshd: /usr/sbin
tcp6       0      0 :::3322                 :::*                    LISTEN      768/sshd: /usr/sbin
[root@my-service: ~]# 
```

ssh root 접근을 시도해보면  'Access denied' 메시지가 출력됨을 볼 수 있을겁니다.
만약 root 허용하고자 한다면 **no** 값을 **yes** 로 바꾸고 재기동합니다.

추가 필요한 설정들은 검색해서 적용해보시기 바랍니다.

SSH 접속자에 대한 세션 타임아웃 설정을 추가할 수 있는데, [이곳](#자동-로그아웃)을 참조하세요.

<br>

---

<br>
### SSH 서버 보안 (fail2ban)

<br><br>
## 6. 전체 스크립트

지금까지의 설정중 필요한 것을 모아 퀵스타트 스크립트를 작성해 두도록 합시다.
