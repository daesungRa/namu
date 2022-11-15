---
title: "[02] 장고 노하우 정리"
created: 2022-11-05 18:00:00 +0900
updated: 2022-11-05 22:00:00 +0900
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

- 13장. [장고 템플릿](#13장-장고-템플릿)
- 16장. [REST API](#16장-REST-API)
- 19장. [장고 어드민과 사용자 모델](#19장-장고-어드민과-사용자-모델)
- 22장. [테스트, 문서화에 집착하자](#22장-테스트-문서화에-집착하자)
- 24장. [장고 성능 향상시키기](#24장-장고-성능-향상시키기)
- 25장. [비동기 태스크 큐](#25장-비동기-태스크-큐)
- 26장. [장고 보안의 실전 방법론](#26장-장고-보안의-실전-방법론)
- 27장. [로깅: 누구를 위한 것인가](#27장-로깅-누구를-위한-것인가)
- 31장. [장고 프로젝트 배포 및 지속적 통합](#31장-장고-프로젝트-배포-및-지속적-통합)

### 시리즈

- <a href="{{ site.github.url }}/frameworks/2022/10/23/django-knowhow-01" target="_blank">[01] 장고 노하우 정리</a>

### 참조

- <a href="https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=88857020" target="_blank">Two Scoops of Django</a>
- <a href="https://tutorial.djangogirls.org/ko/django_orm/" target="_blank">djangogirls tutorial</a>
- <a href="https://docs.djangoproject.com/en/4.0/topics" target="_blank">Django docs</a>

---

<br><br>

공부용으로 필요한 내용을 정리합니다.

<br><br>
# 13장. 장고 템플릿

<br>
### 대부분의 템플릿은 templates/ 에 넣어두자

**<a href="{{ site.github.url }}/frameworks/2022/10/23/django-knowhow-01#우리가-선호하는-프로젝트-구성" target="_blank">
우리가 선호하는 프로젝트 구성</a>** 부분을 참조하면, 프로젝트 내에서 **templates/** 디렉토리의 위치를 알 수 있습니다.
이것 하위에 앱 혹은 필요한 분류에 따라 세분화하여 템플릿 파일들을 두면 됩니다.

템플릿 경로는 **settings.py** 설정파일 내 **TEMPLATES** 항목에 지정합니다.

> 간혹 각 앱의 하위에 각각 **templates/** 디렉토리를 두는 경우도 있으니 알아둡시다.

<br>
### 템플릿 아키텍쳐 패턴

템플릿 문법을 활용해 템플릿 간 상속이 가능합니다.
따라서 앱별로 재사용 가능한 이중 혹은 삼중의 상속구조를 만들 수 있습니다.
그러나 불필요하게 복잡해진 구조는 유지보수의 복잡성을 야기하니 주의합시다.

<br>
### 템플릿에서 프로세싱 제한하기

장고는 뷰 단에서 템플릿으로 쿼리셋을 전달할 수 있는데,
이는 템플릿 수준에서 이터레이션을 통해 쿼리가 수행될 수 있음을 의미합니다.

이러한 기능은 매우 편리하고 직관적인 활용이 가능하지만
프로세싱이 이루어지는 만큼 다음과 같은 부정적 영향이 존재합니다.

- **거대 쿼리셋의 무분별한 이터레이션(반복)은 좋지 않음**
- **쿼리결과 불필요한 필드(데이터)의 포함 가능성**
- **각 루프별 무거운 프로세싱(부하발생의 누적)**

한 마디로 복잡한 비즈니스 로직, 많은 데이터를 다루는 작업은 템플릿 및 자바스크립트 단에서 수행해서는 안 됩니다.

템플릿에서는 결과값을 보여주거나, 소량의 가벼운 프로세싱이 적합합니다.

> - **(X, 하면 안됨!) 템플릿상에서 처리하는 aggregation 메서드**
>     - 대표적으로 count 집계가 있음. 이 때는,
>     - 모델 매니저에 집계용 메서드를 작성하여 뷰에서 활용하는 방법을 사용
> 
> - **(X, 하면 안됨!) 템플릿상에서 조건문으로 하는 필터링**
>     - 템플릿에서 쿼리셋으로 반복문을 돌며 조건비교하는건 지양
>     - 별도의 모델 매니저 메서드로 처리 후 뷰단에서 **context data** 로 반환할 것
>
> - **(X, 하면 안됨!) 템플릿상에서 복잡하게 얽힌 쿼리들**
>     - 템플릿에서 **User** 객체를 iterating 하며 이에 속한 추가 객체들을 조회하는 경우.
>     - **{\{ user.flavor.scoops_remaining }\}** 등이 있음
>     - 이보다는 파이썬 단에서 **select_related** 기능을 활용할 것
> 
> - **(X, 하면 안됨!) 템플릿에서 생기는 CPU 부하**
>     - 많은 양의 이미지나 데이터를 처리하는 프로젝트에서는 사이트 성능을 올리기 위해 이러한 이미지 프로세싱 작업을
> 템플릿에서 분리해 뷰나 모델, 헬퍼 메서드, 또는 셀러리(Celery) 등을 이용한 비동기 메시지 큐 시스템으로 처리해야 함
> 
> - **(X, 하면 안됨!) 템플릿에서 숨겨진 REST API 호출**
>     - 템플릿에서 서드파티 지도 API 호출을 예로 들 수 있음

<br>
### 템플릿의 상속, 강력한 기능의 block.super

장고 템플릿 문법에서 여러 html 파일들이 **base.html** 을 상속받는 경우,

- **```block```** 태그 내에서 **{\{ block.super }\}** 와 같은 식으로 상위 요소 상속도 가능함!
- 상속 시 **{\{ block.super }\}** 를 사용하지 않고 새롭게 **```block```** 정의가 가능함!

```html
{ % extends "base.html" %}
{ % block stylesheets %}
    {# 'block.super' 를 사용하지 않음으로써 dashboard.css 만 사용하도록 stylesheets 재정의 #}
    <link rel="stylesheet" type="text/css" href="{ % static 'css/dashboard.css' %}" />
{ % endblock stylesheets %}
```

혹은 아예 stylesheets 블록을 재정의하지 않으면 부모(base.html)의 css 를 그대로 상속받게 됩니다.

<br>
### 그 외 유용한 사항들

- 파이썬 코드와 스타일을 긴밀하게 연결하지 않도록 한다
- 템플릿 디렉토리의 위치는 앱과 같은 수준이 권장됨 (프로젝트 루트 경로)
- 콘텍스트 객체에 모델의 이름을 붙여 이용하기
    - 범용적인 **object_list** 로 명명해도 되지만, **topping_list** 와 같이 모델명 사용도 가능
- 하드 코딩된 경로 대신 URL 이름 사용하기
    - 주소가 바뀔 때 모든 템플릿 내 url 을 일일히 변경하고 싶지 않다면,
    - **URLConf 에 정의해둔 URL 이름**을 사용할 것
- 복잡한 템플릿 디버깅하기
    - 많은 상속으로 문제를 일으키는 변수의 위치를 찾기 어렵다면,
    - **settings.py** 의 **TEMPLATES** 내 **OPTIONS** 설정에 **string_if_invalid** 를 추가할 것
    - ```'OPTIONS': 'string_if_invalid': 'INVALID EXPRESSION: %s'```
- 완전히 독자적인 에러 페이지 활용하기
    - **404.html**, **500.html** 등의 템플릿 제작하기
    - 상속이나 링크 등의 요소를 두지 않고 모든 데이터를 템플릿 내에 직접 첨부할 것
    - 참조: https://styleguide.github.com/

<br>
### 템플릿 태그와 필터 (14장 내용)

**템플릿 필터**는 **```|```** 문자를 활용하여 템플릿 내에서 사용되는 단순명료한(?!) 함수로,
인자를 두 개만 받도록 제한되며 데이터의 외형을 수정(ex. 페이징 처리시)하거나 테스트 시 유용하게 사용됩니다.

**템플릿 태그** 는 필터보다 좀더 복잡한 기능을 태그를 사용하여 빠르고 쉽게 이용할 수 있도록 합니다.
사실상 프로그래밍적인 그 어떤것도 할 수 있습니다. (ex. **```url```** 태그는 form 양식이 제출되는 url 을 지정한 앱 대상으로 생성합니다)

- **모든 기본 템플릿과 태그의 이름은 명확하고 직관적이어야 한다**
- **모든 기본 템플릿과 태그는 각각 한 가지 목적만을 수행한다**
- **기본 템플릿과 태그는 영속 데이터에 변형을 가하지 않는다**

개발자는 필요에 따라 위 내용을 준수하는 **커스텀 템플릿 태그 혹은 필터**를 생성할 수 있습니다.

커스텀 템플릿 태그와 필터는 주로 화면단에서 사용되기 때문에
**(a) 복잡한 로직을 구현해서는 안 되며**, **(b) 재사용하기가 쉽지 않고**, **(c) 남용시 디버깅하기 어려워**집니다.

> 템플릿 태그와 필터는 장고 템플릿의 작동 자체를 통제하는 기능을 절대 제공하지 않습니다.

<br><br>
# 16장. REST API

REST API 를 구현할 때 일반적으로 알아야 할 HTTP 상태 코드는 다음과 같습니다.

- **200** OK: Success, GET(리소스 반환), PUT(상태 메시지 제공 또는 리소스 반환)
- **201** Created: Success, POST(상태 메시지 반환 또는 새로 생성된 리소스 반환)
- **204** No Content: Success, DELETE(성공적으로 삭제된 요청의 응답)
- **304** Unchanged: Redirect, ALL(이전 요청으로부터 아무 변화가 없음)
- **400** Bad Request: Failure, ALL(폼 검증 에러를 포함한 에러 메시지 반환)
- **401** Unauthorized: Failure, ALL(인증 요청을 했으나 사용자가 인증 요건을 제공하지 않음)
- **403** Forbidden: Failure, ALL(사용자가 허용되지 않은 콘텐츠로 접근을 시도함)
- **404** Not Found: Failure, ALL(리소스 없음)
- **405** Method Not Allowed: Failure, 허가되지 않은 HTTP 메서드로 시도됨
- **410** Gone: Failure, ALL(더는 제공되지 않는 메서드로 호출)
- **429** Too Many Requests: Failure, ALL(제한 시간 내에 너무 많은 요청을 보냄)

<br>
### 간단한 JSON API 구현하기

**flavors** 앱 예제를 활용합니다.

클래스 기반 뷰에 기초를 둔 패턴으로 REST API 를 효과적으로 구현하기 위해
**django-rest-framework** 를 이용하겠습니다.

> 참조: <a href="django-rest-framework**" target="_blank">
> **django-rest-framework** 의 class-based views 와 serializers 상세설명 사이트</a>

```python
# flavors/models.py
from django.urls import reverse
from django.db import models


class Flavor(models.Model):

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    scoops_remaining = models.IntegerField(default=0)
    
    def get_absolute_url(self):
        return reverse('flavors:detail', kwargs={'slug': self.slug})
```

```python
# flavors/views.py
from rest_framework import serializers

from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView

from .models import Flavor


class FlavorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Flavor
        fields = ('title', 'slug', 'scoops_remaining')


class FlavorCreateReadView(ListCreateAPIView):

    queryset = Flavor.objects.all()
    serializer_class = FlavorSerializer
    lookup_field = 'slug'


class FlavorReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Flavor.objects.all()
    serializer_class = FlavorSerializer
    lookup_field = 'slug'
```

뷰 모듈을 **urls.py** 로 묶으면 다음과 같습니다.

```python
# flavors/urls.py
from django.conf.urls import url

from .views import FlavorCreateReadView, FlavorReadUpdateDeleteView

app_name = 'flavors'
urlpatterns = [
    url(
        regex=r'^api/$',
        view=FlavorCreateReadView.as_view(),
        name='flavor_rest_api',
    ),
    url(
        regex=r'^api/(?P<slug>[-\w]+)/$',
        view=FlavorReadUpdateDeleteView.as_view(),
        name='flavor_rest_api',
    ),
]
```

<br>
### REST API 아키텍쳐

- 여러 앱의 API 모듈을 분산시키는것 보다는 **공통의 API 앱**을 생성하는 것이 더 나을 수 있음
    - 공통 API 앱에는 API 관련 **serializer**, **renderer**, **views** 를 위치시키며
    - **버저닝**은 필수 (ex. **/api/v1/flavors**)
- 그러나 공통 API 앱은 비대해질 위험이나 개별 앱으로부터 단절될 가능성이 존재함
- 비즈니스 로직은 API 뷰에서 분리할 것
- 여러 앱의 API URL 을 **core/api.py** 와 같은 공통모듈에 모아두는 것이 좋음

> #### **서비스 지향 아키텍쳐(Service-Oriented Architecture, SOA)**
> - **MSA(Micro-Service Architecture)** 는 프로젝트의 각 컴포넌트를 독립된 서버 또는 클러스터에서 구동시켜
> 상호간에 커뮤니케이션이 이루어지도록 설계하는 것을 의미합니다.
> - 장고 프로젝트의 경우, 이러한 컴포넌트 간 커뮤니케이션에 **REST API 를 이용**합니다.
> - 여기서 가장 중요한 것은 장고 프로젝트 자체를 독립적으로 운영이 가능한 웹 애플리케이션으로 어떻게 나눌지 고려하는 것입니다.
> - 예제) 아이스크림 트럭 임대 앱
>     - trucks, owners, renters, payments, receipts, reservations, scheduling, reviews 앱 단위로 프로젝트 분리하여
>     각각 REST API 구현

<br><br>
# 19장. 장고 어드민과 사용자 모델

**장고의 어드민**은 사이트 관리자를 위한 것이지 최종 사용자를 위한 것이 아니므로,
깊은 수준까지 커스터마이징할 필요가 없습니다.

경우에 따라 고객용 관리 대시보드 화면을 새롭게 구현하는 것이 어드민을 수정하는 것보다 더 효율적일 수 있습니다.

<br>
### 객체의 이름 보여주기

장고 어드민에서 모델의 이름은 **```<Model> object```** 형식으로 표기되지만,
모든 모델 클래스에 **\_\_str\_\_()** 메서드를 구현하면 모델의 **name** 필드의 값으로 표현됩니다.

```python
...

class IceCreamBar(models.Model):

    ...

    def __str__(self):
        return self.name
```

또한 어드민에서 객체의 다른 필드들을 보여주기 원한다면, **list_display** 속성을 활용합니다.

```python
# icecreambars/admin.py
from django.contrib import admin

from .models import IceCreamBar


@admin.register(IceCreamBar)
class IceCreamBarAdmin(admin.ModelAdmin):

    """ IceCreamBar Admin """

    list_display = (
        'name',
        'shell',
        'filling',
    )
```

<br>
### 장고의 사용자 모델 다루기 (20장 내용)

장고에서는 **django.contrib.auth.models.User** 클래스의 기본 사용자 모델이 존재합니다.

또한 이 모델은 클래스 상속을 통해 **커스터마이징이 가능**합니다.
이때는 username 과 password 필드가 기본적으로 정의되어 있는
**django.contrib.auth.models.AbstractUser** 추상화 클래스를 상속받습니다.

커스텀 사용자 모델은 필요에 따라 추가적인 필드를 구성할 수 있습니다.

> #### AbstractBaseUser 의 서브클래스를 생성하는 경우
> **password**, **last_login**, **is_active** 필드만 가진 기본 형태의 옵션
> 1. User 모델이 기본으로 제공하는 필드(first_name, last_name)에 그리 만족하지 못할 때
> 2. 기본 형태만 가진 가볍고 깨끗한 상태로부터 새로 서브클래스를 생성하기 원하면서 패스워드를 저장하기 위해
> AbstractBaseUser 의 기본 환경의 장점을 이용하고 싶을 때

<br><br>
# 22장. 테스트, 문서화에 집착하자

<br>
### 

<br>
### 

<br>
### 

<br>
### 

<br>
### 

**<a href="{{ site.github.url }}/frameworks/2022/10/23/django-knowhow-01" target="_blank">[이전글]</a>**
**<a href="" target="_blank">[다음글]</a>**
