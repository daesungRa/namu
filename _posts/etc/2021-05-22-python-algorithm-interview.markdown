---
title:  "[책 요약] 파이썬 알고리즘 인터뷰"
created:   2021-05-22 22:55:06 +0900
updated:   2021-05-22 21:08:21 +0900
author: namu
categories: etc
permalink: "/etc/:year/:month/:day/:title"
image: https://scontent-ssn1-1.xx.fbcdn.net/v/t1.6435-9/117790189_125225515832301_637663363551734880_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=6e5ad9&_nc_ohc=kdrLvzjD_1MAX_juGbJ&_nc_ht=scontent-ssn1-1.xx&oh=df8c4bf0426a4d8b0223426051c48f98&oe=615895FF
image-view: true
image-author: 파이썬 알고리즘 인터뷰
image-source: https://www.facebook.com/AlgorithmInterview/
---


---

[목차]

1. [들어가며](#들어가며)

---


<br>
## 들어가며

너무 유용하게 읽고 있는 책 **"파이썬 알고리즘 인터뷰"**(2020, 박상길, 책만) 일부 내용과 느낀점을 정리합니다.

<br>
## 파이썬

#### 기본문법

- **인덴트**: [**PEP8**](https://www.python.org/dev/peps/pep-0008/#id15) 에 따라 공백 4칸 원칙
- **네이밍 컨벤션**: class 명을 제외하고 카멜 케이스를 지양 (스네이크 코딩을 지향)
- **타입 힌팅**
    - ```a: str = "1"```
    - ```b: int = 1```
    - ```def fn(a: int) -> bool: ...```
- **람다 표현식**: ```list(map(lambda x: x + 10, [1, 2, 3]))``` (10씩 더한 리스트 만들기)
- **리스트 컴프리헨션**
    - ```[n * 2 for n in range(1, 11) if n % 2 == 1]``` (홀수 리스트 만들기)
    - ```a = {key: value for key, value in original.items()}``` (딕셔너리 만들기)
- **제너레이터**
    - ```python
        def get_natural_number():
            n = 0
            while True:
                n += 1
                yield n
        ```
- **range**: ```list(range(5))```, ```for i in range(5): ...```
- **enumerate**: list 의 인덱스와 값을 tuple 형태로 한번에 반환
- **5 // 3 == int(5 / 3)**
- **print**: ```print('A1', 'B2', sep=',')``` 출력 결과는 "A1, B2"
- **f-string**: ```a = 'A1'```, ```b = 'B2'```, ```print(f'{a}, {b}')``` 출력 결과는 "A1, B2"
- **join**: ```print(', '.join(['A1', 'B2']))``` 출력 결과는 "A1, B2"

#### 코딩 스타일

- 개발자는 혼자 일하지 않는다. 그러므로 나만 알아보는 코드는 지양하고, **의미론적이고 간결하고 클린한 코드**를 지향할 것.
- **변수명과 주석**: 충분히 설명적이면서 간결한 네이밍, 최소한의 적절한 (영어)주석!
- 적절한 줄바꿈은 가독성을 높힌다.
- 가독성이 떨어진다면 리스트 컴프리헨션만 고집하지 않아도 된다.
- **구글 파이썬 스타일 가이드**
    - 함수의 기본 파라미터는 None 과 같이 Immutable 해야 한다.
    - ```python
        """No"""
        def foo(a, b=[]):
            ...
        ```
    - ```python
        """Yes"""
        def foo(a, b: Optional[Sequence] = None):
            if b is None:
                b = []
        ```

#### 빅오

- 시간복잡도는 어떤 알고리즘을 수행하는 데 걸리는 시간을 설명하는 계산복잡도
- Big-oh 는 최악의 수행시간을 나타내는 점근성능 표기법 (점근적 상한)

#### 자료형

- 시퀀스
    - 가변: list
    - 불변: str, tuple, bytes
- 집합형: set
- 매핑: dict
- ```collections.defaultdict(int)```: 존재하지 않는 키 조회 시 기본값 반환
- ```collections.Counter([1, 2, 2, 3, 4, 4, 4])```: 각 아이템 개수를 계산해 dict 로 반환
- ```collections.OrderedDict(dict)```: 순서가 보장되는 dict
- 파이썬은 원시 타입(Primitive type)을 지원하지 않음. 객체 타입(참조형)을 채택
