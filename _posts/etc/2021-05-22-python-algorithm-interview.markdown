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
2. [파이썬](#파이썬)
    - 2-1. [기본문법](#기본문법)
    - 2-2. [코딩 스타일](#코딩-스타일)
    - 2-3. [빅오](#빅오)
    - 2-4. [자료형](#자료형)
    - 2-5. [[**문자열 다루기**] 유효한 펠린드롬](#문자열-다루기-유효한-펠린드롬)
    - 2-6. [[**문자열 다루기**] 로그파일 재정렬](#문자열-다루기-로그파일-재정렬)
    - 2-7. [[**문자열 다루기**] 가장 흔한 단어](#문자열-다루기-가장-흔한-단어)
    - 2-8. [[**문자열 다루기**] 그룹 애너그램](#문자열-다루기-그룹-애너그램)
    - 2-9. [[**문자열 다루기**] 가장 긴 팰린드롬 부분 문자열](#문자열-다루기-가장-긴-팰린드롬-부분-문자열)
3. [선형 자료구조](#선형-자료구조)
    - 3-1. [파이썬에서의 배열](#파이썬에서의-배열)
    - 3-2. [[**배열**] 두 수의 합](#배열-두-수의-합)
    - 3-3. [[**배열**] 빗물 트래핑](#배열-빗물-트래핑)
    - 3-4. [[**배열**] 세 수의 합](#배열-세-수의-합)
    - 3-5. [[**배열**] 배열 파티션 1](#배열-배열-파티션-1)
    - 3-6. [[**배열**] 자신을 제외한 배열의 곱](#배열-자신을-제외한-배열의-곱)
    - 3-7. [[**배열**] 주식을 사고 팔기 가장 좋은 시점](#배열-주식을-사고-팔기-가장-좋은-시점)
    - 3-8. [연결 리스트](#연결-리스트)
    - 3-9. [[**연결 리스트**] 팰린드롬 연결 리스트](#연결-리스트-팰린드롬-연결-리스트)
    - 3-10. [[**연결 리스트**] 두 정렬 리스트의 병합](#연결-리스트-두-정렬-리스트의-병합)
    - 3-11. [[**연결 리스트**] 역순 연결 리스트](#연결-리스트-역순-연결-리스트)
    - 3-12. [[**연결 리스트**] 두 수의 덧셈](#연결-리스트-두-수의-덧셈)
    - 3-13. [[**연결 리스트**] 페어의 노드 스왑](#연결-리스트-페어의-노드-스왑)
    - 3-14. [[**연결 리스트**] 홀짝 연결 리스트](#연결-리스트-홀짝-연결-리스트)
    - 3-15. [[**연결 리스트**] 역순 연결 리스트 2](#연결-리스트-역순-연결-리스트-2)
    - 3-16. [스택](#스택)
    - 3-17. [[**스택**] 유효한 괄호](#스택-유효한-괄호)
    - 3-18. [[**스택**] 중복 문자 제거](#스택-중복-문자-제거)
    - 3-19. [[**스택**] 일일 온도](#스택-일일-온도)
    - 3-20. [큐](#큐)
    - 3-21. [[**큐**] 큐를 이용한 스택 구현](#큐-큐를-이용한-스택-구현)
    - 3-22. [[**큐**] 스택을 이용한 큐 구현](#큐-스택을-이용한-큐-구현)
    - 3-23. [[**큐**] 원형 큐 디자인](#큐-원형-큐-디자인)
    - 3-24. [데크](#데크)
    - 3-25. [[**데크**] 원형 데크 디자인](#데크-원형-데크-디자인)
    - 3-26. [우선순위 큐](#우선순위-큐)
    - 3-27. [[**우선순위 큐**] k개 정렬 리스트 병합](#우선순위-큐-k개-정렬-리스트-병합)
    - 3-28. [해시 테이블: 해시](#해시-테이블-해시)
    - 3-29. [해시 테이블: 충돌](#해시-테이블-충돌)
    - 3-30. [[**해시 테이블**] 해시맵 디자인](#해시-테이블-해시맵-디자인)
    - 3-31. [[**해시 테이블**] 보석과 돌](#해시-테이블-보석과-돌)
    - 3-32. [[**해시 테이블**] 중복 문자 없는 가장 긴 부분 문자열](#해시-테이블-중복-문자-없는-가장-긴-부분-문자열)
    - 3-33. [[**해시 테이블**] 상위 K 빈도 요소](#해시-테이블-상위-k-빈도-요소)
4. [비선형 자료구조](#비선형-자료구조)
    - 4-1. [오일러 경로](#오일러-경로)
    - 4-2. [해밀턴 경로](#해밀턴-경로)
    - 4-3. [그래프 순회](#그래프-순회)
    - 4-4. [백트래킹](#백트래킹)
    - 4-5. [제약 충족 문제](#제약-충족-문제)
    - 4-6. [[**그래프**] 섬의 개수](#그래프-섬의-개수)
    - 4-7. [[**그래프**] 전화번호 문자 조합](#그래프-전화번호-문자-조합)
    - 4-8. [[**그래프**] 순열](#그래프-순열)
    - 4-9. [[**그래프**] 조합](#그래프-조합)
    - 4-10. [[**그래프**] 조합의 합](#그래프-조합의-합)
    - 4-11. [[**그래프**] 부분 집합](#그래프-부분-집합)
    - 4-12. [[**그래프**] 일정 재구성](#그래프-일정-재구성)
    - 4-13. [[**그래프**] 코스 스케줄](#그래프-코스-스케줄)
    - 4-14. [[**최단 경로 문제**] 네트워크 딜레이 타임](#최단-경로-문제-네트워크-딜레이-타임)
    - 4-15. [[**최단 경로 문제**] K 경유지 내 가장 저렴한 항공권](#최단-경로-문제-k-경유지-내-가장-저렴한-항공권)
    - 4-16. [트리](#트리)
    - 4-17. [[**트리**] 이진 트리의 최대 깊이](#트리-이진-트리의-최대-깊이)
    - 4-18. [[**트리**] 이진 트리의 직경](#트리-이진-트리의-직경)
    - 4-19. [[**트리**] 가장 긴 동일 값의 경로](#트리-가장-긴-동일-값의-경로)
    - 4-20. [[**트리**] 이진 트리의 반전](#트리-이진-트리의-반전)
    - 4-21. [[**트리**] 두 이진 트리 병합](#트리-두-이진-트리-병합)
    - 4-22. [[**트리**] 이진 트리 직렬화 & 역직렬화](#트리-이진-트리-직렬화-&-역직렬화)
    - 4-23. [[**트리**] 균형 이진 트리](#트리-균형-이진-트리)
    - 4-24. [[**트리**] 최소 높이 트리](#트리-최소-높이-트리)
    - 4-25. [이진 탐색 트리 (BST)](#이진-탐색-트리-bst)
    - 4-26. [[**트리**] 정렬된 배열의 이진 탐색 트리 변환](#트리-정렬된-배열의-이진-탐색-트리-변환)
    - 4-27. [[**트리**] 이진 탐색 트리를 더 큰 수 함계 트리로](#트리-이진-탐색-트리를-더-큰-수-함계-트리로)
    - 4-28. [[**트리**] 이진 탐색 트리 합의 범위](#트리-이진-탐색-트리-합의-범위)
    - 4-29. [[**트리**] 이진 탐색 트리 노드 간 최소 거리](#트리-이진-탐색-트리-노드-간-최소-거리)
    - 4-30. [트리 순회](#트리-순회)
    - 4-31. [[**트리**] 전위, 중위 순회 결과로 이진 트리 구축](#트리-전위-중위-순회-결과로-이진-트리-구축)
    - 4-32. [힙](#힙)
    - 4-33. [[**힙**] 배열의 K번째 큰 요소](#힙-배열의-k번째-큰-요소)
    - 4-34. [[**트라이**] 트라이 구현](#트라이-트라이-구현)
    - 4-35. [[**트라이**] 팰린드롬 페어](#트라이-팰린드롬-페어)
5. [알고리즘](#알고리즘)
    - 5-1. [버블 정렬](#버블-정렬)
    - 5-2. [병합 정렬](#병합-정렬)
    - 5-3. [퀵 정렬](#퀵-정렬)
    - 5-4. [안정 정렬 vs 불안정 정렬](#안정-정렬-vs-불안정-정렬)
    - 5-5. [[**정렬**] 리스트 정렬](#정렬-리스트-정렬)
    - 5-6. [[**정렬**] 구간 병합](#정렬-구간-병합)
    - 5-7. [[**정렬**] 삽입 정렬 리스트](#정렬-삽입-정렬-리스트)
    - 5-8. [[**정렬**] 가장 큰 수](#정렬-가장-큰-수)
    - 5-9. [[**정렬**] 유효한 애너그램](#정렬-유효한-애너그램)
    - 5-10. [[**정렬**] 색 정렬](#정렬-색-정렬)
    - 5-11. [[**정렬**] 원점에 K번째로 가까운 점](#정렬-원점에-k번째로-가까운-점)
    - 5-12. [이진 검색](#이진-검색)
    - 5-13. [[**이진 검색**] 회전 정렬된 배열 검색](#이진-검색-회전-정렬된-배열-검색)
    - 5-14. [[**이진 검색**] 두 배열의 교집합](#이진-검색-두-배열의-교집합)
    - 5-15. [[**이진 검색**] 두 수의 합 2](#이진-검색-두-수의-합-2)
    - 5-16. [[**이진 검색**] 2D 행렬 검색 2](#이진-검색-2d행렬-검색-2)
    - 5-17. [비트 조작](#비트-조작)
    - 5-18. [부울 연산자](#부울-연산자)
    - 5-19. [비트 연산자](#비트-연산자)
    - 5-20. [비트 조작 퀴즈](#비트-조작-퀴즈)
    - 5-21. [2의 보수](#2의-보수)
    - 5-22. [[**비트 조작**] 싱글 넘버](#비트-조작-싱글-넘버)
    - 5-23. [[**비트 조작**] 해밍 거리](#비트-조작-해밍-거리)
    - 5-24. [[**비트 조작**] 두 정수의 합](#비트-조작-두-정수의-합)
    - 5-25. [[**비트 조작**] UTF-8 검증](#비트-조작-utf-8-검증)
    - 5-26. [[**비트 조작**] 1비트의 개수](#비트-조작-1비트의-개수)
    - 5-27. [슬라이딩 윈도우](#슬라이딩-윈도우)
    - 5-28. [[**슬라이딩 윈도우**] 최대 슬라이딩 윈도우](#슬라이딩-윈도우-최대-슬라이딩-윈도우)
    - 5-29. [[**슬라이딩 윈도우**] 부분 문자열이 포함된 최소 윈도우](#슬라이딩-윈도우-부분-문자열이-포함된-최소-윈도우)
    - 5-30. [[**슬라이딩 윈도우**] 가장 긴 반복 문자 대체](#슬라이딩-윈도우-가장-긴-반복-문자-대체)
    - 5-31. [그리디 알고리즘](#그리디-알고리즘)
    - 5-32. [배낭 문제](#배낭-문제)
    - 5-33. [동전 바꾸기 문제](#동전-바꾸기-문제)
    - 5-34. [가장 큰 합](#가장-큰-합)
    - 5-35. [[**그리디 알고리즘**] 주식을 사고팔기 가장 좋은 시점 2](#그리디-알고리즘-주식을-사고팔기-가장-좋은-시점-2)
    - 5-36. [[**그리디 알고리즘**] 키에 따른 대기열 재구성](#그리디-알고리즘-키에-따른-대기열-재구성)
    - 5-37. [[**그리디 알고리즘**] 태스크 스케줄러](#그리디-알고리즘-태스크-스케줄러)
    - 5-38. [[**그리디 알고리즘**] 주유소](#그리디-알고리즘-주유소)
    - 5-39. [[**그리디 알고리즘**] 쿠키 부여](#그리디-알고리즘-쿠키-부여)
    - 5-40. [분할 정복](#분할-정복)
    - 5-41. [[**분할 정복**] 과반수 엘리먼트](#분할-정복-과반수-엘리먼트)
    - 5-42. [[**분할 정복**] 괄호를 삽입하는 여러 가지 방법](#분할-정복-괄호를-삽입하는-여러-가지-방법)
    - 5-43. [다이나믹 프로그래밍](#다이나믹-프로그래밍)
    - 5-44. [최적 부분 구조](#최적-부분-구조)
    - 5-45. [중복된 하위 문제들](#중복된-하위-문제들)
    - 5-46. [다이나믹 프로그래밍 방법론](#다이나믹-프로그래밍-방법론)
    - 5-47. [[**다이나믹 프로그래밍**] 피보나치 수](#다이나믹-프로그래밍-피보나치-수)
    - 5-48. [0-1 배낭 문제](#0-1-배낭-문제)
    - 5-49. [[**다이나믹 프로그래밍**] 최대 서브 배열](#다이나믹-프로그래밍-최대-서브-배열)
    - 5-50. [[**다이나믹 프로그래밍**] 계단 오르기](#다이나믹-프로그래밍-계단-오르기)
    - 5-51. [[**다이나믹 프로그래밍**] 집 도둑](#다이나믹-프로그래밍-집-도둑)
6. [카카오 공채 문제 풀이](#카카오-공채-문제-풀이)
    - 6-1. [비밀 지도](#비밀-지도)
    - 6-2. [다트 게임](#다트-게임)
    - 6-3. [캐시](#캐시)
    - 6-4. [셔틀 버스](#셔틀-버스)
    - 6-5. [뉴스 클러스터링](#뉴스-클러스터링)
    - 6-6. [프렌즈4블록](#프렌즈4블록)
    - 6-7. [추석 트래픽](#추석-트래픽)
    - 6-8. [숫자 야구](#숫자-야구)
    - 6-9. [경주로 건설](#경주로-건설)
    - 6-10. [징검다리 문제](#징검다리-문제)

---


<br>
## 들어가며

너무 유용하게 읽고 있는 책 **"파이썬 알고리즘 인터뷰"**(2020, 박상길, 책만) 일부 내용과 느낀점을 정리합니다.

<br>
## 파이썬

### 기본문법

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
- **정렬**
    - sort: ```[2, 5, 1, 9, 7].sort()``` 출력값 없이 객체가 정렬됨
    - sorted: ```sorted([2, 5, 1, 9, 7])``` [1, 2, 5, 7, 9] 출력
    - **익명 함수 활용 정렬**: 커스텀 조건 정렬을 위해 익명 함수 활용 가능. 주로 lambda 를 씀
        - ```python
            sorted(['cde', 'cfc', 'abc'], key=lambda x: (x[0], x[-1]))  # ['abc', 'cfc', 'cde']
            ```

<br>
### 코딩 스타일

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

<br>
### 빅오

- 시간복잡도는 어떤 알고리즘을 수행하는 데 걸리는 시간을 설명하는 계산복잡도
- Big-oh 는 최악의 수행시간을 나타내는 점근성능 표기법 (점근적 상한)

<br>
### 자료형

- 시퀀스
    - 가변: list
    - 불변: str, tuple, bytes
- 집합형: set
- 매핑: dict
- ```collections.defaultdict(int)```: 존재하지 않는 키 조회 시 기본값 반환
- ```collections.Counter([1, 2, 2, 3, 4, 4, 4])```: 각 아이템 개수를 계산해 dict 로 반환
- ```collections.OrderedDict(dict)```: 순서가 보장되는 dict
- 파이썬은 원시 타입(Primitive type)을 지원하지 않음. 객체 타입(참조형)을 채택

<br>
### [문자열 다루기] 유효한 펠린드롬

**펠린드롬**이란 뒤집어도 같은 말이 되는 단어 또는 문장을 의미합니다.

```python
"""
Palindrome:
    제약사항: 영문숫자, 대소문자 구분하지 않음.
"""

import re
from collections import deque

def palindrome_deque(string: str) -> bool:
    deq = deque([s.lower() for s in string if s.isalnum()])
    while len(deq) > 1:
        if deq.popleft() != deq.pop():
            return False
    return True


var1 = 'A man, a plan, a canal: Panama'
var2 = 'race a car'
print(palindrome_deque(string=var1))  # True
print(palindrome_deque(string=var2))  # False


def palindrome_slicing(string: str) -> bool:
    string = string.lower()  # 소문자로 통일
    string = re.sub('[^a-z0-9]', '', string)  # 특수문자 필터
    return string == string[::-1]  # 역 슬라이싱!

print(palindrome_slicing(string=var1))  # True
print(palindrome_slicing(string=var2))  # False
```

- **```덱(deque)```** 자료구조 사용 시 list 자료구조보다 성능이 나음
- ```list.pop(0)``` 연산의 경우 O(n) 의 시간복잡도를 가지지만, (재정렬을 위한 전체 탐색)
- ```deque.popleft()``` 연산은 O(1) 이다. (연결 리스트이므로 재정렬 불필요)
- slicing 을 활용하면 앞뒤 조건비교하지 않아 더 간결해짐

> **문자열 슬라이싱**
>> 파이썬에서 문자열은 배열처럼 곧바로 인덱싱하여 다룰 수 있습니다.
>> 별도의 자료구조에 매핑하여 사용하는 것보다 거의 항상 나은 성능을 나타냅니다.

<br>
### [문자열 다루기] 로그파일 재정렬

조건은 다음과 같습니다.

1. 로그의 가장 앞 부분은 식별자이다.
2. 문자로 구성된 로그가 숫자 로그보다 앞에 온다.
3. 식별자는 순서에 영향을 끼치지 않지만, 문자가 동일한 경우 식별자 순으로 한다.
4. 숫자 로그는 입력 순서대로 한다.

[1] Input
```python
["digl 8 1 5 1", "letl art can", "dig2 3 6", "let2 own kit dig", "let3 art zero"]
```

[2] Output
```python
["letl art can", "let3 art zero", "let2 own kit dig", "digl 8 1 5 1", "dig2 3 6"]
```

```python
def reorder_log_files(logs: list) -> list:
    letters, digits = [], []
    for log in logs:
        if log.split()[1].isdigit():
            digits.append(log)
        else:
            letters.append(log)

    letters.sort(key=lambda x: (x.split()[1:], x.split()[0]))
    return letters + digits


logs = ["digl 8 1 5 1", "letl art can", "dig2 3 6", "let2 own kit dig", "let3 art zero"]
reorder_log_files(logs=logs)  # ["letl art can", "let3 art zero", "let2 own kit dig", "digl 8 1 5 1", "dig2 3 6"]
```

숫자로 된 로그는 입력 순서대로 맨 뒤에 붙고, 문자로 된 로그는 ```(1)문자열 순 (2)키순``` 우선순위대로 정렬합니다.
(이 정렬부위가 정렬 키로 람다함수가 쓰여진 곳)

<br>
### [문자열 다루기] 가장 흔한 단어

금지된 단어를 제외한 가장 흔하게 등장하는 단어를 출력합니다.
대소문자 구분하지 않으며, 구두점 또한 무시합니다.

```python
import re
import collections
from typing import List


def most_common_word(paragraph: str, banned: List[str]) -> str:
    words = [
        word
        for word in re.sub(r'[^\w]', ' ', paragraph).lower().split()
        if word not in banned
    ]

    # [CASE 1] Using collections.Counter
    counts = collections.Counter(words)
    return counts.most_common(1)[0][0]
    
    # [CASE 2] Using collections.defaultdict
    # counts = collections.defaultdict(int)
    # for word in words:
    #     counts[word] += 1
    # return max(counts, key=counts.get)


paragraph = 'Bob hit a ball, the hit BALL flew far after it was hit.'
banned = ['hit']
print(most_common_word(paragraph=paragraph, banned=banned))  # 'ball'
```

<br>
### [문자열 다루기] 그룹 애너그램

문자열 배열을 입력받아 애너그램 단위로 그룹핑합니다.

> **애너그램?**
>> 일종의 언어유희로, 동일한 문자열을 재배열하여 다른 뜻을 가진 단어로 바꾸는 것을 말합니다.

애너그램을 판단하는 가장 간단한 방법은 정렬하여 비교하는 것입니다. 동일 문자열로 구성되어 결국 같아지기 때문입니다.

```python
from collections import defaultdict


def make_anagram(anagrams: defaultdict, word: str) -> dict:
    anagrams[''.join(sorted(word))].append(word)
    return anagrams

words = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']
anagrams = defaultdict(list)
for word in words:
    make_anagram(anagrams=anagrams, word=word)

print([sorted(value) for value in anagrams.values()])  # [['ate', 'eat', 'tea'], ['nat', 'tan'], ['bat']]
```

<br>
### [문자열 다루기] 가장 긴 팰린드롬 부분 문자열

가장 긴 팰린드롬 부분 문자열의 길이를 출력합니다.

> **Longest Common Substring**
>> 최장 공통 부분 문자열은 여러 입력 문자열 중 공통된 가장 긴 부분 문자열을 찾는 문제입니다.
>> 보통은 다이나믹 프로그래밍으로 풀지만, 하나의 입력 문자열 중 가장 긴 팰린드롬을 찾는 문제이므로,
>> **투 포인터** 방식을 활용할 수 있습니다.

```python
import re


def get_sub_palindrome(string: str, left: int, right: int) -> str:
    # Expanding from substring length 2 or 3
    while left >= 0 and right < len(string) and string[left] == string[right]:
        left -= 1
        right += 1
    return string[left + 1:right]


def solution(string):
    # 영소문자, 특수문자 제거
    string = string.lower()
    string = re.sub('[^a-z0-9]', '', string)

    # 한 글자이거나, 문자열 전체가 펠린드롬인 경우
    if len(string) < 2 or string == string[::-1]:
        return len(string)

    # 가장 긴 부분 펠린드롬 구하기
    answer = ''
    for i in range(0, len(string) - 1):
        answer = max(
            answer,
            get_sub_palindrome(string, i, i + 1),
            get_sub_palindrome(string, i, i + 2),
            key=len
        )
    return len(answer)
```

<br>
## 선형 자료구조

선형 자료구조는 순차적(sequential)인 객체를 다룹니다.

### 파이썬에서의 배열

파이썬에서의 배열은 **동적 자료형**입니다.

이 말은, 주어지는 데이터에 따라서 할당된 메모리 공간이 가변적이라는 의미입니다.
이는 정적 할당 자료형보다는 처리속도 면에서 불리하긴 하지만, 사용자 편의성 측면에서의 이점이 더 크다고 볼 수 있습니다.

현실적으로 막대하게 큰 데이터나 가변성이 너무 높은 데이터가 아닌 이상 성능적인 이슈는 큰 문제가 되지 않습니다. (충분히 빠름)

파이썬에서 동적 배열은 초기 할당영역을 작게 잡았다가, 모두 채워지면 **더블링Doubling 이후 모두 복사하는 방식**으로 처리합니다.
초반에는 2배씩 늘리다가 전체적으로는 약 1.125배 수준으로 늘려갑니다.

> **파이썬에서 대표적인 동적 배열은 _list_ 자료구조입니다.**

<br>
### [배열] 두 수의 합

덧셈하여 타겟을 만들 수 있는 배열의 두 숫자 인덱스를 리턴합니다.

[1] Input
```python
nums, target = [2, 7, 11, 15], 9
```

[2] Output
```python
[0, 1]
```

```python
"""
Brute-Force, O(n^2)
"""

def get_two_sum_index_that_match_target1(nums: list, target: int) -> list:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []


nums, target = [2, 7, 11, 15], 9
print(get_two_sum_index_that_match_target1(nums, target))
```

```python
"""
Use keyword "in", O(n)
"""

def get_two_sum_index_that_match_target2(nums: list, target: int) -> list:
    for idx, num in enumerate(nums):
        complement = target - num
        if complement in nums[idx + 1:]:
            return [idx, nums.index(complement)]
    return []


nums, target = [2, 7, 11, 15], 9
print(get_two_sum_index_that_match_target2(nums, target))
```

```python
"""
Use reverse dict, advanced O(n)
    -> find the index directly by dict

풀이 3: 첫 번째 수를 뺀 결과 키 조회
    -> 인덱스와 값을 바꿔 값을 key 로 갖는 dict 자료형을 활용합니다.
    -> 첫 번째 수를 뺀 나머지 key 값에 해당하는 value 가 곧 찾는 인덱스가 되도록 합니다.
    -> 나머지 key 값이 주어진 데이터에 없을 수도 있으므로, 조건처리를 잘 해줍니다.
"""

def get_two_sum_index_by_dict(nums: list, target: int) -> list:
    nums_map = {}
    for idx, num in enumerate(nums):
        if target - num in nums_map:
            return [nums_map[target - num], idx]  # find directly using hash key
        nums_map[num] = idx
    return []


nums, target = [2, 7, 11, 15], 9
print(get_two_sum_index_by_dict(nums, target))
```

```python
"""
Two pointer, optimized O(n)

풀이 4: 투 포인터 활용하기
    -> 양 끝 포인터에서부터 탐색합니다.
    -> 탐색 이전에 정렬이 필요합니다.
    -> 그러나, 정렬하면 인덱스가 흐트러지기 때문에 답을 구할 수 없습니다.

따라서, 인덱스를 구하는 것이 아닌 매칭되는 값을 구하는 문제라면 투 포인터를 활용할 수 있습니다.
"""

def get_two_sum_index_by_dict(nums: list, target: int) -> list:
    nums_map = {}
    for idx, num in enumerate(nums):
        if target - num in nums_map:
            return [nums_map[target - num], idx]  # find directly using hash key
        nums_map[num] = idx
    return []


nums, target = [2, 7, 11, 15], 9
print(get_two_sum_index_by_dict(nums, target))
```

<br>
### [배열] 빗물 트래핑

높이를 입력 받아 비 온 후 얼마나 많은 물이 쌓일 수 있는지 계산합니다.

[1] Input
```python
[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
```

[2] Output
```python
6
```

```python
"""
Two pointer

투 포인터를 활용해 양 끝점 중 더 낮은 높이에서 높은 높이로 포인터를 이동시키며 진행합니다. (같은 경우 왼쪽 포인터 진행)
포인터가 이동할 때마다 각 사이드에서의 높이의 차이만큼씩 빗물의 양을 더해 나갑니다.
새로운 위치에서의 높이가 이전 위치에서의 최대 높이보다 높을 경우 최대 높이와 포인터 인덱스를 그것으로 교체합니다.
종료조건은 두 포인터가 만나는 지점입니다.
"""


def trap(height: list) -> int:
    if not height:
        return 0

    result = 0
    start, end = 0, len(height) - 1
    left_max, right_max = height[start], height[end]

    while start < end:
        left_max = max(left_max, height[start])
        right_max = max(right_max, height[end])
        if left_max <= right_max:
            result += left_max - height[start]
            start += 1
        else:
            result += right_max - height[end]
            end -= 1

    return result
```

<br>
### [배열] 세 수의 합

배열을 입력받아 합으로 0을 만들 수 있는 3개의 엘리먼트를 모두 출력합니다.

브루트 포스 방식으로 풀면 항이 세개이므로 ```O(n^3)``` 의 시간 복잡도가 걸립니다.
따라서 **투 포인터** 방식으로 해결하도록 합니다. (```O(n^2)```)

[1] Input
```python
nums = [-1, 0, 1, 2, -1, -4]
```

[2] Output
```python
[
    [-1, 0, 1],
    [-1, -1, 2],
]
```

정렬 이후, 기준 인덱스를 잡고 투 포인터를 이동시키며 해답을 찾습니다.

```python
from typing import List


def get_three_sum(nums: List[int]) -> List[List[int]]:
    results = []
    nums.sort()
    
    for i in range(len(nums) - 2):  # Two pointer
        # 중복된 값 건너뛰기
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # 간격을 좁혀가며 합 sum 계산
        left, right = i + 1, len(nums) - 1
        while left < right:
            three_sum = nums[i] + nums[left] + nums[right]
            if three_sum < 0:
                left += 1
            elif three_sum > 0:
                right -= 1
            else:
                # 0 인 경우 정답 처리
                results.append([nums[i], nums[left], nums[right]])

                # 다음 항에 동일한 값이 있는 경우 한칸 더 이동
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1

                # 포인터를 다음 항으로 이동
                left += 1
                right -= 1

    return results


nums = [-1, 0, 1, 2, -1, -4]
print(get_three_sum(nums=nums))
```

투 포인터 해법은 정렬된 리스트를 대상으로 한다는 점을 기억합시다.

<br>
### [배열] 배열 파티션 1

<br>
### [배열] 자신을 제외한 배열의 곱

<br>
### [배열] 주식을 사고 팔기 가장 좋은 시점

한 번의 거래로 낼 수 있는 최대 이익을 산출합니다.

[1] Input
```python
prices = [7, 1, 5, 3, 6, 4]
```

[2] Output
```python
# 1 일때 사서 6 일때 팔면 최대 수익 5
5
```

이 문제도 브루트 포스는 ```O(n^2)``` 의 시간 복잡도로 효율적이지 않습니다.

따라서 그래프상 시계열 우측으로 이동하면서 최저점과 현재 값과의 차이를 계산하여 그 값이 최대치인 경우를 해답으로 구할 수 있는데,
기술 통계적으로 그림을 그려보면 직관적으로 이해하기 쉽습니다.

여기서는 최저점과 최대값을 초기화한 후 각각 갱신해 나아가는 방식으로 풉니다.
전체 그래프에서 최저점 대비 최대값일 때가 가장 높은 수익입니다.

```python
import sys
from typing import List


INF = sys.maxsize


def max_profit(prices: List[int]) -> int:
    profit = 0
    min_price = INF

    # 최저점(min_price)과 최대값(profit)을 계속 갱신
    for price in prices:
        min_price = min(min_price, price)
        profit = max(profit, price - min_price)

    return profit


prices = [7, 1, 5, 3, 6, 4]
print(max_profit(prices=prices))
```

시계열로 진행하며 최저점이 바뀌면 결과 최대 profit 도 바뀝니다.

<br>
### 연결 리스트

연결 리스트는 대표적인 선형 자료구조로 모든 노드가 앞뒤 노드를 참조하는 방식으로 구현됩니다.

따라서 삽입, 삭제 시 해당 노드의 연결 관계만 바꿔주면 되어 전체적인 재정렬이 필요 없습니다.(배열은 재정렬됨)

그러나 꼬리를 무는 구조이기 때문에 특정 노드의 값을 탐색하기 위해서는 앞에서부터 순차적으로 찾아들어가야 합니다.
이는 배열이 특정 인덱스의 값을 한 번에 찾는 것과는 대조됩니다.

<br>
### [연결 리스트] 팰린드롬 연결 리스트

연결 리스트가 팰린드롬 구조인지 판별합니다.

[팰린드롬](#문자열-다루기-유효한-펠린드롬)은 뒤집어도 같은 말이 되는 단어 또는 문장을 의미합니다.

파이썬 문자열은 기본적으로 배열의 특징을 갖기 때문에 역 슬라이싱으로 쉽게 풀 수 있지만,
- ```string == string[::-1]```

이 문제에서는 연결 리스트로 이루어져 있다고 가정합니다.

[1] Input
```python
1->2
```

[2] Output
```python
False
```

[1] Input
```python
1->2->3->2->1
```

[2] Output
```python
True
```

물론 연결 리스트도 리니어Linear한 자료구조이므로, 배열(deque)로 변환하여 동일하게 풀 수 있습니다.
하지만 이 때는 배열로 변환하는 비용이 추가적으로 발생하므로, 다른 더 최적화된 방식을 고려해볼 수 있습니다.

더 최적화된 방식은 **런너Runner**를 활용하는 것입니다.
**아이디어는 두 배의 속도차이를 갖는 빠른 런너와 느린 런너를 초기화해 연결 리스트 head 에서부터 탐색**해나가는 것입니다.
<br>

> **런너 기법**
>> 런너Runner는 연결 리스트 순회 시 두 개의 포인터를 동시에 사용하는 기법입니다.
>> 한 포인터가 다른 포인터보다 앞서게 하여 병합 지점이나 중간 위치, 길이 등을 판별할 때 사용합니다.
>> 보통 fast 런너는 두 칸씩, slow 런너는 한 칸씩 이동하여 fast 가 끝에 도달하면 slow 는 정확히 중간 지점에 도달합니다.
>> 이렇게 중간 위치를 찾아내면, 값을 비교하거나 뒤집기 등에 활용 가능합니다. (리스트 문제에서 반드시 쓰이는 기법)

<br>

```python
class ListNode:
    def __init__(self, value: int, node: ListNode = None):
        self.value = value
        self.next = node


def is_palindrome(head: ListNode) -> bool:
    if head is None:
        return False

    # rev 는 연결 리스트의 역순. 엄밀히는 slow 포인터의 역순!
    # 따라서 마지막에 rev 와 slow 의 값을 순차적으로 비교하면 됨.
    rev = None

    # 동일 출발점인 head 에서 시작
    slow = fast = head

    # 런너를 이용해 역순 연결 리스트 구성
    while fast and fast.next:
        fast = fast.next.next
        rev, rev.next, slow = slow, rev, slow.next

    # fast 가 None 인지 여부에 따라 중앙값이 있는지 없는지 확인
    # 연결 리스트의 노드가 홀수 개인 경우 중앙값이 존재하게 되므로, slow 포인터의 개수가 rev 보다 하나 많게 됨
    # 따라서 한 칸 진행한 slow.next 부터 rev 와 비교 시작!!
    if fast:
        slow = slow.next

    # rev 와 slow 를 하나씩 탐색하며 팰린드롬 여부 확인
    while rev and rev.value == slow.value:
        slow, rev = slow.next, rev.next
    return not rev


# Test!
nums = [1, 2, 3, 2, 1]
head = ListNode(nums[0])
node = head
for num in nums[1:]:
    next = ListNode(num)
    node.next = next
    node = next

# Palindrome??
print(is_palindrome(head=head))  # True
```

<br>
### [연결 리스트] 두 정렬 리스트의 병합

<br>
### [연결 리스트] 역순 연결 리스트

<br>
### [연결 리스트] 두 수의 덧셈

<br>
### [연결 리스트] 페어의 노드 스왑

<br>
### [연결 리스트] 홀짝 연결 리스트

<br>
### [연결 리스트] 역순 연결 리스트 2

<br>
### 스택

스택은 LIFO, 큐는 FIFO 입니다.

파이썬에서는 **list 자료형으로 스택과 큐 모두를 사용**할 수 있지만,
**큐의 경우**는 더 나은 성능인 연결 리스트를 활용한 **deque 객체로 구현**합니다.
deque 는 첫 번째 인덱스의 값을 pop 하거나 중간값을 제거해도 전체적인 재정렬이 필요 없는 장점이 있습니다.

스택을 연결 리스트로 구현하면 다음과 같습니다.

```python
class Node:
    def __init__(self, item = None, next = None):
        self.item = item
        self.next = next


class Stack:
    def __init__(self):
        self.last = None

    def push(self, item):
        self.last = Node(item, self.last)

    def pop(self):
        item = self.last.item
        self.last = self.last.next
        return item


stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
stack.push(4)
stack.push(5)

for _ in range(5):
    print(stack.pop())  # 5, 4, 3, 2, 1 순으로 출력
```

<br>
### [스택] 유효한 괄호

<br>
### [스택] 중복 문자 제거

<br>
### [스택] 일일 온도

<br>
### 큐

> **큐Queue** 는 시퀀스의 한쪽 끝에는 엔티티를 추가하고, 다른 반대쪽에는 제거할 수 있는 엔티티 컬렉션이다.

큐 자체보다는 이를 응용한 **데크Deque** 나 **우선순위 큐Priority Queue** 가 자주 사용됩니다.

큐는 **BFS** 나 **캐시 구현**, **다익스트라 알고리즘에서 우선순위 방문 노드를 결정**할 때 사용됩니다.

<br>
### [큐] 큐를 이용한 스택 구현

파이썬에서 LIFO 인 스택은 list 이고, 연결 리스트를 활용해서 구현하기도 하지만,
이 문제에서는 **큐(FIFO)로 스택(LIFO)을 구현**하라고 하는 점이 흥미롭습니다.

따라서 큐를 활용한 스택에 값을 push 하면 해당 값을 맨 뒤가 아닌 맨 앞으로 보내 pop 시 우선적으로 리턴되도록 해야 합니다.

> **주의할 점**
>> 파이썬에서 deque 는 pop 과 leftpop 양쪽을 지원하기 때문에,
>> 문제의 취지를 살리고자 본래 큐의 기능인 leftpop 만을 사용하도록 구현합니다.

```python
from collections import deque


class MyStack:
    def __init__(self):
        """대표적인 큐 구현체인 데크 활용"""
        self.q = deque()

    def push(self, value):
        """스택이므로 마지막에 push 한다는 개념"""
        self.q.append(value)
        for _ in range(len(self.q) - 1):
            """맨 앞에 있던 값이 맨 뒤로 가도록 데크의 길이보다 1 적게 순회"""
            self.q.append(self.q.popleft())

    def pop(self):
        """스택이므로 마지막 값을 pop 한다는 개념"""
        return self.q.popleft()

    def top(self):
        """마지막 값을 가져옴"""
        return self.q[0]

    def empty(self):
        """스택이 비었는지 확인"""
        return len(self.q) == 0
```

<br>
### [큐] 스택을 이용한 큐 구현

이번엔 반대로 **스택(LIFO)으로 큐(FIFO)를 구현**합니다.

풀이는 ```[1] 스택 한 개를 활용한 풀이``` 와 ```[2] 스택 두 개를 활용한 풀이``` 두 방법이 있습니다.

```python
"""
[1] 스택 한 개를 활용한 풀이
    -> push 할 때 입력된 값을 스택의 제일 하단으로 보내고
    -> 기존의 스택은 뒤집어서(reversed) 새 스택의 뒤에 연결(extend) 해줍니다.
    -> 말 그대로 reversed 모듈과 extend 메서드를 사용할 수도 있습니다.
"""

class MyQueueOne:
    def __init__(self):
        """오리지날 스택인 list 활용"""
        self.stack = []

    def push(self, value):
        """큐이므로 마지막에 push 한다는 개념"""
        new_stack = [value]
        self.stack = list(reversed(self.stack))  # 직접 구현 reversed 기능을 사용하도록.
        for _ in range(len(self.stack)):
            new_stack.append(self.stack.pop())
        self.stack = new_stack

    def pop(self):
        """큐이므로 첫 번째 값을 pop 한다는 개념"""
        return self.stack.pop()

    def peek(self):
        """첫 번째 값을 가져옴"""
        return self.stack[-1]

    def empty(self):
        """큐가 비었는지 확인"""
        return len(self.stack) == 0
```


```python
"""
[2] 스택 두 개를 활용한 풀이
    -> 여기서는 reversed 된 출력용 output 스택을 하나 더 씁니다.
    -> output 은 peek 시에 한번 초기화됩니다.
"""

class MyQueueTwo:
    def __init__(self):
        self.input = []
        self.output = []

    def push(self, value):
        self.input.append(value)

    def pop(self):
        self.peek()  # output 한번 초기화!
        return self.output.pop()

    def peek(self):
        """output 이 없으면 모두 재입력 (한번 초기화)"""
        if not self.output:
            while self.input:
                self.output.append(self.input.pop())
        return self.output[-1]

    def empty(self):
        return len(self.stack) == 0
```

<br>
### [큐] 원형 큐 디자인

<br>
### 데크

**데크Deque** 는 Double-Ended Queue 의 줄임말입니다.

구현시에는 **이중 연결 리스트**를 활용하여 역방향 탐색도 가능하게 합니다.

<br>
### [데크] 원형 데크 디자인

<br>
### 우선순위 큐

**우선순위 큐Priority Queue** 는 큐 또는 스택과 같은 ADT 와 유사하지만,
추가로 각 요소의 **"우선순위"**와 연관되어 있습니다.

따라서 우선순위 큐에서는 어떠한 특정 조건에 따라 **우선순위가 가장 높은 요소가 추출**됩니다.

파이썬에서 우선순위 큐는 heapq 객체가 사용됩니다.

<br>
### [우선순위 큐] k개 정렬 리스트 병합

주어진 k 개의 정렬된 리스트를 1 개의 정렬된 리스트로 병합합니다.

[1] Input
```python
[
    1->4->5,
    1->3->4,
    2->6
]
```

[2] Output
```python
1->1->2->3->4->4->5->6
```

여기서 k 는 3.

```python
import heapq
from typing import List


class ListNode:
    def __init__(self, value: int, node: ListNode = None):
        self.value = value
        self.next = node


def merge_K_lists(lists: List[ListNode]) -> ListNode:
    root = result = ListNode(None)
    heap = []

    # 각 연결 리스트의 루트를 힙에 저장
    for i in range(len(lists)):
        if lists[i]:
            # (value, index, node) 형태로 heappush 하면 value 우선순위대로 오름차순 정렬됨
            heapq.heappush(heap, (lists[i].value, i, lists[i]))

    # 힙 추출 이후 다음 노드는 다시 저장
    while heap:
        node = heapq.heappop(heap)
        idx = node[1]
        result.next = node[2]

        result = result.next
        if result.next:
            heapq.heappush(heap, (result.next.value, idx, result.next))

    return root.next
```

<br>
### 해시 테이블: 해시

<br>
### 해시 테이블: 충돌

<br>
### [해시 테이블] 해시맵 디자인

<br>
### [해시 테이블] 보석과 돌

<br>
### [해시 테이블] 중복 문자 없는 가장 긴 부분 문자열

<br>
### [해시 테이블] 상위 K 빈도 요소

<br>
## 비선형 자료구조

<br>
### 오일러 경로

<br>
### 해밀턴 경로

<br>
### 그래프 순회

<br>
### 백트래킹

<br>
### 제약 충족 문제

<br>
### [그래프] 섬의 개수

<br>
### [그래프] 전화번호 문자 조합

<br>
### [그래프] 순열

<br>
### [그래프] 조합

<br>
### [그래프] 조합의 합

<br>
### [그래프] 부분 집합

<br>
### [그래프] 일정 재구성

<br>
### [그래프] 코스 스케줄

<br>
### [최단 경로 문제] 네트워크 딜레이 타임

<br>
### [최단 경로 문제] K 경유지 내 가장 저렴한 항공권

<br>
### 트리

<br>
### [트리] 이진 트리의 최대 깊이

<br>
### [트리] 이진 트리의 직경

<br>
### [트리] 가장 긴 동일 값의 경로

<br>
### [트리] 이진 트리의 반전

<br>
### [트리] 두 이진 트리 병합

<br>
### [트리] 이진 트리 직렬화 & 역직렬화

<br>
### [트리] 균형 이진 트리

<br>
### [트리] 최소 높이 트리

<br>
### 이진 탐색 트리 (BST)

<br>
### [트리] 정렬된 배열의 이진 탐색 트리 변환

<br>
### [트리] 이진 탐색 트리를 더 큰 수 함계 트리로

<br>
### [트리] 이진 탐색 트리 합의 범위

<br>
### [트리] 이진 탐색 트리 노드 간 최소 거리

<br>
### 트리 순회

<br>
### [트리] 전위, 중위 순회 결과로 이진 트리 구축

<br>
### 힙

<br>
### [힙] 배열의 K번째 큰 요소

<br>
### [트라이] 트라이 구현

<br>
### [트라이] 팰린드롬 페어

<br>
## 알고리즘

본격적인 알고리즘 풀이입니다.
알고리즘은 다음의 순서로 풉시다.

0. 문제 파악!!
1. 어떤 알고리즘을 적용할지 떠오르면 빠르게 바로 적용해보기
2. 떠오르지 않는다면 다음의 순서대로 적용 가능한지 판단해보기
    - **브루트 포스**
        - 일반적으로 최적의 풀이가 아니므로 연습 혹은 가닥을 잡아가는 느낌으로 빠르게 구현
        - 효율성을 고려하지 않는 문제라면 이것으로 바로 풀어버리기
        - _[[**카카오 기출**] 숫자 야구](#숫자-야구)_
    - **투 포인터**
        - 완전 탐색(브루트 포스)에 비해 시간복잡도를 획기적으로 줄여줌
        - 일차원 배열 혹은 이차원 배열에서 탐색해 들어갈 경우 사용
        - _[[**문자열 다루기**] 가장 긴 팰린드롬 부분 문자열](#문자열-다루기-가장-긴-팰린드롬-부분-문자열)_,
            _[[**배열**] 두 수의 합](#배열-두-수의-합)_
        - _[[**배열**] 빗물 트래핑](#배열-빗물-트래핑)_, _[[**배열**] 세 수의 합](#배열-세-수의-합)_
    - **슬라이딩 윈도우**
    - **이진 검색**
        - 보통 절반씩 범주가 줄어들어 ```O(logn)``` 의 좋은 성능
        - 정렬되어 있어야 함! (안되어있으면 먼저 수행)
        - _[[**카카오 기출**] 징검다리 문제](#징검다리-문제)_
    - **그리디**
    - **시뮬레이션 / 구현**
    - **DFS, BFS**
        - 그래프에서 정점 탐색 시, 깊이 우선 탐색 혹은 너비 우선 탐색
        - BFS 는 최단 거리 구하는 문제 (재방문 등의 조건이 추가될 수 있음)
            - -> _[[**카카오 기출**] 경주로 건설](#경주로-건설)_
        - 최단 거리는 플로이드-와샬, 다익스트라 등의 그래프 알고리즘으로도 품
        - 네트워크 개수 구하기 문제!
    - **분할 정복**
        - 최적 부분 구조를 찾는 것이 핵심!
    - **DP**
        - 메모이제이션과 초기값 세팅이 핵심!
3. 추가로 고려해 볼 알고리즘
    - **우선순위 큐**
        - 일반적인 데크에서 요소의 특정 값에 따라 오름/내림차순으로 정렬되는 큐!
        - 다익스트라에서도 활용됨
    - **해시 맵**
        - 배열 내 빈도수 구하기
        - 배열 내 중복된 요소 구하기
    - **길찾기 알고리즘**
        - **플로이드-와샬, 다익스트라, 크루스칼**

<br>
### 버블 정렬

<br>
### 병합 정렬

<br>
### 퀵 정렬

<br>
### 안정 정렬 vs 불안정 정렬

<br>
### [정렬] 리스트 정렬

<br>
### [정렬] 구간 병합

<br>
### [정렬] 삽입 정렬 리스트

<br>
### [정렬] 가장 큰 수

<br>
### [정렬] 유효한 애너그램

<br>
### [정렬] 색 정렬

<br>
### [정렬] 원점에 K번째로 가까운 점

<br>
### 이진 검색

<br>
### [이진 검색] 회전 정렬된 배열 검색

<br>
### [이진 검색] 두 배열의 교집합

<br>
### [이진 검색] 두 수의 합 2

<br>
### [이진 검색] 2D 행렬 검색 2

<br>
### 비트 조작

<br>
### 부울 연산자

<br>
### 비트 연산자

<br>
### 비트 조작 퀴즈

<br>
### 2의 보수

<br>
### [비트 조작] 싱글 넘버

<br>
### [비트 조작] 해밍 거리

<br>
### [비트 조작] 두 정수의 합

<br>
### [비트 조작] UTF-8 검증

<br>
### [비트 조작] 1비트의 개수

<br>
### 슬라이딩 윈도우

<br>
### [슬라이딩 윈도우] 최대 슬라이딩 윈도우

<br>
### [슬라이딩 윈도우] 부분 문자열이 포함된 최소 윈도우

<br>
### [슬라이딩 윈도우] 가장 긴 반복 문자 대체

<br>
### 그리디 알고리즘 

<br>
### 배낭 문제 

<br>
### 동전 바꾸기 문제 

<br>
### 가장 큰 합

<br>
### [그리디 알고리즘] 주식을 사고팔기 가장 좋은 시점 2

<br>
### [그리디 알고리즘] 키에 따른 대기열 재구성

<br>
### [그리디 알고리즘] 태스크 스케줄러

<br>
### [그리디 알고리즘] 주유소

<br>
### [그리디 알고리즘] 쿠키 부여

<br>
### 분할 정복

<br>
### [분할 정복] 과반수 엘리먼트

<br>
### [분할 정복] 괄호를 삽입하는 여러 가지 방법

<br>
### 다이나믹 프로그래밍

<br>
### 최적 부분 구조

<br>
### 중복된 하위 문제들

<br>
### 다이나믹 프로그래밍 방법론

<br>
### [다이나믹 프로그래밍] 피보나치 수

<br>
### 0-1 배낭 문제

<br>
### [다이나믹 프로그래밍] 최대 서브 배열

<br>
### [다이나믹 프로그래밍] 계단 오르기

<br>
### [다이나믹 프로그래밍] 집 도둑

<br>
## 카카오 공채 문제 풀이

<br>
### 비밀 지도

<br>
### 다트 게임

<br>
### 캐시

<br>
### 셔틀 버스

<br>
### 뉴스 클러스터링

<br>
### 프렌즈4블록

<br>
### 추석 트래픽

<br>
### 숫자 야구

<br>
### 경주로 건설

<br>
### 징검다리 문제

<br><br>

---

<br>
## 21년 하반기 PLAN

<br>
### [필수 공부] -> 목요일(9/9)까지 완료
- 해시 테이블
- 경로, 그래프, 최단 경로
- 트리, BST
- 비트 조작, 부울
- 슬라이딩 윈도우

<br>
### [공부했던것 참조, 정리] -> 토요일(9/11) 테스트 이전까지 정리
- 정렬 알고리즘(버블, 병합, 퀵, 안정불안정)
- 이진 탐색 알고리즘
- 그리디 알고리즘
- 분할 정복 알고리즘
- DP 알고리즘

<br>
### [카카오 공채 모두 풀어보기 or 해법 확인] -> 금요일(9/10)까지 완료

