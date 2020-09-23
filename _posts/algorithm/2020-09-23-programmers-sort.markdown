---
title:  "[플머스] 정렬"
created:   2020-09-13 19:32:15 +0900
updated:   2020-09-13 23:05:10 +0900
author: namu
categories: algorithm
permalink: "/algorithm/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2017/11/12/18/32/book-2943383__480.png
image-view: true
image-author: 200degrees
image-source: https://pixabay.com/ko/users/200degrees-2051452/
---


---

[목차]

1. [자릿수 더하기](#자릿수-더하기)
2. [가장 큰 수](#가장-큰-수)
2. [H-Index](#h-index)

---

<br>
## 들어가며

[_프로그래머스 정렬 파트_](https://programmers.co.kr/learn/courses/30/parts/12198) 의
문제들을 직접 풀어보고 해설과 비교해 보았다.

<br>
## 자릿수 더하기

**핵심 개념**

list 자료형 인덱싱과 정렬에 대한 기본적인 이해

**문제 설명**

배열 array의 i번째 숫자부터 j번째 숫자까지 자르고 정렬했을 때, k번째에 있는 수를 구하려 합니다.

예를 들어 array가 [1, 5, 2, 6, 3, 7, 4], i = 2, j = 5, k = 3이라면

1. array의 2번째부터 5번째까지 자르면 [5, 2, 6, 3]입니다.
2. 1에서 나온 배열을 정렬하면 [2, 3, 5, 6]입니다.
3. 2에서 나온 배열의 3번째 숫자는 5입니다.

배열 array, [i, j, k]를 원소로 가진 2차원 배열 commands가 매개변수로 주어질 때,
commands의 모든 원소에 대해 앞서 설명한 연산을 적용했을 때 나온 결과를 배열에 담아 return 하도록 solution 함수를 작성해주세요.
- array의 길이는 1 이상 100 이하입니다.
- array의 각 원소는 1 이상 100 이하입니다.
- commands의 길이는 1 이상 50 이하입니다.
- commands의 각 원소는 길이가 3입니다.

**입출력 예**

| array	| commands | return |
|:--|:--|:--|
| [1, 5, 2, 6, 3, 7, 4] | [[2, 5, 3], [4, 4, 1], [1, 7, 3]] | [5, 6, 3] |

```python
def my_solution(array, commands):
    answer = []
    for command in commands:
        i, j, k = command[0], command[1], command[2]
        arr = array[i - 1:j]
        arr.sort()
        answer.append(arr[k - 1])
    return answer


def solution(array, commands):
    return list(map(lambda x: sorted(array[x[0]-1:x[1]])[x[2]-1], commands))
```

문제를 처음 따라가서 풀면 _my_solution_ 처럼 일딴 짜게되고
더 파이썬스럽게 고민하다보면 _solution_ 같은 한줄코드가 나오게 된다!

인덱싱에서 i 번 인덱스와 i 번째 인덱스의 미묘한(?) 차이점을 잘 파악해야 하고,
list 의 **sort 메서드**와 **sorted 함수**를 자유자재로 사용해야 한다(대표적으로 반환 유무).

추가로 **map 함수**는 **이터러블 객체(commands)의 각 요소를 주어진 함수(lambda 이하)의 반환값으로 매핑**시켜준다.
map 객체로 반환되기 때문에 list 로 변환이 필요하다.

<br>
## 가장 큰 수

**핵심 개념**

정렬에 대한 기본적인 이해, str 간의 비교는 ASCII 코드로 변환하여 이루어진다.

**문제 설명**

0 또는 양의 정수가 주어졌을 때, 정수를 이어 붙여 만들 수 있는 가장 큰 수를 알아내 주세요.

예를 들어, 주어진 정수가 [6, 10, 2]라면 [6102, 6210, 1062, 1026, 2610, 2106]를 만들 수 있고, 이중 가장 큰 수는 6210입니다.

0 또는 양의 정수가 담긴 배열 numbers가 매개변수로 주어질 때,
순서를 재배치하여 만들 수 있는 가장 큰 수를 문자열로 바꾸어 return 하도록 solution 함수를 작성해주세요.
- numbers의 길이는 1 이상 100,000 이하입니다.
- numbers의 원소는 0 이상 1,000 이하입니다.
- 정답이 너무 클 수 있으니 문자열로 바꾸어 return 합니다.

**입출력 예**

| numbers | return |
|:--|:--|
| [6, 60, 2] | "6602" |
| [3, 30, 34, 5, 9] | "9534330" |

```python
def max_solution(numbers):
    return str(int(''.join(sorted(list(map(str, numbers)), key=lambda x: x*3, reverse=True))))
```

단순히 내림차순 정렬하면 되겠다고 생각할 수 있지만, 예외적인 경우가 있다.

숫자끼리 비교한다면 60 이 6 보다 크다.
하지만 이 문제에서는 **reverse 정렬 시 6 이 60 보다 앞에 정렬**되어야 붙였을 때 가장 큰 수가 된다.

따라서 numbers 요소 자리수 제한 세 자리(1000 이하)를 참고하여 각 요소의 숫자를 str 타입으로 바꿔 3 씩 곱해 조정해준다.
결국 "666" 과 "606060" 의 대소 비교를 하게 되는데, 이때는 첫자리 6 은 같고 둘째자리 는 6 이 0 보다 크기 때문에
최종적으로 6 이 60 보다 앞에 정렬된다.

<br>
## H-Index

**핵심 개념**

문제 설명의 조건에 대한 확실한 이해가 필요

**문제 설명**

H-Index는 과학자의 생산성과 영향력을 나타내는 지표입니다.
어느 과학자의 H-Index를 나타내는 값인 h를 구하려고 합니다.
위키백과1에 따르면, H-Index는 다음과 같이 구합니다.

어떤 과학자가 발표한 논문 n편 중, h번 이상 인용된 논문이 h편 이상이고 나머지 논문이 h번 이하 인용되었다면 h의 최댓값이 이 과학자의 H-Index입니다.

어떤 과학자가 발표한 논문의 인용 횟수를 담은 배열 citations가 매개변수로 주어질 때,
이 과학자의 H-Index를 return 하도록 solution 함수를 작성해주세요.
- 과학자가 발표한 논문의 수는 1편 이상 1,000편 이하입니다.
- 논문별 인용 횟수는 0회 이상 10,000회 이하입니다.

**입출력 예**

| citations | return |
|:--|:--|
| [3, 0, 6, 1, 5] | 3 |

```python
def my_h_index_solution(citations):
    answer = 0
    citations.sort(reverse=True)
    for i in range(1, len(citations) + 1):  # start with index number 1
        if i <= citations[i - 1]:
            answer = i
        else:
            answer = citations[i - 1]
        if answer >= citations[i]:
            break
    return answer


def h_index_solution(citations):
    return max(map(min, enumerate(sorted(citations, reverse=True), start=1)))
```

H-Index 를 처음 접하는 사람이 문제 설명을 충분히 읽어보지 않으면 함정에 빠질 수 있다.
예를 들어 ```citations = [5, 0, 5, 0]``` 으로 주어졌을 때
결과값을 5 로 생각해 버릴 수가 있는데, 이는 ```5 번 이상 인용된 논문이 5 편 이상이고 나머지 논문이 5 번 이하 인용된다```는 조건에 부합하지 않다.
5 번씩 인용된 논문이 2 개이므로 2 가 답이다.
