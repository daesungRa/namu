---
title: "[01] 장고 노하우 정리"
created: 2022-10-23 18:00:00 +0900
updated: 2022-11-03 22:00:00 +0900
author: namu
categories: frameworks
permalink: "/frameworks/:year/:month/:day/:title"
image: https://velog.velcdn.com/images/castlemin/post/9cc001d8-7142-4822-bad1-43fd98cca762/image.jpg
alt: django knowhow
image-view: true
image-author: castlemin in velog.io
image-source: https://velog.io/@castlemin/Two-Scoops-of-Django-0.-%EB%93%A4%EC%96%B4%EA%B0%80%EB%A9%B0
---


---

### 목차

- 1장. [코딩 스타일](#1장-코딩-스타일)
- 3장. [어떻게 장고 프로젝트를 구성할 것인가](#3장-어떻게-장고-프로젝트를-구성할-것인가)
- 4장. [장고 앱 디자인의 기본](#4장-장고-앱-디자인의-기본)
- 6장. [장고에서 모델 이용하기](#6장-장고에서-모델-이용하기)
- 7장. [쿼리와 데이터베이스 레이어](#7장-쿼리와-데이터베이스-레이어)
- 8장. [함수 기반 뷰와 클래스 기반 뷰](#8장-함수-기반-뷰와-클래스-기반-뷰)
- 11장. [장고 폼](#11장-장고-폼)

### 시리즈

- <a href="{{ site.github.url }}/frameworks/2022/11/05/django-knowhow-02" target="_blank">[02] 장고 노하우 정리</a>
- <a href="{{ site.github.url }}/frameworks/2022/11/27/django-knowhow-03" target="_blank">[03] 장고 노하우 정리</a>

### 참조

- <a href="https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=88857020" target="_blank">Two Scoops of Django</a>
- <a href="https://tutorial.djangogirls.org/ko/django_orm/" target="_blank">djangogirls tutorial</a>
- <a href="https://docs.djangoproject.com/en/4.0/topics" target="_blank">Django docs</a>

---

<br><br>

공부용으로 필요한 내용을 정리합니다.

<br><br>
# 1장. 코딩 스타일

<br>
### 79칼럼의 제약

> **"79칼럼에 맞추려고 변수나 함수 또는 클래스 이름을 줄여서 짓는 것은 허용될 수 없다.
> ... 읽기 쉽고 의미 있는 변수명을 만드는 것이 더욱 중요한 일" (애머릭 어거스틴)**

<br>
### 임포트에 대해 - 명시적 성격의 상대 임포트 이용하기 (explicit relative import)

예를 들어 **```cones```** 앱 내부에서,
**```from cones.models import WaffleCone```** 과 같이 하드 코딩된 임포트 문들은 이식성 면에서나 재사용성 면에서 문제가 됩니다.

**```cones/views.py```** 같은 동일 앱 내의 모듈이라면,
**```from .models import WaffleCone```** 과 같이 명시적 성격의 상대 임포트를 이용합시다.

<br><br>
# 3장. 어떻게 장고 프로젝트를 구성할 것인가

<br>
프로젝트 레이아웃을 구성하는 데 널리 합의된 방법에 대해 살펴봅니다.

### 기본 프로젝트 구성

**```$ django-admin.py startproject [project name]```** 는
**프로젝트 root 디렉토리**와 함께 프로젝트 관리를 위한 **```manage.py```**,
프로젝트 이름과 동일한 **세팅 root 디렉토리**를 생성합니다.
**세팅 root 디렉토리** 는 유효한 파이썬 패키지 형태이며,
**```settings.py```**, **```urls.py```** 등의 프로젝트 공통 설정모듈이 존재합니다.

다음으로 프로젝트 root 디렉토리 내에서
**```$django-admin.py startapp [app name]```** 수행하면 입력한 이름의 프로젝트 앱이 생성됩니다.
이곳에는 **```models.py```**, **```views.py```** 등의 앱 필수 모듈이 생성됩니다.

그 형태는 다음과 같습니다.

```text
<project root>/
  manage.py
  <app1>/
    __init__.py
    admin.py
    models.py
    tests.py
    views.py
  <settings root>/
    __init__.py
    settings.py
    urls.py
    wsgi.py
```

<br>
### 우리가 선호하는 프로젝트 구성

위 기본 구성은 **앱 관리 및 저장소(repository) 관리 측면에서 비효율적**입니다.
특히 git 저장소 설정파일, Docker 빌드 설정파일을 두기에 애매한 부분이 존재합니다.

다음은 Two Scoops of Django 와 제가 선호하는 프로젝트 구성입니다.

**Two Scoops of Django**
```text
<repository_root>/
  .gitignore
  Makefile(ex. Dockerfile)
  docs/
  README.rst
  requirements.txt
  <project_root>/
    manage.py
    media/  # 개발 전용!
    <app1>/
      __init__.py
      admin.py
      models.py
      tests.py
      views.py
    <app2>/
    <app3>/
    static/
    templates/
    <settings_root>/
      __init__.py
      settings.py
      urls.py
      wsgi.py
```

**내가 선호하는 프로젝트 구성**
```text
<project_root>/
  .gitignore
  .dockerignore
  Dockerfile
  README.md
  requirements.txt
  run_project.py
  manage.py
  media/  # 개발 전용!
  apps/
    __init__.py
    <app1>/
      __init__.py
      admin.py
      models.py
      tests.py
      views.py
    <app2>/
    <app3>/
  static/
  templates/
  <virtualenv_lib_root>/
  <settings_root>/
    __init__.py
    settings.py
    urls.py
    wsgi.py
```

Two Scoops of Django 프로젝트는 **저장소 루트를 상위로 분리한 것**과
**여러 프로젝트의 가상환경을 별도 공간에 모아둔** 특징이 있습니다.
저장소 루트를 상위로 분리하면 디자이너와 같이 비개발자들을 위한 저장공간을 장고 프로젝트 외에 따로 마련할 수 있습니다.

내 프로젝트는 **저장소 루트와 가상환경이 프로젝트 루트에 포함**되어 있으며, 여러 앱들이 **apps/** 하위에 따로 관리되어 구분이 쉽습니다.
무거운 가상환경 패키지들은 저장소 업로드시 **```.gitignore```** 에 명시해 제외합니다.

각 장단점을 파악하여 적절하게 사용하시기 바랍니다.

<br><br>
# 4장. 장고 앱 디자인의 기본

<br>
장고 앱은 기본적으로 장고 프로젝트에서 **특정 기능을 표현하기 위해 디자인된 작은 라이브러리**입니다.
따라서 필요한 기능의 개수만큼 여러 개가 존재할 수 있습니다.

혹은 장고 모듈이나 외부 라이브러리를 앱으로써 임포트해 사용하게 됩니다.

이러한 앱들은 **```settings.py```** 에서
**INSTALLED_APPS** (DJANGO_APPS + PROJECT_APPS + THIRD_PARTY_APPS) 설정 내에 나열됩니다.

<br>
### 장고 앱 디자인의 황금률

앱의 핵심은 **각 앱이 그 앱의 주어진 임무에만 집중할 수 있어야 한다는 것**입니다.

어떤 앱의 성격과 기능을 한 문장으로 설명할 수 없거나 그 앱을 설명하기 위해 '그리고/또한' 을 한번 이상 사용해야 한다면,
이미 그 앱은 너무 커질 대로 커져 나누어야 할 때가 되었다는 의미입니다.

<br>
### 장고 앱 이름 정하기

앱 이름은 **명료한 한 단어**가 좋습니다.

posts, users, blog 처럼 범용적인 단어가 좋으나, 프로젝트에 목적에 맞는 특정 앱 이름을 지정할 수도 있습니다. (ex. weblog)

앱의 이름은 모듈로써 임포트될 수 있음을 꼭 기억하시기 바랍니다.

<br>
### 확신 없이는 앱을 확장하지 않는다

앱들을 **가능한 한 작게 유지**해야 합니다.

통 하나에 백 가지 맛의 아이스크림이 들어 있는 것보다
한 통에 한 가지 맛의 아이스크림이 들어 있는 것이 훨씬 관리하기 좋은 것과 같은 이치입니다.

다만 너무 완벽하려고 하지 않아도 됩니다. 언제든 다시 되돌릴 수 있습니다.

<br>
### 비공통 앱 모듈

**```models.py```**, **```views.py```**, **```urls.py```**, **```forms.py```** 와 같은 공통 앱 외에,<br>
**```behaviors.py```**, **```constants.py```**, **```middleware.py```** 같이
특별한 기능을 위한 모듈이 앱 내에 포함될 수 있습니다.

또한 앱 내에서 진행되는 **비즈니스 로직을 위한 헬퍼 모듈(Stateless Helper Class)**을 포함시킬 수도 있습니다.
**(<a href="{{ site.github.url }}/frameworks/2022/06/08/django-models-and-databases#저자의-의견-돌아보기"
target="_blank">장고의 디자인 패턴, 모델</a> 참조)**

<br><br>
# 6장. 장고에서 모델 이용하기

<br>
### 모델이 너무 많으면 앱을 나눈다

"앱들을 **가능한 한 작게 유지**해야" 한다는 앞선 가이드를 상기하시기 바랍니다.<br>
모델이 너무 많다는 것은 하나의 앱이 너무 많은 기능을 담당한다는 의미입니다.

<br>
### 모델 상속에 주의하자

장고는 세 가지 모델 상속 방법을 제공합니다.

1. **추상화 기초 클래스(abstract base class)**: 공통 부분을 포함하는 추상화 클래스를 상속
    - migration 시 부모 모델인 추상화 클래스에 해당하는 테이블이 생성되지 않음. 따라서 독립적으로 사용하지는 못함
    - migration 시 상속받은 자식 모델에 해당하는 테이블이 생성됨
    - Meta 설정 내 ```abstract = True``` 로 지정
2. **멀티테이블 상속(multi-table inheritance)**: 상속 관계에 있는 모든 모델을
독립적인 모델로 사용 가능하며 각각 구현된 데이터베이스 테이블에 연결됨
    - 자식 모델은 부모 모델의 필드를 사용 가능하며 상호간의 관계성은 ```OneToOneField``` 로 연결된 컬럼에 의해 확립됨
    (```parent_link=True```)
    - 부모 객체에서 자식 객체를 lowercase name 지정하여 호출 가능 (```parent_object.child_mode_name```)
    - 이러한 상하간의 참조는 테이블 조인 쿼리로 이루어짐. 따라서 상당한 부하를 야기
    - 따라서 사용하지 않기를 권고
3. **프락시 모델(proxy model)**: 원래 모델에 대해서만 테이블이 생성됨
    - 쉽게 말해 동일 모델로부터 여러 별칭 모델이 파생되며,
    - 이러한 별칭 모델은 각기 다른 파이썬 행위(behavior)를 수행
    - 실제 데이터는 원래 모델에 대해서만 존재하므로, 프락시 모델에서 필드를 변경할 수 없음

접합 상속(concrete inheritance)이라고도 하는 멀티테이블 상속은 중복된 필드를 갖는 불필요한 테이블을 추가 생성할 가능성이 있습니다.
또한 생성된 테이블 간 조인을 유발하므로 성능상 부하를 야기합니다.

차라리 상속을 사용하는 대신 모델들 사이에서 좀더 명확한
```OneToOneField``` 와 ```ForeignKeys``` 를 이용함으로써 꼭 필요한 조인만 발생하도록 합니다.

공통 부분을 따로 분류하기 위해서는 추상화 클래스로도 충분하므로, **항상 추상화 기초 클래스를 사용**하는 것을 원칙으로 합니다.

또한 공통 부분이 최소이고 변경이 적다면, 판단 여하에 따라 추상화 상속을 이용하지 않고 각각 필드를 추가해도 됩니다.

<br>
다음은 **추상화 기초 클래스**를 활용하는 예제입니다.
호텔 예약 앱에서 ```Room``` 관련 모델을 구현합니다.
```AbstractItem``` 추상화 클래스가 다시 한번 상속되었다는 점을 주목하시기 바랍니다.

**core/models.py**<br> > 추상화 클래스 정의
```python
# core/models.py
from django.db import models


class TimeStampedModel(models.Model):
    """Abstract class"""
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
```

**apps/rooms/models.py**<br> > 공통 필드(name)를 갖는 추상화 클래스 한번 더 상속 후 용도에 따른 각 모델 정의
```python
# rooms/models.py
from django.db import models
from apps.core.models import TimeStampedModel


class AbstractItem(TimeStampedModel):
    """Abstract class from TimeStampedModel"""
    name = models.CharField(max_length=80)
    
    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class RoomType(AbstractItem):
    """Room model: RoomType"""
    class Meta:
        verbose_name = 'Room Type'
        ordering = ['name']


class Amenity(AbstractItem):
    """Room model: Amenity"""
    class Meta:
        verbose_name_plural = 'Amenities'


class Facility(AbstractItem):
    """Room model: Facility"""
    class Meta:
        verbose_name_plural = 'Facilities'
```

장고의 추상화 클래스는 파이썬 표준 라이브러리인 ```abc``` 모듈을 사용하는 일반적인 추상 클래스와는
목적 면에서 서로 다르기 때문에 혼동해서는 안 됩니다.

장고 추상화 클래스의 목적은 **데이터베이스 테이블과 매핑되는
<a href="https://en.wikipedia.org/wiki/Active_record_pattern" target="_blank">Active Record pattern</a>
모델**의 구현에 있습니다.

<br>
### 데이터베이스 마이그레이션

새 모델 생성 시 마이그레이션은 다음과 같이 수행합니다.

```text
$ python manage.py makemigrations  // 마이그레이션 생성
$ python manage.py sqlmigrate  // 생성된 마이그레이션 SQL 확인
$ python manage.py migrate  // 마이그레이션 실행
$ python manage.py showmigrations  // 프로젝트에 생성된 마이그레이션과 각각의 상태를 보여줌
```

- 운영 서버에서의 마이그레이션은 스테이징 서버에서의 마이그레이션과 다르게 생각보다 오래 걸릴 수 있음(실데이터가 많은 환경)
- 따라서 가급적 스테이징에서 운영과 비슷한 크기의 테스트 데이터를 생성하는 것이 좋음
- MySQL 을 사용하는 경우, 스키마 변경에 트랜잭션을 지원하지 않기 때문에 반드시 데이터베이스를 백업해 두도록 한다
- 이러한 데이터베이스 변경 사항이 있다면 프로젝트를 읽기 전용(read-only) 모드로 변경한다

<br>
### 장고 모델 디자인

- **정규화**, 충분히 고민하여 불필요한 중복 데이터가 발생하지 않도록 정규화해야 합니다.
- **비정규화**, 특별히 필요한 경우만 부분적으로 비정규화를 합니다. 그 이전에 캐싱으로 상당 부분 해결되거나, 비정규화가 많은 경우
**NoSQL** 을 사용할 수 있습니다.
- **널과 공백**, 기본값은 **```null=False, blank=False```**
    - ```null``` 은 데이터베이스 필드와 관련되고 ```blank``` 는 장고 template 위젯 입력값과 관련되며,
    일관성을 위해 장고에서 빈 값은 **```null=False, blank=True```** 를 기본으로 합니다.
    - 문자열 관련 필드(CharField, TextField, FileField)에서 빈 값은 **```null=False, blank=True```** 로 설정합니다.
    - 숫자 관련 필드(IntegerField, FloatField)에서 빈 값은 **```null=True, blank=True```** 으로 설정합니다.
    - ```BooleanField``` 의 공백은 **```NullBooleanField```** 를 사용합니다.
    (```null=True or blank=True``` 설정은 사용하지 않는 대신, ```default=False``` 활용)
    - **예외적인 경우**, 문자열 필드에서 **```unique=True``` 설정이 사용되면 ```null=True```** 를 사용할 수 있습니다.

<br>
### 쿼리셋

> 참조: <a href="https://tutorial.djangogirls.org/ko/django_orm/" target="_blank">장고걸스 튜토리얼</a>

**쿼리셋(QuerySet)**은 전달받은 모델의 객체 목록입니다.

쿼리셋의 중요한 기능은 **데이터를 필터링**하는 것입니다.
예를 들어 ```Post.objects.filter(pub_date__lte=timezone.now())``` 하면 게시물들 중 퍼블리시된 것을 반환합니다.

쿼리셋을 보다 분명히 이해하기 위해 실제 데이터베이스에 질의되는 쿼리문을 확인해 보겠습니다.

```python
...
>>> queryset = Post.objects.filter(pub_date__lte=timezone.now())
>>> str(queryset.query)
SELECT "post"."id", "post"."author", "post"."title", "post"."content", "post"."created_date", "post"."pub_date" FROM "post" WHERE "post"."pub_date" <= "2022-10-23 15:24:27"
```

또한 쿼리셋은 **정렬** 기능도 담당합니다.

```python
>>> Post.objects.order_by('created_date')  # ASCENDING
>>> Post.objects.order_by('-created_date')  # DESCENDING
```

쿼리셋을 **하나로 연결**할 수 있습니다.

```python
>>> Post.objects.filter(pub_date__lte=timezone.now()).order_by('created_date')
```

이렇게 생성된 쿼리셋은 ```views.py``` 모듈에서 **장고 템플릿 엔진으로 전달되어 그대로 사용 가능**합니다.
템플릿에서는 기본적으로 **{\{ posts }\}**, **{ % for post in posts %\}**, **{\{ post.title }\}** 와 같이 사용됩니다.

```python
# apps/posts/views.py

from django.shortcuts import render
from django.utils import timezone
from .models import Post


def post_list(request):
    posts = Post.objects.filter(pub_date__lte=timezone.now()).order_by('created_date')
    return render(request, 'post_list.html', {'posts': posts})
```

<br>
### 모델 매니저

> 추가 참조: <a href="https://docs.djangoproject.com/en/4.0/topics/db/managers/" target="_blank">장고 공식 - Managers</a>

**모델 매니저(model manager)**는 장고 ORM 에서 데이터베이스와 연동하는 인터페이스를 호출합니다.

**커스텀 매니저**를 사용하는 이유는,<br>
**(1) 새 메서드를 추가**하거나 **(2) 기본 모델 매니저가 생성하는 초기 쿼리셋(Initial QuerySet)을 수정**하기 위함입니다.

특히 집계 쿼리(count) 등 **table-level** 의 기능이 필요한 경우,
이를 모든 use-point 에서 각각 사용하거나 특수 함수를 작성하는 것보다는
**커스텀 매니저에 메서드를 추가하는 것이 관리 및 응집도 면에서 좋습**니다.

> [장고 앱 디자인](#비공통-앱-모듈) 이나 [Fat 모델](#거대-모델-이해하기) 파트에서 보다시피,
> stateless helper modules(class or function) 을 따로 생성하는 경우는 그 대상이 복합적인 비즈니스 로직일 때입니다.
> **테이블에 종속되는 기능이 필요한 경우(집계 혹은 모델 내 컬럼의 상태를 변경)에는 커스텀 매니저를 활용**하도록 합시다.

다음은 **(1) 커스텀 매니저를 작성하여 필요한 메서드를 추가**하는 예시입니다.

```python
# apps/reviews/models.py

from django.db import models
from django.utils import timezone


class PublishedManager(models.Manager):
    """Custom manager for published"""

    use_for_related_fields = True

    def published(self, **kwargs):
        return self.filter(pub_date__lte=timezone.now(), **kwargs)


class FlavorReview(models.Model):
    """Ice cream flavor review model"""

    review = models.CharField(max_length=255)
    pub_date = models.DateTimeField()

    # Set default manager to custom manager
    objects = PublishedManager()
```

아이스크림 맛 평가 모델에서 퍼블리시된 평가들을 조회하는 ```published``` 메서드가 추가된 커스텀 매니저를
```objects``` 매니저로 지정했습니다.

```python
>>> from reviews.models import FlavorReview
>>> FlavorReview.objects.count()  # 저장된 모든 평가 개수 조회
35
>>> FlavorReview.objects.published().count()  # 퍼블리시된 평가 개수 조회
31
```

기본 매니저인 ```objects``` 를 커스텀 매니저로 대체하기보다 별개의 매니저로 추가하는 것이 좋다고 판단된 경우
**다른 이름으로 순서에 맞게 아래에 지정**하면 됩니다.

> #### 기본 매니저 (default manager, ```Model._default_manager```)
> **장고 모델에 하나 이상 할당되는 매니저 중 "기본 매니저"는 다음의 용도를 위해 지정됩니다.**
> - **<a href="https://docs.djangoproject.com/en/4.0/ref/django-admin/#django-admin-dumpdata"
> target="_blank">dumpdata</a> 와 같은 장고 내 몇몇 기능에서 독점적으로 사용**
> - **써드파티 앱 등에서 알려지지 않은 모델 사용시, 별도의 매니저명 사용이 없는 경우**
> 
> **기본 매니저의 지정 우선순위는 다음과 같습니다.**
> 1. **모델의 메타 클래스 설정:
> <a href="https://docs.djangoproject.com/en/4.0/ref/models/options/#django.db.models.Options.default_manager_name"
> target="_blank">```Meta.default_manager_name```</a>**
> 2. **부모 모델의 메타 클래스 설정: ```super()._meta.default_manager_name``` (다중 상속시 맨 왼쪽의 부모 클래스)**
> 3. **모델 내에서 정의된 매니저의 순서: 위에서부터 ```objects```, ```published_objects```, ```valid_objects``` 순서로 매니저가
> 정의되었다면, 가장 먼저 정의된 ```objects``` 가 기본 매니저로 지정됨**
>
> **이 중 가장 명확한 방법은 1번인 모델 메타 클래스 설정입니다.**

다음은 **(2) Initial QuerySet(기본 매니저의 초기 쿼리셋)을 수정**하는 예시입니다.

```python
# apps/reviews/models.py

from django.db import models
from django.utils import timezone


class PublishedReviewManager(models.Manager):
    """Custom manager for pub_date"""

    use_for_related_fields = True

    def get_queryset(self):
        return super().get_queryset().filter(pub_date__lte=timezone.now())


class FlavorReview(models.Model):
    """Ice cream flavor review model"""

    review = models.CharField(max_length=255)
    pub_date = models.DateTimeField()

    # Set managers
    objects = models.Manager()
    published_objects = PublishedReviewManager()
    
    class Meta:
        default_manager_name = 'objects'
```

여기서는 초기 쿼리셋을 반환하는 ```get_queryset``` 기본 메서드를 오버라이드 했습니다.
따라서 ```PublishedReviewManager``` 사용시 퍼블리시된 상태의 쿼리셋만 반환됩니다.

또한 모델 내에 Meta 클래스 설정을 통해 기본 매니저를 ```objects``` 로 지정했습니다.

<br>

커스텀 매니저 사용 시 **가장 위험한 점**은 **쿼리셋이 정확히 어떻게 동작할지 예측하기 어려울 수 있다는 것**입니다.
예를 들어 ```FlavorReview.objects.all()``` 로 모든 데이터를 조회하고자 할 때
어떤 매니저를 통해 조회하는지에 따라 의도하지 않게 필터링된 결과가 나올 수 있습니다.
(모델에서 ```objects``` 매니저를 명확하게 정의해야 함)

특히 모델의 내용을 알 수 없는 외부 모듈에서는 더욱 위험할 수 있다는 점을 인지하시기 바랍니다.

<br>

이와 같이 커스텀 매니저는 모델의 응집도를 높이고 중복 코드를 획기적으로 줄이도록 하지만,
쿼리셋 자체가 헷갈릴 수 있어 **모델과 default manager 의 정의를 팀 단위에서 아주 명확하게** 해야 합니다.

<br>
### 커스텀 매니저 중복 코드 줄이기

아이스크림 가게에 초콜릿, 바닐라, 딸기 세 개 맛의 아이스크림이 있다고 가정해 봅시다.
그리고 장사가 너무 잘 돼서 경우에 따라 특정 맛을 판매중지(active=False)할 수 있다고 가정합니다.

```python
# apps/ice_creams/models.py

from django.db import models


class IceCreamQuerySet(models.QuerySet):
    def flavor_by(self, flavor: str = None):
        if flavor is None:
            flavor = 'VANILLA'
        return self.filter(flavor=flavor)
    
    def get_active_icecreams(self):
        return self.filter(active=True)


class IceCreamManager(models.Manager):
    def get_queryset(self):
        return IceCreamQuerySet(self.model, using=self._db)
    
    def flavor_by(self, flavor):
        return self.get_queryset().flavor_by(flavor=flavor)
    
    def get_active_icecreams(self):
        return self.get_queryset().get_active_icecreams()


class IceCream(models.Model):
    FLAVORS = (
        ('VANILLA', 'Vanilla'),
        ('CHOCOLATE', 'Chocolate'),
        ('STRAWBERRY', 'Strawberry'),
    )
    
    flavor = models.CharField(max_length=20, choices=FLAVORS, default='VANILLA')
    active = models.BooleanField(default=True)
    
    objects = models.Manager()
    icecreams = IceCreamManager()
    
    class Meta:
        default_manager_name = 'objects'
```

위 코드에서 **기본 매니저를 ```objects``` 로 명확하게 지정**했습니다.
이는 권장되는 규칙이며 커스텀 매니저 사용에 따른 혼선을 방지합니다.

다음으로 메서드 체이닝을 위해 **커스텀 쿼리셋**을 재정의했습니다.
아이스크림 맛별로 조회하는 ```flavor_by``` 와 판매 가능한 아이스크림 종류를 반환하는 ```get_active_icecreams``` 쿼리셋 메서드는
개별적으로도, 혹은 연속적으로도 사용 가능해야 하기 때문입니다.<br>
(만약 두 메서드가 커스텀 매니저의 메서드라면 체이닝 시 해당 쿼리셋 메서드가 없다는 ```AttributeError``` 에러가 발생합니다.)

하지만 위 예제에서는 각 쿼리셋 메서드를 커스텀 매니저에서 또 재정의하는 중복 문제가 발생합니다.

```python
# apps/ice_creams/models.py

from django.db import models


class IceCreamQuerySet(models.QuerySet):
    def flavor_by(self, flavor: str = None):
        if flavor is None:
            flavor = 'VANILLA'
        return self.filter(flavor=flavor)
    
    def get_active_icecreams(self):
        return self.filter(active=True)


class IceCream(models.Model):
    FLAVORS = (
        ('VANILLA', 'Vanilla'),
        ('CHOCOLATE', 'Chocolate'),
        ('STRAWBERRY', 'Strawberry'),
    )
    
    flavor = models.CharField(max_length=20, choices=FLAVORS, default='VANILLA')
    active = models.BooleanField(default=True)
    
    objects = models.Manager()
    icecreams = IceCreamQuerySet.as_manager()
    
    class Meta:
        default_manager_name = 'objects'
```

커스텀 매니저에서 특별히 사용되는 메서드가 없는 경우,
모델 내 ```icecreams = IceCreamQuerySet.as_manager()``` 부분과 같이 커스텀 쿼리셋 자체로부터 매니저 추출이 중복 코드 없이 가능합니다.

만약 커스텀 매니저 또한 필요하다면 ```from_queryset``` 메서드를 활용합니다.

```python
# apps/ice_creams/models.py

from django.db import models


class IceCreamQuerySet(models.QuerySet):
    def flavor_by(self, flavor: str = None):
        if flavor is None:
            flavor = 'VANILLA'
        return self.filter(flavor=flavor)
    
    def get_active_icecreams(self):
        return self.filter(active=True)


class IceCreamCustomManager(models.Manager):
    def manager_only_method(self):
        # do something
        return


class IceCream(models.Model):
    FLAVORS = (
        ('VANILLA', 'Vanilla'),
        ('CHOCOLATE', 'Chocolate'),
        ('STRAWBERRY', 'Strawberry'),
    )
    
    flavor = models.CharField(max_length=20, choices=FLAVORS, default='VANILLA')
    active = models.BooleanField(default=True)
    
    objects = models.Manager()
    icecreams = IceCreamCustomManager.from_queryset(IceCreamQuerySet)()
    
    class Meta:
        default_manager_name = 'objects'
```

<br>
### 거대 모델 이해하기

비즈니스 로직이 장고 모델 내에 구현되어 있는 것을 거대 모델이라고 합니다.
실제 프로덕트에서 이것은 모델의 소스코드 양을 급격하게 늘리며 타 모델이나 모듈에 대한 의존성이 연쇄적으로 발생할 위험이 있습니다.

따라서 모델 자체 데이터의 상태값을 변화시키지 않는 비즈니스 로직을 분리해 별도의 헬퍼 함수로 구현하는 방법이 권장됩니다.

관련 내용은 <a href="{{ site.github.url }}/frameworks/2022/06/08/django-models-and-databases#저자의-의견-돌아보기"
target="_blank">이 글</a>을 참조하시기 바랍니다.

<br><br>
# 7장. 쿼리와 데이터베이스 레이어

<br>
### 단일 객체에서 ```get_object_or_404()``` 이용하기

단일 객체를 가져와서 작업을 하는 세부 페이지 같은 뷰에서는 ```get()``` 대신 ```get_object_or_404()``` 메서드를 이용합니다.

```get_object_or_404()``` 메서드는 뷰(view) 단에서만 이용해야 합니다.

<br>
### ObjectDoesNotExist 와 DoesNotExist

**ObjectDoesNotExist** 는 어떤 모델 객체에도 이용할 수 있지만 **DoesNotExist** 는 특정 모델에서만 이용 가능합니다.

```python
from django.core.exceptions import ObjectDoesNotExist

from flavors.models import Flavor
from store.exceptions import OutOfStock


def list_flavor_line_item(sku):
    try:
        return Flavor.objects.get(sku=sku, quantity__gt=0)
    except Flavor.DoesNotExist:
        msg = "We are out of {0}".format(sku)
        raise OutOfStock(msg)


def list_any_line_item(model, sku):
    try:
        return model.objects.get(sku=sku, quantity__gt=0)
    except ObjectDoesNotExist:
        msg = "We are out of {0}".format(sku)
        raise OutOfStock(msg)
```

<br>
### 지연 로딩(lazy loading) 이용하기

장고 ORM 에서 제공되는 **쿼리셋(QuerySet)은 전달받은 모델의 객체 목록**으로 일종의 파이썬 클래스이기 때문에,
이것 자체로써 데이터베이스에 질의가 수행되지는 않습니다.

코드상에서 SQL 로 데이터베이스 질의가 이루어지는 시점은 쿼리셋이 생성될때가 아니라 실제 데이터가 활용되는 때이며,
이러한 특성을 **지연 로딩(lazy loading)** 혹은 **지연 연산(lazy evaluation)**이라고 합니다.

다시 말해 지연 연산은 데이터가 정말로 필요하기 전까지는 SQL 작업이 수행되지 않는 기능이라고 할 수 있습니다.

장고에서 이것을 사용함으로 얻을 수 있는 장점은, **(1) 길어진 쿼리셋 필터링(```filter()```)을 가독성 좋은 코드로 분할하는 경우**,
**(2) 거대한 객체를 지연 연산하는 경우**가 있습니다.

다음의 예제를 봅시다.

```python
# Bad case
from django.db.models import Q

from promos.models import Promo


def fun_function(**kwargs):
    """유효한 아이스크림 프로모션 찾기"""
    # 너무 길게 작성된 쿼리 체인은 좋지 않음
    return Promo.objects.active().filter(Q(name__startswith=name) |
                                         Q(description__icontains=name))
```

장고 쿼리셋 특성상 위와 같이 쿼리셋 체이닝이 가능하지만 이는 가독성이 좋지 않아 쿼리를 명확히 식별하기 어렵습니다.

```python
# Advanced
from django.db.models import Q

from promos.models import Promo


def fun_function(**kwargs):
    """유효한 아이스크림 프로모션 찾기"""
    # 필터 체이닝을 여러 줄로 분할하여 가독성을 높임
    results = Promo.objects.active()
    results = results.filter(
        Q(name__startswith=name) |
        Q(description__icontains=name)
    )
    results = results.exclude(status='melted')
    results = results.select_related('flavors')
    return results
```

쿼리 체인을 분할하여 라인 수는 늘어나지만 더 많은 필터링을 가독성 좋게 꾸밀 수 있고,
최종 결과물을 예측하기 쉬워 유지보수에 좋습니다.

다음으로 (2) 거대 객체를 지연 연산하는 예제를 살펴봅시다.

```python
from promos.models import Promo


def fun_function():
    # 쿼리셋 생성시에 SQL 실행되지 않음
    results = Promo.objects.active()
    
    # 실제 필요로 하는 시점에(iteration) 실행됨
    for item in results:
        print(f'[프로모션명] {item.name}')
```

<br>
### 고급 쿼리 도구

기본적으로 데이터를 프로그래밍 단에서 처리하는 것보다 데이버테이스 수준에서 처리하는 것이 성능과 속도 면에서 우월합니다.

따라서 쿼리셋 결과를 가지고 파이썬에서 별도 처리를 하기보단 **장고의 고급 쿼리 도구**를 이용하여
데이터베이스 수준에서 최대한 데이터를 가공되도록 해야 합니다.

또한 고급 쿼리 도구는 장고와 대부분의 데이터베이스 사이에서 지속적인 테스트를 실행해 주므로 테스트 정확도가 높아지는 결과를 얻습니다.

다음의 나쁜 예제를 봅시다.

```python
# 방문한 모든 고객 중
# 한 번 방문할 때마다 평균 한 주걱 이상의 아이스크림을 주문한 모든 고객 목록
# scoops_ordered(주문횟수), store_visits(방문횟수)

from models.customers import Customer


customers = []
for customer in Customer.objects.iterate():
    if customer.scoops_ordered > customer.store_visits:
        customers.append(customer)
```

- **나쁜 이유 1**: 모든 고객 레코드에 대해 일일히 파이썬 루프가 돌고 있음. 과도한 메모리 점유와 처리속도 저하의 문제
- **나쁜 이유 2**: 코드 자체가 경합 상황(race condition)에 직면해 있음. 위와 같이 ```READ``` 상황에서 다른 부분의 코드에 의해
```UPDATE``` 상황이 동시 발생하면 파이썬 수준에서 데이터 분실 및 손실을 인식하거나 대처할 방법이 없음

**쿼리 표현식**을 통해 위 문제점을 다음과 같이 개선해 봅시다.

```python
from django.db.models import F
from models.customers import Customer


customers = Customer.objects.filter(scoops_ordered__gt=F('store_visits'))
```

위 한줄 코드는 동일한 내용을 데이터베이스 수준에서 처리 후 반환하도록 하고 있습니다.
실제 작동하는 쿼리는 다음과 같습니다.

```sql
SELECT * FROM CUSTOMERS_CUSTOMER WHERE SCOOPS_ORDERED > STORE_VISITS; 
```

- 참조: <a href="https://docs.djangoproject.com/en/4.0/ref/models/expressions/" target="_blank">장고 공식: 쿼리 표현식</a>

위와 같은 맥락에서, 장고 1.8 부터 지원하는
**<a href="https://docs.djangoproject.com/en/4.0/ref/models/database-functions/" target="_blank">데이터베이스 함수</a>**도
사용 가능합니다.

<br>
### 필수불가결한 상황이 아니라면 로우 SQL 은 지양합니다.

장고 ORM 은 매우 높은 생산성뿐만 아니라 업데이트시 유효성 검사와 보안을 제공하기 때문에 가능하면 반드시 ORM 을 사용하도록 합시다.

또한 로우 SQL 은 장고 앱의 이식성을 떨어뜨리고 데이터베이스 마이그레이션 시 문제가 될 수 있습니다.

다만 생산성이 월등히 나아지거나 너무나도 복잡한 특수 쿼리 등 로우 SQL 의 필요성이 명확한 경우에는 사용을 고려해볼 수 있습니다.

<br>
### 트랜잭션

장고 ORM 은 기본적으로 데이터베이스 객체에 대한
```WRITE```, ```UPDATE```, ```DELETE``` 수행시 **오토커밋(autocommit mode)**됩니다.
그러나 여러 쿼리가 하나의 단위로 수행되길 원하는 경우 **데이터베이스 트랜잭션**을 활용하여 로직 상에서 ACID 특성을 유지할 수 있습니다.

> 오토커밋되므로, 독립적인 ORM 메서드 [.create(), .update(), .delete()] 사용시 트랜잭션 처리하지 않는 것이 좋습니다.

장고에서 **트랜잭션 가이드라인**은 다음과 같습니다.

- **데이터베이스에 변경이 생기지 않는 데이터베이스 작업은 트랜잭션으로 처리하지 않음**
- **데이터베이스에 변경이 생기는 데이터베이스 작업은 반드시 트랜잭션으로 처리**
- **데이터베이스 읽기 작업을 수반하는 데이터베이스 변경 작업 또는 데이터베이스 성능에 관련된 특별한 경우에는
앞의 두 가이드라인을 모두 고려**

다음으로 트랜잭션 사용시 곡 기억하고 있어야 할 세부사항을 설명하겠습니다.

**(1) 각각의 HTTP 요청을 트랜잭션으로 처리하라**

**```ATOMIC_REQUESTS```** 설정으로 장고는 모든 web requests 를 트랜잭션으로 쉽게 처리 가능합니다.

```python
# settings/base.py

DATABASES = {
    'default': {
        # ...
        'ATOMIC_REQUESTS': True,
    },
}
```

이 설정은 뷰<small>(MVC 모델과 비교시, view 는 컨트롤러, template 은 뷰와 같음)</small>에서 호출되는 모든 쿼리가 보호되어 안정적이지만,
트랜잭션은 기본적으로 대상 객체에 대한 잠금(locking)을 동반하므로 처리성능 저하의 가능성이 존재합니다.

따라서 데이터 쓰기가 많은 프로젝트에서는 효과적이지만, 트래픽이 증가할수록 비효율적일 수 있습니다.

**(2) 고객에게 이메일을 보냈는데 트랜잭션이 롤백되는 경우?**

특정 뷰에서 이메일, SMS, 팝업 등 데이터베이스 객체와는 무관한 쓰기작업이 동반될 경우
트랜잭션이 롤백되면 이미 고객에게 전송된 메시지를 되돌릴 방법이 없습니다.

이는 빈번한 롤백의 가능성이 있는 금융이나 의료 정보 앱에서 더욱 중요한 이슈인데,
이때는 트랜잭션 무결성(transactional integrity)보다는 이벤트 일관성(eventual consistency)에 초점이 더 맞춰지게 됩니다.

이러한 특정 뷰를 위해 **```transaction.non_atomic_requests```** 로 데코레이팅하는 방안을 고려할 수 있습니다.

```python
# flavors/views.py
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Flavor


@transaction.non_atomic_requests
def posting_flavor_status(request, pk, status):
    flavor = get_object_or_404(Flavor, pk=pk)  # 단일 객체 쿼리셋 가져오기

    # 여기서는 오토커밋 모드 실행
    flavor.latest_status_change_attempt = timezone.now()  # 최신상태 변경 시도
    flavor.save()
    
    with transaction.atomic():
        # 트랜잭션 안에서 실행
        # 함수 뷰 자체는 예외적으로 트랜잭션이 아니고, 이곳 with 블록만 트랜잭션 처리됨!!
        flavor.status = status
        flavor.latest_status_change_success = timezone.now()  # 최신상태 변경 성공
        flavor.save()
        return HttpResponse('Hooray!')
    
    return HttpResponse('Sadness', status=400)
```

위 예시와 같이 데코레이터를 활용해 ```posting_flavor_status``` 함수 뷰 자체를 트랜잭션 처리하지 않으면서 꼭 필요한 핵심 부분만
```transaction.atomic()``` 컨텍스트로 감싸서 트랜잭션 처리할 수 있습니다.

이로 인해 에러 발생 시 트랜잭션 처리된 부분만 롤백됩니다.

**(3) 명시적인 트랜잭션 선언**

**```ATOMIC_REQUESTS```** 설정으로 모든 request 에 대해 뭉뚱그려 트랜잭션 처리할 수도 있지만,
사이트 성능 개선(꼭 필요한 부분에서만 트랜잭션 사용. 트랜잭션은 상대적으로 처리 속도가 느림)을 위해
명시적인 트랜잭션을 선언할 수 있습니다. 이 경우 개발에 더 많은 시간이 소요되겠지만 그만큼 성능 최적화된 결과물을 얻을 수 있습니다.

앞선 예시에서처럼 **```transaction.atomic```** 메서드를 사용하는 것이 명시적인 트랜잭션 선언의 방법입니다.

- ```ATOMIC_REQUESTS=False``` 인 경우, 필요한 부분에 ```transaction.atomic``` 컨텍스트 사용.
혹은 atomic 메서드를 특정 뷰의 데코레이터로 활용
- ```ATOMIC_REQUESTS=True``` 인 경우, 원하는 뷰에 ```@transaction.non_atomic_requests``` 데코레이터를 감싸고
부분적으로 ```transaction.atomic``` 처리

관련 내용으로
**<a href="https://docs.djangoproject.com/en/4.0/topics/db/transactions/#controlling-transactions-explicitly"
target="_blank">장고 공식 문서</a>**를 참조하십시오.

<br>
# 8장. 함수 기반 뷰와 클래스 기반 뷰

<br>

> 본 장에서는 **9장. 함수 기반 뷰**와 **10장 클래스 기반 뷰** 설명을 포함합니다.

**함수 기반 뷰(FBV)**와 **클래스 기반 뷰(CBV)**는 서로 장단점이 있으므로 상황에 따라 적절히 사용하도록 합시다.

- **FBV**: 뷰의 로직을 단일함수로 명확하고 빠르게 작성
    ```python
    """FBV 의 기본 형태"""
    from django.http import HttpResponse
    
    
    def simplest_view(request):
        # business logic
        return HttpResponse('FBV')
    ```
- **CBV**: 객체지향에서 클래스의 장점은 상속 및 오버라이딩, 응집도는 높이고 결합도는 낮추는 데 있음.
불필요한 클래스 사용은 코드가 장황해질 수 있음
    ```python
    """CBV 의 기본 형태"""
    from django.http import HttpResponse
    from django.views.generic import View
    
    
    class SimplestView(View):
        def get(self, request, *args, **kwargs):
            # business logic
            return HttpResponse('CBV')
    ```

충분히 고려했다면 어떤 방법이든 문제될게 없습니다.
다만 장고에서 기억할 주요 특징은
**단순명료할 것**, **느슨한 결합(loose coupling)**, **DRY(Don't Repeat Yourself)** 등이라는 사실을 기억해야 합니다.

<br>
### URLConf 로부터 뷰 로직을 분리하기, 느슨한 결합 유지하기

장고 **뷰(app/views.py)는 URLConf(app/urls.py)와 밀접한 관련**이 있습니다.
request 가 라우팅되어 로직처리 후 response 가 반환되는 일련의 과정을 거치기 때문입니다.

- **뷰 모듈은 뷰 로직을 포함해야 함**
- **URL 모듈은 URL 로직을 포함해야 함**

위 단순한 규칙에 따르자면 URLConf 내에 뷰, 모델의 정의가 단단하게 결합되는 식의 코드는 좋지 않습니다.

뷰와 URL 은 항상 **느슨하게 결합**되어 같은 뷰가 HTTP method 에 따라 여러 URL 에서 재사용될 가능성을 열어둬야 합니다.

```python
# tastings/urls.py
from django.conf.urls import url

from .views import TasteListView, TasteDetailView, TasteResultsView, TasteUpdateView


urlpatterns = [
    url(
        regex=r'^$',
        view=TasteListView.as_view(),
        name='list',
    ),
    url(
        regex=r'^(?P<pk>\d+)/$',
        view=TasteDetailView.as_view(),
        name='detail',
    ),
    url(
        regex=r'^(?P<pk>\d+)/results/$',
        view=TasteResultsView.as_view(),
        name='results',
    ),
    url(
        regex=r'^(?P<pk>\d+)/update/$',
        view=TasteUpdateView.as_view(),
        name='update',
    )
]
```

위 예시를 보면,

- **(1) 뷰 로직이 URL 로부터 완전 분리되어 재사용 가능한 상태**이고,
- **(2) URLConf 는 라우팅 목적을 위해서만 쓰여졌**으며,
- **(3) 클래스 기반 뷰이기 때문에 확장성(상속)과 유연성(커스텀 로직)이 자유롭게**

되었습니다.

<br>
### 함수 기반 뷰 (9장 내용)

함수 기반 뷰는 작을수록 좋으며 단순한 프레젠테이션 로직을 처리하도록 작성합니다.
주로 403, 404, 500 등을 처리하는 커스텀 코드로 이용하도록 합시다.

또한 장고 앱 글로벌 액션에 연동되어 있는 유틸리티 함수 중 **```django.http.HttpRequest```** 의 특성을 활용하여
각종 필요한 속성을 추가하거나,

사용자 요청시 권한을 위해 공통적으로 동작하는 **```check_sprinkle 데코레이터 활용 예제```**를
**_```교재 102쪽 HttpRequest 객체 전달하기```_** 파트부터 참조하도록 합시다.

유틸리티 공통 함수를 활용하여 중복 코드를 없애고 획기적인 생산적 이점을 얻을 수 있습니다.

> **모든 함수는 HttpRequest 객체를 받고 HttpResponse 객체를 반환하는 기본 원리**를 가집니다.
> 참고로 **클래스 기반 뷰는 URLConf 에서 ```as_view()``` 로 임포트시 이러한 함수로 변환됨**을 알아둡시다.

<br>
### 클래스 기반 뷰 (10장 내용)

장고의 모든 클래스 기반 뷰는 **```django.views.generic.View```** 클래스로부터 상속되며
**URLConf 에 임포트시 ```as_view()``` 를 통해 함수로 변환**되어 사용됩니다.

- **뷰 코드의 양은 적을수록 좋음**
- **동일 코드 반복금지**
- **뷰는 간단명료해야 함**
- **뷰는 프레젠테이션 로직에서 관리하도록 함** (비즈니스 로직은 모델이나 모델 매니저, 헬퍼 모듈에 구현. 특수한 경우 폼 활용)
- **403, 404, 500 에러 핸들링에 클래스 기반 뷰를 사용하지 않도록 함** (대신 함수 기반 뷰 활용)
- **믹스인은 간단명료해야 함**

제네릭 뷰를 상속한 클래스 기반 뷰의 종류는 다음과 같습니다.

- **RedirectView, TemplateView, ListView, DetailView, FormView, CreateView, UpdateView, DeleteView, generic date view**

**(1) 클래스 기반 뷰와 믹스인**

객체지향 디자인에서 다중상속은 복잡성을 이유로 지양되는 추세입니다.

하지만 특정 상황에서 다중상속이 꼭 필요할 수 있는데, 이런 경우 파이썬 장고에서는 믹스인(Mixin)을 활용합니다.
이는 자바(Java)에서 인터페이스(Interface)를 활용하는 것과 유사합니다.

믹스인은 **실체화(instantiation)되지 않으면서 특정 상속이 필요한 기능을 기술하고 있는 클래스**입니다.

- (다중상속 시) 장고가 제공하는 기본 뷰는 '항상' 오른쪽으로 진행
- 믹스인은 기본 뷰에서 왼쪽으로 진행
- 믹스인은 파이썬 기본 객체 타입(object)을 상속해야만 함

```python
# Mixin inheritance example - Add attribute to context
from django.views.generic import TemplateView


class FreshFruitMixin(object):
    def get_context_data(self, **kwargs):
        context = super(FreshFruitMixin, self).get_context_data(**kwargs)
        context['has_fresh_fruit'] = True
        return context


class FruityFlavorView(FreshFruitMixin, TemplateView):
    template_name = 'fruity_flavor.html'
```

**(2) 클래스 기반 뷰에 대한 일반적인 팁**

먼저 **인증된 사용자에게만 뷰를 제공** 하는 경우를 생각해 봅시다.

로그인 여부확인을 위해
앞서 살펴본 함수 데코레이터와 ```django.http.HttpRequest``` 공통함수를 활용하여 클로벌 액션으로 공통화 처리할 수도 있겠지만,

클래스 기반 뷰의 믹스인을 활용하면 코드가 훨씬 간결해집니다.
다음의 예시를 봅시다.

```python
# flavors/views.py
from django.views.generic import DetailView

from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Flavor


class FlavorDetailView(LoginRequiredMixin, DetailView):
    model = Flavor
```

```django.contrib.auth.mixins.LoginRequiredMixin``` 과 같이 범용적인 믹스인 클래스를 활용하면
지나치게 정형화된 미들웨어나 데코레이터 함수를 사용하지 않아도 됩니다. 별도 함수를 복잡하게 구현할 필요도 없습니다.

다음 팁은 **커스텀 액션을 구현하는 경우**입니다.

대표적으로 폼의 유효성 검사가 있는데, 이것은 제네릭 뷰에 존재하는 **```form_valid()```**, **```form_invalid()```** 메서드를
오버라이딩하는 방식으로 구현합니다.

```python
# flavors/views.py
from django.views.generic import CreateView

from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Flavor


class FlavorCreateView(LoginRequiredMixin, CreateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')
    
    def form_valid(self, form):
        # Custom logic is here
        # This method returns django.http.HttpResponseRedirect
        return super(FlavorCreateView, self).form_valid(form)
    
    def form_invalid(self, form):
        # Custom logic is here
        # This method returns django.http.HttpResponse
        return super(FlavorCreateView, self).form_invalid(form)
```

**(3) 검색 폼 예제 (뷰 + 폼)**

다음은 제네릭 뷰 클래스 파생인 **```ListView```** 를 활용해 아이스크림 종류 검색 폼을 생성하는 예제입니다.

검색만을 위한 폼이므로 **GET** 메서드만 사용되며, 최소한의 코드로 **뷰 자체적으로 쿼리셋을 필터**하도록 합니다.

```python
from django.views.generic import ListView

from .models import Flavor


class FlavorListView(ListView):
    model = Flavor
    
    def get_queryset(self):
        qs = super(FlavorListView, self).get_queryset()
        
        # GET 메서드로 q 파라미터 받기
        q = self.request.GET.get('q')
        if q:
            return qs.filter(title__icontains=q)
        return qs
```

이로써 검색 폼 HTML 에서 HTTP request GET 메서드로 **```FlavorListView```** 대상으로
검색어 q 파라미터를 넘기면, 필터된 아이스크림 리스트가 반환되는 핵심 코드를 구현하였습니다.

검색 폼을 위한 HTML 예시는 다음과 같습니다.

```html
{# templates/flavors/search.html #}
{ % comment %}
    Usage: { % include "flavors/search.html" %}
{ % endcomment %}
<form action="{ % url 'flavors:list' %}" method="GET">
    <input type="text" name="q" />
    <button type="submit">search</button>
</form>
```

**(4) django.views.generic.View 이용하기**

위에서는 제네릭 뷰의 파생 뷰 클래스들을 사용했으나(ListView, DetailView, ...),
**```django.views.generic.View```** 만을 이용하여 장고 프로젝트 전부를 구성할 수도 있습니다.

상위 클래스를 이용한다는 것은 공수가 상대적으로 많이 드는 만큼 꼭 필요한 부분만 최적화해 커스터마이징 가능하다는 장점이 있습니다.

제네릭 뷰는 기본적으로 HTTP request/response 객체, 뷰 함수를 반환하는 ```as_view()``` 메서드 등을 포함합니다.
하지만 서비스에 필요한 **HTTP 메서드(GET, POST, PUT, DELETE 등)의 구현은 파생 뷰에 포함**되어 있으므로
필요한 메서드라면 추가 구현해줘야 합니다.

제네릭 뷰의 활용은 **특히 GET 메서드와 함께 JSON, PDF 또는 다른 비HTML 콘텐츠를 서비스하는 경우** 빛을 발하게 됩니다.

```python
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

from django.views.generic import View

from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Flavor
from .reports import make_flavor_pdf


class PDFFlavorView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        flavor = get_object_or_404(Flavor, slug=kwargs['slug'])
        response = HttpResponse(content_type='application/pdf')
        response = make_flavor_pdf(response, flavor)
        return response
```

<br>
# 11장. 장고 폼

<br>

> 본 장에서는 **12장. 폼 패턴들** 설명을 포함합니다.

장고에서 입력되는 **데이터의 유효성 검사**는 기본적으로
**모델폼(```django.forms.ModelForm```)에서 수행**한다는 점을 기억하시기 바랍니다.

> 장고 **모델(Model) 클래스**가 데이터베이스 객체를 매핑한다면,
> **폼(Form) 클래스**는 HTML form 의 <input\> 요소들을 매핑합니다.
> **모델폼(ModelForm) 클래스**는 모델 클래스의 필드를 HTML form <input\> 요소에 바로 매핑합니다.
> (<a href="https://docs.djangoproject.com/en/4.0/topics/forms/#the-django-form-class" target="_blank">장고 공식</a>)

다음의 예제는 csv 형식의 주문이 들어왔을 때 모델폼을 활용하여 판매자가 실제 존재하는지 검사하는 예시입니다.

```python
import csv
import StringIO

from django import forms

from .models import Purchase, Seller


class PurchaseForm(forms.ModelForm):
    class Meta:
        model = Purchase
    
    def clean_seller(self):
        """Check if inserted seller exists"""
        seller = self.cleaned_data['seller']
        try:
            Seller.objects.get(name=seller)
        except Seller.DoesNotExist:
            msg = f'{seller} does not exist in purchase #{self.cleaned_data["purchase_number"]}'
            raise forms.ValidationError(msg)
        return seller


def add_csv_purchases(rows):
    rows = StringIO.StringIO(rows)
    records_added = 0
    errors = []
    for row in csv.DictReader(rows, delimiter=','):
        form = PurchaseForm(row)
        if form.is_valid():  # validation point
            form.save()
            records_added += 1
        else:
            errors.append(form.errors)
    return records_added, errors
```

위와 같이 장고 모델폼에서 **```clean_<field>()```** 형식의 유효성 검사 메서드를 작성할 수 있습니다.
그러면 **```form.is_valid()```** 호출시 검사가 수행됩니다.

**(1) 모델폼 인스턴스에 원하는 속성 추가하기**

모델폼 인스턴스는 모델을 기반으로 생성되지만, 때때로 추가적인 속성값이 필요하기도 합니다.

```django.contrib.auth.mixins.LoginRequiredMixin``` 믹스인이 적용된 클래스 기반 뷰에서,
유효성 검사 시 리퀘스트를 보낸 사용자 정보가 필요할 때가 그런 경우입니다.

다음은 모델폼 인스턴스 생성 시 특정값(사용자 정보)을 속성값으로 추가하는 코드입니다.

```python
# apps/tasters/forms.py
from django import forms

from .models import Taster


class TasterForm(forms.ModelForm):
    class Meta:
        model = Taster
    
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')  # Add new value to ModelForm class
        super(TasterForm, self).__init__(*args, **kwargs)
```

사용자 정보 값인 'user' 는 ```django.http.HttpRequest``` 글로벌 객체로부터 얻어옵니다.

```python
# apps/tasters/views.py
from django.views.generic import UpdateView

from django.contrib.auth.mixins import LoginRequiredMixin

from .forms import TasterForm
from .models import Taster


class TasterUpdateView(LoginRequiredMixin, UpdateView):
    model = Taster
    form_class = TasterForm
    success_url = '/someplace/'
    
    def get_form_kwargs(self):
        """폼에 추가할 키워드 인자들을 반환하는 메서드"""
        kwargs = super(TasterUpdateView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs
```

**(2) 폼이 유효성을 검사하는 방법 알아두기**

앞서 ```form.is_valid()``` 를 통해 유효성 검사가 수행됨을 확인했습니다.
이 때, 이면에서 진행되는 작업들을 살펴봅시다.

1. 폼이 데이터를 받으면 ```form.is_valid()``` 는 ```form.full_clean()``` 메서드를 호출
2. ```form.full_clean()``` 은 폼의 각 필드를 하나씩 검사
    - 입력된 데이터를 파이썬 형식으로 변환 가능한지 검사(```to_python()```), 문제시 ```ValidationError``` 발생
    - 필드별 특별한 유효성(커스텀 validator) 검사, 문제시 ```ValidationError``` 발생
    - 폼에 ```clean_<field>()``` 메서드가 있으면 실행
3. ```form.full_clean()``` 이 ```form.clean()``` 메서드 실행
4. ModelForm 인스턴스의 경우 ```form.post_clean()``` 이 다음 작업을 함
    - ```form.is_valid()``` 가 True 나 False 로 설정된 것과 관계없이 모델폼의 데이터를 모델 인스턴스로 설정
    - 모델의 ```clean()``` 메서드 호출. (참고. ORM 을 통한 모델 인스턴스 저장시에는 ```clean()``` 호출되지 않음)

**(3) 모델폼(ModelForm)에 입력된 데이터가 최종 저장되기까지의 과정**

사용자에 의해 모델폼으로 입력된 데이터는 최종 데이터베이스까지 다소 번거로워 보이는 방식으로 저장됩니다.

그것은 **a. 폼 데이터가 모델폼 인스턴스에 저장**된 이후 **b. 폼 데이터가 모델 인스턴스에 저장**된다는 사실인데,
이러한 **지연 저장** 방식은 뷰 로직에서 여러 이점을 가질 수 있습니다.

먼저 과정을 살펴봅시다.

- a. 모델폼 인스턴스 생성: **```form = TasterForm(request.POST)```** 시 생성 (사용자 제출 데이터)
    - 유효성 검사: **```form.is_valid()```** (```form.full_clean()``` 메서드 호출됨)
- b. 모델 인스턴스 생성: **```taster = form.save(commit=False)```**
    - ```form``` 의 ```save()``` 메서드 사용시 모델 인스턴스가 생성됨
    - 파라미터로 **```commit=False``` 라면 DB 로 저장되지는 않음**(지연저장 포인트!), ```True``` 면 저장까지 됨!

다음 구현 예제를 살펴봅시다.

```python
from django.shortcuts import redirect, reverse
from django.views.generic import FormView

from django.contrib.auth.mixins import LoginRequiredMixin

from .forms import TasterForm
from .models import Taster


class CreateTasterView(LoginRequiredMixin, FormView):
    form_class = TasterForm
    template_name = 'tasters/create.html'

    def post(self, request, *args, **kwargs):
        # a. 모델폼 인스턴스 생성 이후 유효성 검사
        form = TasterForm(request.POST)
        if form.is_valid():
            # b. 모델 인스턴스 생성, commit 값이 False 인 경우 DB 까지 저장되지 않고 모델 객체 반환
            taster = form.save(commit=False)
            taster.ip = request.META['REMOTE_ADDR']  # 접속 IP 세팅
            taster.save()  # Model Save!
            taster.save_m2m()
            return redirect(reverse('tasters:detail', kwargs={'pk': taster.pk}))
```

먼저 사용자 제출 데이터를 기반으로 ```form``` 모델폼 인스턴스가 생성됩니다.

```form.is_valid()``` 검증에 통과하면 ```form.save()``` 에서 기본적으로 ```taster``` 모델 인스턴스가 생성되나,
위 코드에서는 ```commit=False``` 이기 때문에 DB save 되지는 않습니다.

이 시점이 지연 저장 부분인데, ```taster``` 모델 인스턴스에 request 사용자 IP 정보를 추가 저장한 후
```taster.save()``` DB save 하게 됩니다.

이처럼 **a. 데이터를 모델폼 인스턴스에 저장**하는 것과 **b. 데이터를 모델 인스턴스에 저장**하는 시점차이를 이용해
사용자 IP 를 추가하는 등 이점을 얻을 수 있습니다.

<br>

다음은 폼 데이터 저장시 유효성 검사에 실패하면 그 기록을 저장하는 기능을 추가한 모델입니다. 참조해 보세요.

```python
# core/models.py
from django.db import models


class ModelFormFailureHistory(models.Model):
    """모델폼 실패기록 저장 모델"""
    form_data = models.TextField()
    model_data = models.TextField()
```

```python
# flavors/views.py
import json

from django.contrib import messages
from django.core import serializers
from core.models import ModelFormFailureHistory


class FlavorActionMixin(object):
    @property
    def success_msg(self):
        return NotImplemented

    def form_valid(self, form):
        messages.info(self.request, self.success_msg)
        return super(FlavorActionMixin, self).form_valid(form)

    def form_invalid(self, form):
        """유효성 검사 실패시 호출됨, 실패 기록 저장하는 로직 구현"""
        form_data = json.dumps(form.cleaned_data)
        model_data = serializers.serialize('json', [form.instance])[1:-1]
        ModelFormFailureHistory.objects.create(
            form_data=form_data,
            model_data=model_data,
        )
        return super(FlavorActionMixin, self).form_invalid(form)
```

Flavor 관련 모델에서 위 ```FlavorActionMixin``` 믹스인 클래스를 상속하면 모델폼 실패기록이 별도로 저장됩니다.
```form_invalid``` 메서드는 유효성 검사에 실패한 후에 호출됩니다.

<br>
### 폼 패턴들 (12장 내용)

다음으로 다섯가지 폼 패턴과 함께 장고에서 최고의 기능이라 불리는 **폼, 모델, 클래스 기반 뷰**를 잘 이용하는 방법을 살펴봅니다.

**(1) 패턴 1: 간단한 모델폼과 기본 유효성 검사기**

클래스 기반 뷰 사용시 자동으로 생성되는 **ModelForm** 을 활용하는 방법입니다.
이 모델폼은 설정된 모델의 기본 필드 유효성 검사기를 이용하게 됩니다.

```python
# flavors/views.py
from django.views.generic import CreateView, UpdateView

from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Flavor


class FlavorCreateView(LoginRequiredMixin, CreateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')


class FlavorUpdateView(LoginRequiredMixin, UpdateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')
```

**(2) 패턴 2: 모델폼에서 커스텀 폼 필드 유효성 검사기 이용하기**

프로젝트를 진행할 때, 기본 유효성 검사기만으론 부족해 커스텀 필드 유효성 검사기를 제작하는 경우가 발생합니다.
이 때, 커스텀 유효성 검사기 모듈을 core 앱에 제작하여 추상화 모델에 적용하는 방법을 살펴봅니다.

```python
# core/validators.py
from django.core.exceptions import ValidationError


def validate_tasty(value):
    if not value.startswith(u'Tasty'):
        msg = u'Must start with "Tasty"'
        raise ValidationError(msg)
```

**validate_tasty** 함수는 검사하는 값이 'Tasty' 로 시작하는지 검사합니다.
이 유효성 검사기를 디저트 모델 전반에 적용하기 위해 추상화 모델을 제작합니다.

```python
# core/models.py
from django.db import models

from .validators import validate_tasty


class TastyTitleAbstractModel(models.Model):
    title = models.CharField(max_length=255, validators=[validate_tasty])
    
    class Meta:
        abstract = True
```

이제 ```TastyTitleAbstractModel``` 추상화 모델을 상속하는 모든 모델의 **title** 필드는
전달된 값이 'Tasty' 로 시작되는지 확인하는 유효성 검사를 거치게 됩니다.

```python
# flavors/models.py
from django.urls import reverse
from django.db import models

from core.models import TastyTitleAbstractModel


class Flavor(TastyTitleAbstractModel):
    slug = models.SlugField()
    scoops_remaining = models.IntegerField(default=0)

    def get_absolute_url(self):
        return reverse('flavors:detail', kwargs={'slug': self.slug})
```

```Flavor``` 모델뿐 아니라 '맛있는' 이란 표현이 어울리는 다른 여러 종류의 디저트 모델에도 동일한 적용이 가능합니다.
결과적으로 이 모델들의 제목('title') 필드에 'Tasty' 가 포함되어 있지 않으면 ```ValidationError``` 가 발생합니다.

만약 모델(Model)이 아닌 폼(Form)에서만 커스텀 유효성 검사기를 적용하거나,
다른 필드에도 커스텀 유효성 검사기를 적용하고자 할 때는 어떻게 해야할까요?

이 때는 **커스텀 모델폼**을 작성하도록 합니다.

```python
# flavors/forms.py
from django import forms

from core.validators import validate_tasty
from .models import Flavor


class FlavorForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(FlavorForm, self).__init__(*args, **kwargs)
        self.fields['title'].validators.append(validate_tasty)
        self.fields['slug'].validators.append(validate_tasty)
    
    class Meta:
        model = Flavor
```

이제 커스텀 유효성 검사기가 적용된 커스텀 모델폼(**FlavorForm**)을 뷰에 적용합니다.

**패턴 1**에서처럼 클래스 기반 뷰는 적용된 모델(Model)의 속성(attribute)을 기반으로 모델폼을 자동 생성합니다.
이 모델폼을 커스텀 모델폼으로 오버라이딩하는 과정입니다.

```python
# flavors/views.py
from django.contrib import messages
from django.views.generic import CreateView

from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Flavor
from .forms import FlavorForm  # 커스텀 모델폼


class FlavorActionMixin(object):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')
    
    @property
    def success_msg(self):
        return NotImplemented
    
    def form_valid(self, form):
        messages.info(self.request, self.success_msg)
        return super(FlavorActionMixin, self).form_valid(form)


class FlavorCreateView(LoginRequiredMixin, FlavorActionMixin, CreateView):
    success_msg = 'created.'
    form_class = FlavorForm  # 클래스 기반 뷰의 모델폼을 커스텀 모델폼으로 명시적 적용
```

**(3) 패턴 3: 유효성 검사의 클린 상태 오버라이딩하기**

장고에서 기본 또는 커스텀 필드 유효성 검사기가 실행된 다음에는 **```clean()```** 혹은
**```clean_<field name>()```** 메서드로 유효성 검사가 실행됩니다.

이 단계에서는 다중 필드에 대한 유효성 검사가 이루어지며 필드의 중복 혹은 존재유무같은 데이터베이스 연관 검사도 가능합니다.

폼을 통해 아이스크림 주문이 들어온 경우 해당 맛의 재고를 체크하는 clean 유효성 검사 로직은 다음과 같습니다.

```python
# flavors/forms.py
from django import forms
from flavors.models import Flavor


class IceCreamOrderForm(forms.Form):
    slug = forms.ChoiceField('Flavor')
    toppings = forms.CharField()
    
    def __init__(self, *args, **kwargs):
        super(IceCreamOrderForm, self).__init__(*args, **kwargs)

        # slug 필드의 선택 가능 옵션들(choices)은 여기서 지정함
        self.fields['slug'].choices = [
            (x.slug, x.title) for x in Flavor.objects.all()
        ]
    
    # clean_<field> 형태의 커스텀 유효성 검사 메서드
    def clean_slug(self):
        slug = self.cleaned_data['slug']
        if Flavor.objects.get(slug=slug).scoops_remaining <= 0:
            msg = u'Sorry, we are out of that flavor.'
            raise forms.ValidationError(msg)
        return slug
```

이제 **IceCreamOrderForm** 기반으로 생성된 HTML 폼에서 사용자가 맛을 선택할 경우,
**```clean_slug()```** 유효성 검사를 통해 해당 맛이 존재하지 않으면
**'Sorry, we are out of that flavor.'** 메시지를 입력 필드에 보여주게 됩니다.

혹은 **```clean()```** 검사기 자체를 오버라이딩할 수 있습니다.

```python
...

    def clean():
        cleaned_data = super(IceCreamOrderForm, self).clean()
        
        # additional validation
        slug = cleaned_data.get('slug', '')
        toppings = cleaned_data.get('toppings', '')
        if u'chocolate' in slug.lower() or u'chocolate' in toppings.lower():
            msg = u'Your order has too much chocolate'
            raise forms.ValidationError(msg)
        return cleaned_data
```

이제 **'chocolate'** 이 포함된 주문이 들어온 경우, **'Your order has too much chocolate'** 메시지가 나타나게 됩니다.

이러한 **```clean()```** 메서드 오버라이딩 방식을 응용하여 회원가입 폼에서 이메일이나 패스워드 유효성 체크 등을 진행할 수 있습니다.

**(4) 패턴 4: 폼 필드 해킹하기(두 개의 CBV, 두 개의 폼, 한 개의 모델)**

고급 주제로 넘어가서, 하나의 모델에 두 개의 뷰와(CBV) 폼이 엮여 있는 경우가 있습니다.
보통은 특정 모델에 대한 create/update 뷰와 폼이 그것입니다.

```python
# stores/models.py
from django.urls import reverse
from django.db import models


class IceCreamStore(models.Model):
    title = models.CharField(max_length=100)
    block_address = models.TextField()
    phone = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)
    
    def get_absolute_url(self):
        return reverse('stores:detail', kwargs={ 'pk': self.pk })
```

**IceCreamStore** 모델에서 **title**, **block_address** 필드는 필수지만 **phone**, **description** 필드는 필수가 아닙니다.
따라서 데이터 생성시 사용자가 제목과 주소를 입력하고 나머지 필드는 나중에 업데이트하도록 구성할 수 있습니다.

다음은 위 모델에 대한 모델폼 에제입니다.

```python
# stores/form.py
from django import forms

from .models import IceCreamStore


class IceCreamStoreCreateForm(forms.ModelForm):
    
    class Meta:
        model = IceCreamStore

        # Set mandatory fields in ModelForm
        fields = ( 'title', 'block_address', )


class IceCreamStoreUpdateForm(IceCreamStoreCreateForm):
        
    def __init__(self, *args, **kwargs):
        # 지정한 모델 기반으로 부모 클래스인 생성폼에서 우선 초기화
        super(IceCreamStoreUpdateForm, self).__init__(*args, **kwargs)

        # 이후 모델폼 내 유사 딕셔너리 객체인 fields 속성을 통해 모델에서 원하는 필드값의 속성 변경
        self.fields['phone'].required = True
        self.fields['description'].required = True
    
    class Meta(IceCreamStoreCreateForm.Meta):
        # Set all fields in ModelForm
        fields = ( 'title', 'block_address', 'phone', 'description', )
```

위 방식은 모델폼에서 모델의 필드를 굳이 다시 정의하지 않고, 클래스나 유사 딕셔너리 객체인 **fields** 를 활용합니다.

마지막으로 두 개의 Class Based Views 를 정의합니다.

```python
# stores/views.py
from django.views.generic import CreateView, UpdateView

from .forms import IceCreamStoreCreateForm, IceCreamStoreUpdateForm
from .models import IceCreamStore


class IceCreamCreateView(CreateView):
    model = IceCreamStore
    form_class = IceCreamStoreCreateForm


class IceCreamUpdateView(UpdateView):
    model = IceCreamStore
    form_class = IceCreamStoreUpdateForm
```

**(5) 패턴 5: 재사용 가능한 검색 믹스인 뷰**

이번에는 **Flavor**, **IceCreamStore** 두 모델에 연동되는 각 뷰에 하나의 공통 폼을 재사용할 수 있는지 알아보겠습니다.

두 모델은 공통적으로 title 필드를 가지고 있다고 가정하고, title 기반 검색 믹스인을 생성합니다.

```python
# core/views.py
class TitleSearchMixin(object):
    
    def get_queryset(self):
        queryset = super(TitleSearchMixin, self).get_queryset()
        
        # 검색어가 존재하면 필터된 쿼리셋 반환
        q = self.request.GET.get('q')
        if q:
            return queryset.filter(title__icontains=q)
        return queryset
```

이제 이 믹스인을 상속한 두 모델의 뷰에 전달되는 request 에 검색어 q 가 존재하면 제목에서 필터됩니다.

```python
# flavors/views.py
from django.views.generic import ListView

from core.views import TitleSearchMixin
from .models import Flavor


class FlavorListView(TitleSearchMixin, ListView):
    model = Flavor
```

```python
# stores/views.py
from django.views.generic import ListView

from core.views import TitleSearchMixin
from .models import Store


class IceCreamStoreListView(TitleSearchMixin, ListView):
    model = Store
```

여기서 모델폼은 **ListView** 의 자동 생성 폼을 사용하여 html 내에 구현합니다.

```html
{# flavors/flavor_list.html #}
...

<form action="" method="GET">
    <input type="text" name="q" />
    <button type="submit">search</button>
</form>

...
```

```html
{# stores/store_list.html #}
...

<form action="" method="GET">
    <input type="text" name="q" />
    <button type="submit">search</button>
</form>

...
```

이러한 공통 믹스인은 개발을 편리하게 하지만 너무 남발하면 유지보수가 복잡해질 수 있으니 주의합시다!

<br>
**<a href="{{ site.github.url }}/frameworks/2022/11/05/django-knowhow-02" target="_blank">[다음글]</a>**
