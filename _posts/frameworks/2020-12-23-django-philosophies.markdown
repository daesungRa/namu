---
title: "[번역] 장고의 디자인 철학"
created: 2020-12-23 20:25:27 +0900
updated: 2022-06-03 22:50:00 +0900
author: namu
categories: frameworks
permalink: "/frameworks/:year/:month/:day/:title"
image: https://miro.medium.com/max/875/1*KwSbyYyqaukruQVofd1HTQ.jpeg
alt: django image
image-view: true
image-author: Why you should use Django for your next project(Abdul Hafeez Abdul Raheem)
image-source: https://codeburst.io/why-you-should-use-django-for-your-next-project-83c775a750d1
---


---

### 목차

1. [장고의 디자인 철학](#장고의-디자인-철학)
    1. [Overall](#1-overall)
    2. [Models](#2-models)
    3. [Database API](#3-database-api)
    4. [URL design](#4-url-design)
    5. [Template system](#5-template-system)
    6. [Views](#6-views)
    7. [Cache Framework](#7-cache-framework)
2. [장고 모델을 활용한 모범 사례](#장고-모델을-활용한-모범-사례)
    1. [Correct Model Naming](#1-correct-model-naming)
    2. [Relationship Field Naming](#2-relationship-field-naming)

### 참조

- <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/"
target="_blank">Django Docs: Design philosophies</a>
- <a href="https://steelkiwi.com/blog/best-practices-working-django-models-python/"
target="_blank">Steel KIWI: Django best practices</a>

---

<br>
## <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/" target="_blank">장고의 디자인 철학</a>

장고의 디자인 철학은 무엇일까요?
**_<a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/" target="_blank">공식 페이지의 설명</a>_**을
참조해 봅시다.

> 이 문서는 프레임워크를 만들 때 장고 개발자들이 사용한 기초적인 철학에 대해 설명합니다.
> 이것의 목적은 과거에 대한 설명과 미래에 대한 가이드입니다.

<br>
### 1. <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/#overall" target="_blank">Overall</a>

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
### 2. <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/#models" target="_blank">Models</a>

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
### 3. <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/#database-api" target="_blank">Database API</a>

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
### 4. <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/#url-design" target="_blank">URL design</a>

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
**<a href="https://docs.djangoproject.com/en/4.0/ref/settings/#std:setting-APPEND_SLASH" target="_blank">APPEND_SLASH</a>**
설정의 이유입니다.

<br>
### 5. <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/#template-system" target="_blank">Template system</a>

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
<a href="https://docs.djangoproject.com/en/4.0/topics/templates/#template-language-intro" target="_blank">장고 템플릿 언어 (DTL)</a>는
향상된 로직을 회피하는 데 초점을 맞추고 있습니다.

장고 템플릿 시스템은 템플릿이 대부분 프로그래머가 아닌 디자이너에 의해 쓰여지기 때문에 파이썬 관련 지식을 포함하면 안 된다고 가정하고 있습니다.

#### 안전과 보안

템플릿 시스템은 데이테베이스의 레코드를 삭제하는 명령과 같은 악의적 코드를 포함할 수 없게 되어 있어야 합니다.

이것은 템플릿 시스템이 임의의 Python 코드를 실행할 수 없는 또다른 이유이기도 합니다.

#### 확장성

이 템플릿 시스템은 실력이 높은 템플릿 작성자가 기술을 확장할 수 있도록 합니다.

이는 커스텀 템플릿 태그와 필터에 있는 철학입니다.

<br>
### 6. <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/#views" target="_blank">Views</a>

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
### 7. <a href="https://docs.djangoproject.com/en/4.0/misc/design-philosophies/#cache-framework" target="_blank">Cache Framework</a>

장고의 캐시 프레임워크의 목표는 다음과 같습니다.

#### 적은 코드

캐시는 가능한 한 빨라야 합니다. 그래서 **get()** 연산과 같이 캐시를 감싸고 있는 모든 프레임워크의 백엔드 코드는 완전히 최소화되어야만 합니다.

#### 일관성

캐시 API는 서로 다른 캐시 백엔드 사이에서 일관성 있는 인터페이스를 제공해야 합니다.

#### 확장성

캐시 API는 개발자의 필요 하 어플리케이션 레벨 차원에서 확장 가능해야 합니다.(예를 들어,
<a href="https://docs.djangoproject.com/en/4.0/topics/cache/#cache-key-transformation" target="_blank">Cache key transformation</a>을 보십시오.)

<br>

<br>
## <a href="https://steelkiwi.com/blog/best-practices-working-django-models-python/" target="_blank">장고 모델을 활용한 모범 사례</a>

<br>
### 1. Correct Model Naming

모델 네이밍을 위해 **단수형 명사**를 사용하는 것이 권장됩니다.
(ex. _User_, _Post_, _Article_)

이는 **모델 이름의 마지막 부분은 명사여야 한다**는 의미입니다.
모델의 단위가 여러 객체의 정보를 포함하지 않을 때는 단수형 명사를 사용하는 것이 정확합니다.

<br>
### 2. Relationship Field Naming

_ForeignKey_ 나 _OneToOneKey_, _ManyToMany_ 와 같이 (객체 간) 관계성이 존재할 때는
때때로 **필드의 이름을 별도로 명명하는 것**이 더 좋습니다.

**_User_** 모델과 외래 키 관계에 있는 필드를 가진 **_Article_** 이라는 모델이 있다고 상상해 봅시다.
만약 이 필드가 기사(article)의 작성자(author) 정보를 포함한다면,
필드명을 **user** 로 하기보다는 **author** 로 하는 것이 더 적절합니다.

<br>
### 3. Correct Related-Name

**종속되는 모델에 쿼리셋(queryset)으로 제공**되는 경우,
해당 필드관련 정보 중 **related-name** 을 **복수로 지정하는 것이 합리적**입니다.

부디 적절한 **related-name** 을 지정하십시오. 대다수의 경우 모델의 이름을 복수로 지정하는 것이 맞습니다.
다음의 예시를 참조하십시오.

```python
class Owner(models.Model):
    pass


class Item(models.Model):
    owner = models.ForeignKey(Owner, related_name='items')  # <= 이 부분!
```

<br>
### 4. Do not use ForeignKey with unique=True

외래 키를 **unique=True** 설정과 함께 사용할 하등의 이유가 없습니다.
이 설정을 사용하는 _OneToOneField_ 의 케이스가 따로 존재합니다.

<br>
### 5. Attributes and Methods Order in a Model

모델 정의 시 선호되는 **속성값(attributes)과 메서드(methods)의 순서**는 다음과 같습니다.

- **constants** (for choices and other)
- **fields of the model**
- **custom manager indication**
- **_meta_**
- **_def \_\_unicode\_\__** (python 2) or **_def \_\_str\_\__** (python 3)
- **other special methods**
- **_def clean_**
- **_def save_**
- **_def get_absolute_url_**
- **other methods**

위의 순서는 공식 문서에서 가져왔으며 약간 확장되었다는 사실을 유념하시기 바랍니다.

<br>
### 6. Adding a Model via Migration

모델을 추가하는 경우, 모델 클래스를 생성한 후 **_makemigrations_ 와 _migrate_ 옵션과 함께 _manage.py_ 커맨드를 직렬로 실행**하십시오.
(장고 1.6 버전 이하라면 _South_ 를 활용하십시오.)

<br>
### 7. Denormalisations

관계형 데이터베이스에서 **생각 없이 비정규화를 사용해서는 안 됩**니다.
어떤 이유(e.g. 생산성의 이유)에서건 **당신이 의식적으로 데이터 비정규화를 하는 경우**를 제외하고는
언제나 **이것을 회피하고자** 노력하십시오.

데이터베이스 설계 단계에서 많은 데이터를 비정규화해야 한다는 것을 안 경우, **NoSQL** 을 사용하는 것은 좋은 선택입니다.
그러나 대부분의 데이터가 비정규화를 요하지 않는데 몇몇 데이터의 비정규화를 피할 수 없다면
관계 기반의 **JsonField** 활용을 고려해 보십시오.

<br>
### 8. BooleanField

**BooleanField** 를 위해 **null=True** 설정이나 **blank=True** 설정을 사용하지 마십시오.
대신 **기본값(default values)**을 지정하는 것이 더 좋습니다.

만약 필드에 **빈 값(empty)**을 허용해야 할 경우 **NullBooleanField** 를 사용하십시오.

<br>
### 9. Business Logic in Models

당신의 프로젝트를 위해 **비즈니스 로직을 넣을 최적의 장소는 모델, 즉 메서드 모델과 모델 매니저**입니다.
메서드 모델은 몇몇 메서드와 함수만을 유발할 수 있습니다.

만약 로직을 모델 내에 넣는 것이 불편하거나 불가능한 경우,
you need to replace its forms or serializers in tasks.

<br>
### 10. Field Duplication in ModelForm

별다른 이유 없이 **ModelForm** 또는 **ModelSerializer** 에서 모델 필드를 복제하지 마십시오.
**form** 이 모델의 모든 필드를 사용하도록 지정하려면 **MetaFields** 를 사용하십시오.
이 필드에서 변경할 사항이 없는 필드에 대한 위젯을 재정의하고자 할 경우,
**Meta widget** 을 사용하여 위젯을 표시하십시오.

<br>
### 11. Do not use ObjectDoesNotExist

**ObjectDoesNotExist** 대신 **ModelName.DoesNotExist** 를 사용하는 것은 더욱 전문화화된 예외처리 방식이며 좋은 용례입니다.

<br>
### 12. Use of choices

**choices** 사용 시 다음의 내용들이 권장됩니다.

- 데이터베이스에서 **숫자 대신 문자열**을 유지하십시오
(optional(선택을 요하는) 데이터베이스 사용의 관점에서 이것이 가장 좋은 선택지는 아니지만,
REST 프레임워크 내부에서 보다 명확한 필터로 옵션 가져오기를 가능하게 하는 **문자열이 더 설명적**이므로 실제 사례에서는 더 편리합니다.)
- (Choices) 변형들을 저장하기 위한 변수(모델 클래스 내 필드)는 상수입니다. 따라서 **대문자(uppercase) 로 표현**되어야 합니다.
- 필드 목록이 정의되기 이전에 이러한 변형들을 정의하십시오
- (Choices) 변형값들이 상태(statuses)의 목록일 경우,
시간적인 순서에 따라 정의하십시오 (e.g. _new_, _in_progress_, _completed_)
- **model_utils** 라이브러리로부터 **Choices** 를 사용할 수 있습니다

다음은 **Article** 모델의 예시입니다.

```python
from model_utils import Choices


class Article(model.Model):
    STATUSES = Choices(
        (0, 'draft', _('draft')),
        (1, 'published', _('published')),
    )
    status = models.IntegerField(choices=STATUSES, default=STATUSES.draft)
    ...
```

<br>
### 13. Why do you need an extra .all()?

**ORM** 사용 시, _filter()_, _count()_ 등 이전에 추가적인 _all_ 메서드 호출을 추가하지 마십시오.

<br>
### 14. Many flags in a model?

정당화가 가능하다면, **여러 _BooleanFields_ 를 status 와 같은 하나의 필드로 교체**하십시오.

```python
class Article(models.Model):
    is_published = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    ...
```

article 을 먼저 체크하여 **_is_verified_ 값이 _True_ 로 지정된 다음
_published_ 되도록** 우리의 어플리케이션 로직이 구성되었다고 가정해 봅시다.
당신은 체크 이전에는 기사가 출판되지 못한다는 것을 알게 됩니다.

이 때는 **전체적으로 (_new_, _checked_, _published_) 세 종류의 조건**이 있는데,
이 중 **(_checked_, _published_) 두 개의 boolean 필드에 대한 4개의 가능한 조합**이 존재하게 되고,
당신은 이 중 **잘못된 조합이 형성된 article 이 없는지 확인해야**만 합니다.

바로 이 점이 **두 개의 boolean 필드 대신에 하나의 상태 필드를 사용하는 것이 더 나은 선택지인 이유**입니다.

```python
from model_utils import Choices


class Article(models.Model):
    STATUSES = Choices('new', 'verified', 'published')
    
    status = models.IntegerField(choices=STATUSES, default=STATUSES.new)
    ...
```

이 예시가 그렇게까지 적절하지는 않을 수도 있지만, 모델에 이런 boolean 필드들이 세 개 혹은 더 많이 존재한다고 생각했을 때,
**필드값 조합에 대한 유효성을 일일히 관리하는 것은 정말로 귀찮은 작업**이 될 수 있습니다.

<br>
### 15. Redundant model name in a field name

꼭 그렇게 해야 하는 이유가 있는게 아니라면 **모델의 이름을 필드명에 더하지 마십**시오.

예를 들어 _User_ 테이블에 _user_status_ 필드가 있다면,
이 모델에 별도의 다른 상태가 있지 않는 한 **당신은 필드의 이름을 _status_ 로 변경**해줘야 합니다.

<br>
### 16. Dirty data should not be found in a base

_IntegerField_ 를 사용하는 것이 의미가 있는 경우가 아니라면
**언제나 _IntegerField_ 대신에 _PositiveIntegerField_ 를 사용**하십시오.
왜냐하면 **"나쁜" 데이터가 들어가서는 안 되기 때문**입니다.

이와 같은 이유로 논리적으로 유일성(unique)을 갖는 데이터에 **_unique_**, **_unique_together_** 를 항상 사용해야 하며,
이 때는 모든 필드에 **required=False** 설정을 사용해서는 절대 안 됩니다.

<br>
### 17. Getting the earliest/latest object

**_order_by('created')[0]_** 대신에 **_ModelName.objects.earliest('created'/'earliest')_** 를 사용할 수 있으며,
모델의 **_Meta_** 클래스의 **_get_latest_by_** 값으로 정렬할 필드명을 삽입할 수 있습니다.
이 경우, object 조회 시 별도의 인수를 투입하지 않는다면 **_get_lasted_by_** 에 지정한 필드 기준으로 정렬된 결과의
**latest/earliest** 행을 반환합니다.

**latest/earliest** 뿐 아니라 **get** 도 _DoesNotExist_ 예외를 유발할 수 있다는 점을 유념하십시오.
따라서 **_order_by('created').first()_** 가 가장 유용한 방법입니다.

```python
from datetime import datetime


class Article(models.Model):
    title = models.CharField(max_length=200, blank=True)
    content = models.TextField(blank=True)
    pub_date = models.DateTimeField('date published', default=datetime.utcnow)
    
    class Meta:
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'
        get_latest_by = '-pub_date'  # descending order

    ...


# Prints the latest row with no arguments.
# Resulted rows are sorted by 'pub_date' specified in 'get_latest_by' in 'Meta' class.
print(Article.objects.latest())
```

<br>
### 18. Never make len(queryset)

쿼리셋의 객체들의 총량을 구하기 위해 **_len_** 을 사용하지 마십시오.
이 목적으로 **_count_** 메서드를 사용할 수 있습니다.

**```len(ModelName.objects.all())```** 와 같이 사용하는 경우 가장 먼저 테이블의 모든 데이터를 조회하는 쿼리가 수행되고,
그 결과값이 파이썬 객체로 변환된 후 **_len_** 함수에 의해 객체의 길이를 확인하는 과정을 거치므로 매우 권장되지 않습니다.

반면 **_count_** 메서드는 SQL 함수인 **COUNT()** 와 바로 연동되므로 데이터베이스에서 더욱 간단한 쿼리가 수행됩니다.
그리고 파이썬 코드 성능상 더 적은 리소스많이 요구됩니다.

<br>
### 19. _if queryset_ is a bad idea

boolean 값으로 쿼리셋을 사용하지 마십시오.
**_if queryset: do something_** 대신에 **_if queryset.exists(): do something_** 형식의 구문을 사용하십시오.

쿼리셋은 **게으르게(lazy)** 동작하기 때문에 이것을 boolean 값으로 사용할 경우
데이터베이스에서 부적절한 쿼리가 수행된다는 사실을 기억하십시오.

> #### lazy 의 의미
> 특정 코드의 수행 결과 생성되는 **객체의 모든 데이터를 한 번에 구하는 것**보다
> 각각 **필요할 때에만 따로 구해오는 것**이 성능 면에서 유리한 경우가 있습니다.
> 
> 파이썬에서는 이를 위해 **제너레이터(generator)**와 같은 방식으로 게으른(lazy) 코드를 구현합니다.
> 제너레이터는 보통 **yield** 키워드를 통해 반복문의 각 루프마다 개별적인 데이터를 반환합니다.
>
> 위에서 설명한 쿼리셋도 게으르게(lazy) 동작한다고 했으므로,
> if 문의 조건절에 그대로 사용한다면 **True or False 의 조건을 완벽하게 보장할 수 없습**니다.
> **_queryset.exists()_** 메서드를 사용하면 객체의 존재 유무를 파악하는 기능이 즉시 실행되므로 보장된 조건을 제공할 수 있습니다.

<br>
### 20. Using help_text as documentation

모델의 필드에 _help_text_ 를 문서(documentation)의 일부분으로 사용한다면
당신과 동료 및 관리자가 데이터 구조에 대해 확실히 쉽게 이해할 수 있습니다.

<br>
### 21. Money Information Storage

돈의 액수에 대한 정보를 저장하기 위해 **_FloatField_ 를 사용하지 마십**시오.
대신에 **_DecimalField_** 를 사용하십시오.
또한 이러한 정보를 cents, units 등으로 유지할 수도 있습니다.

<br>
### 22. Don't use null=true if you don't need it

- **null=True**: 데이터베이스 컬럼에 영향. 컬럼이 **NULL** 값을 허용함
- **blank=True**: Django 모델 폼의 유효성 체크에 영향. **공백**을 허용함. 데이터베이스 제약과는 무관

문자 기반의 필드(_CharField_, _TextField_)에 대해 빈 값(empty)을 허용하기 위해서
데이터베이스 제약조건 관점의 **null=True** 옵션을 지정한다면
해당 컬럼에는 NULL 과 공백 문자열 중 하나가 구분 없이 저장될 가능성이 있습니다.
그러므로 일반적으로는 **null=True 옵션을 사용하지 말아야** 합니다.

장고에서는 빈 값(empty)으로 **NULL 보다는 공백 문자열만 사용하는 것**을 권장합니다.
따라서 **blank=True**, **default=''** 와 같이 복합적으로 옵션을 지정하도록 합시다.<br>
(별도 지정 없을 시 기본 설정은 **null=False**, **blank=False** 입니다.)

> #### 예외적인 경우
> 문자 기반 필드에 예외적으로 **null=True** 를 사용하는 경우가 존재합니다.<br>
> 바로 **blank=True** 옵션과 함께 **unique=True** 옵션이 지정될 때인데,
> 이때는 여러 객체에 존재하는 중복되는 공백 문자열에 의한 **unique constraint violations** 이 발생할 수 있는데,
> 이를 피하기 위해 **null=True** 옵션을 지정하여 빈 값으로 **NULL** 이 삽입되도록 해야 합니다.

문자 기반의 필드가 아닌 경우 **null=True** 를 사용하고자 한다면 **blank=True** 옵션도 함께 설정해야 합니다.
null 설정은 데이터베이스 레벨에만 영향을 미치기 때문에 **그 이전 단계인 모델 폼 레벨에서 빈 데이터를 입력**받아야 하기 때문입니다.

<br>
### 23. Remove _id

_ForeignKeyField_ 와 _OneToOneField_ 의 접미사에 **\_id** 를 추가하지 마십시오.

<br>
### 24. Define __unicode__ or __str__

모든 추상화되지 않은 모델에는 **\_\_unicode\_\_** (python 2) 또는 **\_\_str\_\_** (python 3) 메서드를 추가하십시오.
이러한 메서드는 항상 문자열을 반환해야 하는데, 이것은 파이썬 클래스 객체를 설명합니다.

<br>
### 25. Transparent fields list

_ModelForm_ 에서 모델 필드의 목록을 설명하기 위해 _Meta.exclude_ 를 사용하지 마십시오.
이를 위해 **필드의 목록을 투명하게(transparent) 만들도록 _Meta.fields_ 를 사용하는 것**이 더 낫습니다.
위와 같은 목적으로 _Meta.fields="\_\_all\_\_"_ 를 사용하지 마십시오.

<br>
### 26. Do not heap all files loaded by user in the same folder

사용자가 로드한 모든 파일을 동일한 폴더에 넣지(heap, 쌓아두지) 말 것.

때때로 많은 양의 다운로드 파일이 예상되는 경우, _FileField_ 별로 분리된 폴더만으로는 충분하지 않을 때가 있습니다.
(ex. **account/avatars/**)
많은 파일을 하나의 폴더에 저장한다는 것은 파일 시스템이 필요한 파일을 더 느리게 검색한다는 것을 의미합니다.
이러한 문제를 피하기 위해, 다음을 참조하세요.

```python
import os
from datetime import datetime


def get_upload_avatar_path(instance, filename):
    return os.path.join('account/avatars/', datetime.now().date().strftime('%Y-%m-%d'), filename)


class User(AbstractUser):
    avatar = models.ImageField(blank=True, upload_to=get_upload_path)
```

**get_upload_avatar_path** 함수는 일자별로 별도의 하위 디렉토리를 생성하여 **filename** 과 조합된 업로드 경로를 반환하여
위와 같은 이슈를 회피합니다.

<br>
### 27. Use abstract models

**모델 간 공유되는 어떤 로직**이 필요한 경우 **추상화 모델을 사용**하세요.

객체의 생성일, 수정일, 삭제일 등 날짜 필드를 기본적으로 공유하는 추상 모델을 생성하는 것이 대표적인 예입니다.

```python
class CreatedAtModel(models.Model):
    created_at = models.DateTimeField(
        verbose_name=u"Created at",
        auto_now_add=True,
    )
    
    class Meta:
        abstract=True


class Post(CreatedAtModel):
    ...


class Comment(CreatedAtModel):
    ...
```

추상 모델인 **CreatedAtModel** 에는 날짜형 컬럼인 **created_at** 필드가 정의되어
이것을 상속받은 **Post**, **Comment** 모델에서 공유됩니다.

<br>
### 28. Use custom Manager and QuerySet

작업하는 프로젝트의 규모가 클수록 당신은 같은 코드를 다른 장소에서 반복하게 됩니다.
당신은 당신의 코드를 **DRY(Don't repeat yourself)** 하게 유지하면서 모델 내 비즈니스 로직에 첨가하기 위해
**custom Manager** 와 **custom Queryset** 을 사용할 수 있습니다.

예를 들어 포스트의 댓글 개수를 가져와야 하는 경우 다음과 같이 커스텀 매니저를 생성합니다.

```python
class CustomManager(models.Manager):
    def with_comments_counter(self):
        return self.get_queryset().annotate(comments_count=Count('comment_set'))
```

그리고 이렇게 사용합니다.

```python
posts = Post.objects.with_comments_counter()
posts[0].comments_count
```

만약 이 메서드를 다른 쿼리셋 메서드와 연계해서 사용하고자 하는 경우 커스텀 쿼리셋을 사용합니다.

```python
class CustomQuerySet(models.query.QuerySet):
    """Substitution the QuerySet, and adding additional methods to QuerySet"""

    def with_comments_counter(self):
        """Adds comments counter to queryset"""
        return self.annotate(comments_count=Count('comment_set'))
```

다음과 같이 사용합니다.

```python
posts = Post.objects.filter(...).with_comments_counter()
posts[0].comments_count
```
