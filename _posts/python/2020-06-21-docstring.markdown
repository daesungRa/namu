---
title: docstring
date: 2020-06-21 06:30:00 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: cards.jpg
image-view: true
---

### 들어가며

**개발자는 협업한다.**
개인 토이 프로젝트를 제외하면 거의 필연적으로 다른 개발자들과 협업한다.
프로그래밍 언어로 컴퓨터와 소통하는 것 이상으로 타인과의 소통이 중요한 이유이다.
이 소통을 위해 매우 유용한 기능이 있는데, 바로 파이썬 **[docstring](https://wikidocs.net/16050)** 이다.

### Docstring, 문서화

`docstring` 은 주석(commenting)이 아니다. **'문서화'** 이다. 주석과 문서화의 차이점은 굳이 따지자면
쪽지와 공식 사용설명서 간의 차이 정도로 볼수 있을 것 같다.

전자는 코드에 대해 설명하다 보니 코드 자체의 가독성이 떨어진다는 반증이 되기도 하며,
여러 곳에 흩뿌려져 있어 히스토리 추적이 어려워 정말 맞는 설명인지, 잘 동작할지 확신하기 어렵다.

하지만 후자는 사용자 중심의 사용설명서로 협업하는 팀 혹은 회사 단위로 규칙을 정해 모두가 함께 작성하므로 신뢰할 수 있다.
공식화된 예제를 통해 해당 코드가 어떻게 동작하는지 시뮬레이션 해볼 수도 있다.

충분히 설명적인 코드라면 주석이 필요 없겠지만,
엔터프라이즈급으로 규모가 커질수록 누군지 모를 사용자 혹은 컨트리뷰터를 위해 문서화는 언제나 필요하다.
특정 라인의 개선 방향성(enhancement)을 기술하는 등 특별한 경우를 제외하고 주석의 사용은 지양되는 것이 좋은 반면,
협업하는 모든 개발자는 합의한 컨벤션대로 문서화에 기여해야 한다.

### Docstring 이란?

```docstring```은 코드의 특정 컴포넌트에 대한 설명이다(모듈, 클래스, 메서드 or 함수).
또한 **[리터럴 문자열(literal string)](https://www.computerhope.com/jargon/l/literal.htm)** 이라
`python interpreter` 에 의해 실행되지 않으며 built-in variable 인 `__doc__` 에 저장되어 `help()` 도구를 통해 참조할 수 있다.

다음은 dict 자료형의 update 메서드에 대한 `docstring` 을 출력한 내용이다.

```python
help(dict.update)
```

```text
Help on method_descriptor:
update(...)
    D.update([E, ]**F) -> None.  Update D from dict/iterable E and F.
    If E is present and has a .keys() method, then does:  for k in E: D[k] = E[k]
    If E is present and lacks a .keys() method, then does:  for k, v in E: D[k] = v
    In either case, this is followed by: for k in F:  D[k] = F[k]
```

딕셔너리 ```D```의 update 메서드가 주어진 iterable 객체 ```E```와 ```F```에 대해 어떤 동작을 수행하는지
예시를 통해 설명하고 있다. iterable 이 딕셔너리인지, 리스트인지,
아니면 그 밖의 타입인지에 따라 조금씩 다른 것을 명료하게 확인할 수 있다.

### 장단점!

1. 장점
    - **충분한 설명**.
    공식 문서인 ```docstring```은 해당 컴포넌트가 작성된 목적과 사용법을 일목요연하고 자세하게 설명한다. 자세할수록 좋다.
    - **타입 힌팅**.
    코드가 파이써닉하고 네이밍이 설명적이어도 동적 타이핑인 파이썬 코드에서 모든 요소의 타입을 바로 알기는 어려운 법이다.
    사용자의 소중한 시간을 지키기 위해 공식 문서인 ```docstring```은 타입을 직관적으로 알려준다.
    - **예시를 통한 설명**.
    어떤 설명서든 예시를 보여주는 설명서가 최고인 법이다. 위 `dict.update` 처럼 예시를 따라가 컴포넌트를 바로 이해할 수 있다.
2. 단점
    - **수작업을 요한다**.
    한 가지 불편한 단점이 있는데(전적으로 작성자 입장에서), 그것은 지속적인 수작업이 필요하다는 것이다.
    아무래도 사람과 사람이 설명을 통해 소통하는 도구이다 보니 ```docstring```의 작성 및 관리는 사람의 손을 직접 거칠 수밖에 없다.
    또 모든 팀원이 한마음으로 문서화에 참여해야 하므로 컨벤션 준수 및 최신화에 신경쓸 것을 강조해야
    한다(<del>팀웤 향상에 도움이 될지도?</del>).

### docstring 작성하기

```docstring```에는 ```One-Line Docstring```과 ```Multi-Line Docstring```이 있으며,
```docstring```의 내용은 세 개의 홑따옴표 혹은 쌍따옴표로 감싸진다.
```One-Line Docstring```의 경우 여는 따옴표와 닫는 따옴표가 같은 라인에 있어야 하며,
standard convention 으로 따옴표는 ```triple-double quotes```를 사용해야 한다.
다음을 참고하자.

```python
class IntegerMaker:
    """
    This is integer maker class
    """
    def __init__(self):
        pass

    def make_integer_from_string(self, my_age: str) -> int:
        """
        Return 0 or positive integer with string type argument.
        If the argument is not of type string, it returns integer type value of -1.
        If the argument is a negative integer, it returns integer type value of -2.

        Args:
            my_age (str): my age in string type

        Returns:
            int: The return value converted to integer.
        """
        if isinstance(my_age, str):
            try:
                result = int(my_age)
            except ValueError as ve:
                print(ve)
            else:
                if result >= 0:
                    return result
                else:
                    return -2
        else:
            return -1


if __name__ == '__main__':
    int_maker = IntegerMaker()
    help(int_maker.make_integer_from_string)
    print(int_maker.make_integer_from_string(my_age='100'))
    print(int_maker.make_integer_from_string(my_age='0'))
    print(int_maker.make_integer_from_string(my_age=99))
    print(int_maker.make_integer_from_string(my_age='-1'))
```

실행 결과는 다음과 같다.

```text
Help on method make_integer_from_string in module __main__:

make_integer_from_string(my_age:str) -> int method of __main__.IntegerMaker instance
    Return 0 or positive integer with string type argument.
    If the argument is not of type string, it returns integer type value of -1.
    If the argument is a negative integer, it returns integer type value of -2.
    
    Args:
        my_age (str): my age in string type
    
    Returns:
        int: The return value converted to integer.

100
0
-1
-2
```

순서대로 ```IntegerMaker.make_integer_from_string```의 ```docstring```을 출력하였고,<br/>
이어서 정의된 내용에 맞는 input/output 을 확인할 수 있다. 끝~!
