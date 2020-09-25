---
title:  "[알고리즘] 기본, 그리디, 구현"
created:   2020-09-08 22:29:25 +0900
updated:   2020-09-25 23:45:14 +0900
author: namu
categories: algorithm
permalink: "/algorithm/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2017/11/12/18/32/book-2943383__480.png
image-view: true
image-author: 200degrees
image-source: https://pixabay.com/ko/users/200degrees-2051452/
---

<br>
## 들어가며

[안경잡이개발자](https://ndb796.tistory.com/)님의
[이것이 취업을 위한 코딩테스트이다 with python 유튭 강의](https://www.youtube.com/watch?v=Lytj_xcw8mE&list=PLRx0vPvlEmdBFBFOoK649FlEMouHISo8N)에서
참조했다.

<br>
## 순열과 조합

순열과 조합은 모든 경우의 수를 고려해야 할 때 사용하는 완전탐색 알고리즘이다.<br>
**순열**: 서로 다른 n개에서 서로 다른 r개를 선택하여 일렬로 나열하는 것
- nPr = n * (n - 1) * (n - 2) * ... * (n - r + 1)
- 10P5 = 10 * 9 * 8 * 7 * 6

```python
# permutation
from itertools import permutations, product


# 순열
data = ['A', 'B', 'C']
result = list(permutations(data, 3))
print(result)  # [('A', 'B', 'C'), ('A', 'C', 'B'), ('B', 'A', 'C'), ('B', 'C', 'A'), ('C', 'A', 'B'), ('C', 'B', 'A')]

# 중복 순열
result = list(product(data, repeat=2))
print(result)  # [('A', 'A'), ('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'B'), ('B', 'C'), ('C', 'A'), ('C', 'B'), ('C', 'C')]
```

**조합**: 서로 다른 n개에서 순서에 상관 없이 서로 다른 r개를 선택하는 것
- nCr = nPr / r! = n * (n - 1) * (n - 2) * ... * (n - r + 1) / r * (r - 1) * (r - 2) * ... * 2 * 1
- 10C5 = (10 * 9 * 8 * 7 * 6) / (5 * 4 * 3 * 2 * 1)

```python
# permutation
from itertools import combinations, combinations_with_replacement


# 조합
data = ['A', 'B', 'C']
result = list(combinations(data, 2))
print(result)  # [('A', 'B'), ('A', 'C'), ('B', 'C')]

# 중복 조합
result = list(combinations_with_replacement(data, 2))
print(result)  # [('A', 'A'), ('A', 'B'), ('A', 'C'), ('B', 'B'), ('B', 'C'), ('C', 'C')]
```

<br>
## 그리디

현재 상황에서 단순히 가장 좋은 것만 선택하는 탐욕적 알고리즘이다.
핵심 아이디어을 얼마나 정확하게 파악하고 그대로 구현해 내는지가 관건이다.

**거스름 돈 문제**: 500원, 100원, 50원, 10원짜리 조합 중에서 거스름돈 N원을 구성하는 동전의 최소 개수 구하기
- 핵심 아이디어 >> 당연히 500원으로만 구성할수록 최소 동전이다!

```python
N = 1260  # 원
def solution(N):
    result = 0  # 동전개수
    coins = [500, 100, 50, 10]

    for coin in coins:
        result += N // coin
        N %= coin
    return result
```

<br>
## 구현: 시뮬레이션과 완전 탐색

구현 문제는 **풀이를 떠올리는 것은 쉽지만 소스코드로 옮기기 어려운 문제**를 의미한다.

**행렬(Matrix)**은 알고리즘 문제에서 2차원 공간 좌표계를 나타낼 때 많이 쓰이는데,
x축을 행(row, i, 세로 방향으로 증감)으로 y축을 열(column, j, 가로 방향으로 증감)로 본다. 이를 i와 j의 이중 반복문으로 표현 가능하다.

**방향 벡터**는 2차원 공간에서 좌표를 움직일때 쓰인다. 보통 dx와 dy벡터 리스트를 정의하고 현재 위치로부터 인덱스에 따라 방향을 이동한다.
```python
# 동, 북, 서, 남
dx = [0, -1, 0, 1]
dy = [1, 0, -1, 0]

# 현재 위치
x, y = 2, 2

for i in range(4):
    nx = x + dx[i]
    ny = y + dy[i]
    print(nx, ny)
```
좌표를 이동하다가 만약 행렬의 범위 바깥으로 벗어난다면 그것은 무시한다(벡터 변하지 않음).

**상하좌우 문제**: 여행가 A가 N x N 크기 공간의 (1, 1) 위치에서부터 정의된 방향 벡터(L, R, U, D)에 따라
입력된 plans 만큼 이동하기
- 정사각형 공간 범위를 벗어나면 움직임은 무시된다

```python
# N 입력
n = int(input())
x, y = 1, 1
plans = input().split()

# L, R, U, D
dx = [0, 0, -1, 1]
dy = [-1, 1, 0, 0]
move_types = ['L', 'R', 'U', 'D']

for plan in plans:
    for idx, move_type in enumerate(move_types):
        if plan == move_type:
            nx = x + dx[idx]
            ny = y + dy[idx]

            # filter exceed
            if 0 < nx < n + 1:
                x = nx
            if 0 < ny < n + 1:
                y = ny
print(x, y)
```

**문자열 재정렬 문제**: 알파벳 대문자와 숫자(0 ~ 9)로만 구성된 문자열에서 알파벳 대문자 오름차순 출력 이후
모든 숫자를 더한 값을 이어서 출력하기
```python
input_string = input()
result = []
value = 0

for unit in input_string:
    if unit.isalpha():
        result.append(unit.upper())
    else:
        value += int(unit)

result.sort()
if value > 0:
    result.append(str(value))

print(''.join(result))
```

<br>
## 배열의 특정 연속된 구간을 처리하는 경우

연속된 구간이 짧다면 성능상 문제가 없겠지만, 데이터가 백만개라고 하면 O(N²) 으로 시간복잡도가 너무 커진다.
연속된 수 N 이 커짐에 따라 그 개수만큼 더 탐색을 진행해야 하기 때문이다.
그러나 아래의 알고리즘들을 활용하면, N 개의 수를 전체 한 번만 탐색하면 되는 O(N) 의 시간복잡도가 충족된다. 

**투 포인터1**: 자연수로 구성된 수열 중 합이 5인 부분 연속 수열의 개수 구하기

투 포인터는 리스트에 순차적으로 접근해야 할 때 두 개의 점을 이용해 위치를 기록하면서 처리하는 기법이다.

| 1 | 2 | 3 | 4 | 5 |

```python
def two_pointer(m, nums):
    start, end, partial_sum, count = 0, 0, 0, 0
    while start < len(nums):
        while partial_sum < m and end < len(nums):
            partial_sum += nums[end]
            end += 1
        if partial_sum == m:
            count += 1
        partial_sum -= nums[start]
        start += 1
    return count
```

m = 5 로 주어진다면, start 포인터와 end 포인터 둘다 인덱스 0 에서부터 시작해서
인덱스 1 씩 올려가며 구간합이 5 인 부분합의 개수를 count 한다.

먼저 end 인덱스를 반복해 올려가며 더하는데, 주어진 수 5 보다 같거나 커지는 경우 반복을 종료하고 조건에 부합하며 count 를 1 올린다.
그다음 start 인덱스를 1 올리고 다음 end 반복을 수행한다.

만약 end 가 주어진 리스트 nums 을 마지막 인덱스에 도달하면 멈추고, start 만 1 씩 증가시키며 count 조건을 확인한다.

**투 포인터2**: 자연수로 구성된 수열 중 주어진 인덱스 구간의 부분합 중 가장 큰 수 구하기

같은 기법을 활용하여 이번에는 주어긴 구간합 중 최대값을 구한다.

| 1 | 2 | 3 | 4 | 5 |

```python
def two_pointer2(m, nums):
    partial_sum = 0
    for i in range(m):
        partial_sum += nums[i]
    result = partial_sum
    start, end = 0, m
    while end < len(nums):
        partial_sum -= nums[start]
        partial_sum += nums[end]
        result = partial_sum > result and partial_sum or result
        start, end = start + 1, end + 1
    return result
```

인덱스 구간(간격)은 m 으로 주어지고, 각 구간합 중 최대값을 result 에 저장하여 반환한다.

**구간 합**: N 개의 정수로 구현된 수열에서 M 개의 쿼리에서 표현되는 각각의 구간 합 구하기

쿼리는 **[L, R]** 구간을 의미하며, 구간 합을 구하면 된다.<br>
아이디어는 간단하다. **접두사 합Prefix Sum**을 구하는 것.
수열 list 에서 각 인덱스의 prefix sum 테이블을 구한 뒤,
쿼리에서 지정된 R 의 누적합에서 L - 1 의 누적합을 빼면 된다. -> O(N + M)

| 10 | 20 | 30 | 40 | 50 |

```python
def section_sum(num_list: list, query_list: list):
    sum_list = []
    prefix_sum = [0]
    summary = 0
    for num in num_list:
        summary += num
        prefix_sum.append(summary)
    print(f'[PREFIX-SUM] {prefix_sum}')  # [0, 10, 30, 60, 100, 150]
    for query in query_list:
        sum_list.append(prefix_sum[query[1]] - prefix_sum[query[0] - 1])
    return sum_list


if __name__ == '__main__':
    # [60, 70, 140]
    section_sum(
        num_list=[10, 20, 30, 40, 50],
        query_list=[  # [[L, R]]
            [1, 3],
            [3, 4],
            [2, 5],
        ]
    )
```
