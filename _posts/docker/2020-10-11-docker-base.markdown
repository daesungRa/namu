---
title:  "Base 우분투 이미지 만들기"
created:   2020-10-10 20:49:23 +0900
updated:   2020-10-11 16:17:48 +0900
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
[```Docker 실습환경```](./2020-10-10-docker-config.markdown)을 만들어 보았다.
이때 ```/home/docker-user/workdir/base``` 디렉토리까지 생성했었는데,
이번에는 이 위치를 기반으로 해서 **Base 우분투 이미지**를 만들 것이다.

<br>
## Base 우분투 이미지 만들기

먼저 Dockerfile 을 만든다. 경로는 ```/home/docker-user/workdir/base/Dockerfile``` 이다.

![docker base 01](https://daesungra.github.io/namu/assets/post-img/docker_base01.png)
