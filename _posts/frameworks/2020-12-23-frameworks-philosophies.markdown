---
title: "[번역] 장고의 디자인 철학"
created: 2020-12-23 20:25:27 +0900
updated: 2020-12-23 20:25:27 +0900
author: namu
categories: frameworks
permalink: "/frameworks/:year/:month/:day/:title"
image: https://miro.medium.com/max/875/1*KwSbyYyqaukruQVofd1HTQ.jpeg
image-view: true
image-author: Why you should use Django for your next project(Abdul Hafeez Abdul Raheem)
image-source: https://codeburst.io/why-you-should-use-django-for-your-next-project-83c775a750d1
---


---

[순서]

1. [Overall](#overall)
2. [Models](#models)
3. [Database API](#database-api)
4. [URL design](#url-design)
5. [Template system](#template-system)
6. [Views](#views)
7. [Cache Framework](#cache-framework)

---

<br>
## 들어가며

장고의 디자인 철학은 무엇일까요?
**_<a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/" target="_blank">공식 페이지의 설명</a>_**을
참조해 봅시다.

> 이 문서는 프레임워크를 만들 때 장고 개발자들이 사용한 기초적인 철학에 대해 설명합니다.
> 이것의 목적은 과거에 대한 설명과 미래에 대한 가이드입니다.

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#overall" target="_blank">Overall</a>

#### 낮은 결합도

장고 스택의 기본적 목표는
<a href="http://wiki.c2.com/?CouplingAndCohesion" target="_blank">결합도를 낮추고 응집도를 높이는</a> 데 있습니다.
프레임워크의 다양한 계층들은 각각 서로간에 대해서 알지("know") 못합니다. 심지어 그런 것이 필요하다고 해도 말입니다.

예를 들어, 템플릿 시스템은 웹 리퀘스트에 대해서 아무것도 알지 못하고 데이터베이스 계층은 데이터가 어떻게 표현되는지 알지 못하며,
뷰 시스템은 프로그래머가 어떤 템플릿 시스템을 사용하는지 신경쓰지 않습니다.

비록 장고가 편의를 위해서 풀 스택의 기능을 제공한다고 하더라도, 각각의 스택 부분들은 어디에 있든지 서로 독립적입니다.

#### 적은 코드

장고 앱은 가능한 한 적은 코드를 사용하며,
<a href="https://brunch.co.kr/@kooslab/144" target="_blank">boilerplate</a>
를 줄입니다.<small>(boilerplate. 재사용 가능한 코드셋이나 프로그램. 역주)</small>
장고는 <a href="https://www.geeksforgeeks.org/code-introspection-in-python/" target="_blank">introspection</a>
과 같이 파이썬의 동적 적합성의 이점을 최대한 활용합니다.<small>(introspection. 파이썬에서 런타임 동적 타입관리 기능을 의미. 역주)</small>

#### 빠른 개발

21세기 웹 프레임워크의 핵심은 웹 개발의 지루한 측면을 빠르게 하는 것입니다. 장고는 웹 개발이 놀라울 정도로 빠르도록 만듭니다.

#### 반복하지 않는 것 (DRY)

모든 특정 개념 또는 데이터는 한 번에 한 곳에만 존재해야 합니다. 반복되는 것은 좋지 않고, 정규화(normalization)는 좋습니다.

그런 이유에서 이 프레임워크는 가능한 한 적은 것으로부터 가능한 한 많은 것들을 연역해야 합니다.(최소한의 모듈로 최대한의 효율을 내야합니다.)

> See also
>> The <a href="http://wiki.c2.com/?DontRepeatYourself" target="_blank">discussion of DRY on the Portland Pattern Repository</a>

#### 명시적인 것인 암묵적인 것보다 낫습니다

이것은 **<a href="https://www.python.org/dev/peps/pep-0020" target="_blank">PEP 20</a>**에 나와 있는 파이썬 핵심 원리이며,
장고가 너무 많은 "마법<small>magic</small>"을 부리지 말라는 것을 의미합니다. 이 마법은 정말 합당한 이유 없이는 발생해서는 안됩니다.
마법은 다른 방식으로는 얻을 수 없는 매우 큰 이점이 있는 경우에만 사용가치가 있으며,
그것을 기능을 배우고자 하는 개발자들로 하여금 혼란을 일으키는 방식으로 구현되어서는 안 됩니다.

#### 일관성

이 프레임워크는 모든 레벨에서 일관적이어야 합니다.
일관성은 로우레벨(파이썬 코딩 스타일)에서부터 하이레벨(장고 사용의 "경험")에 이르기까지 모든 부분에 걸쳐 적용됩니다.

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#models" target="_blank">Models</a>

#### 명시적인 것이 암묵적인 것보다 낫습니다

필드는 그것의 이름 하나에만 기반하여 특정 동작을 수행하도록 가정되어서는 안 됩니다.
이것은 시스템에 대한 너무 많은 지식을 요구하며 에러를 양산하기 쉽습니다.
이 대신에 필드의 동작은 키워드 인자(keyword arguments)나, 경우에 따라 필드의 타입에 기반하도록 해야 합니다.

#### 모든 관련된 도메인 로직을 포함해야 합니다

_Martin Fowler_의 **<a href="https://www.martinfowler.com/eaaCatalog/activeRecord.html" target="_blank">Active Record</a>**
디자인 패턴에 따르면, 모델<small>Models</small>은 객체의 모든 관점에서 캡슐화되어야 합니다.

이것은 모델에 의해 표현되는 데이터와 그것의 정보적 측면(사람이 읽을 수 있는 이름, 기본 정렬과 같은 옵션 등)
모두가 모델의 클래스에 정의되는 것의 이유입니다. 모델에 의해 제공되는 이해를 필요로 하는 모든 정보는 모델 내에 있어야 합니다.

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#database-api" target="_blank">Database API</a>

데이터메이스 API의 핵심 목표는 다음과 같습니다.

#### SQL 효율성

이는 가장 적은 시간 내에 SQL 구문을 실행하며, 내부적으로 구문에 최적화되어야 한다는 것을 뜻합니다.

또한 이 프레임워크가 저장하는 동작을 뒤에서 조용하게 처리하는 것보다 개발자가 **save()** 메서드를 명시적으로 호출하도록 하는 것의 이유입니다.

그리고 이것은 **select_related() QuerySet** 메서드가 존재하는 것의 이유입니다. "모든 관련된 객체"를 셀렉팅하는 일반적인 경우에 있어서
성능을 향상시키는 옵션이 됩니다.

#### 간결하고 강력한 문법

이 데이터베이스 API는 가능한 한 적은 문법을 가지고 풍부하고 표현력 있는 구문을 허용해야 합니다.
다른 모델들이나 헬퍼 객체를 임포팅하는 데 의존해서는 안 됩니다.

조인<small>Joins</small> 문법은 필요하다면 뒤에서 자동으로 처리되어야 합니다.

모든 객체는 시스템 전체에 걸쳐 관련된 모든 객체에 접근할 수 있어야 합니다. 이러한 접근은 객체 쌍방간에 동일하게 일어나야 합니다.

#### 필요한 경우 raw SQL에 직접 명령을 전달하는 것이 용이해야 합니다.

이 데이터베이스 API는 축약 명령을 이해하지만 그것만이 전부여서는 안 됩니다. 이 프레임워크는 커스텀 SQL 작성이 용이하도록 해야 합니다.
커스텀 SQL은 구문 전체일수도 있고, 단지 API 호출 시 파라미터로 전달되는 커스텀 **WHERE**절일 수도 있습니다.

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#url-design" target="_blank">URL design</a>

#### 느슨한 결합도

장고 앱의 URL은 하위의 파이썬 코드와 결합되어서는 안 됩니다. 파이썬 함수 이름을 URL로 입력하는 것은 나쁘고 못생긴 방식입니다.

장고 URL 시스템은 같은 app에 대한 URL이 서로 다른 문맥 상에서 다르게 적용되도록 할수 있습니다. 예를 들어 한 사이트에서는 stories 를
**/stories/**로, 다른 곳에서는 **/news/**로 적용할 수 있습니다.

#### 무한한 유연함

URL은 가능한 한 유연해야 합니다. 상상할 수 있는 어떤 URL 디자인도 허용됩니다.

#### 최적의 사용례를 장려합니다

이 프레임워크는 개발자로 하여금 못생긴 URL 방식보다는 예쁜 URL 방식으로 디자인하기 쉽도록 합니다.

웹 페이지 URL에 있는 파일 확장자는 지양되어야 합니다.

URL에 있는 Vignette-style 콤마는 벌받아 마땅합니다.

#### 명확한 URL

기술적으로 **foo.com/bar**와 **foo.com/bar/**는 서로 다른 URL이며, 검색 엔진 로봇이나 몇몇 웹 트래픽 분석 도구들은 이것들을
분리된 페이지로 다룹니다. 검색 엔진 로봇이 혼동하지 않도록 장고는 URL 정규화를 위해 노력해야 합니다.

이것이
**<a href="https://docs.djangoproject.com/en/3.1/ref/settings/#std:setting-APPEND_SLASH" target="_blank">APPEND_SLASH</a>**
설정의 이유입니다.

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#template-system" target="_blank">Template system</a>

#### 표현과 로직을 분리합니다

우리는 템플릿 시스템을 표현과 표현 관련 로직을 관리하는 도구로써만 보고 있습니다.
이 템플릿 시스템은 이러한 기본 목적을 넘어서는 기능을 지원해서는 안 됩니다.

#### 중복 방지

대다수의 다이나믹 웹사이트는 통합 header, footer, navigation bar 등 일련의 사이트 공통 디자인을 사용합니다.
장고 템플릿 시스템은 하나의 장소에 그러한 요소들을 저장하는 데 용이하며 중복 코드를 제거하도록 해야 합니다.

#### HTML과 분리되도록 해야 합니다

이 템플릿 시스템은 HTML만을 출력하도록 디자인되지 않았습니다.
이것은 다른 텍스트 기반 포맷이나 일반 텍스트를 생성하는 데도 문제가 없어야 합니다.

#### XML이 템플릿 언어로 사용되면 안 됩니다

템플릿을 해석하는 데 XML 엔진을 사용하면 템플릿 편집에 있어서 에러가 발생하기 쉽고,
템플릿 분석 과정에서 수용 불가능한 과부하가 발생합니다.

#### 디자이너가 코딩 능력이 있을 것으로 가정합니다

이 템플릿 시스템은 드림위버와 같은 위지윅 에디터에서 템플릿이 필수적으로 정확하게 표현될 것으로 생각하고 디자인되지 않았습니다.
거기에는 너무나도 심각한 제약이 있고, 문법이 적절하게 존재할 수 없다는 이유가 있습니다.
장고는 템플릿 작성자가 직접 HTML을 편집하는 데 문제가 없을 것이라고 기대합니다.

#### 공백을 분명하게 다룰 것

이 템플릿 시스템은 공백을 가지고 마법을 일으켜서는 안 됩니다.
템플릿이 공백을 포함하고 있다면, 시스템은 그것을 단순히 나타내기만 하는 것처럼 텍스트 다루듯이 다뤄야 합니다.
템플릿 태그에 있지 않은 어떠한 공백이든지 단순히 표현되어야만 합니다.

#### 프로그래밍 언어를 발명하지 마십시오

목표는 프로그래밍 언어를 발명하는 것이 아닙니다. 목표는 분기와 반복과 같이 프로그래밍적 기능을 제공하는 것뿐이며,
이는 기본적으로 표현과 관련된 것들을 만드는 데 쓰입니다.
<a href="https://docs.djangoproject.com/en/3.1/topics/templates/#template-language-intro" target="_blank">장고 템플릿 언어 (DTL)</a>는
향상된 로직을 회피하는 데 초점을 맞추고 있습니다.

장고 템플릿 시스템은 템플릿이 대부분 프로그래머가 아닌 디자이너에 의해 쓰여지기 때문에 파이썬 관련 지식을 포함하면 안 된다고 가정하고 있습니다.

#### 안전과 보안

템플릿 시스템은 데이테베이스의 레코드를 삭제하는 명령과 같은 악의적 코드를 포함할 수 없게 되어 있어야 합니다.

이것은 템플릿 시스템이 임의의 Python 코드를 실행할 수 없는 또다른 이유이기도 합니다.

#### 확장성

이 템플릿 시스템은 실력이 높은 템플릿 작성자가 기술을 확장할 수 있도록 합니다.

이는 커스텀 템플릿 태그와 필터에 있는 철학입니다.

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#views" target="_blank">Views</a>

#### 단순성

뷰를 작성하는 것은 파이썬 함수를 작성하는 것만큼 단순해야 합니다. 개발자들은 함수로 충분하다면 굳이 클리스를 인스턴스화할 필요가 없습니다.

#### request 객체를 사용

뷰는 request 객체에 접근해야 합니다. 이 객체는 현재 요청에 대한 metadata를 저장하며,
뷰 함수가 전역변수에 있는 요청 데이터에 접근하는 방식보다는 뷰 함수 자체에 직접적으로 전달되어야 합니다.
이는 "가짜" request 객체를 전달함으로써 가볍고 깔끔하고 편리하게 뷰를 테스트할 수 있도록 합니다.

#### 느슨한 결합도

뷰는 개발자가 어떤 템플릿 시스템을 사용하는지 신경쓰지 않아야 합니다.
또는 템플릿 시스템 자체가 쓰이고 있는지에 대해서도 관여하지 않아야 합니다.

#### GET과 POST를 구분해야 합니다

GET과 POST는 명확합니다. 개발자는 둘 중 하나를 명시적으로 사용해야 합니다.
이 프레임워크는 GET과 POST 데이터가 쉽게 구별될 수 있도록 해야 합니다.

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#cache-framework" target="_blank">Cache Framework</a>

장고의 캐시 프레임워크의 목표는 다음과 같습니다.

#### 적은 코드

캐시는 가능한 한 빨라야 합니다. 그래서 **get()** 연산과 같이 캐시를 감싸고 있는 모든 프레임워크의 백엔드 코드는 완전히 최소화되어야만 합니다.

#### 일관성

캐시 API는 서로 다른 캐시 백엔드 사이에서 일관성 있는 인터페이스를 제공해야 합니다.

#### 확장성

캐시 API는 개발자의 필요 하 어플리케이션 레벨 차원에서 확장 가능해야 합니다.(예를 들어,
<a href="https://docs.djangoproject.com/en/3.1/topics/cache/#cache-key-transformation" target="_blank">Cache key transformation</a>을 보십시오.)
