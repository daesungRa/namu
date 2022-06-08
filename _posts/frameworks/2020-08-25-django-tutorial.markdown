---
title: Django tutorial 정리
created: 2020-08-25 21:17:34 +0900
updated: 2020-09-91 22:36:24 +0900
author: namu
categories: frameworks
permalink: "/frameworks/:year/:month/:day/:title"
image: https://miro.medium.com/max/1050/1*Ks0q-hduUiEo9JVzWNJhRg.jpeg
alt: python and django logo
image-view: true
image-author: Pim Vernooij
image-source: https://blog.labdigital.nl/why-python-django-are-our-weapons-of-choice-8a662b51136e
---


---

[목차]

1. [들어가며](#들어가며)
2. [1장 프로젝트 생성하기](#1장-프로젝트-생성하기)
3. [2장 데이터베이스 설정 및 관리자 기능](#2장-데이터베이스-설정-및-관리자-기능)
4. [3장 더 많은 뷰와 템플릿](#3장-더-많은-뷰와-템플릿)
5. [4장 폼과 제네릭 뷰](#4장-폼과-제네릭-뷰)
6. [5장 테스팅](#5장-테스팅)
7. [6장 정적 파일들](#6장-정적-파일들)
8. [7장 관리자 사이트 바꿔보기](#7장-관리자-사이트-바꿔보기)
9. [8장 재사용 가능한 앱 작성하기](#8장-재사용-가능한-앱-작성하기)
10. [9장 Django 용 패치 작성하기](#9장-django-용-패치-작성하기)

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

view 작성
{% gist daesungra/8906238f7753a26d887b55d666647ecc %}

polls url 작성
{% gist daesungra/7bfcfdfc218125ef72ab73bcb7d6545f %}

mysite url 작성
{% gist daesungra/9fead032fa3880a788b65bbac494a4db %}

mysite 가 프로젝트의 메인 앱이기 때문에 이곳에 polls url 을 include 해줘야 한다.<br>
이곳을 **URLconf** 라고 한다.<br>
그럼 이제 ```http://localhost:[포트]/polls/``` 로 이동하면
"Hello, world. You're at the polls index." 문장이 출력된 페이지를 확인할 수 있다.

<br>
## 2장 데이터베이스 설정 및 관리자 기능

[튜토리얼 안내](https://docs.djangoproject.com/en/3.1/intro/tutorial02/#database-setup)를 따라 SQLite 를 활용한다.<br>
먼저 환경설정 파일인 ```mysite/settings.py``` 를 살펴보자.

### 프로젝트에 설치된 앱 목록
```text
INSTALLED_APPS = [
    'polls.apps.PollsConfig',  # polls 앱
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

### 프로젝트에서 사용할 DB 정의
```text
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

이에 따라 migration 을 실행하면, 각 앱이 필요로 하는 기본 테이블이 만들어지게 된다.

```text
(venv) $ python manage.py migrate
```

migration 에서 필요로 하는 정보는
[**장고 db model**](https://docs.djangoproject.com/en/3.1/ref/models/instances/#django.db.models.Model) 에 기반한다.<br>
해당 모델정보는 각 앱의 models.py 에 기록되어 있다.<br>
polls 앱에서는 **Question** 및 **Choice** 두 모델을 사용하며, 후자는 전자에 종속적이다.

- question 테이블의 필드 : question_text: str, pub_date: datetime
- Choice 테이블의 필드 : choice_text: str, votes: int

### polls 앱의 model 정의
{% gist daesungra/502cfbe26ea1aef0c92eb36de446018e %}

[django.db.models.Model](https://docs.djangoproject.com/en/3.1/ref/models/instances/#django.db.models.Model)
클래스에는 CharField, IntegerField, DateTimeField, ForeignKey 타입 등의 변수가 존재한다.

추가로 ```\_\_str\_\_``` 매직 메서드를 통해 각 text 필드값이 그대로 반환되도록 하였고,
```was_published_recently``` 메서드를 통해 등록된 ```pub_date``` 가 당일인지(정확히는 1일 이내) 체크하도록 하였다.

이제 polls 앱의 model 을 정의했으니 settings 의 INSTALLED_APPS 목록에 추가된 것을 확인하고 migration 을 진행하면 된다.

### migration 만들기
model 에 변경사항이 있으면 새로운 migration 을 만든다
```text
(venv) $ python manage.py makemigrations polls
```
이렇게 만들어진 migration 은 ```polls/migrations/0001_initial.py``` 와 같이 앱 디렉토리 내에 생성되며,
git 을 통해 버전관리가 가능하다.

### 쿼리 확인
쿼리가 잘 생성되었는지 확인 차원이므로 넘어가도 된다.
```text
(venv) $ python manage.py sqlmigrate polls 0001
```

### migration 실행
```text
(venv) $ python manage.py migrate
```
이 migrate 명령은 매우 강력하며, **데이터 손실 없이 DB 를 라이브로 업그레이드 하는 데 특화**되어 있다.

모델을 작성하고 실제 테이블 스키마가 생성되었다면 이제 python 코드상에서 다음과 같이 활용할 수 있다.
### api 를 통해 model 활용
다음은 파이썬 코드상에서 model 활용 예제이다.
{% gist daesungra/18b41a995b6b525be941a0e2e79eca20 %}

### 관리자 기능 - admin 사용자 만들기
> INSTALLED_APPS 에 등록된 [_django.contrib.auth_](https://docs.djangoproject.com/en/3.1/topics/auth/#module-django.contrib.auth) 앱이다.

```admin``` 사이트는 ```polls``` 뿐 아니라 프로젝트에서 사용되는 모든 앱의 관리를 위한 별개의 사이트로, 관리자 외 접근 불가이다.
먼저 관리자 계정을 생성해보자.

```text
(venv) $ python manage.py createsuperuser
Username: admin
Email address: admin@example.com
Password: **********
Password (again): *********
Superuser created successfully.
```

이러면 끝이다. 정말 간단하다.<br>
이제 ```http://localhost:[PORT]/admin/``` 에 접속해 로그인한 뒤 등록된 각종 컨텐츠들을 관리(CRUD)할 수 있다.

### 관리자 기능 - admin 앱에 polls 관리기능 추가
마찬가지로 polls 앱을 매우 간단하게 admin 에 등록할 수 있다.
{% gist daesungra/56d36771f1d434e4001ce649dcd2397f %}

> TIMEZONE 설정에 유의할 것.
>> datetime 객체를 활용한다면 무조건 aware 객체여야만 한다.
>> 이는 서로 다른 시간대 간의 변환 가능성을 보장하기 위함이다.
>> Django 는 기본적으로 'UTC' timezone 이므로, 'Asia/Seoul' timezone 에서 변환을 염두에 두거나 TIME_ZONE 설정을 맞춰줘야 한다.
>>> 일반적으로 저장시에는 항상 'UTC' timezone 으로, 사용자에게 보여줄 때는 그에 맞는 timezone 으로 변환하는 것을 원칙으로 한다.

이제 다음과 같이 admin 사이트를 활용할 수 있다.

![admin-main](https://docs.djangoproject.com/en/3.1/_images/admin03t.png)
![admin-polls-questions](https://docs.djangoproject.com/en/3.1/_images/admin04t.png)
![admin-polls-questions-content](https://docs.djangoproject.com/en/3.1/_images/admin05t.png)

<br>
## 3장 더 많은 뷰와 템플릿

뷰(view)는 사용자에게 보여지는 화면을 구성한다.<br>
사용자의 모든 행동은 일차적으로 뷰를 통해 이루어진다.<br>

적절한 뷰를 제공하기 위해 명료한 URL 을 지정해야 하는데,
'URLconfs' 에 어떻게 하면 보다 [restful](https://ko.wikipedia.org/wiki/REST) 한 url 을 등록할 수 있을지 항상 고민해야 한다.

### 더 많은 뷰 > detail, results, vote
단순히 작성된 컨텐츠를 반환하는 **HttpResponse** 을 활용한다.
{% gist daesungra/d1f1fe4eebbe62131bc2878bbde4cf9a %}
polls urls 에 위 뷰들을 추가등록한다.
{% gist daesungra/5bfe02513013cb98dc51b546cfc632e7 %}
이 ```urlpatterns``` 는 프로젝트 ```mysite 의 URLconfs``` 에 등록된다.

### 실제로 뭔가를 하는 뷰
다음은 최근 5개의 Questions 를 반환하는 뷰이다.
{% gist daesungra/939ceb9a0b02fc60fe927702f0314c89 %}
그러나 하드코딩된 5개의 Questions 문자열을 단순히 반환하기보다는 Django 에서 제공하는
[TEMPLATES](https://docs.djangoproject.com/en/3.1/ref/settings/#std:setting-TEMPLATES) 을 활용하면 더 좋아보인다.<br>
이를 위해 먼저 polls 디렉토리 안에 templates 디렉토리를 생성한 후 index.html 템플릿 파일을 만들어 보자.
{% gist daesungra/3197dfc351dcd3b5190e976527ca661d %}

> 템플릿 네임스페이스
>> 'polls/templates/index.html' 이 적절해 보이나,
>> 다른 앱의 동일한 템플릿 이름과 구분하기 위하여 특정 앱의 네임스페이스를 지정하는 것이 좋다.
>> 이제 이 템플릿은 네임스페이스를 포함한 'polls/index.html' 로 사용된다.

이제 만들어진 템플릿을 활용하도록 뷰를 업데이트한다. Django 의 template loader 를 활용한다.
{% gist daesungra/5f5ab96c78ab97e7ab1e21303efe8f5f %}

### 뷰를 생성하는 일반적 패턴
HttpResponse 가 렌더링된 template 을 반환하는 위 방식을 함축하는 관용적(idion) 방법이 있다.<br>
그것은 [render()](https://docs.djangoproject.com/en/3.1/topics/http/shortcuts/#django.shortcuts.render) 함수를 사용하는 것이다.
{% gist daesungra/fa1a48eeb1420b780ffe7878fc0bb5aa %}
이런 관용적 방식은 템플릿 로드를 필요로 하는 뷰에서 필요에 따라 사용할 수 있다.

### 404 에러 발생시키기
detail 페이지를 호출할 때 존재하지 않는 Question 번호를 제공하는 경우 404 에러를 발생시킨다.
조회 시 try 후 [Http404](https://docs.djangoproject.com/en/3.1/topics/http/views/#django.http.Http404)
장고 에러를 raise 시킬 수 있겠지만, 보다 관용적인 방법이 있다.
[get_object_or_404()](https://docs.djangoproject.com/en/3.1/topics/http/shortcuts/#django.shortcuts.get_object_or_404)
shortcut 함수가 그것이다.
{% gist daesungra/674a755cf62c9401eaf55c606e5dfee0 %}
get_object_or_404() 는 제공받은 키값을 모델의
[get()](https://docs.djangoproject.com/en/3.1/ref/models/querysets/#django.db.models.query.QuerySet.get)
함수에 전달해 조회하는 한편, 존재하지 않는 경우 Http404 를 raise 시킨다.
- get() 대신에 filter() 를 사용하는 것 외에 완전 동일한
[get_list_or_404()](https://docs.djangoproject.com/en/3.1/topics/http/shortcuts/#django.shortcuts.get_list_or_404)
shortcut 함수도 존재한다. list 가 없으면 Http404 를 raise 시키는 것도 동일하다.

### 템플릿 엔진 사용하기
템플릿 엔진을 사용하여 뷰로부터 제공된 context 변수를 다룰 수 있다.
{% gist daesungra/805328b36a0abe5d304d76fc2eb80df9 %}

### 하드코딩된 URLs 제거하기
하드코딩된 URLs 은 템플릿이 많을 경우 URL 도메인 변경에 일일히 대처하기 어렵다는 문제점이 있다.
보다 유연한 대처를 위해 **'polls/index.html'** 에서 각 question detail 화면으로 링크되는 a 태그의 href 부분을 변경해 보자.
{% gist daesungra/6cacad476e421f2326108d9fb18c2376 %}

이렇게 되면 polls.urls 의 path name(여기서는 'detail')을 사용하므로,
앱의 url 패턴이 변경되어도 별도로 각 템플릿들을 수정하지 않을 수 있다.

### URL 이름 네임스페이싱(Namespacing URL names)
Django 프로젝트 내에 수많은 앱이 존재할 수 있고, 각각에 동일한 이름의 뷰가 존재할 수 있다.<br>
이를 구분하기 위하여 urls.py 에 앱의 네임스페이스인 **app_name** 을 지정할 수 있다.
{% gist daesungra/db33a17ba2801d2d71a6a8593b62b9c0 %}
지정한 **app_name**(polls) 을 polls/index.html 의 detail url 에 명시해 주자.
{% gist daesungra/e51d7744f52f1bff063e5e5baa331cf8 %}

<br>
## 4장 폼과 제네릭 뷰

polls 앱에서 투표를 실행하는 폼(**html <form>**)을 작성해 보자. 투표는 'polls/templates/polls/detail.html' 에서 진행된다.
{% gist daesungra/584e8f9ff56ecdb32a2d535a687616b3 %}
앞에서 언급했던 **네임스페이싱된 유연한 url 템플릿 패턴**을 html form 태그에 적용했다.

<br>
## 5장 테스팅

<br>
## 6장 정적 파일들

<br>
## 7장 관리자 사이트 바꿔보기

<br>
## 8장 재사용 가능한 앱 작성하기

<br>
## 9장 Django 용 패치 작성하기
