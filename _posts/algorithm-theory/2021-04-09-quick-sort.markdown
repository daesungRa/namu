---
title:  "[분할정복] 퀵 정렬"
created:   2021-04-09 22:55:06 +0900
updated:   2021-04-09 21:08:21 +0900
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

이 방식은 말 그대로 처리가 가능한 가장 작은 단위까지 **분할**해가며 각 결과들을 활용해 해를 구하는 것입니다(**정복**).
따라서 하향식의 재귀적인 방법 많이 사용되며, 필요에 따라 분할의 결과들을 **병합**합니다.

<br>
## 알고리즘 설명

분할정복 시리즈에는 대표적으로 **이진 탐색, 합병 정렬, 퀵 정렬, 선택 문제**가 있습니다.

그 중 퀵 정렬은 피벗(pivot)을 중심축으로 양분된 두 부분을 대소관계에 따라 재배치하는 과정을 반복합니다.
만약 피벗보다 작은 요소이면 왼쪽 부분으로, 큰 요소이면 오른쪽 부분으로 옮기는 것입니다.(오름차순 기준)

퀵 정렬의 성능은 주어진 리스트가 **얼마나 정렬되어 있는가**와 **피벗을 무엇으로 선택하는가**에 따라 상당히 달라집니다.

<br>
## 코드 구현

퀵 정렬은 피벗을 선택해 좌우로 재배치하는 기능을 반복한다고 하였으므로
종료 시점까지 정렬을 반복하는 Sort 함수와 피벗을 선택해 양분하여 정렬하는 Partition 함수 두개가 필요합니다.

1. **입력**: 정렬할 리스트, 시작 인덱스, 끝 인덱스
2. **분할**: 피벗을 선택해 그것을 중심축으로 분할
3. **정복**: 정렬 수행
    - 양분된 두 부분을 대소관계에 따라 재배치
    - 정렬의 과정을 더 이상 나눌 부분이 없을때까지 순환적으로 반복

정렬하는 것이 목적이므로 최종 결과들을 결합하는 과정은 필요 없습니다.

다음은 퀵 정렬이 구현된 코드입니다.

**[code]**

```python
def partition(nums: list, init: int, end: int):
    # Select pivot to middle of range
    pivot = nums[(init + end) // 2]

    while init <= end:  # Until init and end intersect
        # Select a number greater than pivot
        while init < len(nums) and nums[init] < pivot:
            init += 1
        # Select a number smaller than pivot
        while end >= 0 and nums[end] > pivot:
            end -= 1

        # Change selected numbers based on pivot
        if init <= end:
            nums[init], nums[end] = nums[end], nums[init]
            init += 1
            end -= 1

    return init

def sort(nums: list, init: int, end: int) -> list:
    if init < end:  # Termination condition
        # Get pivot of middle
        pivot = partition(nums, init, end)

        # Recursive call
        sort(nums, init, pivot - 1)
        sort(nums, pivot, end)

    return nums
```

여기서 메인 실행 함수는 sort 입니다.
이것이 더 이상 리스트를 분할할 수 없을 때까지 반복적으로 호출되면서 정렬을 수행합니다.
그리고 **분할 및 정복의 핵심 함수는 partition** 입니다.
여기서는 주어진 범주 내 피벗을 선택해 그것을 중심축으로 양분 정렬을 수행한 후 최종 인덱스를 반환합니다.
정렬은 init, end 로부터 범주를 좁혀가며 pivot 보다 큰 수, 작은 수를 선택하여 서로 교환하는 방식으로 수행됩니다.

메인 sort 함수에서는 partition 의 결과값을 받아 그것을 중심으로 양분된 추가적인 sort 를 재호출 합니다.
더 이상 양분이 불가능한 경우 재귀 호출은 종료되며 그것의 결과가 곧 정렬된 리스트가 됩니다.

이 로직에서 주목해야 할 점은 **피벗을 무엇으로 선택하는가** 입니다.
앞서 이야기했듯 알고리즘의 성능은 피벗 선택에 따라 좌우되기 때문입니다.
위 구현에서는 피벗을 범주 내 중간값으로 선정하도록 코딩했는데, 경우에 따라 이것을 리스트의 첫 번째 값으로 해도 무방할 수 있습니다.

만약 충분히 뒤섞여 있는 리스트가 주어진다면 첫 번째 값도 큰 문제는 없습니다.
어차피 모든 분할 정렬을 수행해야 하기 때문입니다.
하지만 완전히 정렬된 리스트가 주어져 분할의 결과가 한쪽으로 치우치는 최악의 경우가 발생하면
불필요한 탐색 및 분할의 과정이 반복수행되어 성능상 문제가 될 수 있습니다.

- **극심한 불균형적 분할**
    - 첫 번째 요소를 피벗으로 선택하는 과정에서, 이미 정렬된 리스트가 주어지는 경우
    - 가장 작거나 큰 값이 피벗이 되어 나머지 모든 요소들이 한쪽 분할에 치우치는 결과가 나옴
    - 즉, 0:n-1 혹은 n-1:0 으로 분할되는 상황

<br>
## 점화식 및 시간복잡도

정리하자면, 알고리즘이 최악의 성능을 나타내게 되는 상황은 다음과 같습니다.

> 완전히 정렬된 리스트 + 첫 번째 인덱스의 피벗
