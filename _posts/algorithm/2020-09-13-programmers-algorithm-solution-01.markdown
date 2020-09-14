---
title:  "[플머스] 알고리즘 문제 해설"
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
2. [순열 검사](#순열-검사)
3. [나머지 한 점](#나머지-한-점)
4. [가장 큰 정사각형 찾기](#가장-큰-정사각형-찾기)

---

<br>
## 들어가며

[_프로그래머스 알고리즘 문제 해설 강의_](https://programmers.co.kr/learn/courses/18) 의
문제들을 직접 풀어보고 해설과 비교해 보았다.

<br>
## 자릿수 더하기

**핵심 개념**

1의자리 수는 나머지 연산으로, 오른쪽 자리수로 당기기는 몫 연산으로 가능하다는 아이디어 떠올리기.

**문제 설명**

자연수 N이 주어지면, N의 각 자릿수의 합을 구해서 return 하는 solution 함수를 만들어 주세요.
예를들어 N = 123이면 1 + 2 + 3 = 6을 return 하면 됩니다.
- N의 범위 : 100,000,000 이하의 자연수

**입출력 예**

| N	| answer |
|:--|:--|
| 987 | 24 |

```python
# my solution
# 문자열 변환 리스트에서 각 자리수를 숫자로 변환하여 answer 에 더한다.
def my_solution(n):
    answer = 0
    num_list = [int(s) for s in str(n)]
    for num in num_list:
        answer += num
    return answer

# solution
# 각 자리수는 10으로 나눈 나머지이고, 다음 자리수는 10으로 나눈 몫이다.
def solution(n):
    answer = 0
    while n > 0:
        answer += n % 10
        n = n // 10
    return answer
```


<br>
## 순열 검사

**핵심 개념**

리스트 정렬 이후 중복 없이 연속된 수라는 점 캐치!

**문제 설명**

_이 문제는 효율성 테스트를 포함하고 있다._

길이가 n인 배열에 1부터 n까지 숫자가 중복 없이 한 번씩 들어 있는지를 확인하려고 합니다.
1부터 n까지 숫자가 중복 없이 한 번씩 들어 있는 경우 true를, 아닌 경우 false를 반환하도록 함수 solution을 완성해주세요.
- 배열의 길이는 10만 이하입니다.
- 배열의 원소는 0 이상 10만 이하인 정수입니다.

**입출력 예**

| arr | result |
|:--|:--|
| [4, 1, 3, 2] | true |
| [4, 1, 3] | false |

```python
# list 를 정렬한 후, 각 인덱스에 합당한 수가 들어있는지 체크.
# 중복 없이 한 번씩 들어 있는지 확인하기 때문.
def solution(arr):  # [4, 1, 3, 2]
    answer = True
    arr.sort()
    for idx, num in enumerate(arr):
        if idx + 1 != num:
            answer = False
            break  # 불필요한 반복 하지 않도록.
    return answer
```

이 문제의 해설을 보면 check 를 위한 list 를 별도로 만들어 체크값인 1을 채워넣는 식으로 풀기도 한다.

<br>
## 나머지 한 점

**핵심 개념**

xor 비트연산을 아는지? 그 특성을 활용할 방법을 떠올릴 수 있는지?

**문제 설명**

직사각형을 만드는 데 필요한 4개의 점 중 3개의 좌표가 주어질 때, 나머지 한 점의 좌표를 구하려고 합니다. 점 3개의 좌표가 들어있는 배열 v가 매개변수로 주어질 때, 직사각형을 만드는 데 필요한 나머지 한 점의 좌표를 return 하도록 solution 함수를 완성해주세요. 단, 직사각형의 각 변은 x축, y축에 평행하며, 반드시 직사각형을 만들 수 있는 경우만 입력으로 주어집니다.
- v는 세 점의 좌표가 들어있는 2차원 배열입니다.
- v의 각 원소는 점의 좌표를 나타내며, 좌표는 [x축 좌표, y축 좌표] 순으로 주어집니다.
- 좌표값은 1 이상 10억 이하의 자연수입니다.
- 직사각형을 만드는 데 필요한 나머지 한 점의 좌표를 [x축 좌표, y축 좌표] 순으로 담아 return 해주세요.

**입출력 예**

| v | result |
|:--|:--|
| [[1, 4], [3, 4], [3, 10]] | [1, 10] |
| [[1, 1], [2, 2], [1, 2]] | [2, 1] |

```python
# my solution
# 직사각형의 x축, y축 꼭지점의 좌표 dict 를 만든 후,
# 각 좌표값의 카운트를 세어 최종 값이 1인 좌표로 answer 를 구성한다. -> O(n)
def my_solution(v):
    answer = []
    result_dict = {'x': {}, 'y': {}}
    for point in v:
        x, y = point[0], point[1]
        if x not in result_dict['x']:
            result_dict['x'][x] = 1
        else:
            result_dict['x'][x] += 1
        if y not in result_dict['y']:
            result_dict['y'][y] = 1
        else:
            result_dict['y'][y] += 1
    for key in result_dict['x']:
        if result_dict['x'][key] == 1:
            answer.append(key)
    for key in result_dict['y']:
        if result_dict['y'][key] == 1:
            answer.append(key)
    return answer

# solution
# 배타적 논리합(xor) 활용하기
# 파이썬에서 xor 의 연산자는 ^ 이다.
# x, y축 각각의 좌표는 항상 2개씩이므로, 입력된 꼭지점 배열 횟수만큼 xor 연산해주면 된다.
def solution(v):
    answer = [0, 0]
    for point in v:
        answer[0] ^= point[0]
        answer[1] ^= point[1]
    return answer
```

<br>
## 가장 큰 정사각형 찾기

**핵심 개념**

[_dynamic programming_]()

**문제 설명**

1와 0로 채워진 표(board)가 있습니다. 표 1칸은 1 x 1 의 정사각형으로 이루어져 있습니다. 표에서 1로 이루어진 가장 큰 정사각형을 찾아 넓이를 return 하는 solution 함수를 완성해 주세요. (단, 정사각형이란 축에 평행한 정사각형을 말합니다.)
- 표(board)는 2차원 배열로 주어집니다.
- 표(board)의 행(row)의 크기 : 1,000 이하의 자연수
- 표(board)의 열(column)의 크기 : 1,000 이하의 자연수
- 표(board)의 값은 1또는 0으로만 이루어져 있습니다.

**입출력 예**

| board | answer |
|:--|:--|
| [[0,1,1,1],[1,1,1,1],[1,1,1,1],[0,0,1,0]] | 9 |
| [[0,0,1,1],[1,1,1,1]] | 4 |
