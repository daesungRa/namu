---
title:  파이썬으로 예외처리하기
date:   2020-06-16 21:12:00 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2020/06/05/22/21/beach-5264739_1280.jpg
image-view: true
image-author: njbateman526
image-source: https://pixabay.com/ko/users/njbateman526-16908298/
---

### 들어가며

**[파이썬 에러와 예외](https://docs.python.org/ko/3/tutorial/errors.html)** 공식 문서를 참조하면 되겠지만,
딱 필요한 정보만 압축해서 정리해 놓으려고 한다(<del>쓰다보면 길어질지도?</del>).
조건문만 사용해서 모든 상황을 통제할 수 있다면 좋겠는데..
나도 모르는 내 실수나 손쓸 수 없는 예외적인 상황에 대한 완벽한 대처는 참 어려운 법이다.

파이썬에서는 문법적 에러와 런타임 에러가 있는데, 전자는 실행 시 무조건 에러가 발생하기 때문에 코딩 중에 바로 대처할 수 있다.
그러나 문법적으로 문제가 없어도 외부적인 요인에 의해 발생할 수 있는 예외상황에 대해서는 `try-except` 예외처리를 해줘야 한다.

### Exception

예외는 항상 치명적이지는 않다. 하지만 보다 안정적인 코딩을 위해서 예외처리는 필수이다.
대표적인 예외는 **[ZeroDivisionError](https://docs.python.org/ko/3/library/exceptions.html#ZeroDivisionError)** 인데,
이것은 정수나 실수를 0으로 나누는 논리적 예외상황에서 발생한다.
나누는 수로 0이 항상 입력되는 것은 아니기 때문에 이러한 예외상황이 언제 발생할 지는 알 수 없다.
이 문제를 조건문으로 처리할 수도 있겠지만, 0이 입력되는 경우는 의미 있는 고려대상이 아니기 때문에 예외처리하는 것이 옳다.
다음은 **[ZeroDivisionError](https://docs.python.org/ko/3/library/exceptions.html#ZeroDivisionError)** 를 테스트하는
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
===== start =====
divide 10 by 10!!!
    >> 1
divide 10 by 0!!!
Traceback (most recent call last):
File "<input>", line 1, in <module>
  File "<input>", line 3, in divide_by_zero
ZeroDivisionError: division by zero
===== end =====
```

보면 알겠지만 10을 10으로 나눈 첫 시도에는 문제 없이 1이 출력되었는데, 0으로 나눠지는 두 번째 시도에서는
**'ZeroDivisionError: division by zero'** 예외가 발생했다.

### Handling exception

위에서 언급했듯, `try-except` 도구를 사용하면 성공적으로 예외처리를 할 수 있다.
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
===== start =====
divide 10 by 10!!!
    >> 1
divide 10 by 0!!!
[division by zero] Oops! "0" for div was no valid number. Try again...
===== end =====
```

이제 `div=0` 가 들어와도 예외상황에 발목잡히지 않고 이후 코드가 진행된다!
만약 division 의 결과값이 특정 변수에 담겨야 한다면,
`except` 처리문 내에 예외 시 변수의 기본값을 세팅함으로써 매끄럽게 처리할 수도 있을 것이다.

```
- except 처리문에 ZeroDivisionError 뿐만 아니라 여러 타입의 예외를 동시에 포함시킬 수도 있다.
- 동시에 포함시키지 않고 순차적으로 여러 타입의 except 문을 작성할 수도 있다.
- 순차적으로 작성 시, 마지막 except 문은 예외 타입 지정을 생략할 수 있다.
- Exception 클래스는 모든 exception 타입의 상위 클래스로, 타입 구분 없이 예외처리할 때 사용된다.
```

### raising exception

**[raise](https://docs.python.org/ko/3/reference/simple_stmts.html#raise)** 문은 강제적으로 예외를 일으킨다.
사전에 클래스로 정의된 예외상황은 아니지만, 작성자가 원하는 조건에서 예외가 발생하기를 원할 때 사용한다.

```python
raise NameError('HiThere')
```

일으킨 예외를 처리하고 싶다면 다음과 같이 한다.

```python
try:
    raise NameError('HiThere')
except NameError:
    print('An exception flew by!')
    raise
```

```text
An exception flew by!
Traceback (most recent call last):
  File "<input>", line 2, in <module>
NameError: HiThere
```

이러한 출력이 나타나면서 예외가 처리되고 다음 로직이 실행된다.

### 사용자 정의 예외

모든 예외 타입들은 **[Exception](https://docs.python.org/ko/3/library/exceptions.html#Exception)** 클래스의 자식들이므로,
`Exception` 혹은 그 자식 클래스를 상속받음으로써 사용자 정의 예외를 만들 수 있다.

일반적으로 **[Exception](https://docs.python.org/ko/3/library/exceptions.html#Exception)** 의 상속은 간단하게 유지하며
에러에 관한 구체적인 정보들을 추출하기 위한 용도에서 이루어진다. 흔히 사용되는 방식은 모듈에서 정의되는 예외들의
베이스 클래스를 정의한 후, 각기 다른 에러 조건마다 특정한 예외 클래스를 서브 클래스로 만드는 것이다.

자세한 내용은 **[공식 문서](https://docs.python.org/ko/3/tutorial/errors.html#user-defined-exceptions)** 를 참조하자.

### else, finally

`else` 구문은 모든 `except` 문 이후에 작성되며, `try` 진행중 예외가 발생하지 않은 경우 실행된다.
지정한 모든 예외가 발생하지 않는 상황을 보장하기 때문에, **정상 로직은 `try` 문보다는 `else` 문에 작성하는 것**이 좋다.

**finally 구문은 무조건 실행**된다.
예외가 발생하든 발생하지 않든 항상 실행되어야만 하는 코드를 이곳에 작성하면 된다.
일반적으로 열었던 파일을 닫을 때 많이 사용된다.

```python
# divide_by_zero.py

def divide_by_zero(num: int = 10, div: int = 10):
    """
    If exception occurs, the except statement is executed,
    Otherwise, the else statement is executed.
    Finally statement is always executed.
    """
    print(f'[START] divide {num} by {div}!!!')
    try:
        result = int(num / div)
    except ZeroDivisionError as e:
        print(f'[ERROR][{e}] Oops! "{div}" for div was no valid number. Try again...')
    except TypeError as te:
        print(f'[ERROR][{te}] Please insert a number. not a string.')
    else:
        print(f'[NORMAL] result is {result}.')
    finally:
        print(f'[FIN] finising division process.')


if __name__ == '__main__':
    print('===== start =====')
    divide_by_zero(num=10, div=10)
    divide_by_zero(num=10, div='10')
    divide_by_zero(num=10, div=0)
    print('===== end =====')
```

```text
===== start =====
[START] divide 10 by 10!!!
[NORMAL] result is 1.
[FIN] finising division process.
[START] divide 10 by 10!!!
[ERROR][unsupported operand type(s) for /: 'int' and 'str'] Please insert a number. not a string.
[FIN] finising division process.
[START] divide 10 by 0!!!
[ERROR][division by zero] Oops! "0" for div was no valid number. Try again...
[FIN] finising division process.
===== end =====
```

중간에 `div` 로 문자열이 입력된 경우를 추가했다.
이 때는 **[TypeError](https://docs.python.org/ko/3/library/exceptions.html#TypeError)** 가 발생한다.
어쨌든 예외가 발생하면 각각의 `except` 구문에 해당하는 라인이 실행되고, 그렇지 않은 경우 `else` 구문이 실행되는 것을 볼 수 있다.
`finally` 구문은 예외 발생에 관계없이 무조건 실행된다.

### read/write file

마지막으로 `finally` 가 필요한 **file read/write** 상황을 살펴보자.

```python
# handling_file.py

def handling_file(command: str = None):
    fo = []
    result = ''
    try:
        fo = open("myFile.txt")
        for line in fo:
            result += f'{line}\n'
        if command:
            result += f'\ncommand'
    except Exception as e:
        print(f'[ERROR] {e}')
    else:
        print(f'[NORMAL] {result}')
    finally:
        fo.close()
        print(f'[FIN] file closed.')


if __name__ == '__main__':
    print('===== start =====')
    handling_file(command='say hello~!')
    print('===== end =====')
```

**myFile.txt** 를 try 문 내에서 `open` 한 뒤, 예외가 발생하면 `except` 문이, 아니라면 `else` 문이 실행되도록 작성한 코드이다.
예상되는 예외는 해당 파일을 경로 내에서 찾을 수 없는
**[FileNotFoundError](https://docs.python.org/3/library/exceptions.html#FileNotFoundError)** 이다.

예외 발생 여부와 상관 없이 `finally` 문 내의 `fo.close()` 라인으로 인해 파일의 무기한 `open` 이 방지된다. (메모리 누수 방지)

file handling 에 최적화된
**[with](http://effbot.org/zone/python-with-statement.htm)** 구문을 사용하면 위의 방식보다 훨씬 간단한 코드를 작성할 수도 있다.

```python
# handling_file.py

def handling_file(command: str = None):
    fo = []
    result = ''
    with open("myFile.txt") as f:
        for line in f:
            result += f'{line}\n'
        if command:
            result += f'\ncommand'
    print(f'[NORMAL] {result}')


if __name__ == '__main__':
    print('===== start =====')
    handling_file(command='say hello~!')
    print('===== end =====')
```

파이썬 **[context manager](https://www.geeksforgeeks.org/context-manager-in-python/)** 에 의해 관리되는 `with` 문은,
구문이 종료되는 `__exit__` 상황에서 열렸던 파일이 닫힌다.
그러므로 작성자가 `with` 구문을 활용하면 파일 `open` 에 의한 메모리 누수를 염려를 하지 않아도 된다.
자세한 내용은 **[context manager 를 다룬 포스트](#)** 에서 확인할 수 있다.

부가적인 예외 처리에 대한 부분을 추가하려면, `with` 구문을 `try-except` 구문으로 감싸면 된다.

끝~!
