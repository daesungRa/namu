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
- <a href="{{ site.github.url }}/frameworks/2022/11/27/django-knowhow-03" target="_blank">[03] 장고 노하우 정리</a>

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

<br>
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

<br>
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
먼저 장고 앱에 자동으로 생성되는 **tests.py** 를 모두 삭제하고
각 모듈에 맞는 **test_\<module name\>.py** 형식의 테스트 파일을 생성합니다.

> 테스트용 파일은 **'test_'** 접두어를 붙여야 장고의 테스트 러너가 인식함
> - **test_models.py**, **test_forms.py**, **test_views.py**, **test_middleware.py**, ...

<br>
### 단위 테스트 작성하기

테스트 코드는 최소한의 시간을 들여 가장 의미 있게 만들어야 합니다.

- 각 테스트 메서드는 **테스트를 한 가지씩 수행**해야 합니다. 뷰면 뷰, 모델이면 모델 이런식..
- 플로우 테스트를 위해서는 최소한의 환경만을 사용합니다
    ```python
    # flavors/test_api.py
    import json
    
    from django.urls import reverse
    from django.test import TestCase
    
    from flavors.models import Flavor
    
    
    class DjangoRestFrameworkTests(TestCase):
    
        def setUp(self):
            Flavor.objects.get_or_create(title='title1', slug='slug1')
            Flavor.objects.get_or_create(title='title2', slug='slug2')
            self.create_read_url = reverse('flavor_rest_api')
            self.read_update_delete_url = reverse('flavor_rest_api', kwargs={'slug': 'slug1'})
        
        def test_list(self):
            response = self.client.get(self.create_read_url)
            
            # title existing check
            self.assertContains(response, 'title1')
            self.assertContains(response, 'title2')
        
        def test_detail(self):
            response = self.client.get(self.read_update_delete_url)
            data = json.loads(response.content)
            content = {'id': 1, 'title': 'title1', 'slug': 'slug1', 'scoops_remaining': 0}
            self.assertEquals(data, content)
    
        def test_create(self):
            post = {'title': 'title3', 'slug': 'slug3'}
            response = self.client.post(self.create_read_url, post)
            data = json.loads(response.content)
            self.assertEquals(response.status_code, 201)
            content = {'id': 3, 'title': 'title3', 'slug': 'slug3', 'scoops_remaining': 0}
            self.assertEquals(data, content)
            self.assertEquals(Flavor.objects.count(), 3)
        
        def test_delete(self):
            response = self.client.delete(self.read_update_delete_url)
            self.assertEquals(response.status_code, 204)
            self.assertEquals(Flavor.objects.count(), 1)
    ```
- 뷰에 대해서는 가능하면 **요청 팩토리**를 이용합시다
    - 장고 테스트의 **리퀘스트 팩토리 모듈**(**django.test.client.RequestFactory**)은
    테스트하는 해당 메서드 내에서만 활용되는 **request 인스턴스**를 제공함으로써 보다 독립적인 환경을 제공합니다
        ```python
        # flavors/test_views.py
        from django.contrib.auth.models import AnonymousUser
        from django.contrib.sessions.middleware import SessionMiddleware
        from django.test import TestCase, RequestFactory
        
        from .views import cheese_flavors
        
        
        def add_middleware_to_request(request, middleware_class):
            middleware = middleware_class()
            middleware.process_request(request)
            return request
        
        
        def add_middleware_to_response(request, middleware_class):
            middleware = middleware_class()
            middleware.process_request(request)
            return request
        
        
        class SavoryIceCreamTest(TestCase):
            def setUp(self):
                # 모든 테스트에서 이 request factory 로 접근 가능해야 함
                self.factory = RequestFactory()
            
            def test_cheese_flavors(self):
                request = self.factory.get('/cheesy/broccoli/')
                request.user = AnonymousUser()
        
                # request 객체에 세션 생성
                request = add_middleware_to_request(request, SessionMiddleware)
                request.session.save()
        
                response = cheese_flavors(request)
                self.assertContains(response, 'bleah!')
        ```
- 테스트가 필요한 테스트 코드를 작성하지 않습니다
- 같은 일을 반복하지 말라는 법칙은 테스트 케이스를 쓰는 데는 적용되지 않습니다
    - **setUp** 과 같은 메서드가 재사용 면에서 유용하나, **때로 테스트 케이스마다 조금씩 다른 데이터를 필요로** 하기도 합니다
- 픽스처를 너무 신뢰하지 않습니다
    - **픽스처란, 테스트를 위한 샘플 오브젝트 데이터를 JSON 과 같은 형식으로 미리 작성해두는 것**을 말합니다
    - 이보다는 **ORM 에 의존하는 코드를 제작하는 편**이 더 낫습니다
    - 테스트 데이터를 생성해주는 도구: factory boy, model mommy, mock
- 테스트해야 할 대상들
    - 뷰, 모델, 폼, validator, 시그널, 필터, 템플릿 태그, 실패 케이스, 기타(context processor, middleware, email 등)
- 테스트의 목적은 **테스트의 실패를 찾는 데** 있습니다
    - **성공 시나리오**보다 **실패 또는 예외 시나리오 커버리지**가 중요합니다 (꼭 해당 케이스를 생성할 것!!)
- 목(Mock, mock library)을 이용하여 실제 데이터에 문제를 일으키지 않고 단위 테스트 하기
    - **mock** 패키지의 **monkey-patch** 라이브러리를 활용하면 **icecreamapi** 외부 API 를 실제 연결하지 않고 테스트가 가능합니다
        ```python
        # list_flavors_sorted() 함수에 대한 테스트!
        import mock
        import unittest
        
        import icecreamapi
        
        from flavors.exceptions import CantListFlavors
        from flavors.utils import list_flavors_sorted
        
        
        class TestIceCreamSorting(unittest.TestCase):
        
            # icecreamapi.get_flavors() 의 monkey-patch 세팅
            @mock.patch.object(icecreamapi, 'get_flavors')
            def test_flavor_sort(self, get_flavors):
                # icecreamapi.get_flavors() 가 정렬되어 있지 않은 리스트를 생성하도록 설정
                get_flavors.return_value = ['chocolate', 'vanilla', 'strawberry',]
                
                # list_flavors_sorted() 는 icecreamapi.get_flavors() 함수를 호출하도록 구현되어 있음
                # monkey patch 를 통해 get_flavors() 의 return_value 값을 별도로 설정했으므로,
                # 항상 반환되는 값은 위 코드와 같이 ['chocolate', 'vanilla', 'strawberry',] 가 되며
                # 이는 구현된 list_flavors_sorted() 의 핵심로직에 의해 자동으로 정렬되어 최종 반환됨
                flavors = list_flavors_sorted()
                
                self.assertEqual(flavors, [
                    'chocolate', 'strawberry', 'vanilla',  # 정렬된 결과 확인
                ])
        ```
    - **icecreamapi** API 가 연결되지 않는 실패 케이스에 대한 테스트 코드는 다음과 같이 구현합니다
        ```python
        # icecreamapi 접속 실패인 경우 테스트!
        
        ...
                
                @mock.patch.object(icecreamapi, 'get_flavors')
                def test_flavor_sort_failure(self, get_flavors):
                    # icecreamapi.get_flavors() API 접속 시도시 에러가 발생하도록 설정
                    get_flavors.side_effect = icecreamapi.FlavorError()
                    
                    # list_flavors_sorted() 내부에서 FlavorError() 가 발생하면 CantListFlavors 예외가 발생되는지 확인
                    with self.assertRaises(CantListFlavors):
                        list_flavors_sorted()
        ```
    - 나아가 python **requests** 연결 문제에 대한 테스트 케이스입니다
        ```python
        # request 의 connection, SSL 에러 테스트!
        import requests
        
        ...
        
                @mock.patch.object(requests, 'get')
                def test_request_conn_failure(self, get):
                    """타깃 사이트에 접속 실패 시"""
                    get.side_effect = requests.exceptions.ConnectionError()
                    
                    with self.assertRaises(CantListFlavors):
                        list_flavors_sorted()
        
                @mock.patch.object(requests, 'get')
                def test_request_ssl_failure(self, get):
                    """타깃 사이트의 SSL 이슈 테스트"""
                    get.side_effect = requests.exceptions.SSLError()
                    
                    with self.assertRaises(CantListFlavors):
                        list_flavors_sorted()
        ```
- 좀 더 고급스러운 단언 메서드 사용하기
    - **assertRaises()**, **assertCountEqual()**, **assertDictEqual()**, **assertFormError()**
    - **assertContains()**: **response.content** 를 체크하여 상태 200 확인
    - **assertHTMLEqual()**, **assertJSONEqual()**
- 각 테스트 목적을 문서화하라 (꼭!)

<br>
### 통합 테스트(Integration Tests)란?

**통합 테스트**는 개별적인 소프트웨어 모듈이 하나의 그룹으로 조합되어 테스트되는 것을 말하는데,
단위 테스트 이후에 시행됩니다.

이것은 서드 파티 API 와의 연동을 포함하여 어플리케이션의 모든 부분이 잘 작동하는지 확인하는 훌륭한 방법입니다.

하지만 통합 테스트는 시스템 전체에 대한 확인과정을 거치기 때문에 단위 테스트에 비해 더 많은 주의를 요합니다.

예를 들어, 데이터베이스 레벨에서 벌어진 유니코드 변환 문제가 브라우저상의 문제로 보일 수도 있습니다.

<br>
### 지속적 통합

프로젝트 규모에 관계없이 프로젝트 저장소에 새로운 코드가 커밋될 때마다 테스트를 실행하는 지속적 통합 서버를 세팅하는 것을 추천합니다.
본 내용은 '32장. 지속적 통합' 에서 자세히 다룹니다.

<br>
### 테스트 범위 게임

테스트를 최대한 많은 범위로 확장하는 것을 테스트 범위 게임이라고 합니다.

1. 테스트 작성 시작하기
2. 테스트 실행하기(```$ manage.py test```) 그리고 커버리지 리포트(coverage.py) 작성하기
    - **\<project_root\>** 에서 다음과 같은 명령을 입력합니다
    - **```$ coverage run manage.py test -settings-twoscoops.settings.test```**
3. 리포트 생성하기
    - **\<project_root\>** 에서 다음과 같은 명령을 입력합니다
    - **```$ coverage html -omit="admin.py"```**

처음에는 당연히 매우 낮은 테스트 커버리지를 가지고 있을 것입니다.
이 커버리지를 높여나가는 게임입니다.

- **규칙**: **_테스트 커버리지를 낮추는 그 어떤 커밋도 허용하지 않기_**

새로운 기능을 추가하거나 버그 수정을 시작했을 때
테스트 커버리지가 이전보다 조금이라도 높아지지 않는다면 **절대 commit and merge 하지 않습**니다.

> 한 번에 급격히 증가하는 테스트 커버리지보다 **점진적으로 발전하는 테스트 커버리지가 좋습**니다.
> 개발자들이 의미 없는 가짜 테스트를 넣고 있지 않다는 의미이기 때문입니다.

<br>
### unittest 대안

장고의 **unit test 모듈** 은 파이썬 표준 라이브러리인 **unittest** 를 사용합니다.

unittest 는 **클래스 기반(class-based)** 으로 코드를 작성하게 되는데,
그만큼 확장 면에서 강력하고 유용하지만 **너무 많은 코드를 요한다는 불편함도 존재**합니다.

따라서 대안으로 **pytest**, **nose** 라이브러리를 사용하기도 합니다.

```python
# test_models.py
"""Using pytest"""
from pytest import raises

from cones.models import Cone


def test_good_choice():
    assert Cone.objects.filter(type='sugar').count() == 1


def test_bad_cone_choice():
    with raises(Cone.DoesNotExist):
        Cone.objects.get(type='spaghetti')
```

위와 같이 **pytest** 를 활용하면 짧은 코드의 함수 기반 테스트 코드를 작성할 수 있습니다.

> 함수는 간편한 대신 클래스의 공통 테스트 기능 확장에 한계가 있기도 하다는 사실을 기억합시다.

<br>
### 문서화에 집착하자 (23장 내용)

문서 작성을 위해 **reStructuredText** 나 **Sphinx** 같은 도구를 사용합니다.

1. 파이썬 프로젝트 문서화에 일반적으로 사용되는 **reStructuredText (RST)** 마크업 언어
    - 핵심 사용법 확인을 위해
    **<a href="https://docutils.sourceforge.io/rst.html" target="_blank">reStructuredText 공식 문서</a>**를 살펴봅시다.
2. reStructuredText 로부터 스핑크스를 이용하여 문서 생성하기
    - **Sphinx** 는 **.rst** 파일을 보기 좋게 꾸며진 문서로 변환해주는 도구입니다.
    - 스핑크스 문서 생성에 대한 방법은
    **<a href="https://www.sphinx-doc.org" target="_blank">reStructuredText 공식 문서</a>**를 살펴봅시다.

> **적어도 매주마다(주기적으로) 스핑크스 문서를 빌드합시다.**

프로젝트에서 작성해야 하는 문서들은 다음과 같습니다.

- **README.rst**: 이 프로젝트가 무엇인지 짧은 문장이라도 설명이 제공되어야 함
- **docs/**: 프로젝트 문서들이 위치하는 디렉토리
- **docs/deployment.rst**: 프로젝트 설치, 업데이트 방법을 단계별로 제공
- **docs/installation.rst**: 프로젝트 소프트웨어 셋업 가이드. 다른 개발자 및 본인을 위해서도 유용함
- **docs/architecture.rst**: 프로젝트를 간단 명료하게 표현하는 문서

<br><br>
# 24장. 장고 성능 향상시키기

<br>
이 장에서는 병목 현상을 찾아내 장고 프로젝트를 좀 더 빠르게 만드는 방법을 다룹니다.

<br>
### 쿼리로 무거워진 페이지의 속도 개선

> **<a href="https://docs.djangoproject.com/en/4.1/topics/db/optimization/" target="_blank">
> 장고 공식: DB optimization</a>**

> 성능 디버깅을 위해 유용한 툴
> - **<a href="https://django-debug-toolbar.readthedocs.io/en/latest/" target="_blank">
> Django Debug Toolbar</a>**: 페이지에서 호출되는 대부분의 쿼리 출처 확인 가능
> - **<a href="https://github.com/lincolnloop/django-cache-panel" target="_blank">
> Django Cache Panel</a>**: 장고에서 캐시의 이용을 시각화해 보여준다

<br>
**(1) 쿼리 수 줄이기**

- ORM 에서 **select_related()**, 클래스 기반 뷰에서 **SelectRelatedMixin** 을 이용한다
    - 모델 간 관계를 추적하여 한 번에 좀더 많은 정보를 가져옴
    - 특별히 필요한 관계들만 고려하고 필요한 필드만 넘겨줌으로써 쿼리가 너무 방대해지는 것 방지해야 함
- 다대다(many-to-many) 혹은 다대일(many-to-one) 관계에서는 **select_related** 최적화가 어렵기 때문에,
**prefetch_related()** 를 사용할 것
- 하나의 템플릿에서 하나 이상의 같은 쿼리가 (반복) 호출된다면 **해당 쿼리를 뷰로 이동시켜 콘텍스트 변수로 처리**할 것
- **key/value 형식의 캐시(Memcached)** 이용하기
- **django.utils.functional.cached_property** 데코레이터 이용하여 객체 인스턴스의 메서드 호출 결과를
메모리 캐시게 저장하기

<br>
**(2) 일반 쿼리 빠르게 하기**

다음은 개별 쿼리 속도를 높이는 데 시작점으로 삼기 좋은 팁입니다.

- 일반적으로 **인덱스**로 최적화가 가능함.
이를 위해 **실제 SQL 문법의 쿼리문을 살펴봐**서 WHERE 혹은 ORDER BY 절에서 빈번하게 사용되는 필터를 대상으로 삼기
- **상용(운영) 환경**에서 사용되는 인덱스가 적절한지 살펴보기
- 쿼리에서 생성된 **쿼리 계획(query plan)** 살펴보기
- 데이터베이스에서 **느린 쿼리 로깅(slow query logging)** 기능을 활성화하고 빈번히 발생하는 느린 쿼리 확인하기
- **django-debug-toolbar** 이용하여 느려질 가능성이 있는 쿼리 찾기

쿼리를 다시 작성할 때는 다음과 같이 진행합니다.

1. 가능한 작은 크기의 결과가 반환되도록 재구성
2. 인덱스가 좀더 효과적으로 작동할 수 있도록 모델 재구성
3. ORM 보다 효율적이라면, 직접 SQL 이용해보기

<br>
**(3) ATOMIC_REQUESTS 비활성화하기**

절대 다수의 사이트에서는 한 request 에서 발생하는 모든 쿼리를 하나의 트랜잭션 처리하도록
**ATOMIC_REQUESTS** 값을 **True** 로 설정해도 문제가 없습니다.

하지만 특정 트랜잭션에서 병목 현상이 일어나는 경우, 아예 이 설정값을 비활성화(**False** 로 변경)하는 것을 고려할 수 있습니다.

혹은 해당 트랜잭션 뷰(view)에 **```@transaction.non_atomic_requests```** 데코레이터를 적용하고, 필요한 쿼리수행 코드만
**```with transaction.atomic(): ...```** 구문으로 감싸 별도 처리할 수 있습니다.

<br>
### 데이터베이스의 성능 최대한 이용하기

데이터베이스 **접근 최적화**에 대해 세부적으로 다뤄봅니다.

- 규모가 큰 사이트의 관계형 데이터베이스에 포함되어서는 안 되는 두 가지
    1. **로그**: 지속적으로 누적되는 로그 데이터를 데이터베이스에 저장하면 전체적인 성능이 점점 저하됩니다.
    필요한 경우 로그 데이터는 NoSQL 에 별도로 저장할 수 있습니다
    2. **일시적 데이터**: **django.contrib.sessions**, **django.contrib.messages**, **metrics** 와 같이 빈번하게
    리라이팅(rewriting)되는 일시적 데이터는 데이터베이스에 저장하지 않도록 합니다. 이를 위해 **Memcached**, **레디스(Redis)**,
    **리악(Riak)** 등을 활용합니다
- **PostgreSQL** 혹은 **MySQL** 최대한 이용하기 (책 p287 참조)

<br>
### Memcached 나 레디스(Redis)를 이용하여 쿼리 캐시하기

**Memcached**나 **레디스(Redis)** 를 바인딩할 수 있는 파이썬 패키지를 통해 이용이 가능합니다.

사이트 전반에 적용되는 캐시를 설정할 수도 있고 각 뷰나 템플릿별로 할 수도 있습니다.

<br>
### 캐시를 이용할 곳 정하기

메모리 캐시를 어느 곳에 우선적으로 적용할지 결정해야 합니다.

- 가장 많은 쿼리를 포함하고 있는 뷰와 템플릿은 어떤 것인가?
- 어떤 URL 이 가장 많은 요청을 받는가?
- 캐시를 삭제해야 할 시점은 언제인가?

<br>
### 서드 파티 캐시 패키지

서드 파티 캐시 패키지는 다음과 같은 기능을 제공합니다.

- 쿼리세트(QuerySet) 캐시
- 캐시 삭제 세팅과 메커니즘
- 다양한 캐시 백엔드
- 기존 캐시 시스템에 대한 대안과 실험적이며 과도기적 방법론

몇몇 인기 있는 장고 캐시 패키지는 다음과 같습니다.

- django-cache-machine
- johnny-cache

<br>
### HTML, CSS, Javascript 압축과 최소화하기

책 참조(p290)

<br>
### 업스트림 캐시나 CDN 이용하기

책 참조(p290)

<br><br>
# 25장. 비동기 태스크 큐

<br>
**비동기 태스크 큐(asynchronous task queue)** 란 태스크가 실행되는 시점이 태스크가 생성되는 시점과 다르고
태스크의 생성 순서와도 연관 없이 실행되는 작업을 의미합니다.

이와 관련된 용어는 다음과 같습니다.

- **브로커(broker)**: 태스크들이 보관되어 있는 장소
    - **RabbitMQ** 와 **Redis** 와 같이 데이터를 지속적으로 보관할 수 있는 도구를 사용
- **프로듀서(producer)**: 나중에 실행될 태스크를 큐에 넣는 코드
    - 즉, 장고 프로젝트를 구성하는 애플리케이션 코드를 의미함
- **워커(worker)**: 태스크를 브로커에서 가져와 실행하는 코드
    - 일반적으로 하나 이상의 워커가 존재
    - 각 워커는 데몬 형태로 실행되며 관리를 받음

다시 말해 **비동기 태스크 큐**는 사전에 지정된 순서에 따라 원하는 작업이 순차적으로 수행되는 것을 의미합니다.
이때 다음 작업은 이전 작업이 완료되고 하드웨어 자원이 가용한 시점에 호출됩니다.

이것이 정말 필요한지 가늠할 수 있는 기준은 다음과 같습니다.

- **결과에 시간이 걸리는 경우** > **태스크 큐 이용한다**
    - 단체 이메일 보내기, 파일 수정 작업(이미지 포함), 서드 파티 API 로부터 다량의 데이터 불러오기, 테이블에 많은 양의 레코드를
    추가하거나 업데이트하기, 긴 시간을 요하는 연산(인공지능 학습 등), 웹훅(webhook)을 보내거나 받기
- **사용자에게 바로 결과를 제공해야 한다** > **태스크 큐 이용하지 않는다**
    - 사용자 프로파일 변경, 블로그나 CMS 엔트리 추가

사이트의 트래픽 규모에 따라 예외가 있을 수 있습니다.

- 트래픽이 적거나 중간 정도인 경우 태스크 큐를 이용하지 않아도 됨
- 트래픽이 많은 경우 모든 작업에 태스크 큐가 필요함

<br>
### 태스크 큐 소프트웨어 선택하기

**Celery**, **Redis Queue**, **django-background-tasks** 가 있습니다.

- 용량이 작은 프로젝트부터 용량이 큰 프로젝트까지 대부분 레디스 큐를 추천
- 태스크 관리가 복잡한 대용량 프로젝트에는 샐러리를 추천
- 특별히 시간이 주기적인 배치 작업(batch job)을 위한 소규모 프로젝트에는 django-background-tasks 추천

<br>
### 태스크 큐에 대한 실전 방법론

다음은 태스크 큐 패키지에 공통으로 적용 가능한 일반적인 방법론으로써, 각 태스크 기능이 **이식성**과 **독립성**을 갖게 하는데 큰 도움을 줍니다.

따라서 사이트가 성장하여 패키지를 전환할 필요가 발생할 때 이전이 쉬워집니다.

<br>
**(1) 태스크를 뷰처럼 다루자**

앞서 뷰(view) 를 가능한 한 작고 단일 기능으로 구성하도록 권장했는데,
이와 유사하게 태스크 로직을 구성해야 합니다.

복잡해지거나 중복 사용되는 코드는 헬퍼 함수로 별도 모듈화하도록 합시다.

<br>
**(2) 태스크 또한 리소스를 이용한다**

태스크 실행을 위한 메모리와 리소스에도 한계가 있기 때문에
최대한 간결하고 리소스를 낭비하니 않는 방향으로 코드를 작성해야 합니다.

<br>
**(3) JSON 화 가능한 값들만 태스크 함수에 전달하라**

뷰와 같은 태스크 함수의 인자는 **JSON 화 가능한 값으로만 제한**해야 합니다.
(정수, 부동 소수점, 문자열, 리스트, 튜플, 딕셔너리 타입만 허용하도록)

**복잡하게 얽힌 객체를 인자로 이용하지 말아야** 합니다.

- ORM 인스턴스와 같은 영속적 데이터 객체를 함수의 인자로 이용하는 것은 경합 상황을 유발합니다
    - 이는 태스크가 실행되기 전에 영속적 데이터의 내용이 변경되었을 때 나타납니다
    - 대신 primary key 나 다른 구분자를 함수에 넘겨, 호출 시점의 최신 데이터를 불러오도록 할 수 있습니다
- 복잡한 형태의 인자의 경우 시간과 메모리가 더 소요됩니다. 이는 태스크 큐를 사용하는 목적에 정면으로 대치되는 것입니다
- JSON 화 된 인자 값들의 디버깅이 더 수월합니다
- 태스크 큐 자체로 JSON 형태의 인자만 허용하기도 합니다

<br>
**(4) 태스크와 워커를 모니터링하는 방법을 익혀 두라**

태스크와 워커의 상태를 시각적으로 확인할 수 있는 방법을 반드시 익혀 두어야 합니다.

- **Celery**
    - https://pypi.python.org/pypi/flower
- **Redis Queue**
    - https://pypi.python.org/pypi/django-redisboard (레디스 큐에서 직접 이용 가능)
    - https://pypi.python.org/pypi/django-rq (django-rq 이용)
- **django-background-tasks**
    - **django.contrib.admin** 을 모니터링에 이용

<br>
**(5) 로깅!**

태스크 큐 작업은 기본적으로 백그라운드에서 진행되므로,
에러가 일어나기 쉬운 태스크의 경우 디버깅을 위해 각 태스크 함수 내에 로그를 남겨야 합니다.

<br>
**(6) 백로그 모니터링하기**

트래픽이 점점 증가하는데 충분한 수의 워커가 제공되지 못한다면 태스크가 점점 쌓일 수밖에 없습니다.

이 경우 워커 수를 늘리는 것을 고려해야 합니다.
하나의 워커만 이용이 가능한 경우(django-background-tasks), 샐러리나 레디스 큐로 업그레이드를 고려해야 합니다.

<br>
**(7) 죽은 태스크들 주기적으로 지우기**

태스크가 큐로 전달되었음에도 모종의 이유로 아무런 반응(리턴)이 돌아오지 않는 경우,
이러한 죽은 태스크를 주기적으로 지우는 방법을 고심해야 합니다.

원인은 사이트의 버그 등으로 아무 반응이 없거나, 리소스가 더 이상 존재하지 않는 등 여러가지가 있을 수 있습니다.

<br>
**(8) 불필요한 데이터 무시하기**

태스크가 완료되면 브로커는 태스크 성공과 실패를 기록하게 설계되어 있습니다.
이는 통계 정보 추출에 유용한 정보이나, **exit 결과값 자체**는 태스크의 결과물이 아닙니다.

exit 결과물이 불필요한 저장소를 차지하지 않도록 보통은 이런 기능을 비활성화 시킵니다.

<br>
**(9) 큐의 에러 핸들링 이용하기**

네트워크나 서드파티 API 문제 등 예상치 못한 이유로 태스크가 실패하는 경우가 있습니다.

태스크 큐 소프트웨어는 이러한 에러에 대한 핸들링 기능을 제공합니다.

- 태스크 최대 재시도 횟수 (Max retries for a task)
- 재시도 전 지연 시간 (Retry delays)

재시도 전 지연 시간은 적어도 10초 이상 기다리도록 하는 것을 권장합니다.
또한 재시도 할때마다 이 간격이 커지게 설정해 주면 좋습니다.

<br>
**(10) 태스크 큐 소프트웨어의 기능 익히기**

각 태스크 큐 소프트웨어의 특성을 인지하고 적절한 기능을 판단해 사용하시기 바랍니다.

<br>
> ## 태스크 큐 참고자료
> - http://www.fullstackpython.com/task-queues.html
> - http://www.2scoops.co/why-task-queues
> - https://pypi.python.org/pypi/django-transaction-hooks (트랜잭션 후 커밋 훅을 지원하는 장고 데이터베이스 백엔드)
> ### 샐러리 관련
> - http://celeryproject.com, https://denibertovic.com/posts/celery-best-practices/ (셀러리 홈페이지, 필독서)
> - https://pypi.python.org/pypi/flower (셀러리 클러스터 관리를 위한 웹 기반 도구)
> - http://wiredcraft.com/blog/3-gotchas-for-celery/
> - https://www.caktusgroup.com/blog/2014/06/23/scheduling-tasks-celery/
> ### 레디스 큐 관련
> - http://python.rq.org, http://racingtadpole.com/blog/redis-queue-with-django
> ### django-background-tasks 관련
> - https://pypi.python.org/pypi/django-background-tasks

<br>
**<a href="{{ site.github.url }}/frameworks/2022/10/23/django-knowhow-01" target="_blank">[이전글]</a>**
**<a href="{{ site.github.url }}/frameworks/2022/11/27/django-knowhow-03" target="_blank">[다음글]</a>**
