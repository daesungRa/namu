---
title: Context Manager 와 with 구문
date: 2020-08-11 22:43:25 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: http://www.picpedia.org/highway-signs/images/manager.jpg
image-view: true
image-author: toppr.com
image-source: https://www.toppr.com/guides/business-management-and-entrepreneurship/nature-of-management-and-its-process/tasks-and-responsibilities-of-professional-managers/
---


---

[목차]

1. [들어가며](#들어가며)
2. [Context Manager](#context-manager)
3. [with 구문](#with-구문)
4. [구현하기](#구현하기)
5. [Generator 와 Decorator 로 구현하기](#generator-와-decorator-로-구현하기)

[참조]

1. [pythontips.com](https://book.pythontips.com/en/latest/context_managers.html)

---

### 들어가며

> 어떤 컴퓨팅 환경에서건 특정 리소스(resource) 를 사용(acquire) 하고 그것을 해제(release) 해주지 않으면 리소스 누수(leak) 현상이 발생한다.

이런 이유로 모든 언어에는 할당된 리소스를 해제해주는 ```close``` 기능이 존재한다. 파이썬도 마찬가지다.
하지만 만약 코드 진행 도중에 exception 이 발생한다면 그 이후에 작성된 ```close``` 라인은 실행되지 않을 것이다.
일반적인 문법으로 ```try-finally``` 구문을 통해 무조건적으로 close 코드가 실행되도록 조치할 수 있겠지만,
파이썬에서는 **_context manager_** 와 **_with_** 구문을 통해 보다 명시적이고 간결하게 해당 로직을 구현할 수 있다.
나아가 리소스 해제에 대한 무결성도 보장해줄 것이다.

### Context Manager

**_context manager_** 는 **_with_** 구문에서 쓰일 수 있는 일종의 객체 타입인데,
직접적으로 사용할 수는 없고 프로토콜에 따라 이것이 구현된 특정 클래스를 작성할 수 있다.
file 객체나 database connection 객체와 같은 리소스 활용 클래스 기반 객체가 그 예이다.
이것들의 핵심은 해당 리소스의 allocate and release 가
적시에 이루어지도록 할 수 있다는 것이다<small>-precisely when you want to-</small>.

### with 구문

**_context manager_** 가 구현된 클래스 인스턴스를 with 구문에서 사용하면,
진입 시 **_\_\_enter\_\__** 메서드가 호출되고 빠져나갈 때 **_\_\_exit\_\__** 메서드가 호출된다.
이 모든 과정은 자동으로 이루어진다.

### 구현하기

대표적으로 **_context manager_** 클래스는 **_\_\_enter\_\__** 와 **_\_\_exit\_\__** 메서드로 이루어져 있다. 다음 예제를 보자.

{% gist daesungra/2ee8fea40c166057956db92744324f0c %}

위 코드는 **_context manager_** 로써 ```SQLAlchemy orm``` 을 활용한 예제이다.
해당 db connection 클래스를 구현하여 이것을 with 구문에서 인스턴스화할 때 **_\_\_enter\_\__** 메서드가,
빠져나갈 때 **_\_\_exit\_\__** 메서드가 자동 호출되도록 만들었다.
최초 인스턴스화 시에는 **_\_\_init\_\__** 메서드가 호출되어 engine 및 session 을 생성하기 위한 참조변수를 선언한다.

### Generator 와 Decorator 로 구현하기

파이썬 모듈인 ```contextlib``` 을 활용하면 보다 간편하게 **_context manager_** 를 구현할 수 있다.
이 때는 class 대신에 generator 함수로 구현 가능하다.

{% gist daesungra/4fa8227e03c1f443665ab3d9d22bfe7e %}

이 방식은 보다 직관적이다. 그러나 generator 와 yield, decorator 에 대한 제반 지식이 필요하다.

간단히 설명하자면, yield 는 generator 에서 사용하는 키워드로,
return 키워드의 경우는 해당 값을 반환하고 함수를 종료해 버리지만
generator 내부의 yield 키워드는 해당 값 반환 후 다시 함수 내부로 되돌아온다.
yield 는 값을 내보내는 것뿐만 아니라 넣는 것도 가능하다.
즉, 여러 번에 걸쳐 함수 입출력이 가능하게 된다!

그렇다면 이 기능을 어디에 사용할까?
결론적으로 말하자면 대용량 자료를 처리하는 함수가 필요할때 사용한다.
예를 들어 파이썬에서 range() 함수는 내부적으로 입력된 수 만큼의 사이즈를 갖는 list 가 생성되는데,
만약 대용량의 데이터라면 그만큼 무거운 list 가 만들어질 것이다.
이 때는 한 번에 모든 데이터를 올려서 for-range 처리하지 말고,
yield generator 를 이용해서 한 줄씩 순차적으로 처리되도록 하면 시스템 부하를 그만큼 줄일 수 있다.

실제로 Flask 웹앱에서 대용량 파일 전송, Sphinx 확장 개발 등에 사용된다.
decorator 는 말 그대로 목적 함수를 꾸며주는? 역할을 한다. wrapping 이라고 부르는데
여러 함수에 반복적으로 작성해야 할 로직 내용이 있다면 그것들을 일일히 코딩하는 것이 아니라
decorator 를 만들어 놓고 그것으로 감싸기만 하면 되는 것이다.
목적 함수를 감싸는 역할이기 때문에 함수 중간에 끼어드는 것은 불가능하다.

끝!
