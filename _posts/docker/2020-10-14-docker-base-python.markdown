---
title:  "[도커실습03] Base 파이썬 개발환경 만들기"
created:   2020-10-14 22:38:48 +0900
updated:   2020-10-14 22:38:48 +0900
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
2. [Pyenv 설명](#pyenv-설명)
3. [Base 파이썬 개발환경 만들기](#base-파이썬-개발환경-만들기)

---

<br>
## 들어가며

이 글의 목적은 이전까지 만들어 두었던 [Base 우분투 이미지](https://daesungra.github.io/namu/docker/2020/10/11/docker-base)를
기반으로 파이썬 개발환경 이미지를 빌드하는 것이다.

파이썬은 크게 2.x 버전과 3.x 버전이 존재한다.
둘 간에는 여러 문법적인 차이가 있기 때문에 혼용해서 사용하기 어려우며 각각의 상세 버전으로 나누어 들어가면 더 복잡해진다.

만약 2.x 로 구축된 프로젝트와 3.x 로 구축된 프로젝트를 하나의 시스템에서 동시에 개발한다면?
어느 한쪽의 프로젝트는 버전문제로 인해 개발 자체가 불가능할 것이다.

<br>
## Pyenv 설명

이러한 문제를 해결하기 위해 **pyenv** 는 시스템 차원에서 특정 파이썬 버전만을 빠르게 스위칭해가며 사용할 수 있는 환경을 제공한다.

다음은 공식 문서의 설명이다

> ### _Simple Python Version Management: pyenv_
> _Pyenv lets you easily switch between multiple versions of Python. It's simple,
> unobtrusive, and follows the UNIX tradition of single-purpose tools that do one thing well.
> \[[pyenv 공식문서](https://github.com/pyenv/pyenv)\]_

pyenv 는 별도의 설치가 필요하며, pyenv 내에서 여러 버전의 파이썬을 세팅할 수 있다.

<br>
## Base 파이썬 개발환경 만들기

Base 우분투 이미지에 pyenv 파이썬 개발환경을 세팅해보자.
위치는 ```/home/docker-user/workdir/base-python/Dockerfile``` 이다.

![docker base python 01](https://daesungra.github.io/namu/assets/post-img/docker_base_python01.png)

한 가지 유념할 점은 pyenv 를 **```$PATH``` 환경변수에 우선적으로 추가**해야 한다는 것이다.
그러면 개발을 위해 파이썬을 실행할 때 기존의 global python 이 아닌 **pyenv 에 세팅된 python** 이 먼저 호출된다.

- FROM, MAINTAINER : 베이스 이미지 및 빌드 관리자 정보
- ARG : **내가 사용할 파이썬 버전**을 변수로 명시. ```3.6.8``` 외에 필요한 다른 버전을 지정해도 무관
- RUN : 사전작업 및 pyenv 설치
    - apt-get 매니저를 업데이트 하고, pyenv 사전필수 패키지 설치
    - pyenv 설치를 위해 ```https://pyenv.run``` 스크립트를 다운받아 실행
- ENV : pyenv 가 설치된 경로를 **PYTHON_ROOT 로 지정하고, ```$PATH``` 에 prepend**
- RUN : pyenv 및 pyenv virtualenv 초기화 / 명시된 버전의 파이썬 설치 및 관련패키지 업그레이드

이로써 pyenv 기반 파이썬 개발환경이 구축되었다.<br>
다음으로 파이썬 웹앱의 웹서버 역할을 하는 ```nginx``` 컨테이너 이미지를 빌드하고 실제 구축해보자.
