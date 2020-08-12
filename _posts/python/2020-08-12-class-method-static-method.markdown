---
title: Python 에서 Static Method 와 Class Method 
date: 2020-08-12 23:37:27 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: https://blog.se.com/wp-content/uploads/2013/12/Building-Blocks-with-Legos.jpg
image-view: true
image-author: blog.se.com
image-source: https://blog.se.com/datacenter/2014/09/15/new-way-think-data-center-design-optimizing-data-center-like-box-legos/
---


---

[목차]

1. [들어가며](#들어가며)
2. [Static Method](#static-method)
3. [Class Method](#class-method)
4. [그럼 어디에서 쓸까](#그럼-어디에서-쓸까)

---

### 들어가며

자바에서처럼 Python 에서도 **_Static Method_** 와 **_Class Method_** 는
별도의 인스턴스 생성 없이 클래스 메모리 영역에 상주하여 사용 가능한 메서드라는 특징이 있다.

### Static Method

자바에서 클래스를 인스턴스화 한 후 static 메서드를 호출하면 호출은 되지만 warning 이 발생한다.

그러나 파이썬은 어떻게 해도 상관이 없나보다.
인스턴스화된 객체는 적재된 메모리 스코프 자체가 다름에도 불구하고 static 메서드가 그냥 호출이 된다.
그러므로 스코프, 즉 메모리 적재 영역이 서로 다르다는 사실을 꼭 인지하고 있어야 한다!!

### Class Method

클래스 메서드는 스태틱 메서드와 같이 클래스 메모리 영역에서 전역적으로 사용되는 메서드란 개념은 유사하나,
한 가지 주목할 점은 그것이 **_정의된 해당 클래스에 종속된다는 점_**이다.

그러므로 클래스 메서드는 정의할 때 메서드의 첫 번째 인자로 class 자신을 넘겨줘야만 한다(보통 cls 로 명명).
첫 번째 인자에 자기 자신을 넣는다는 것은, 일반적으로 그것이 객체화가 된 이후에야 사용 가능하다는 의미지만,
이 class 메서드에서는 (인스턴스화에 관계없이) 정말로 자기 자신(클래스)을 의미하기 위해 사용된다.
이러한 특성은 클래스 상속 시에 확인할 수 있다.

### 그럼 어디에서 쓸까

예를 들어 부모 클래스 A 의 필드 word 값을 출력하는 static 메서드 get_word 가 있다고 하자.
A 를 상속받은 자식 클래스 B 에서 필드 word 의 값을 변경하고 get_word 메서드를 호출하면 어떻게 될까?
본래 A 의 word 값이 출력된다.
그럼 get_word 메서드를 class 메서드로 정의하면 어떻게 될까?
당연히 B 의 변경된 word 값이 출력된다.

이는 자기 자신을 나타내는 cls 매개변수를 받는 class 메서드의 특성에 의한 것이다.

특히 파이썬에서는 참조변수의 자료형을 명시하지 않으므로 상속 클래스에 대한 정확한 타입을 보장하기 어렵다(코드 수준에서).
스태틱 메서드는 클래스 메모리 영역에 적재되나, 상속 시 정확히 어떤 것의 정적 메서드가 되는가에 대해 불분명한 것이다.
이때 static 메서드라면 무조건 최초 정의된 부모 클래스의 메서드로써 동작하고,
class 메서드라면 cls 매개변수를 받은 (자기자신) 클래스의 메서드로써 동작하게 된다.

만약 혼란의 여지가 있다면, static method 를 사용하는 것을 추천.
