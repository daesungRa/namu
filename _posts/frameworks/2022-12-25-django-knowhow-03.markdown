---
title: "[03] 장고 노하우 정리"
created: 2022-12-25 18:00:00 +0900
updated: 2022-12-25 22:00:00 +0900
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

- 26장. [장고 보안의 실전 방법론](#26장-장고-보안의-실전-방법론)
- 27장. [로깅: 누구를 위한 것인가](#27장-로깅-누구를-위한-것인가)
- 28장. [시그널: 시그널은 최후의 수단이다](#28장-시그널-시그널은-최후의-수단이다)
- 29장. [유틸리티들에 대해](#29장-유틸리티들에-대해)
- 31장. [장고 프로젝트 배포 및 지속적 통합](#31장-장고-프로젝트-배포-및-지속적-통합)

### 시리즈

- <a href="{{ site.github.url }}/frameworks/2022/10/23/django-knowhow-01" target="_blank">[01] 장고 노하우 정리</a>
- <a href="{{ site.github.url }}/frameworks/2022/11/05/django-knowhow-02" target="_blank">[02] 장고 노하우 정리</a>

### 참조

- <a href="https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=88857020" target="_blank">Two Scoops of Django</a>
- <a href="https://tutorial.djangogirls.org/ko/django_orm/" target="_blank">djangogirls tutorial</a>
- <a href="https://docs.djangoproject.com/en/4.0/topics" target="_blank">Django docs</a>

---

<br><br>

공부용으로 필요한 내용을 정리합니다.

<br><br>
# 26장. 장고 보안의 실전 방법론

<br>
프레임웤이 아무리 좋은 보안 기능을 제공하더라도
실제 프로젝트를 구축하는 개발자가 그것을 적절히 활용하지 않는다면 아무런 의미가 없습니다.

혹은 견고하게 잘 구축된 서버 보안환경이 1차적으로 가장 중요한 관문이 되기도 합니다.

<br>
### 장고의 보안 기능 요약 (장고 1.8)

아래 내용의 대부분은 특별한 추가 설정 없이 기본 환경만으로 바로 이용할 수 있습니다.

1. **XSS(cross-site scripting) 보안**
2. **CSRF(cross-site request forgery) 보안**
3. **SQL 인젝션 보안**
4. **clickjacking 보안**
5. **보안 쿠키(secure cookie)를 포함한 TLS, HTTPS, HSTS 지원**
6. **기본 설정으로 SHA256 과 PBKDF2 알고리즘을 이용한 안전 패스워드 저장**
7. **자동 HTML 이스케이핑**
8. **expat parser 를 통한 XML 폭탄 공격 대비**
9. **강력해진 JSON, YAML, XML 직렬화/역직렬화 도구**

이 중 추가적인 설정이 필요한 부분을 살펴보겠습니다.

<br>
### 설정이 필요한 보안 기능 목록

프로젝트 구축 시, **아래 항목을 참고하여 빠짐없이 충족되도록** 합시다!

1. **상용 환경에서 DEBUG 모드 끄기**
2. **보안 키 안전하게 보관하기**
3. **HTTPS 이용하기**
    - **django.middleware.security.SecurityMiddleware**
    - **SECURE_SSL_HOST = True**
    - **SESSION_COOKIE_SECURE = True**, **CSRF_COOKIE_SECURE = True**
    - **<a href="https://hstspreload.org" target="_blank">HSTS</a>(HTTP strict transport security)** 이용하기
    (설정은 웹 서버에서)
        - 브라우저로 하여금 지정된 기간동안 해당 사이트에 HTTPS request 만 하도록 강제
        - SSL Strip 공격 방어: 중간자 공격(MITM, Man in the Middle) 방어
        - 장고에서 설정: **SECURE_HSTS_SECONDS = 31536000**, **SECURE_HSTS_INCLUDE_SUBDOMAINS = True**, **SECURE_HSTS_PRELOAD = True**
        - HTTP 헤더에 추가된 예시(1년): **-Strict-Transport-Security: max-age=31536000; includeSubDomains; preload**
        - 한번 브라우저에 설정되면 서버 입장에서 다시 바꿀 수 없으므로,
        - 서비스 초기 변동사항이 많을때는 **3600s(한 시간)** 으로 임시 설정하는것이 좋음
4. **ALLOWED_HOSTS 설정 이용하기**
5. **데이터를 수정하는 HTTP Form 에 대해서는 항상 CSRF 보안을 이용하자**
6. **XSS 공격으로부터 사이트 방어하기**
    - 장고 템플릿은 기본적인 이스케이핑을 해주므로(<, >, ', ", &), 이를 이용할 것
    - ```mark_safe()``` 기능은 자제하기
        - 이것을 사용하면 장고 기본 렌더링 시스템에서의 이스케이핑을 사용하지 않는다는 의미가 됨
    - 사용자가 개별적인 HTML 태그 어트리뷰트를 이용하지 못하게 할것
    - 자바스크립트에서 이용되는 데이터에는 항상 JSON 인코딩 이용
7. **파이썬 코드 인젝션 공격으로부터 사이트 방어하기**
    - eval(), exec(), execfile() 사용주의!!
    - **사용자에 의해 수정된 어떤 피클값(pickled)**도 받지 말것!
    - ```yaml.load()``` 보다는 **```yaml.safe_load()```** 메서드 사용!
    - 쿠키 기반 세션을 조심할 것! > 캐시서버를 따로 이용해서 클라이언트는 키값만 받도록 하자!
8. **장고 Form 을 이용하여 모든 들어오는 데이터 검사하기!!**
9. **결제 필드에서 자동 완성 기능 비활성화하기**
    - 장고 Form 설정시 {'autocomplete': 'off'} 지정, 혹은 필드를 ```widget=forms.PasswordInput()``` 으로 변경
10. **사용자가 올린 파일 다루기**
11. **ModelForms.Meta.exclude 절대 이용하지 않기**
    - **<a href="https://en.wikipedia.org/wiki/Mass_assignment_vulnerability" target="_blank">
    대량 매개변수 입력 취약점(mass assignment vulnerability)</a>** 위협 가능성
    - 또한 **exclude** 로 지정된 필드는 폼에서 입력되어도 **업데이트가 불가능**, 폼은 여러 템플릿에서 다양하게 이용될 수 있다!
    - **```ModelForms.Meta.fields```** 를 이용하여 허용되는 필드를 명시적으로 지정할 것!
12. **ModelForms.Meta.fields = "\_\_all\_\_" 이용하지 않기**
13. **SQL 인젝션 공격 피하기**
    - 기본적으로 장고 ORM 을 사용하면 이러한 인젝션을 예방
    - 다음 장고 컴포넌트를 사용할 땐 주의를 기울일 것!
        1. **.raw() ORM 메서드**
        2. **.extra() ORM 메서드**
        3. 데이터베이스 커서에 직접 접근하는 경우
14. **신용카드 정보를 절대 저장하지 말라**
15. **장고 어드민 안전하게 관리하기**
    - **기본 어드민 url 변경하기**: 다른 이름 혹은 다른 도메인
    - **어드민 접근에 HTTPS 만 허용**: 사이트 전체를 HTTPS 화 하는게 가장 수월
    - **IP 기반으로 접속 제한하기**: Nginx 등 앞단의 웹 서버에서 설정 혹은 미들웨어 이용
    - **allow_tags 어트리뷰트** 주의해서 쓰기: 사용자 입력 태그는 철저히 제외하도록
    - **[OPTION] staff 권한으로 로그인된 사용자만 admin 자체에 접근 허용**:
    그렇지 않다면 로그인 페이지조차 보여주지 않기(admin 흔적을 최소화)
    - **[OPTION] django-admin-honeypot** 이용하여 공격자 속이기
16. **어드민 문서의 보안**
    - url 을 yoursite.com/admin/doc 이 아닌 다른 것으로 변경
    - HTTPS 접속, IP 제한 설정
17. **사이트 모니터링 하기**
18. **의존성 최신으로 유지하기**
19. **클릭재킹(clickjacking) 예방하기**
    - 클릭재킹이란 악의적인 사이트에서 숨겨진 프레임이나 아이프레임 등에 다른 사이트를 로드해서 사용자가
    숨겨진 엘리먼트를 클릭하게 유도하는 것을 말함
    - 다음 참조:
    **<a href="https://docs.djangoproject.com/en/4.1/ref/clickjacking/" target="_blank">django clickjacking</a>**
20. **defusedxml 을 이용하여 XML 폭탄 막기**
21. **이중 인증 살펴보기**: 로그인 시 OTP 사용. 선택사항
22. **SecurityMiddleware 이용하기**
23. **강력한 패스워드 이용하게 만들기**
24. **사이트 보안 검사하기**
    - **<a href="https://djcheckup.com/pony/" target="_blank">포니 체크업(DJ CHECKUP)</a>** 보안감사 사이트 이용
25. **취약점 보고 페이지 만들기**
26. **django.utils.html.remove_tag 이용하지 않기**
27. **문제가 일어났을 때의 대응방법 마련해 두기**
    - 사이트를 관리하는 사람들에게 필요한 프로젝트의 기술적이지 않은 부분까지도 포함한 사항들을 정리한 문서와 계획이 반드시 필요
    1. 모든 것을 정지하거나 읽기 전용 모드로 변경한다.
    2. 정적 HTML 페이지를 띄운다.
    3. 백업을 시작한다.
    4. security@djangoproject.com 으로 메일을 보낸다.(개발자의 실수라도)
    5. 문제를 살펴보기 시작한다.
28. **UUID 를 이용한 난해한 Primary Key**
    - 특별히 식별 키(프라이머리 키)를 숨기고자 하는 목적이 아니라면 난해해서 복붙이 강제되는 **models.UUIDField** 는 지양
29. **보안 사항 일반에 대해 늘 최신 정보를 유지할 것**

<br><br>
# 27장. 로깅: 누구를 위한 것인가

<br>
### 애플리케이션 로그

웹앱에서 발생하는 로그로,
**DEBUG**, **INFO**, **WARNING**, **ERROR**, **CRITICAL** 레벨로 구성됩니다.

<br>
### 로그 레벨

상용 환경에서는 **DEBUG** 레벨을 제외한 모든 로그 레벨을 이용하기를 추천합니다.

1. **급한 주의를 요구할 때 이용되는 CRITICAL**
    - 심각한 참사 우려로 급하게 주의를 요구
    - 코어 장고에서는 CRITICAL 을 이용하지 않고, 사용자의 프로그램 상 중요 코드에서 이용할 것
2. **상용 환경의 에러는 ERROR 를 이용할 것**
    - 코어 장고에서는 드물게 사용되는데, 코드에서 발생한 예외가 처리되지 않은 경우가 대표적
3. **중요도가 낮은 문제에 대해서는 WARNING 이용하기**
    - 일반적이지 않은 문제를 초래할 가능성이 있으나 ERROR 만큼 심각하지 않은 경우 사용
    - 예를 들어 POST request 가 csrf_token 을 포함하지 않은 경우
4. **유용한 상태 정보에 대해서는 INFO 를 이용**
    - 특별한 분석이 필요한 부분에 세부 정보를 남기는 데 사용
    - 성능 분석을 위한 일반적인 정보를 남길 때 사용
    - ex) 다른 부분에서 로그를 남기지 않는 중요 컴포넌트의 시작과 종료
    - ex) 중요한 이벤트에 대한 응답으로 일어난 상태의 변화
    - ex) 권한 변화 시(일반 사용자가 어드민 권한 획득 등)
5. **디버그 관련 메시지는 DEBUG 로**
    - 개발 환경에서 사용
    - **print()** 를 사용하는 잘못된 습관은 지양! >> **logger.debug()** 사용!

<br>
### 예외를 처리할 때 트레이스백 로그 남겨두기

해당 예외에 대해 스택 트레이스 정보를 로그로 남기는 것은 큰 도움이 됩니다.

- **Logger.exception()** 은 ERROR 레벨에서 자동으로 트레이스백과 로그를 포함
- **exec_info 옵션** 키워드를 활용하여 다른 로그 레벨에서도 트레이스백 이용

**WARNING** 레벨에서 트레이스백 남기기
```python
import logging
import requests

logger = logging.getLogger(__name__)


def get_additional_data():
    try:
        r = requests.get('http://example.com/something-optional/')
    except requests.HTTPError as e:
        logger.exception(e)
        logger.debug('Could not get addtional data', exc_info=True)
        return None
    return r
```

<br>
### 한 모듈당 한 개의 로거 쓰기

절대 다른 곳에서 로거를 임포트해서는 안 됩니다.
각 모듈 내에서 로거를 정의해서 써야합니다.

```python
import logging

logger = logging.getLogger(__name__)
```

<br><br>
# 28장. 시그널: 시그널은 최후의 수단이다

<br>
이곳저곳 덕지덕지 붙어 있는 **시그널(Signal)**은 코드 이해와 관리가 어렵고,
플로우에 동기화되며 블로킹을 일으키는 무거운 프로세스를 호출하기 때문에
단지 유용하다는 이유만으로 자주 사용하기에는 단점이 너무 많습니다.

<br>
### 시그널을 이용할 때와 피할 때

- **이용하지 않아야 할 때**
    1. 로직이 **하나의 특별한 모델에만 연관**되어 있어 모델 메서드 중 하나로 이전 가능할 때
        - 이 때는 **save()** 메서드 내에서 구현하여 처리
    2. **커스텀 모델 매니저 메서드**를 시그널 대신 이용할 수 있을 때
    3. **특정 뷰에 연관**된 시그널이 해당 뷰 안으로 이동될 수 있을 때
- **이용을 고려해볼 때**
    1. 시그널의 receiver 가 **하나 이상의 모델을 변경**할 때
        - 예를 들어, User 생성 시 Profile 자동 생성. 이것이 필수적인 로직인 경우
    2. 여러 앱에서 발생한 한 종류의 시그널에서 **공통으로 이용되는 receiver**
    3. 모델이 저장된 이후 캐시를 지우고 싶을 때
    4. 콜백이 필요하나 시그널을 제외하고는 이를 이용할 수 없는 **특별한 경우**
        - 예를 들어, 서드 파티 앱의 모델에서 save() 나 init() 에 기반을 둔 트리거 유발

> "일반 함수로 해결할 수 있는 한 시그널을 이용하지 말라고 말하고 싶다." - 장고 코어 개발자 _Aymeric Augustin_

<br>
### 시그널 대체하기

**(1) 시그널 대신 커스텀 모델 매니저 메서드 이용하기**

**Event** 인스턴스가 생성되면 > 관리자에게 이메일을 보내는 예제 로직입니다.

```python
# events/managers.py
from django.db import models


class EventManager(models.Manager):
    def create_event(self, title, start, end, creator):
        """Custom method to create event"""
        event = self.model(
            title=title, start=start, env=end, creator=creator)
        event.save()
        event.notify_admins()
        return event
```

```python
# events/models.py
from django.conf import settings
from django.core.mail import mail_admins

from django.db import models

from .managers import EventManager


class Event(models.Model):
    STATUS_UNREVIEWED, STATUS_REVIEWED = (0, 1)
    STATUS_CHOICES = (
        (STATUS_UNREVIEWED, 'Unreviewed'),
        (STATUS_REVIEWED, 'Reviewed'),
    )

    title = models.CharField(max_length=100)
    start = models.DateTimeField()
    end = models.DateTimeField()
    status = models.IntegerField(
        choices=STATUS_CHOICES, default=STATUS_UNREVIEWED)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL)

    objects = EventManager()
    
    def notify_admins(self):
        subject = f'{self.creator.get_full_name()} ' \
                   'submitted a new event!'
        message = f'TITLE: {self.title}\n' \
                  f'START: {self.start}\nEND: {self.end}'
        
        # Send to admin!
        mail_admins(subject=subject, message=message, fail_silently=False)
```

이후 **Event** 생성시 **create()** 대신 커스텀 모델 매니저의 **create_event()** 메서드를 사용하면 됩니다.

**(2) 시그널을 통하지 않은 모델 검사**

당연하게도 모든 입력값에 대해 **ModelForm** 의 **clean()** 메서드를 오버라이딩하여 validation check 하시기 바랍니다. 

**(3) 모델의 save 나 delete 메서드를 오버라이딩 하기**

이것은 **하나의 모델에 국한되는 경우**입니다. 모델 내부적으로 전/후처리 모두 가능하기 때문에 시그널을 이용할 필요가 없습니다.

**(4) 시그널 대신 헬퍼함수 이용하기**

- **리팩토링의 경우**
    - 시그널이 너무 난해해 리팩토링을 하고자 하는 경우, 앞선 대체재들을 구현할 수 없는 경우,
    - 그 자리에 헬퍼함수를 사용합니다.
- **아키텍쳐 관점**
    - 거대 모델(Fat Model)을 해소하기 위해 시그널보다는 헬퍼 함수를 사용합니다.
    
<br><br>
# 29장. 유틸리티들에 대해

<br>
### 코어 앱(core app)

- **django.core**: 프로젝트 전반에 걸쳐 쓰이는 함수들과 객체들을 넣어 두는 장고 앱

**장고 코어 앱**에 있는 대상들을 **유틸리티**라 합니다.

개발자가 **본인의 프로젝트에 core 앱을 별도**로 만들어 유틸리티 기능들을 구현할 수도 있습니다.
보통 **커스텀 모델 매니저**나 **커스텀 뷰 믹스인**을 코어 앱에 만들어두고 여러 앱에서 임포트해 사용합니다.

> **코어 앱의 구조는 일반 장고 앱의 구성을 따르자**
> - 코어는 비추상화(non-abstract) 모델을 가지게 된다.
> - 코어에 어드민 자동 발견(admin auto-discovery)을 적용한다.
> - 코어에 템플릿 태그와 필터를 위치시킨다.

<br>
### 유틸리티(utils.py) 모듈을 이용하여 앱 최적화하기

앱 내에서 **utils.py**, **helpers.py** 모듈을 별도로 만들어 앱을 최적화합니다.

- 여러 곳에서 공통으로 쓰이는 코드를 저장해 두기
- 모델을 좀 더 간결하게 만들기
    - 수백~수천 줄의 거대 모델(Fat Model)의 조짐이 보이면 헬퍼함수로 분리합니다.
    - 여러 모델에 걸친 로직의 경우
- 좀 더 손쉬운 테스팅: 모듈이 분리되면 테스팅도 손쉬워집니다.

<br>
### 장고 자체적인 유틸리티

**django.utils**, **django.contrib**, **django.core** 등 장고 내부적인 사용의 목적으로 제작된 유틸리티가 존재합니다.
장고 자체적인 예외처리, 직렬화/역직렬화 도구 등이 그것입니다.

각 유틸리티별 자세한 설명은 교재를 참고합시다^^ (p348~)

<br><br>
# 31장. 장고 프로젝트 배포 및 지속적 통합

<br>
### 

<br>
**<a href="{{ site.github.url }}/frameworks/2022/11/05/django-knowhow-02" target="_blank">[이전글]</a>**
