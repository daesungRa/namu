---
title:  "Docker 실습 환경 만들기"
created:   2020-10-10 20:49:23 +0900
updated:   2020-10-11 16:17:48 +0900
author: namu
categories: docker
permalink: "/docker/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2018/04/06/13/46/poly-3295856_1280.png
image-view: true
image-author: Manuchi
image-source: https://pixabay.com/ko/users/manuchi-1728328/
---


---

[목차]

1. [들어가며](#들어가며)
2. [Docker Toolbox 설치](#docker-toolbox-설치)
3. [윈도우에서는 너무 불편해!](#윈도우에서는-너무-불편해)
4. [도커를 위한 Ubuntu 환경을 따로 만들자](#도커를-위한-ubuntu-환경을-따로-만들자)
5. [Ubuntu 에 도커 설치하기](#ubuntu-에-도커-설치하기)
6. [Docker 작업환경 만들기](#docker-작업환경-만들기)

---

<br>
## 들어가며

기본적으로 docker 는 ```docker engine``` 과 ```docker client``` 로 구성된다.
```docker engine``` 은 linux 환경에서 구동되도록 만들어졌기 때문에,
내 노트북과 같은 윈도우 환경에서는 사용할 수 없다.

이를 위해 공식적으로 제공되는 것이 [```Docker Toolbox```](https://docs.docker.com/toolbox/toolbox_install_windows/)
또는 [```Docker Desktop on Windows```](https://docs.docker.com/docker-for-windows/install/) 이고,
후자가 가상화의 측면에서 권장되는 사용 방식이나, 나는 일단 익숙한 방법이었던 ```Docker Toolbox``` 방식을 선택했다(이하 툴박스).

툴박스 방식은 오라클사의 [VirtualBox](https://www.virtualbox.org/wiki/VirtualBox) 를 설치하여
그 안에 리눅스 가상머신을 만들어 ```docker engine``` 을 구동시키는 방법이다.
이는 일단 윈도우 호스트에서 가상머신으로, 가상머신에서 도커 엔진으로 포트 포워딩을 하는 다소 이상한? 구조이다.

<br>
## Docker Toolbox 설치

먼저 [툴박스 링크](https://docs.docker.com/toolbox/toolbox_install_windows/) 로 가서
Docker Desktop 을 권장한다는 소리들은 가볍게 무시해주고 <del>굳이</del> 툴박스를 다운받는다.
설치 패키지에는 도커엔진, 클라이언트와 함께 VirtualBox 까지 포함되어 있으므로 설치하란대로 하면 된다.
Docker compose, git(없다면) 까지 체크하여 모두 설치하자.

이제 바탕화면에 나타난 **Docker Quickstart Terminal** 를 클릭하여 엔진에 접속하기 위한 클라이언트를 실행한다.
그런데 절대 한번에 될 리가 없지. 높은 확률로 발생할 수 있는 몇 가지 이슈를 살펴보자.

1. Hyper-V
    - Hyper-V 는 윈도우10 이후에 있는 자체 가상머신이라고 생각하면 된다.
    이는 VirtualBox 와 함께 사용할 수 없으므로 꺼두도록 하자. -> [관련 링크](https://lsjsj92.tistory.com/423)
2. 방화벽.. 방화벽..!!
    - 앞서 살펴봤듯이 ```docker engine``` 은 별도의 가상머신에서 돌고 있다.
    그러므로 클라이언트를 실행중인 윈도우 호스트에서 는 TCP 통신을 통해 가상머신에 접근해야 한다.
    따라서 방화벽이 막혀 있다면 접속이 불가하다.
    ipconfig(ifconfig) 로 VirtualBox IP 대역을 찾아서 로컬호스트 영역의 방화벽(인바운드) 뚫어주자.
3. cgroup 을 못찾는 이슈
    - cgroup 은 도커 컨테이너들에 자원할당을 해주는 역할을 한다고 한다. vm 설정을 통해 해결한다.
    -> [관련 링크](https://lsjsj92.tistory.com/424?category=762556)

자, 이제 설치가 완료되었으니 ```docker -v``` ```docker images``` ```docker ps -a``` 등으로 확인해보자.

<br>
## 윈도우에서는 너무 불편해!

윈도우 호스트에서 별도의 가상머신을 또 돌린다는 사실도 왠지모르게 걸리는데,
리눅스가 아닌 윈도우이기 때문에 어쩔수 없이 발생하는 여러 이슈들은 참으로 불편하다.

1. 디스크 바인딩
    - 도커 이미지를 ```BUILD``` 하거나 컨테이너를 ```RUN``` 하다보면 심심치 않게 디스크 볼륨 바인딩이 이루어진다.
    하지만 도커 엔진은 중간에 가상머신을 또 매개하고 있어서 윈도우 호스트의 디스크 경로를 제대로 캐치하지 못한다.
    툴박스의 실행 환경설정을 수정하는 방식이 있기는 하지만, 배보다 배꼽이 커지는 느낌이 들면서 그렇게까지 하고 싶지는 않아진다.
2. 컨테이너와의 직접적인 통신
    - nginx 웹서버 컨테이너나 웹앱 컨테이너를 RUN 하면서 호스트에서 직접 통신하기도 하는데, 이것도 마찬가지의 원인으로
    원활하게 이루어지지 않는다. 물론 IP 나 방화벽 등 해결방법이 있긴 하겠지만 내키지 않는다.

이상 **윈도우 호스트에서 사용하되는 도커가 불편한 이유**를 나열해 봤다. 물론 찾으면 더 나올 것이다.

<br>
## 도커를 위한 Ubuntu 환경을 따로 만들자

나에겐 툴박스와 함께 설치된 VirtualBox 가 있었다.
어차피 특정 호스트 안에서만 도커 이미지를 ```BUILD``` 할것이기 때문에 아예 리눅스 가상머신을 만들어 거기서만 도커를 쓰면 된다.
이때 쓸라고 나는 내 노트북의 메모리를 ```24기가```나 되도록 맞췄나보다(<del>진짜?</del>).

1. iso 받기
    - 먼저 [ubuntu 18.04 LTS](https://releases.ubuntu.com/18.04/) iso 이미지를 다운받자
2. 가상머신 만들기
    - VirtualBox 에 ubuntu 를 위한 가상머신을 만들고, 머신의 **설정의 저장소 파트에 ubuntu iso 를 등록**하자.
    그리고 머신을 기동하면 최초 ubuntu 설치가 진행된다. 환경설정, 언어, 계정, 지역 등을 적절히 입력하고 설치하자.
    그 이후에는 ubuntu 로 부팅된다.
3. 도커를 위한 기본환경 설정
    - apt 패키지 매니저를 보면(```apt --help```) 이 커맨드는 apt-get, apt-cache 등의 툴의 기능을 제공하며,
    옵션 사용 시 유저와 기본적인 상호작용에 있어서 더 적합하다고 설명한다.
    - apt 업데이트(```sudo apt update```) 이후 기본 툴들을 설치한다(```sudo apt install vim curl make git``` 등등).
    - 혹시 존재할지 모르는 예전 도커 툴들을 삭제한다(```sudo apt remove docker docker.io docker-engine```).

![docker config 01]({{ site.url }}/assets/post-img/docker_config01.png)

<br>
## Ubuntu 에 도커 설치하기

우분투에 docker 설치는 [공식 링크](https://docs.docker.com/engine/install/ubuntu/) 를 따라서 한다.

이제 기본 명령어로 잘 설치되었는지 체크해보자.<br>
```docker -v``` ```docker images``` ```docker ps -a```

![docker config 01]({{ site.url }}/assets/post-img/docker_config02.png)

<br>
## Docker 작업환경 만들기

### docker-user

먼저 docker 사용만을 위한 SUDO 계정을 만들어 보자

root 로 접속 후 도커유저 생성
```text
ra@ra-VirtualBox:/$ su
Password:
root@ra-VirtualBox:/$ adduser docker-user
...
root@ra-VirtualBox:/$ usermod -aG sudo docker-user
root@ra-VirtualBox:/$ 
```

명령 ```usermod``` 에서 ```-aG``` 옵션은 사용자를 보조 그룹에 추가하는 옵션이다.
새로 추가한 ```docker-user``` 유저는 sudo 권한을 갖는 보조그룹에 추가되었다.

### docker workdir

docker-user 로 접속 후 작업 디렉토리 만들기
```text
root@ra-VirtualBox:/$ su - docker-user
docker-user@ra-VirtualBox:~$ pwd
/home/docker-user
docker-user@ra-VirtualBox:~$ mkdir -p ./workdir/base
docker-user@ra-VirtualBox:~$ ls -lR
.:
total 16
drwxrwxr-x 3 docker-user docker-user 4096 10월 11 16:55 workdir

./workdir:
total 4
drwxrwxr-x 2 docker-user docker-user 4096 10월 11 17:22 base

./workdir/base:
total 0
docker-user@ra-VirtualBox:~$ 
```

이후부터 ```/home/docker-user/workdir/base``` 디렉토리에
ubuntu 18.04 LTS 베이스 이미지를 만들고 실습을 진행할 것이다.
