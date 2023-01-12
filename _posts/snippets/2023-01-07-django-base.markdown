---
title: 장고 기본환경 구성하기
created: 2023-01-07 18:00:00 +0900
updated: 2023-01-09 23:00:00 +0900
author: namu
categories: snippets
permalink: "/snippets/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2018/03/30/15/11/poly-3275592_960_720.jpg
alt: dog(django-chat)
image-view: true
image-author: Manuchi in pixabay
image-source: https://pixabay.com/ko/users/manuchi-1728328/
---


---

### 목차

1. [파이썬 환경 설정](#1-파이썬-환경-설정)
2. [가상환경, git](#2-가상환경-git)
3. [프로젝트 구성](#3-프로젝트-구성)
4. [기본 템프릿 구성](#4-기본-템플릿-구성)
5. [User 앱](#5-user-앱)

### 참조

- <a href="https://channels.readthedocs.io/en/stable/" target="_blank">Docs: Django Channels</a>

---

<br><br>

장고 기본환경을 구성합니다.

<br><br>
# 1. 파이썬 환경 설정

<br>
가장 먼저 **<a href="https://github.com/pyenv/pyenv" target="_blank">pyenv</a>** 를 설치합니다.<br>
**pyenv** 를 활용하면 시스템 내에서 global python 버전 전환시 매우 간편합니다.

- 리눅스OS: **<a href="https://github.com/pyenv/pyenv#installation" target="_blank">pyenv</a>**
- 윈도우OS: **<a href="https://github.com/pyenv-win/pyenv-win#installation" target="_blank">pyenv for Windows</a>**

설치 이후, 다음과 같이 **global python** 버전을 선택합니다.

```text
$ pyenv global
no global version configured for this directory
$ 
$ pyenv install 3.10.9
$ pyenv global 3.10.9
$ 
$ pyenv global
3.10.9
$ pyenv versions
* 3.10.9 (set by [HOME]/.pyenv/pyenv-win/version)
$ 
```

```text
$ python --version
Python 3.10.9
$ 
$ python -m pip install --upgrade pip
$ python -m pip install virtualenv
$ python -m pip install --upgrade virtualenv
$ 
```

2022년 12월 릴리즈 된 **3.10.9** 버전으로 합니다.<br>
터미널에서 ```$ python --version``` 입력 시 pyenv 의 **Python 3.10.9** 표시되는지 확인합니다.

이후 가상환경 생성을 위해 패키지 관리자인 **pip** 업그레이드와 **virtualenv** 설치를 진행하면 완료입니다.

<br><br>
# 2. 가상환경, git

<br>
프로젝트를 생성할 위치에서 진행하며, 이름은 **mysite** 으로 합니다.<br>
<small>_(원하는 프로젝트명으로 하세요.)_</small>

**mysite** 디렉토리 생성 후 그곳으로 이동하여

**venv** 이름으로 가상환경을 생성하고, **```$ git init```** 합니다.

```text
$ mkdir mysite
$ cd mysite
~/mysite $ python -m virtualenv venv
~/mysite $ git init
~/mysite $ touch .gitignore
~/mysite $ ls -la
... ./
... ../
... .git/
... venv/
~/mysite $ 
```

> github repository 를 등록하려면,<br>**```$ git remote add [REMOTE NAME] [REMOTE URL]```** 명령을 입력하면 됩니다.<br>
> 리모트 URL 을 가져오려면 먼저 github 에서 레포지토리를 생성했어야 합니다.
> (<a href="https://shanepark.tistory.com/284" target="_blank">참조</a>)

> **.gitignore** 파일 내용은
> <a href="https://github.com/daesungRa/drftutorial/blob/master/.gitignore" target="_blank">여기</a>를 참조하세요.

가상환경 진입과 빠져나오는 명령입니다.

```text
~/mysite $ source ./venv/bin/activate
(venv) ~/mysite $ 
(venv) ~/mysite $ deactivate
~/mysite $ 
```

<br><br>
# 3. 프로젝트 구성

<br>
가상환경 내에서 장고 프로젝트인 **mysite** 에서 필요한 패키지들을 설치하고 ```$ pip freeze``` 합니다.

```text
(venv) ~/mysite $ python -m pip install -U requests django coverage
(venv) ~/mysite $ python -m pip freeze > requirements.txt
(venv) ~/mysite $ ls -la
... ./
... ../
... .git/
... requirements.txt
... venv/
(venv) ~/mysite $ 
```

다음으로 **django-admin** 커맨드로 장고 프로젝트, 기본 앱을 생성한 후,<br>
프로젝트 구성을 최적화합니다.

```text
(venv) ~/mysite $ django-admin startproject mysite
(venv) ~/mysite $ django-admin startapp core
(venv) ~/mysite $ mv ./mysite/ ./temp/
(venv) ~/mysite $ mv ./temp/* ./
(venv) ~/mysite $ rmdir ./temp/
(venv) ~/mysite $ mv ./mysite/ ./config/
(venv) ~/mysite $ mkdir ./apps ./static ./templates
(venv) ~/mysite $ 
```

최종적으로 디렉토리가 이런 모습인지 확인합니다.

```text
(venv) ~/mysite $ ls -l
... apps/
... config/
... core/
... manage.py
... requirements.txt
... static/
... templates/
... venv/
(venv) ~/mysite $ 
```

이제부터 새로 생성되는 앱은 **apps/** 디렉토리에 넣을 것입니다.

최적화된 구성에 맞게 설정을 변경합니다.

```python
# ./manage.py

9     os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

```

```python
# ./config/asgi.py

14 os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

```

```python
# ./config/wsgi.py

14 os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

```

```python
# ./config/settings.py

52 ROOT_URLCONF = 'config.urls'

...

70 WSGI_APPLICATION = 'config.wsgi.application'

```

**```config/settings.py```** 의 **INSTALLED_APPS** 설정에 맞게 db miagration 을 진행하고,<br>
수퍼유저를 생성한 뒤 서버를 실행합니다.

```text
(venv) ~/mysite $ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  ...
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying sessions.0001_initial... OK
(venv) ~/mysite $ 
(venv) ~/mysite $ python manage.py createsuperuser --email [EMAIL ADDR] --username [USERNAME]
Password: 
Password (again): 
Superuser created successfully.
(venv) ~/mysite $ 
(venv) ~/mysite $ python manage.py runserver
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
...
Django version x.x.xx, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**http://127.0.0.1:8000/** 접속시 장고 기본 페이지가 나오면 기본 환경 구성 완료입니다.

![django intro](https://daesungra.github.io/namu/assets/img/django_intro.png)

<br><br>
# 4. 기본 템플릿 구성

<br>
다음으로 기본 화면단을 구성합니다.

{% raw %}
```html
<!-- templates/layout.html -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />

        <!-- bootstrap -->
        <link rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
              integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
              crossorigin="anonymous">

        <!-- css style -->
        {% load static i18n %}
        <link rel="stylesheet" type="text/css" href="{% static 'css/layout.css' %}">
        
        <!-- Split web/mobile -->
        <link rel="stylesheet" type="text/css" media="screen and (min-width: 769px)"
              href="{% static 'css/common-web.css' %}">
        <link rel="stylesheet" type="text/css" media="screen and (min-width: 0) and (max-width: 768px)"
              href="{% static 'css/common-mobile.css' %}">
        
        <title>MySite: {% block page_title %}{% endblock page_title %}</title>
    </head>
    <body>
        <div>
            {% include "partials/messages.html" %}
            {% include "partials/header.html" %}
            <div>
                {% block content %}{% endblock %}
            </div>
            {% include "partials/footer.html" %}
        </div>
    </body>
</html>
```

```html
<!-- templates/partials/messages.html -->
{% if messages %}
    <div class="message-box">
        {% for message in messages %}
            <div class="alert alert-{% if message.tags %}{{ message.tags }}{% endif %}" role="alert">
                {{ message }}
            </div>
        {% endfor %}
    </div>
{% endif %}
```

```html
<!-- templates/partials/header.html -->
<header>
    <a href="{% url 'core:home' %}">MySite</a>
</header>
```

```html
<!-- templates/partials/footer.html -->
<footer>
    <span>&copy; 2023 MySite, Inc. All rights reserved.</span>
</footer>
```

```html
<!-- templates/users/login.html -->
{% extends "layout.html" %}

{% block page_title %}
    Log In
{% endblock page_title %}

{% block content %}
    <div>
        {% url "users:login" as loginUrl %}

        <form method="POST" {% if url %} action="{{ url }}" {% endif %} enctype="multipart/form-data">
            {% csrf_token %}
            {% if form.non_field_errors %}
                {% for error in form.non_field_errors %}
                    <span>{{ error }}</span>
                {% endfor %}
            {% endif %}
            {% for field in form %}
                <div class="{% if field.errors %}has-error{% endif %}">
                    {{ field }}
                    {% if field.errors %}
                        {% for error in field.errors %}
                            <span>{{ error }}</span>
                        {% endfor %}
                    {% endif %}
                </div>
            {% endfor %}
            <button>Log In</button>
        </form>

        <div>
            <span>Don't have an account?</span>
            <a href="{% url 'users:signup' %}">Sign up</a>
        </div>
    </div>
{% endblock content %}
```
{% endraw %}

이 외 **404.html**, **500.html** 에러 페이지도 적절히 생성하세요.

<br><br>
# 5. User 앱

<br>
## 

<br>
## 
