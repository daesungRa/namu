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
4. [기본 템플릿 구성](#4-기본-템플릿-구성)
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
(venv) ~/mysite $ touch ./apps/__init__.py
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

이제부터 새로 생성되는 앱은 **apps/** 패키지(디렉토리) 내에 넣을 것입니다.

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

54 TEMPLATES = [
55     {
56         'BACKEND': 'django.template.backends.django.DjangoTemplates',
57         'DIRS': [BASE_DIR / 'templates'],

...

70 WSGI_APPLICATION = 'config.wsgi.application'

```

**```config/settings.py```** 에서 기본 템플릿 경로를 **templates** 로 지정합니다.
그리고 **INSTALLED_APPS** 설정에 맞게 db miagration 을 진행하고, 수퍼유저를 생성한 뒤 서버를 실행합니다.

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
<!-- templates/home.html -->

{% extends "layout.html" %}

{% block page_title %}
    HOME
{% endblock page_title %}

{% block content %}
    <div>
        <h2>This is Home page!</h2>
    </div>
{% endblock content %}

```
{% endraw %}

이 외 **404.html**, **500.html** 에러 페이지도 적절히 생성하세요.

다음으로 **core 앱의 URLConf** 를 지정하여 기본 **HOME** 화면을 띄워보겠습니다.

```python
# core/views.py
"""
View components of core app.
"""
from django.shortcuts import render

from django.views.generic import View


class HomeView(View):
    """
    Home view of this project.
    """

    def get(self, request):
        context = {'title': 'Home'}
        return render(request=request, template_name='home.html', context=context)

```

```python
# core/urls.py
"""
URLConf of core app.
"""
from django.urls import path

from .views import HomeView

app_name = 'core'
urlpatterns = [
    path(r'', HomeView.as_view(), name='home'),
]

```

**core** 앱의 **URLConf** 를 **config** 의 설정에 include 하면 완료입니다.

```python
# config/urls.py
...
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path(r'', include('core.urls', namespace='core')),
    path(r'admin/', admin.site.urls),
]

```

이후 **http://127.0.0.1:8000/** 로 다시 접속해봅니다.

<br><br>
# 5. User 앱

<br>
프로젝트의 첫 앱인 **users** 를 생성합니다.

users 앱은 장고에서 권한관리 및 어드민 기능을 기본적으로 제공하는
**'django.contrib.auth'**, **'django.contrib.admin'** 앱을 베이스로 구성됩니다.

```text
(venv) ~/mysite $ django-admin startapp users
(venv) ~/mysite $ 
(venv) ~/mysite $ mv ./users/ ./apps/
(venv) ~/mysite $ ls -lR ./apps/
./apps/:
... __init__.py
... users/

./apps/users:
... __init__.py
... admin.py
... apps.py
... migrations/
... models.py
... views.py

./apps/users/migrations:
... __init__.py
(venv) ~/mysite $ 
```

```python
# apps/users/apps.py
from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'  # apps 패키지 내부로 경로 변경

```

settings.py 설정의 **INSTALLED_APPS** 에 **users** 앱을 추가하고,
하단에 **users** 앱의 **커스텀 User 모델**을 프로젝트의 AUTH_USER 객체로 쓸지 지정해줍니다.

```python
# ./config/settings.py

...

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'apps.users',  # 추가
]

...

# Customized User Model

AUTH_USER_MODEL = 'users.User'

```


<br>
## User 모델과 폼

커스텀 **User** 모델은 장고 추상 모델인 **django.contrib.auth.models.AbstractUser** 를 상속받습니다.

이것은 **username** 과 **password** 필드를 강제하며, 기본적으로 다음의 선택적 필드를 가지는 추상 모델입니다.
> first_name, last_name, email, is_staff, is_action, date_joined 

```python
# apps/users/models.py
"""
Models of users app.
"""

from django.db import models

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """User model"""

    birthdate = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.username

```

커스텀 **User** 모델에서 **birthdate** 필드를 추가해 보았습니다.

새 커스텀 모델을 생성했으므로, DB 에 적용합니다.

```text
(venv) ~/mysite $ python manage.py makemigrate
Migrations for 'users':
  apps\users\migrations\0001_initial.py
    - Create model User
(venv) ~/mysite $ python manage.py migrate
... 
... OK
(venv) ~/mysite $ 
```

다음으로 기본적인 폼을 제공하고 사용자 입력 데이터를 검사하는 **Form 모듈**을 정의합니다.
우선 로그인 페이지를 구현할 것이므로 **login form** 을 생성합니다.

```python
# apps/users/forms.py
"""
Forms of users app.
"""

from django.forms import Form, ValidationError
from django.forms import CharField, EmailField
from django.forms import EmailInput, PasswordInput

from .models import User


class LoginForm(Form):
    """Login form detail"""

    username = EmailField(widget=EmailInput(attrs={'placeholder': 'Username in email form'}))
    password = CharField(widget=PasswordInput(attrs={'placeholder': 'Password'}))

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                return self.cleaned_data
            else:
                self.add_error(field='password', error=ValidationError('Password is wrong'))
        except User.DoesNotExist:
            self.add_error(field='username', error=ValidationError('User does not exist.'))

```

아이디인 **username** 은 이메일 형식으로 받을 것이므로 **EmailField** 입력 타입을 사용합니다.

**clean()** 메서드는 Form 고유의 기능으로써 사용자 입력 데이터가 유효한지 검증합니다.

<br>
## 믹스인, 뷰, URLConf

여러 모듈에서 재사용되는 부분을 **믹스인**으로 정의해두면 좋습니다.

사용자 request 가 로그인된 상태인지 구분하는 기능이 대표적인 예시입니다.

```python
# apps/users/mixins.py
"""
Mixins of users app.
"""

from django.contrib import messages
from django.urls import reverse_lazy
from django.shortcuts import redirect
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin


class LoggedInOnlyView(LoginRequiredMixin):
    permission_denied_message = 'Page not found!'
    login_url = reverse_lazy('users:login')


class LoggedOutOnlyView(UserPassesTestMixin):
    permission_denied_message = 'Page not found!'

    def test_func(self):
        return not self.request.user.is_authenticated

    def handle_no_permission(self):
        messages.warning(self.request, "Can't go there.")
        return redirect('core:home')

```

장고 기본 믹스인인 **LoginRequiredMixin** 를 상속한 **LoggedInOnlyView** 에는
접속 거부 메시지와 redirect 대상 경로를 지정하고,

**LoggedOutOnlyView** 는 **test_func()** 메서드에서 실패한 request 에 대하여
permission error 를 발생시키는 **UserPassesTestMixin** 을 상속합니다.
이것은 사용자 request 가 로그아웃 되어있는지 체크합니다.

```python
# apps/users/views.py
"""
Views of users app.
"""

from django.views.generic import FormView

from django.shortcuts import redirect, reverse

from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout

from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin

from .forms import LoginForm
from .mixins import LoggedInOnlyView, LoggedOutOnlyView


class LoginView(LoggedOutOnlyView, SuccessMessageMixin, FormView):
    template_name = 'users/login.html'
    form_class = LoginForm
    success_message = 'Successfully logged in.'

    def form_valid(self, form):
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = authenticate(request=self.request, username=username, password=password)
        if user is not None:
            django_login(request=self.request, user=user)
        return super(LoginView, self).form_valid(form=form)

    def get_success_url(self):
        next_arg = self.request.GET.get('next')
        if next_arg is not None:
            return next_arg
        else:
            return reverse('core:home')


def logout(request):
    messages.info(request=request, message='Successfully logged out.')
    django_logout(request=request)
    return redirect(to=reverse('core:home'))

```

로그인과 로그아웃 시 정의된 로직을 수행하고 템플릿을 렌더링하는 **LoginView**, **logout** 을 구현합니다.

**LoginView** 는 **LoggedOutOnlyView** 믹스인을 상속받아 세션 로그아웃된 상태에서만 접근 가능하도록 하고,
**form_valid()** 메서드를 재정의하여 로그인 로직를 구현합니다.

그리고 **logout** 은 함수 기반 뷰로 간략히 정의합니다.

메인 페이지에서도 로그인이 필수가 되도록 하기 위해 **HomeView** 에 **LoggedInOnlyView** 를 적용합니다.

```python
# core/views.py
"""
View components of core app.
"""
from django.shortcuts import render

from django.views.generic import View

from apps.users.mixins import LoggedInOnlyView  # 로그인 필수 적용!


class HomeView(LoggedInOnlyView, View):  # 로그인 필수 적용!
    """
    Home view of this project.
    """

    def get(self, request):
        context = {'title': 'Home'}
        return render(request=request, template_name='home.html', context=context)

```

커스텀 믹스인의 정의에 따라 세션 로그아웃 상태에서 Home 화면에 접근하면 로그인 페이지로 이동됩니다.

다음은 **LoginView** 가 렌더링하는 로그인 페이지입니다.

{% raw %}
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
    </div>
{% endblock content %}

```
{% endraw %}

마지막으로 커스텀 뷰를 URLConf 에 등록하고 메인 페이지에 접속합니다.

```python
# apps/users/urls.py
"""
URLConf of users app.
"""

from django.urls import path

from .views import LoginView, logout

app_name = 'users'
urlpatterns = [
    path(r'login/', LoginView.as_view(), name='login'),
    path(r'logout/', logout, name='logout'),
]

```

```python
# config/urls.py
...
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path(r'', include('core.urls', namespace='core')),
    path(r'users/', include('apps.users.urls', namespace='users')),
    path(r'admin/', admin.site.urls),
]

```

**http://127.0.0.1:8000/** 로 다시 접속한 후 로그인, 로그아웃을 해봅시다!

<br>
## 
