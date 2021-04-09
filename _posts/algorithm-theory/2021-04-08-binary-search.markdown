---
title:  "[분할정복] 이진 탐색"
created:   2021-04-08 21:03:27 +0900
updated:   2021-04-08 21:03:27 +0900
author: namu
categories: algorithm-theory
permalink: "/algorithm-theory/:year/:month/:day/:title"
image: https://companiesdigest.com/wp-content/uploads/2020/10/Untitled-design-2-1280x720.jpg
image-view: true
image-author: companiesdigest.com
image-source: https://companiesdigest.com/divide-and-conquer-algorithms/
---

<br>
## 분할정복 -> Divide and Conquer

_```나누고 정복한다.```_

이 방식은 말 그대로 처리가 가능한 가장 작은 단위까지 **분할**해가며 각 결과들을 활용해 해를 구합니다(**정복**).
따라서 하향식의 재귀적인 방법 많이 사용되며, 필요에 따라 분할의 결과들을 **병합**합니다.

<br>
## 알고리즘 설명

분할정복 시리즈에는 대표적으로 **이진 탐색, 합병 정렬, 퀵 정렬, 선택 문제**가 있습니다.

이진 탐색과 합병 정렬은 1/2씩 범위를 좁혀가는 방법인데, 특히 이진 탐색에서는 탐색에 해당하지 않는 나머지 한쪽 분할은 버립니다.
따라서 시간복잡도가 **O(logn)** 이며 합병 정렬은 1/2짜리 둘 다 병합하는데 사용하므로 **O(nlogn)** 입니다.

이진 탐색의 기본 원리는 **정렬된 리스트에서 범위를 1/2씩 좁혀가며 탐색하고자 하는 수를 찾는 것**입니다.
이때 꼭 정렬된 리스트여야 한다는 사실을 기억하세요. 범위를 따져야 하기 때문입니다.

<br>
## 코드 구현

구현 아이디어는 간단합니다.
절반씩 분할을 반복하면서 탐색하고자 하는 값과 중간값이 같으면 반환하도록 하면 됩니다.
분할이 최대로 이루어져 분할된 수가 1개라면 종료됩니다.
만약 마지막까지 찾지 못하면 -1이 반환되도록 합니다.

1. **입력**: 찾는 수, 탐색 수 리스트, 분할의 기준이 되는 left, right 인덱스
2. **분할**: left, right 를 활용해 mid 인덱스를 중심으로 분할
    - 찾는 수와 mid 인덱스의 값이 같다면 반환,
    - 아니라면 대소비교하여 선택된 범주를 다시 분할하여 탐색
3. **정복**: 원하는 값이 탐색되면 즉시 반환합니다.

[CODE 1] 재귀적으로 구현하기
```python
import math


def binary_search(x, nums, left, right):
    if left > right:
        return -1  # 잘못된 입력이므로 -1 반환

    # [분할] 중간값을 찾아 나누기
    # 홀수 개인 경우 내림수를 사용하면 됩니다.
    mid = math.floor((left + right) / 2)
    if x == nums[mid]:
        return mid  # [정복] 원하는 수 x를 찾은 즉시 해당 index 반환
    elif x < nums[mid]:
        return binary_search(x, nums, left, mid - 1)  # [분할, 정복] 재귀를 활용해 왼쪽 하향식 탐색
    else:
        return binary_search(x, nums, mid + 1, right)  # [분할, 정복] 재귀를 활용해 오른쪽 하향식 탐색
    
    # 마지막까지 찾지 못할 시 -1 반환
    return -1
```

이번엔 반복문을 사용해서 구현해 보겠습니다.

[CODE 2] 반복문 사용하기
```python
import math


def binary_search_loop(x, nums, n):  # n 은 탐색할 리스트의 크기
    left, right = 0, n - 1  # 시작과 끝점 인덱스

    # 로직 순서는 위와 동일합니다.
    # 다만 left, right 를 증감하는 방식으로 반복하여, 끝까지 못찾으면 종료되도록 합니다.
    while left <= right:
        mid = math.floor((left + right) / 2)
        if x == nums[mid]:
            return mid
        elif x < nums[mid]:
            right = mid - 1
        else:
            left = mid + 1
    return -1
```

중간값을 찾아 분할한 후 비교해가는 과정은 재귀와 같으나,
반복문 사용시 단순히 right 혹은 left 를 변경해주는 방법으로 범주를 분할합니다.

실제로 재귀함수를 새로 호출하는 것보다는 단순반복문을 활용하는 것이 성능상 더 좋습니다.

<br>
## 점화식 및 시간복잡도

주어진 수의 갯수를 n 이라고 할 때 1/2씩 범위를 줄여나간다고 했으므로,

```text
/* 최대 분할 횟수 k */
n/2 >> n/2^2 >> n/2^3 >> ... >> n/2^k

k = floor(logn)  // floor 는 내림 함수
```

분할 횟수 k는 주어진 n의 2의 지수만큼 floor 된 결과입니다.
따라서 **logn 으로 일반화**할 수 있죠.

최대 비교 횟수는 최초 분할 전 한번 비교하고 시작하기 때문에 최대 분할 횟수 + 1 입니다.

```text
/* 최대 비교 횟수 */
최대 비교 횟수 = 최대 분할 횟수 k + 1
```

결국 시간복잡도를 알기 위해서는 최대(최악의 경우)로 몇번이나 비교되는지 파악해야 합니다.
따라서 n에 대한 모든 비교 횟수의 합 T(n)의 점화식은 다음과 같이 도출됩니다.

```text
최대 비교 횟수 = 순환 호출에서의 비교 횟수 + 고정된 연산

T(n) = T(n/2) + O(1) (n>1), T(1) = 1

T(n) = O(logn)
```

상단 설명에서 본것처럼 **시간복잡도는 O(logn)**임이 확인되었습니다!
