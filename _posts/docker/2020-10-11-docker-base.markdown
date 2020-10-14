---
title:  "[도커실습02] Base 우분투 이미지 만들기"
created:   2020-10-10 20:49:23 +0900
updated:   2020-10-14 20:38:48 +0900
author: namu
categories: docker
permalink: "/docker/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2018/03/30/15/11/poly-3275592_1280.jpg
image-view: true
image-author: Manuchi
image-source: https://pixabay.com/ko/users/manuchi-1728328/
---


---

[목차]

1. [들어가며](#들어가며)
2. [Base 우분투 이미지 만들기](#base-우분투-이미지-만들기)

---

<br>
## 들어가며

앞서 **```VirtualBox Ubuntu 18.04 LTS```** 가상머신으로
[```Docker 실습환경```](https://daesungra.github.io/namu/docker/2020/10/10/docker-config)을 만들어 보았다.
이때 ```/home/docker-user/workdir/base``` 디렉토리까지 생성했었는데,
**Base 우분투 이미지**를 이 위치에서 만들게 된다.

지금 이후 docker 기반 이미지를 빌드할 때는 ```Dockerfile``` 을 활용한다.
도커 이미지의 storage 전략은 [```layer```](https://docs.docker.com/storage/storagedriver/#images-and-layers) 의 개념을
따르는데, Dockerfile 은 각 단계별 레이어에 대한 정보를 순서대로 저장한다(line by line).
사용자는 그저 Dockerfile 에 기록된 대로 빌드를 실행해주기만 하면 되는 것이다.

<br>
## Base 우분투 이미지 만들기

먼저 Dockerfile 을 생성한다. 경로는 ```/home/docker-user/workdir/base/Dockerfile``` 이다.

![docker base 01](https://daesungra.github.io/namu/assets/post-img/docker_base01.png)

```Dockerfile``` 커맨드를 하나씩 살펴보자.

- FROM : 지금 시작할 빌드의 베이스 이미지이다. 여기서 베이스는 ubuntu 18.04 LTS 이미지이다.
- MAINTAINER : 이미지를 빌드 및 관리하는 주체의 정보이다.
- ENV : **시스템에 환경변수**를 등록한다.
    - ubuntu:18.04 이미지는 최소한의 파일들로만 구성되었기 때문에 로케일 설정을 별도로 해줘야 한다.
    - 기본적으로 비어 있는 LANG, LC_ALL 로케일 환경변수에 'C.UTF-8' 을 지정해야 시스템에 한글 입력이 가능하다.
    - '.' 를 기점으로 좌측은 로케일(POSIX), 우측은 코드셋(UTF-8)을 의미한다.
    - 추가적으로 $TZ 변수에 timezone 을 입력한다.
- RUN : 이미지 내에서 **실행시킬 명령**이다. 리눅스 환경에서는 쉘 스크립트 정도가 되겠지.
    - ln 라인 : 시스템 timezone 을 지정한다(timezone 정보 파일을 심볼릭 링크로 연결).
    - apt-get 라인 : 이후 apt-get 업데이트 이후 기본적으로 필요한 패키지들을 설치한다
    - mkdir 라인 : 향후 베이스 우분투 기반의 프로젝트들을 생성할 기본 디렉토리를 생성한다.
- WORKDIR : 이미지의 work directory 경로이다. 컨테이너를 생성하면 이곳부터 시작된다.

다음으로 이 Base 이미지를 토대로 python 환경을 구축해보자.
