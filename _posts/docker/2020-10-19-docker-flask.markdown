---
title:  "[도커실습05] Flask 이미지 만들기"
created:   2020-10-19 01:23:06 +0900
updated:   2020-10-20 23:17:26 +0900
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
2. [Flask 어플리케이션 만들기](#flask-어플리케이션-만들기)
2. [Flask 빌드를 위한 Dockerfile](#flask-빌드를-위한-dockerfile)
3. [이미지 빌드 후 컨테이너 실행하기](#이미지-빌드-후-컨테이너-실행하기)

---

<br>
## 들어가며

[Flask](https://flask.palletsprojects.com/en/1.1.x/) 는 파이썬 기반 웹 프레임워크이다.
웹개발에 있어서 기본적인 모듈들을 이미 포함한 [Django](https://www.djangoproject.com/) 프레임워크와는 달리 Flask 는
[wsgi](https://flask.palletsprojects.com/en/1.1.x/deploying/),
[request](https://flask.palletsprojects.com/en/1.1.x/api/),
[logging](https://flask.palletsprojects.com/en/1.1.x/logging/),
[jinja2 template engine](https://flask.palletsprojects.com/en/1.1.x/templating/) 등 웹앱으로써 최소한의 기능만을 갖추고 있다.

그만큼 경량이라는 의미이고, 사용자의 입맛대로 모듈 추가 및 커스터마이징에 유리하다.

<br>
## Flask 어플리케이션 만들기

일단은 ```/home/docker-user/workdir/server-flask``` 디렉토리를 생성하여
[**_My Flask_**](https://github.com/daesungRa/server-flask.git) 프로젝트를 clone 하도록 하자.

내가 최소한으로 만들어둔 flaks 웹 프로젝트인데 나중에 좀더 보강하여 제작 포스트를 올릴 것이다(2020.10.19).

<br>
## Flask 빌드를 위한 Dockerfile

My Flask 안의 ```Dockerfile``` 을 살펴보자.

![docker flask 01](https://daesungra.github.io/namu/assets/post-img/docker_flask01.png)

```base:20.10.1``` 이미지에 이전 글에서 만들었던 파이썬 개발환경설정까지 포함하였다.
이후 이미지 내에 ```/serve/server-flask``` 디렉토리를 생성해 WORKDIR 로 지정하였다.

- COPY : [Flask 어플리케이션 만들기](#flask-어플리케이션-만들기) 에서 clone 해온 flask 프로젝트를 이미지의 WORKDIR 에 복사한다.
COPY 커맨드는 ADD 와 달리 단순히 지정 위치의 파일들만 복사하며, 압축파일 등도 압축된 상태 그대로 보존한다.
- RUN : 이미지에 복사된 flask 프로젝트 경로에서 ```venv``` 가상환경을 만든다.
- CMD : 컨테이너를 RUN 할 때 어플리케이션 실행 스크립트인 ```run_app.sh``` 를 자동으로 실행한다.

<br>
## 이미지 빌드 후 컨테이너 실행하기

이제 이미지를 빌드해보자.

![docker flask 02](https://daesungra.github.io/namu/assets/post-img/docker_flask02.png)

COPY, RUN 등 순차적으로 잘 되는 것을 볼 수 있다.
빌드 결과를 확인해보자.

![docker flask 03](https://daesungra.github.io/namu/assets/post-img/docker_flask03.png)

다음으로 빌드된 이미지를 ```docker run``` 해보자.

![docker flask 04](https://daesungra.github.io/namu/assets/post-img/docker_flask04.png)

정상적으로 잘 동작중이다.
