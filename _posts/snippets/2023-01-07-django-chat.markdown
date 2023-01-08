---
title: 채팅앱 만들기 with 장고
created: 2023-01-07 18:00:00 +0900
updated: 2023-01-07 22:00:00 +0900
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

1. [기본 환경 구성](#1-기본-환경-구성)
    - [파이썬 환경 설정](#파이썬-환경-설정)
    - [가상환경, git 구성](#가상환경-git-구성)
    - [프로젝트 구성](#프로젝트-구성)

### 참조

- <a href="https://channels.readthedocs.io/en/stable/" target="_blank">Docs: Django Channels</a>

---

<br><br>

<a href="https://channels.readthedocs.io/en/stable/" target="_blank">Django Channels</a> 를 활용한 채팅앱을 만들어 봅시다.

<br><br>
# 1. 기본 환경 구성

<br>
## 파이썬 환경 설정

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

<br>
## 가상환경, git 구성

프로젝트를 생성할 위치에서 진행하며, 이름은 **mychat** 으로 합니다.<br>
<small>_(원하는 프로젝트명으로 하세요.)_</small>

**mychat** 디렉토리 생성 후 그곳으로 이동하여

**venv** 이름으로 가상환경을 생성하고, **```$ git init```** 합니다.

```text
$ mkdir mychat
$ cd mychat
~/mychat $ python -m virtualenv venv
~/mychat $ git init
~/mychat $ ls -la
... ./
... ../
... .git/
... venv/
~/mychat $ 
```

> github repository 를 등록하려면,<br>**```$ git remote add [REMOTE NAME] [REMOTE URL]```** 명령을 입력하면 됩니다.<br>
> 리모트 URL 을 가져오려면 먼저 github 에서 레포지토리를 생성했어야 합니다.
> (<a href="https://shanepark.tistory.com/284" target="_blank">참조</a>)

가상환경 진입과 빠져나오는 명령입니다.

```text
~/mychat $ source ./venv/bin/activate
(venv) ~/mychat $ 
(venv) ~/mychat $ deactivate
~/mychat $ 
```

<br>
## 프로젝트 구성

가상환경 내에서 장고 프로젝트인 **mychat** 에서 필요한 패키지들을 설치하고 ```$ pip freeze``` 합니다.

```text
(venv) ~/mychat $ python -m pip install -U django djangorestframework \
> requests coverage 'channels[daphne]' channels-redis
(venv) ~/mychat $ python -m pip freeze > requirements.txt
(venv) ~/mychat $ ls -la
... ./
... ../
... .git/
... requirements.txt
... venv/
(venv) ~/mychat $ 
```

다음으로 **django-admin** 커맨드로 장고 프로젝트, 기본 앱을 생성한 후,<br>
프로젝트 구성을 최적화합니다.

```text
(venv) ~/mychat $ django-admin startproject mychat
(venv) ~/mychat $ django-admin startapp core
(venv) ~/mychat $ mv ./mychat/ ./temp/
(venv) ~/mychat $ mv ./temp/* ./
(venv) ~/mychat $ rmdir ./temp/
(venv) ~/mychat $ mv ./mychat/ ./config/
(venv) ~/mychat $ mkdir ./apps ./static ./templates
(venv) ~/mychat $ 
```

최종적으로 디렉토리가 이런 모습인지 확인합니다.

```text
(venv) ~/mychat $ ls -l
... apps/
... config/
... core/
... manage.py
... requirements.txt
... static/
... templates/
... venv/
(venv) ~/mychat $ 
```

이제부터 새로 생성되는 앱은 **apps/** 디렉토리에 넣을 것입니다.

최적화된 구성에 맞게 설정을 변경합니다.

```python
# ./manage.py
...
3 import os
4 import sys

...

9     os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

...
```

```python
# ./config/asgi.py
...
10 import os
11 
12 from django.core.asgi import get_asgi_application
13 
14 os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
15 
16 application = get_asgi_application()
```

```python
# ./config/wsgi.py
...
10 import os
11 
12 from django.core.wsgi import get_wsgi_application
13 
14 os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
15 
16 application = get_wsgi_application()
```

```python
# ./config/settings.py
...
13 from pathlib import Path

...

52 ROOT_URLCONF = 'config.urls'

...

70 WSGI_APPLICATION = 'config.wsgt.application'

...
```

```python
# ./core/apps.py
1 from django.apps import AppConfig
2 
3 
4 class CoreConfig(AppConfig):
5     default_auto_field = 'django.db.models.BigAutoField'
6     name = 'core'
```

**```config/settings.py```** 의 **INSTALLED_APPS** 설정에 맞게 db miagration 을 진행하고,<br>
수퍼유저를 생성한 뒤 서버를 실행합니다.

```text
(venv) ~/mychat $ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying sessions.0001_initial... OK
(venv) ~/mychat $ 
(venv) ~/mychat $ python manage.py createsuperuser --email [EMAIL ADDR] --username [USERNAME]
Password: 
Password (again): 
Superuser created successfully.
(venv) ~/mychat $ 
(venv) ~/mychat $ python manage.py runserver
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

<br>
## 

<br>
## 

<br>
## 

<br>
## 

<br>
## 
