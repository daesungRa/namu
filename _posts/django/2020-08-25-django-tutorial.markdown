---
title: Django tutorial 정리
date: 2020-08-25 21:17:34 +0900
author: namu
categories: django
permalink: "/django/:year/:month/:day/:title"
image: https://miro.medium.com/max/1050/1*Ks0q-hduUiEo9JVzWNJhRg.jpeg
image-view: true
image-author: Pim Vernooij
image-source: https://blog.labdigital.nl/why-python-django-are-our-weapons-of-choice-8a662b51136e
---


---

[목차]

1. [들어가며](#들어가며)
2. [1장 프로젝트 생성하기](#1장-프로젝트-생성하기)
3. [2장](#2장)
4. [3장](#3장)
5. [4장](#4장)

[참조]

1. []()

---

<br>
## 들어가며

[**_장고 공식 튜토리얼_**](https://docs.djangoproject.com/en/3.1/)을 내가 알아보기 쉽게 요약했다.

> Writing your first Django app!!

<br>
## 1장 프로젝트 생성하기

장고 튜토리얼은 크게 두 어플리케이션으로 구성되어 있다.

- 모든 사람들에게 오픈된 투표 사이트
- 투표를 add, change, and delete 하는 관리자 사이트

프로젝트 루트는 ```/home/[USER]/``` 등 기존의 웹 문서 루트(```/var/www/```)의 외부로 정한다(코드 노출 방지).

### 가상환경 구축 및 의존성 작성
```text
$ python -m vitrualenv venv
(venv) $ pip install django
(venv) $ pip freeze > requirements.txt
```

### 어드민 사이트 시작 > mysite
```text
(venv) $ django-admin startproject mysite
```

사이트 이름은 Python, Django 등 이미 있는 키워드와 겹치지 않도록 한다.<br>
그럼 이제 현재 디렉토리에 mysite 디렉토리가 생성된다. 구조는 다음과 같다.

```text
mysite/
    manage.py
    mysite/
        __init__.py
        settings.py
        urls.py
        asgi.py
        wsgi.py
```

- manage.py : 프로젝트와 다양한 방식으로 상호작용하는 명령 줄 유틸리티.
- mysite/mysite/ : 실제 메인으로 사용되는 프로젝트 패키지.
- settings, urls, asgi, wsgi : 세팅, 프로젝트 기본 url 선언, 호환 웹 진입점.

### 생성된 프로젝트 서버 run 이후 접속하기
```text
(venv) $ python manage.py runserver [허용IP대역]:[포트]
```

이제 브라우저에서 ```http://localhost:[포트]/```와 같은 방식으로 접근 가능하다.
이는 프로덕션 웹서버가 없는 **개발용 임시 웹앱 서버구동**이라는 점 명심.

### polls 앱 만들기

Django 프로젝트 내에서는 개별적인 기능을 가진 여러 앱을 생성, 관리할 수 있다.<br>
**_polls_** 앱을 만들어보자.

```text
(venv) $ python manage.py startapp polls
```

```mysite/mysite/``` 와 유사한 ```mysite/polls``` 디렉토리가 생성된다.
앱 구조도 유사하다.

```text
polls/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```

### 첫 번째 뷰 작성

이제 ```polls/views.py``` 에 뷰단을 작성하고 polls url 을 등록한 후 화면의 띄워보자.

{% gist daesungra/8906238f7753a26d887b55d666647ecc %}
