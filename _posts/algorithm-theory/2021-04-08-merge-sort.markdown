---
title:  "[분할정복] 합병 정렬"
created:   2021-04-08 23:05:17 +0900
updated:   2021-04-08 20:12:33 +0900
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

이진 탐색과 합병 정렬은 1/2씩 범위를 좁혀가는 방법인데, 특히 이진 탐색에서는 탐색에 해당하지 않는 나머지 한쪽 분할은 버립니다.
따라서 시간복잡도가 **O(logn)** 이며 합병 정렬은 1/2짜리 둘 다 병합하는데 사용하므로 **O(nlogn)** 입니다.



<br>
## 코드 구현

<br>
## 점화식 및 시간복잡도
