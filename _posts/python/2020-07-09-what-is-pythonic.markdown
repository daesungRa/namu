---
title: what does pythonic mean??
date: 2020-07-09 21:30:00 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: pythonic_x.jpg
image-view: true
image-author: none
image-source: ''
---


---

[목차]

1. [들어가며](#들어가며)
2. [파이썬의 철학, PEP8](#파이썬의-철학)
3. [파이썬스러운 코드의 장점](#파이썬스러운-코드의-장점)
4. [인덱스와 슬라이스](#인덱스와-슬라이스)
5. [접근제한자](#접근제한자)
6. [프로퍼티](#프로퍼티)
7. [리펙토링의 냄새가 나는 경우](#리펙토링의-냄새가-나는-경우)

---

<br>

### 들어가며

파이썬으로 개발하다 보면 코드를 **파이썬스럽게** 작성해야 한다는 말을 심심치 않게 듣는다.
물론 개발환경이나 개인의 선택에 따라 파이썬스러울 수도, 아닐 수도 있겠지만,
일단은 파이썬스럽다는 것의 의미를 아는 것이 먼저일 것이다.

### 파이썬의 철학

아무래도 파이썬을 사용한다면 파이썬스럽게 코드를 짜는 것이 여러 가지 면에서 효과적이지 않을까?<br>
그것을 알아보기 위해 다음을 실행해보자.

{% gist daesungRa/810b1dc18e80f6baeb7e77358a0778a3 %}
{% gist daesungRa/eb6e653a107e909d9a716ae40e200cff %}

이것은 python main contributor 인 팀 피터스([Tim peters](https://en.wikipedia.org/wiki/Tim_Peters_(software_engineer)))가
작성한 파이썬 철학이다. ([The zen of python by Tim peters](https://www.python.org/dev/peps/pep-0020/#id2))

위 내용들을 쭉 읽어가다 보면 파이썬스럽다는 것은
**명료성, 단순성, 가독성, 규칙성, 일관성, 설명성** 등의 가치를 내포한다는 것을 알 수 있다.

### PEP8

파이썬 철학을 담고 있는 표준은 [**```PEP8```**](https://www.python.org/dev/peps/pep-0008/)이다.
여기서 다 살펴볼 수는 없으므로, 몇 가지만 짚어보자.

- [Tabs or Spaces?](https://www.python.org/dev/peps/pep-0008/#id18)
    - 들여쓰기로는 Spaces 를 쓰는 것이 좋다.
    - Tabs 는 이미 tabs 로 작성되어 있는 코드에 한해서만 오직 일관성 유지를 위해 사용되어야 한다.
    - Python 3 는 들여쓰기로 tabs 와 spaces 를 혼용하는 것을 허용하지 않는다.
    그러므로 tabs 와 spaces 가 혼합되어 들여쓰기된 Python 2 코드는 spaces 만 쓰이도록 변환되어야 한다.
    - -t 옵션과 함께 Python 2 인터프리터를 실행하면, tabs 와 spaces 를 문법에 맞지 않게 혼용했다는 warnings 를 발생시킨다.
    - -tt 를 사용하면, 이러한 warnings 는 errors 가 된다. 이러한 옵션들은 매우 권장된다!

- [Documentation Strings](https://www.python.org/dev/peps/pep-0008/#id33)
    - 좋은 documentation strings(a.k.a "docstrings")를 위한 컨벤션은 [PEP 257](https://www.python.org/dev/peps/pep-0257)에
    있다.
    - 모든 public 모듈, 함수, 클래스, 메서드에 ```docstring```을 쓸것. ```Docstring```은 public이 아닌 메서드에서 필수는 아니지만,
    그 메서드가 어떤 동작을 하는지를 설명하는 주석을 달아야 한다. 이 주석은 ```def``` 라인 이후에 나타나야 한다.
    - [PEP 257](https://www.python.org/dev/peps/pep-0257)는 좋은 ```docstring``` 규칙을 설명한다. 특히, 여러 줄로 이루어진
    ```docstring```의 종료지점으로 쓰이는 ```double-triple quotation```이 개별 라인으로 존재해야 한다는 사실을 유념할 것.
    
    {% gist daesungRa/24b53f0b0100f86b6da59aebf964da3a %}

- [Package and Module Names](https://www.python.org/dev/peps/pep-0008/#id40)
    - 모듈은 짧은 ```all-lowercase``` 이름을 갖는다.
    그리고 모듈명의 가독성을 높이기 위해서 밑줄```Underscores```을 사용할 수 있다.
    파이썬 패키지 또한 짧은 ```all-lowercase``` 이름을 짓되, 밑줄```Underscores```은 가급적 사용하지 않는 것이 좋다.
    - C 혹은 C++로 쓰여진 확장모듈이 고수준의 인터페이스를 제공하는 추가적인 파이썬 모듈을 포함할 시(e.g more object oriented),
    이 C/C++ 모듈은 ```leading underscore``` 를 갖는다(e.g _socket).

### 파이썬스러운 코드의 장점

코드 작성 시 권장사항을 따른다는 것(파이썬스럽게 코딩한다는 것)은 위에서 살펴본
[철학](#파이썬의-철학)이 반영되는 것으로, 보통 더 나은 성능을 낸다. 또한 코드도 더 작고 이해하기 쉽다.
무엇보다 전체 개발팀이 동일한 패턴과 구조에 익숙해지면서 실수를 줄이고 문제의 본질에 보다 집중할 수 있다.

그럼 이제 파이썬스러운 코드의 몇 가지 특징들을 살펴보자.

### 인덱스와 슬라이스

1. list 의 마지막 요소 가져오기
    - C에서는 배열 길이에서 1을 뺀 위치의 요소를 가져오지만, 파이썬에서는 음수 인덱스를 활용한다.
    {% gist daesungRa/c2e994a381df6f585b7ee7d07d88cece %}
2. slice 활용하기 (시작:끝:간격)
    - 2번 인덱스(3번째 인덱스)로부터 8번 인덱스(9번째 인덱스) 이전까지 slicing 은 다음과 같이 한다.
    (두번재 파라미터는 **이전까지**인 점 주의)
    {% gist daesungRa/4981cb0c5158ba41a5ca4fde5e918d38 %}
    - 2번 인덱스(3번째 인덱스)로부터 8번 인덱스(9번째 인덱스) 이전까지 2칸 간격으로 slicing 은 다음과 같이 한다.
    {% gist daesungRa/bead75ec1b8da55ff1eaf0d87e8225e6 %}
    - 각 파라미터는 생략 가능하다
    {% gist daesungRa/c189d0331afcdea26e80b43728b46399 %}
    - slice 는 파이썬 객체이다. 그러므로, 별도로 빌드하여 전달할 수도 있다.
    {% gist daesungRa/7597b01061e3cfdefd3983e69c7a42b2 %}

### 접근제한자

다른 언어들은 ```public```, ```private```, ```protected``` 등의 접근제한자를 가지지만,
파이썬의 모든 객체 프로퍼티와 함수의 속성은 ```public```이다. 다만 밑줄```underscore```로 시작하는 속성은 ```private```을
의미하기는 하지만, 문법상 **강제되지는 않는다.**

{% gist daesungRa/df4f6ba7eb45738fb2910b7c919a1636 %}

학생 점수 평균을 구하는 ```Score``` 클래스에서 _avg 속성은 ```private```으로 표현되지만, 외부에서 직접 접근은 가능하다.
이는 기본적으로 모든 객체의 속성과 함수는 ```public``` 이라는 파이썬의 특성을 반영한 결과이다.
따라서 개발자는 밑줄```underscore```을 통해 해당 속성이 ```private```으로 활용되고 있음을 인지해야 한다.


- 간혹 밑줄 두개로 private 속성을 정의할 수 있다고 착각할 수 있는데, 이는 클래스 확장시 각 클래스 고유의 속성이나 메서드를
특정하기 위한 [name mangling](https://www.geeksforgeeks.org/name-mangling-in-python/)의 방식이다.

### 프로퍼티

파이썬 객체의 속성```attribute```에 직접적인 접근을 차단하면서 부가적인 로직과 함께 간접접근하도록 하려면
[**프로퍼티**```@property```](https://www.programiz.com/python-programming/property)를 사용한다.
(```@property```는 [python decorator]() 이다.)

{% gist daesungRa/01707acb9d201099335424374b939904 %}

밑줄을 사용함으로써 이메일 값은 객체의 ```private```타입 속성으로 정의되었다.

자바에서는 이러한 속성에 ```getter and setter```메서드를 직접 생성하여 접근에 제한을 두지만,
파이썬에서는 프로퍼티 데코레이터를 활용하여 보다 간결하고 명시적으로 동일한 작업을 진행할 수 있다.
출력은 다음과 같다.

{% gist daesungRa/3ea1fe937ca899b4720d38bd394f0d39 %}

최초 ```User```객체를 생성하면서 username 이 세팅되었지만, email 은 세팅되지 않았으므로 username 만 출력된다.
다음 라인에서 이메일을 세팅하면서 ```email setter```메서드가 호출되어 _email 속성에 값이 들어갔다.

프로퍼티 데코레이터를 활용하면 ```user1.email``` 하나만으로 ```getter and setter``` 모두 동작한다니 신기하지 않은가?
이것이 간결성과 명시성을 추구하는 파이썬의 특징이다.

또한 프로퍼티를 사용하는 이유는 부가적인 로직 때문이기도 하다.
위 예제에서는 이메일 세팅 시 그것이 유효한 형식인지 검증하는 로직이 포함된다.

- ```getter and setter```를 사용하는 일반적인 이유는 객체의 메서드가 오직 하나의 동작만을 수행해야 한다는
[명령-쿼리 분리```command and query separation - CC08```](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)
원칙에 있다.
파이썬 프로퍼티 또한 이러한 원칙의 연장선이다.

### 리펙토링의 냄새가 나는 경우

파이썬 코드에서 흔히 발생하는 잠재적인 문제들을 피할 수 있는 **관용적 작성방식**이 있다.
이러한 방어코드는 안티 패턴을 정당화하는 시나리오가 사실상 없다고 말할 수 있으므로,
코드리뷰 중 해당 문제를 발견한다면 제안된 방식으로 리팩토링하는 것이 좋다.

#### a. 변경 가능한(mutable) 파라미터의 기본 값

{% gist daesungRa/ebe4a1b72b016d69440f0642951d71c2 %}

여기서는 기본인자를 뮤터블한 객체로 활용하면서도 그것 자체를 함수 내부적으로 수정해 버리는(pop 사용)
문제가 발생한다. 이는 잠재적인 에러의 가능성을 내포한다.

{% gist daesungRa/ddf3606f43d0e7f84e4f4c17b0bfcebf %}
{% gist daesungRa/06bfbb03230a9baabefd6bc4bde58b81 %}

한 번의 스크립트 실행 동안 ```wrong_user_display``` 가 여러 번 호출된다면
그것은 최초 하나의 객체만을 가리킨다(같은 객체의 주소가 메모리에 계속 남아 있음을 의미).

따라서 최초 호출 이후 별도 파라미터 없이 기본인자를 다시 활용하는 경우
이전에 user_metadata 로부터 pop 을 통해 name 키를 지워버린 상태이기 때문에 ```KeyError``` 로 이어진다.

이러한 문제를 리팩토링하는 방법은 기본인자로 ```None```을 사용하는 것이다.
그리고 ```None```일 시 함수 내부에서 기본값을 할당하도록 하면 해결된다.

{% gist daesungRa/d59cddf1200e1c013e3058542d88c349 %}

파이썬에서 함수 내부는 독립적인 스코프이므로(생명주기 상), 매 호출 시마다 기본값이 손실 없이 새롭게 할당된다.

#### b. 내장(built-in) 타입 확장
