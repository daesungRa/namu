---
title:  python exception
date:   2020-06-16 21:12:00 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: beach.jpg
image-view: true
---

### 들어가며

[파이썬 에러와 예외](https://docs.python.org/ko/3/tutorial/errors.html) 공식 문서를 참조하면 되겠지만,
딱 필요한 정보만 압축해서 정리해 놓으려고 한다(<del>쓰다보면 길어질지도?</del>).
조건문만 사용해서 모든 상황을 통제할 수 있다면 좋겠는데..
나도 모르는 내 실수나 손쓸 수 없는 예외적인 상황에 대한 완벽한 대처는 참 어려운 법이다.

파이썬에서는 문법적 에러와 런타임 에러가 있는데, 전자는 실행 시 무조건 에러가 발생하기 때문에 코딩 중에 바로 대처할 수 있다.
그러나 문법적으로 문제가 없어도 실행 중에 외부적인 요인에 의해 발생할 수 있는 예외에 대해서는 try-except 예외처리를 해줘야 한다.

### Exception

예외는 항상 치명적이지는 않다. 하지만 보다 안정적인 코딩을 위해서 예외처리는 필수이다.
대표적인 예외는 [ZeroDivisionError](https://docs.python.org/ko/3/library/exceptions.html#ZeroDivisionError) 인데,
이것은 정수나 실수를 0으로 나누는 논리적 예외상황에서 발생한다.
나누는 수로 0이 항상 입력되는 것은 아니기 때문에 이러한 예외상황이 언제 발생할 지는 알 수 없다.
이 문제를 조건문으로 처리할 수도 있겠지만, 0이 입력되는 경우는 의미 있는 고려대상이 아니기 때문에 예외처리하는 것이 옳다.
다음은 [ZeroDivisionError](https://docs.python.org/ko/3/library/exceptions.html#ZeroDivisionError) 를 테스트하는
**divide_by_zero.py** 의 내용이다.

```python
# divide_by_zero.py


def divide_by_zero(num: int = 10, div: int = 10):
    """
    When you insert '0' for div,
    Exception messages can be printed.
    """
    print(f'divide {num} by {div}!!!')
    print(f'    >> {int(num / div)}')


if __name__ == '__main__':
    print('===== start =====')
    divide_by_zero(num=10, div=10)
    divide_by_zero(num=10, div=0)
    print('===== end =====')
```

위 코드를 실행하면 다음과 같은 결과가 출력된다.

```text
1  ===== start =====
2  divide 10 by 10!!!
3      >> 1
4  divide 10 by 0!!!
5  Traceback (most recent call last):
6  File "<input>", line 1, in <module>
7    File "<input>", line 3, in divide_by_zero
8  ZeroDivisionError: division by zero
9  ===== end =====
```

보면 알겠지만 10을 10으로 나눈 첫 시도에는 문제 없이 1이 출력되었는데, 0으로 나눠지는 두 번째 시도에서는
**'ZeroDivisionError: division by zero'** 예외가 발생했다.

### Handling exception

위에서 언급했듯, try-except 도구를 사용하면 성공적으로 예외처리를 할 수 있다.
코드를 수정해 보자.

```python
# divide_by_zero.py


def divide_by_zero(num: int = 10, div: int = 10):
    """
    This time, '0' will be handled by try-except tool.
    """
    print(f'divide {num} by {div}!!!')
    try:
        print(f'    >> {int(num / div)}')
    except ZeroDivisionError as e:
        print(f'[{e}] Oops! "{div}" for div was no valid number. Try again...')


if __name__ == '__main__':
    print('===== start =====')
    divide_by_zero(num=10, div=10)
    divide_by_zero(num=10, div=0)
    print('===== end =====')
```

출력은 다음과 같다.

```text
1  ===== start =====
2  divide 10 by 10!!!
3      >> 1
4  divide 10 by 0!!!
5  [division by zero] Oops! "0" for div was no valid number. Try again...
6  ===== end =====
```

이제 **'div=0'** 가 들어와도 예외상황에 발목잡히지 않고 이후 코드가 진행된다!
만약 division 의 결과값이 특정 변수에 담겨야 한다면,
except 처리문 내에 예외 시 변수의 기본값을 세팅함으로써 매끄럽게 처리할 수도 있을 것이다.
