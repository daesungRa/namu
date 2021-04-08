---
title:  "[CODILITY][01] BinaryGap"
created:   2020-08-28 19:35:12 +0900
updated:   2020-08-28 19:35:12 +0900
author: namu
categories: algorithm-practical
permalink: "/algorithm-practical/:year/:month/:day/:title"
image: https://www.codility.com/wp-content/uploads/2020/03/CodilitySocial.jpg
image-view: true
image-author: codility.com
image-source: https://www.codility.com/solutions/customers/flatiron-health-case-study-success-story-on-saving-430-hours/
---

<br>
## 들어가며

[**_Codility_**](https://app.codility.com/programmers/) 를 통한 내 첫번째 알고리즘 코딩 공부이다.<br>
다음 Question 은 Lesson 1 으로써
[Iterations](https://towardsdatascience.com/python-basics-iteration-and-looping-6ca63b30835c) 에 대한 내용이다.

<br>
## Question

> [BinaryGap](https://app.codility.com/programmers/lessons/1-iterations/binary_gap/)
>> Find longest sequence of zeros in binary representation of an integer.

A binary gap within a positive integer N is any maximal sequence of consecutive zeros that is surrounded by ones at both ends in the binary representation of N.

For example, number 9 has binary representation 1001 and contains a binary gap of length 2. The number 529 has binary representation 1000010001 and contains two binary gaps: one of length 4 and one of length 3. The number 20 has binary representation 10100 and contains one binary gap of length 1. The number 15 has binary representation 1111 and has no binary gaps. The number 32 has binary representation 100000 and has no binary gaps.

Write a function:

def solution(N)

that, given a positive integer N, returns the length of its longest binary gap. The function should return 0 if N doesn't contain a binary gap.

For example, given N = 1041 the function should return 5, because N has binary representation 10000010001 and so its longest binary gap is of length 5. Given N = 32 the function should return 0, because N has binary representation '100000' and thus no binary gaps.

Write an efficient algorithm for the following assumptions:

N is an integer within the range \[1..2,147,483,647].

<br>
## Answer

```python
def _int_to_binary(N: int):
    """Get binary list from integer"""
    bin_list = []
    while N > 1:
        bin_list.append(N % 2)
        N = int(N / 2)
    bin_list.append(1)
    return bin_list[::-1]


def solution(N: int):
    if not isinstance(N, int) and N < 0:
        raise ValueError(f'Number {N} is not a positive Integer.')
    
    bin_list = _int_to_binary(N)
    count = 0
    result = 0
    for bin_num in bin_list:
        if bin_num == 1:
            result = count > result and count or result
            count = 0
        elif bin_num == 0:
            count += 1
    return result


if __name__ == '__main__':
    print(solution(99))  # 1100011 -> 3
    print(solution(529))  # 1000010001 -> 4
    print(solution(1610612737))  # 1100000000000000000000000000001 -> 28
    print(solution(1610612737))  # 1000000000000000000000000000001 -> 29
```
