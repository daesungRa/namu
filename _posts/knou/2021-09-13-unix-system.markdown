---
title:  "[방통대] UNIX 시스템 정리"
created:   2021-09-13 20:57:05 +0900
updated:   2021-09-13 20:57:05 +0900
author: namu
categories: knou
permalink: "/knou/:year/:month/:day/:title"
image: https://www.observeit.com/wp-content/uploads/2015/05/7%20Ways%20ObserveIT%20Can%20Detect%20Escalated%20Privilges%20Pic4.PNG
alt: unix root image
image-view: true
image-author: proofpoint.com
image-source: https://www.proofpoint.com/us/blog/insider-threat-management/7-ways-proofpoint-itm-can-detect-privileged-escalations-unix
---


---

### 목차

1. [](#)
2. [](#)
3. [셸 사용하기](#3-셸-사용하기)
4. [파일과 디렉토리](#4-파일과-디렉토리)
5. [리눅스 시작과 종료](#5-리눅스-시작과-종료)
6. [사용자 관리](#6-사용자-관리)

### 참조

- 김상형. 안드로이드 프로그래밍 정복. 한빛 미디어

---

<br>
## 1. 

<br>
## 2. 

<br>
## 3. 셸 사용하기

### 3.1 셸 개요

### (1) 셸(shell)

- **명령어 해석기** 또는 **명령 행 인터페이스**

GUI 로는 하기 힘든 다양한 기능을 수행할 수 있습니다.

- 셸 명령을 **프로그램으로 작성하여 처리** 가능

셸 스크립트는 텍스트 파일이며 프로그래밍을 통한 셸 명령의 조합입니다.
반복 작업을 작성 가능하며, 셸이 이 파일을 읽어 처리합니다.

- 로그인을 하면 기본 셸이 주어짐

**셸은 사용자로부터 명령을 받아 내부의 커널, 파일시스템, 프로세스 스케줄러, 디바이스 드라이버 및 메모리를 관리**합니다.

### (2) 셸 사용하기

- 터미널에서 로그인을 해야 함
- GNOME 데스크톱에서 터미널 창을 실행시켜 셸을 사용
- 프로그램 > 시스템 도구 > 터미널

셸은 명령 프롬프트와 명령 행을 제공하며, 터미널 창은 여러 개 띄울 수 있습니다.

- 기본적으로 한 라인에 명령을 입력하고 ENTER 를 쳐 명령을 수행
    - 결과 출력 이후 명령 프롬프트가 아래에 다시 등장
    - 세미콜론(;) 사용 시 한 라인에 여러 명령 입력 가능

### (3) 셸의 종류

- 많은 리눅스 배포판에서 **bash** 를 기본 셸로 사용
- **일반 사용자 명령 프롬프트는 $, root 사용자는 #**
- 셸의 종류에 따라 alias 설정, 초기화 파일, 스크립트 작성, 명령 행 완성 기능, 명령 행 편집 기능 등에 차이 존재

### (4) bash 셸

- **Bourne Again Shell** 로 Bourne 셸의 개선 버전

많은 셸 스크립트 문법이 Bourne 셸에 기반을 둡니다.

- **C 셸과 Korn 셸의 유용한 기능**을 가져옴
- 실행 명령은 **/bin/bash**
    - **/etc/passwd** 파일에 다음과 같은 라인이 있음 (유저가 사용하는 셸 지정)
    - **"kdhong:x:500:500:KilDong Hong:/home/kdhong:/bin/bash"**

---

### 3.2 셸 명령

---

### 3.3 명령 히스토리

---

### 3.4 명령의 연결과 확장

---

### 3.5 셸 변수

<br>
## 4. 파일과 디렉토리

<br>
## 5. 리눅스 시작과 종료

### 5.1 운영체제의 부팅

### (1) 부팅 과정 1

전원을 켜고 로그인 프롬프트가 나올 때까지 과정입니다.

- ROM BIOS 펌웨어 실행(BIOS 기반 x86 컴퓨터 가정)
    - 하드웨어 검사 후 부트로더 적재
- MBR 에 있는 부트로더가 실행됨
    - 파티션 테이블, 리눅스 부트로더인 GRUB 찾아 적재
- 커널 이미지(/boot/vmlinuz-<kernel-version>)와 initramfs(부팅 과정에서 필요한 임시 파일시스템)를 로드
- 커널 실행됨

### (2) 부팅 과정 2

커널의 실행

- 하드웨어를 점검하고 초기화함
    - 메모리, 프로세서, 저장장치, 주변장치 등
    - 디바이스를 찾고 디바이스 드라이버를 로드
- 루트(/) 파일 시스템을 마운트하고 검사
- 커널은 /sbin/init 프로그램을 실행시키고 제어를 넘김
    - init 프로세스는 시스템 운영을 위한 나머지 초기화 과정을 처리
    - init 은 부팅이 끝난 후에도 계속 수행됨 > PID = 1

---

### 5.2 초기화 데몬

### (1) 초기화 init 데몬

- 전통적 init 데몬
    - System V init 데몬이라고도 함
    - 런레벨(runlevel)에 기초하여 순차적으로 서비스를 실행하는 방식
    - 시간이 오래걸리며, 복잡한 초기화 스크립트로 인해 새로운 하드웨어나 서비스의 등장에 효율적 대처가 어려움

- 업스타트 init 데몬과 systemd 데몬
    - 이벤트 기반 서비스 실행방식
    - 간단한 설정 파일들로 대체
    - Upstart 는 Ubuntu 에서 개발되어 2006년에 포함되었고 RHEL 6에서 채택됨
    - systemd 데몬은 2011년 Fedora 에서 처음 채택되었음
    - RHEL 7과 SUSE 및 Ubuntu 16.04 에서 systemd 가 Upstart 를 대체

### (2) init 프로세스 1

- 업스타트는 /sbin/init 데몬으로 구현됨
- 모든 사용자 프로세스의 최상위 조상 프로세스 > PID = 1
    - "ps -e" or "ps -ax"
- 나머지 부팅 과정 즉, 시스템 초기화 작업을 실행함
    - 사용자 환경을 준비함. 시스템 운영을 위한 서비스 프로그램(데몬)의 실행 등
- 계속 수행되며 시스템 운영을 관리하고 셧다운을 처리함
    - 사용자 프로세스(커널 프로세스)의 정리, 로그아웃 후 로그인 서비스의 제공 등

### (3) init 프로세스 2

- /etc/init/ 디렉토리에 있는 job 설정 파일을 읽음
    - 확장자는 .conf > rcS.conf, rc.conf
    - init 데몬이 실행하는 job(실행파일 or 셸 스크립트)이 정의되어 있음
        - 이벤트가 발생할 때 상응하는 job 을 시작하거나 중지시킴
- 전통적 init 데몬에서는 /etc/inittab 파일을 환경 설정 파일로 사용했음
    - 현재는 초기 런레벨을 설정하는 용도로만 사용됨
    - 이 파일에 업스타트 초기화 과정을 설명하는 내용이 있음
- initctl 명령
    - job 의 상태를 확인하거나 수동으로 시작/중지시키는 명령
    - initctl command job
    - initctl list 는 모든 job 의 상태를 보여줌
    - initctl start job 또는 initctl stop job 을 사용할 수 있음

### (4) 환경설정 파일과 스크립트

- 업스타트 init 데몬은 기존 방식과 호환되도록 설계됨
- [파일] /etc/init/rcS.conf
    - 부팅 시 한번 실행, 시스템 초기화와 관련된 내용설정
    - 초기 런레벨을 읽고 /etc/rc.d/rc.sysinit 스크립트를 실행
    - 호스트명 설정, 시스템 점검, 파일 시스템 마운팅, LVM 장치 활성화, 쿼터 설정 등 서버가 작업을 실행하는 데 필요한 모든 작업 수행
- [파일] /etc/init/rc.conf
    - 부팅 or 런레벨이 바뀔 때 필요한 서비스를 시작시키거나 필요 없는 서비스를 중단시키기 위해 스크립트 실행
    - /etc/rc.d/rc <runlevel> 명령을 실행
- [파일] /etc/inittab
    - 부팅 시 정해지는 초기 런레벨 정의된 파일
    - 업스타트 init 데몬을 사용하는 경우 초기 런레벨 외의 다른 설정은 의미가 없음
- [파일] /etc/rc.d/rc.local
    - 결과적으로 런레벨 2, 3, 5 에서 가장 마지막에 실행되는 스크립트

### (5) init 프로세스와 런레벨

- 초기 런레벨은 /etc/inittab 파일에서 id:5:initdefault: 와 같이 설정되어 있음
- 런레벨이 5로 부팅되는 경우
    - /etc/rc.d/rc5.d/ 디렉토리에 존재하는 스크립트 파일이 실행됨
        - K 로 시작하면 해당 서비스 종료를, S 로 시작하면 해당 서비스 시작을 위한 스크립트 파일
        - 이러한 파일은 /etc/rc.d/init.d/ 에 존재하는 실제 스크립트 파일에 대한 심벌릭 링크
- 런레벨 2, 3, 5 에서 가장 마지막에 실행되는 스크립트는 S99local 이 가리키는 /etc/rc.d/rc.local 임
    - 관리자가 원하는 특별한 초기화 작업 추가 가능

### (6) 런레벨

- 0
    - 시스템 종료시 사용. 기본값 x
- 1
    - 단일 사용자 모드. 로그인 과정 없이 root 로 로그인
    - 콘솔 시스템 점검이나 복구 관리자 모드
- 2
    - 기본적으로 네트워크 서비스를 제공하지 않는 다중 사용자 모드
- 3
    - 모든 네트워킹을 지원하는 다중 사용자 모드
    - 리눅스 초기 시절 보편적으로 사용된 레벨
    - 명령해 인터페이스만 지원
- 4
    - 사용되지 않음
- 5
    - 그래픽 사용자 환경, 다중 사용자 모드
    - 최근 배포판에서 기본 설정
- 6
    - 시스템 재부팅시 사용. 기본값 x

- telinit: 런레벨 교체 명령
- runlevel: 이전 런레벨과 현재 런레벨 확인
- chkconfig: 부팅 시 런레벨에 따른 시스템 서비스의 활성화 여부를 확인하거나 변경하는 명령
    - ```chkconfig --list httpd```
    - ```chkconfig --level 345 httpd on```
- service: 시스템 운영중 /etc/rc.d/init.d/ 에 존재하는 초기화 스크립트를 수동으로 실행/중지하는 관리자 명령
    - start, stop, restart, reload, status
    - ```service httpd start```
    - ```/etc/rc.d/init.d/httpd start```
    - ```service --status-all```
    - 테스크톱 메뉴에서 '시스템>관리>서비스' 를 실행하면 나오는 서비스 설정 창에서 서비스의 초기 설정(활성화 여부)가능, 서비스 시작/중지 가능

---

### 5.3 시스템 종료

- 개인 사용자 로그아웃
    - 계정 사용 마치고 빠져나옴
    - 테스크톱(GNOME) 환경에서 '시스템>로그아웃'
    - 로그인 셸에서 logout 또는 exit 명령
- 시스템의 종료
    - 관리자가 시스템을 셧다운
        - 접속 중인 사용자에게 시스템의 종료를 알림
        - 사용자의 로그인을 차단하고 종료
    - 데스크톱 환경에서 '시스템>끄기'(다시 시작, 취소 또는 끄기 선택)

- shutdown: 시간을 정해 시스템을 안전하게 종료
    - -r 은 재부팅, -c 는 셧다운 취소
    - -k 는 실제 셧다운을 하는 것처럼 경고 메시지만 보냄
    - ```shutdown -r +10```
    - time 인수 >> 23:15, +10, now, ...
    - ```shutdown -h now``` (halt, 즉시 종료)

- 시스템 종료 절차
    - 실제 init 프로세스를 통해 런레벨을 바꾸어(0 or 6) 셧다운 처리
        - 모든 프로세스에게 종료를 알림
        - 각 프로세스가 스스로 종료하도록 TERM 시그널 보냄
        - 종료하지 않은 프로세스에게 강제 종료를 위한 KILL 시그널 보냄
        - 시스템 파일을 잠그고 파일 시스템을 언마운트
        - 버퍼에 있는 데이터를 파일 시스템에 기록(sync)
        - 시스템 호출을 통해 커널에 재부팅 또는 종료를 요청
    - -h or -r 옵션을 사용하지 않으면 단일 사용자 모드로 재부팅됨
    - 종료를 위해 halt 명령을, 재부팅을 위해 reboot 명령을 사용할 수 있음

---

### 5.4 데스크톱

- 데스크톱 환경
    - GUI 제공 사용자 환경
        - 그래픽 윈도우, 아이콘, 툴바, 메뉴, 위젯 등을 마우스나 키보드로 조작
    - 대부분의 데스크톱은 X 윈도우 시스템에 기반을 둠
    - 시각적으로 다양한 스타일의 데스크톱이 존재

일반적인 서버용 리눅스는 명령행 인터페이스만 제공합니다.

- GNOME
- KDE

<br>
## 6. 사용자 관리

### 6.1 사용자 계정

### (1) su: 사용자를 전환시키는 명령

- ```su -l jjpark```: jjpark 의 로그인 셸 시작(root 가 아니라면 암호 필수)
- ```su -l```: root 로그인
- ```su -c 'ls -l /root/*'```: root 권한으로 단일 명령 실행

### (2) sudo: root 또는 다른 사용자가 되어 명령을 실행

- /etc/sudoers 파일에 '누가/어디서/어떤 명령' 을 수행할 수 있는지 설정
- 해당 사용자나 그룹의 권한별로 명령 실행
- 암호는 본인의 암호만. 권한이 없는 명령이라면 실행 불가
- ```sudo -l```: 자신에게 허용된 명령 확인
- ```sudo -u jjpark touch ~jjpark/ttt.txt```: -u 는 지정된 사용자로 수행
### (3) /etc/sudoers

- root 사용자가 visudo 사용해 편집함(안전하게 편집)
- ```user MACHINE=COMMANDS``` 양식임
```text
jjpark ALL=/usr/sbin/useradd, /usr/sbin/usermod
User_Alias ADMINS = user1, user2, kdhong
ADMINS ALL=NOPASSWD:ALL
%users ALL=(ALL) NOPASSWD:ALL
```

---

### 6.2 사용자 계정 만들기

### (1) useradd: 사용자 계정 생성 관리자 명령

- ```useradd -c "Kim, Song" songkim```
- ```passwd songkim``` 이후 비번 설정
- options
    - -d: 홈 디렉토리 설정
    - -D [options]: -D 만 사용하면 설정값 보여주고, options 로 홈 디렉토리의 위치, 만료일, 주 그룹, 기본 셸 등 기본설정 변경
    - -e: 만료일 설정. ```-e 2021-12-31```, 기본값은 /etc/default/useradd 파일에 EXPIRE 변수값(무기한)
    - -g: 주 그룹 설정. 그룹은 /etc/group 파일에 존재해야 함. 기본적으로 계정과 동일명의 그룹이 생성됨
    - -G: 부 그룹 설정. 콤마 구분으로 여러 개 지정가능
    - -s: 기본 셸 지정. ```-s /bin/bash```
    - -u: UID 수동 설정. 기본적으로 다음 가용 숫자로 지정됨

### (2) 사용자 계정 생성 절차

- /etc/login.defs, /etc/default/useradd 파일을 읽어 기본값 확인
- useradd 주어진 옵션을 검사하여 기본값 대체 확인
- /etc/passwd, /etc/shadow 파일에 새로운 사용자 계정 항목 생성
- /etc/group 파일에 새로운 그룹 항목 추가
- /home/ 디렉토리에 사용자 계정명의 홈 디렉토리 생성
- /etc/skel/ 디렉토리에 있는 파일을 사용자 계정의 홈 디렉토리에 복사
    - 홈 디렉토리의 기본 뼈대!

### (3) 명령어

- /etc/passwd
    - ```kdhong:x:500:500:Kildong Hong:/home/kdhong:/bin/bash```
    - 이 파일 직접 수정은 x!
- /etc/skel
    - 사용자 홈 디렉토리에 복사되는 파일들 가짐
    - .bash_profile, .bashrc, .bash_logout 등
- /etc/shadow
    - 계정 암호 정보와 패스워드 에이징 정보
    - ```kdhong:$6$w8j...<중간생략>...:16922:0:99999:7:3::```
    - 앞에서부터, 사용자계정:암호화된비밀번호:최종비밀번호변경일:
    - 0 은 비밀번호 변경 후 바꿀 수 없는 기간(minimum password age)
    - 99999 는 비밀번호 변경 후 다시 변경하지 않고 사용할 수 있는 최대 기간(maximum password age)
    - 7 은 비밀번호 만료일 전에 경고를 보내는 날짜 수(password warning period)
    - 3 은 비밀번호의 만료 후 로그인이 가능한 날짜 수(password inactivity period)
    - 사용자 계정의 만료일(account expiration date)로 빈 값은 계정이 만료되지 않는다는 것
    - 예약 필드
- chage: 사용자의 비밀번호 만료에 관한 정보를 변경하는 관리자 명령
    - ```chage -l kdhong```
    - -l days: 만료 후 비활성화 되기 전까지의 날짜 수(-1 사용하지 않음)
    - -m, -M days: 각각 비밀번호 최소, 최대 사용 날짜 수(0 to 99999)
    - -d date: 비밀번호 마지막 변경 날짜 수정
    - -E date: 계정 만료일 지정(-1 사용하지 않음)

### (4) 사용자 계정의 기본 설정

- /etc/login.defs 은 계정 생성시 기본값을 정의한 파일
    - 키워드와 값으로 구성
    - UID_MIN, UID_MAX 는 UID 자동 할당 유효 범위
    - USERGROUPS_ENAB 은 사용자 계정과 같은 이름의 그룹을 자동으로 만들지 지정
    ```text
    MAIL_DIR          /var/spool/mail
    PASS_MAX_DAYS     99999
    PASS_MIN_DAYS     0
    PASS_MIN_LEN      5
    PASS_WARN_AGE     7
    UID_MIN           500
    UID_MAX           60000
    GID_MIN           500
    GID_MAX           60000
    CREATE_HOME       yes
    UMASK             077
    UsERGROUPS_ENAB   yes
    ENCRYPT_METHOD    SHA512
    ```

- /etc/default/useradd 은 useradd 명령이 참조하는 기본값을 설정한 파일
    ```text
    # useradd -D
    GROUP=100
    HOME=/home
    INACTIVE=-1
    EXPIRE=
    SHELL=/bin/bash
    SKEL=/etc/skel
    CREATE_MAIL_SPOOL=yes
    ```

---

### 6.3 사용자 계정 수정

### (1) usermod: 사용자 계정 정보 수정 관리자 명령

- ```usermod -g root kdhong```
- options
    - -d home_dir: 홈 디렉토리 변경
    - -m: -d 와 함께 사용되며, 기존 홈 디렉토리의 내용을 새 디렉토리로 복사
    - -l login_name: 계정명 변경. 그렇다 해서 홈 디렉토리명 등이 함께 바뀌지는 않음
    - -u user_id: UID 변경
    - -L: 계정 잠금. 실제 /etc/shadow 에서 비밀번호 앞에 !를 붙임
    - -U: 계정 잠금 해제

- userdel: 사용자 계정 삭제 관리자 명령
    - ```userdel -r kdhong```
    - options
        - -r: 홈 디렉토리와 파일을 함께 삭제하고 메일 스풀도 삭제
        - -f: 로그인 중이어도 삭제, 같은 이름의 그룹도 삭제

### (2) 사용자 계정 삭제 시 고려사항

- 홈 디렉토리도 삭제할 것인가?
- 계정을 삭제하지 않도 잠금할 것인가?
- 삭제될 계정이 소유하는 파일이 또 있는가?
    - 삭제 전 ```find / -user <username> -ls``` 로 확인
    - 삭제 후라면 ```find / -uid <UID> -ls``` 또는 ```find / -nouser -ls``` 로 확인

---

### 6.4 그룹 계정과 관리

일반 사용자는 bin, mail, sys 등의 시스템 정의 그룹에 포함될 수 없습니다.

또한 사용자 계정은 주 그룹이 지정되며, 0개 이상의 부 그룹에 속할 수 있습니다.

### (1) groupadd: 그룹 계정을 만드는 관리자 명령

- ```groupadd -g <GID> -o <newgroup>```
- /etc/group: 그룹 계정의 정보를 가진 텍스트 파일
    - 라인별 그룹 계정의 정보 저장
    - ```그룹계정:암호:GID:구성원_리스트```
    - ```sales:x:1000:kdhong,jjpark```
    - 암호화된 비밀번호는 /etc/gshadow 에 저장됨
    - 사용자 계정을 부 그룹에 추가하는 방법(관리자가 수행)
        - ```usermod -G <groupname> -a <username>```, -a 는 append 의 의미
    - 사용자가 자신의 그룹 확인
        - ```id <username>```, ```groups <username>```

### (2) 사용자 계저와 그룹 및 파일의 접근권한

- 사용자가 파일이나 디렉토리를 생성하면 그것의 소유 그룹은 사용자의 주 그룹으로 지정됨
- 사용자는 0개 이상의 부 그룹에 속할 수 있음
- 사용자 스스로 다른 그룹의 구성원이 될 수 없음
    - 관리자라면, ```gpasswd -a <username> <groupname>```
- ```newgrp <groupname>``` 을 실행하면 일시적으로 자신의 주 그룹을 변경할 수 있음
    - 자신이 속한 그룹 중에서 지정해야 함
    - 그룹 계정의 비밀번호를 알고 있다면 다른 그룹으로도 지정 가능
    - 단순히 newgrp 를 실행하면 원래 주 그룹으로 되돌아감

### (3) 명령어

- gpasswd: 그룹의 관리를 위한 명령(그룹의 관리자가 사용)
    - ```gpasswd [options] <groupname>```
        - 옵션 없으면 그룹 비밀번호 변경
        - options
            - -a <username>: 구성원 추가
            - -A <username>: 그룹 관리자 지정
            - -d <username>: 구성원 삭제
            - -M <username>: 구성원 설정
            - -r: 비밀번호 삭제
- groupmod: 기존 그룹의 정보를 수정하는 명령
- groupdel: 그룹 삭제 명령
    - 사용자 계정의 주 그룹으로 되어 있는 경우 삭제 불가

---

### 6.5 사용자 관리를 위한 GUI

- 사용자 관리 도구는 데스크톱 메뉴 중 '시스템>관리>사용자 및 그룹' 에서 실행
    - root 계정 비밀번호 입력
    - [사용자 추가], [그룹 추가]
    - 선택된 계정에서 [등록정보] 버튼으로 정보 수정 가능

<br>
## 7. 텍스트 편집

vi 에디터 사용 방법에 대해 살펴봅니다.

### 7.1 편집기

### (1) 리눅스 텍스트 편집기

- **gedit**: GNOME 데스크톱에서 제공하는 작고 가벼운 편집기
- **emacs**: 화면 단위 편집기로 다양한 기능을 제공하나 사용법이 어려움
- **vi**: 유닉스 계열 운영체제에서 가장 보편적인 화면 편집기
    - vim 으로 alias 되어 있음
    - vim(Vi Improved)와 vi 차이
        - 파일의 구조를 표시하기 위해 컬러를 사용
            - 마우스 지원, 다중 undo, 다중 탭(또는 화면 분할) 지원
            - 블록을 선택할 때 비주얼 모드 지원

### (2) vi

- ```vi [options] [filename]```
- 세 가지 모드
    - 명령 모드: 기본 모드
        - ZZ: 변경 내용을 저장하고 종료
    - 입력 모드: 명령 모드에서부터 i, a, o, c 등으로 전환
        - esc 키를 누르면 명령 모드로 돌아감
    - 라인 모드: 명령 모드에서부터 :, /, ? 등으로 전환
        - :x [filename]: 변경이 있었다면 저장하고 종료

---

### 7.2 vi 로 편집하기

강의 참조

---

### 7.3 파일 찾기와 문자열 검색

- ```locate [options] <pattern>```
- ```find [pathnames] [expression]```
    - ```find /etc -iname '*passwd*'```: 이름에 passwd 를 포함하는 파일 찾기
    - ```find ~ | wc -l```: 사용자가 가지고 있는 파일의 총 개수 출력
- ```grep [options] pattern [file]```
    - 파일에서 지정된 문자열 패턴을 퐇마한 라인을 찾아 출력
    - -r 은 디렉토리 내 모든 파일 대상, -i 는 대소문자 구분x, -v 는 매칭이 일어나지 않는 라인을 출력

---

<br>
## 8. 

### 8.1 

---
