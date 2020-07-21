---
title: what does pythonic mean??
date: 2020-07-09 21:30:00 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: pythonic_x.jpg
image-view: true

---

### 들어가며

파이썬으로 개발하다 보면 코드를 **파이썬스럽게** 작성해야 한다는 말을 심심치 않게 듣는다.
물론 개발환경이나 개인의 선택에 따라 파이썬스러울 수도, 아닐 수도 있겠지만,
일단은 파이썬스럽다는 것의 의미를 아는 것이 먼저일 것이다.

### Pythonic, philosophy of python(파이썬의 철학)

아무래도 파이썬을 사용한다면 파이썬스럽게 코드를 짜는 것이 여러 가지 면에서 효과적이지 않을까?<br>
그것을 알아보기 위해 다음을 실행해보자.

```python
import this
```
```text
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```
이것은 python main contributor 인 팀 피터스([Tim peters](https://en.wikipedia.org/wiki/Tim_Peters_(software_engineer)))가
작성한 파이썬 철학이다. ([The zen of python by Tim peters](https://www.python.org/dev/peps/pep-0020/#id2))

위 내용들을 쭉 읽어가다 보면 파이썬스럽다는 것은
**명료성, 단순성, 가독성, 규칙성, 일관성, 설명성** 등의 가치를 내포한다는 것을 알 수 있다.

### PEP8

파이썬 철학을 담고 있는 가장 표준적인 Convention은 [**```PEP8```**](https://www.python.org/dev/peps/pep-0008/) 이다.
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
    
    ```text
    """Return a foobang
    
    Optional plotz says to frobnicate the bizbaz first.
    """
    ```

- [Package and Module Names](https://www.python.org/dev/peps/pep-0008/#id40)
    - 모듈은 짧은 ```all-lowercase``` 이름을 갖는다.
    그리고 모듈명의 가독성을 높이기 위해서 밑줄```Underscores```을 사용할 수 있다.
    파이썬 패키지 또한 짧은 ```all-lowercase``` 이름을 짓되, 밑줄```Underscores```은 가급적 사용하지 않는 것이 좋다.
    - C 혹은 C++로 쓰여진 확장모듈이 고수준의 인터페이스를 제공하는 추가적인 파이썬 모듈을 포함할 시(e.g more object oriented),
    이 C/C++ 모듈은 ```leading underscore``` 를 갖는다(e.g _socket).
    
