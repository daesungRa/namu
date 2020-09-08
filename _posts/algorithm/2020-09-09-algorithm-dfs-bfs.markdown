---
title:  "[알고리즘] DFS, BFS"
created:   2020-09-09 00:00:00 +0900
updated:   2020-09-09 00:00:00 +0900
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
[이것이 취업을 위한 코딩테스트이다 with python 유튭 강의](https://www.youtube.com/watch?v=PqzyFDUnbrY&list=PLRx0vPvlEmdBFBFOoK649FlEMouHISo8N&index=3)에서
발췌했다.

<br>
## 스택과 큐

**스택(stack)**은 **LIFO**로 입구와 출구가 같은 스택구조이고,
**큐(queue)**는 **FIFO**로 코드상에서 오른쪽 입구 왼쪽 출구(popleft)이다.

파이썬에서 list 자료형이 바로 스택이다.
```python
stack = []
stack.append(4)
stack.append(3)
stack.pop()  # 마지막 입력값인 3이 pop 된다
stack.append(2)
stack.append(1)
stack.pop()  # 마지막 입력값인 1이 pop 된다

print(stack)  # [4, 2]
```

파이썬에서는 큐를 구현할 때 collections 라이브러리인 **덱(deque)**을 사용한다.<br>
큐는 일방향이지만, 덱은 양방향으로 진보된 자료형으로 보면 된다.
```python
from collections import deque

queue = deque()
queue.append(5)
queue.append(4)
queue.append(3)
queue.popleft()  # 처음 입력값인 5가 popleft 된다
queue.append(2)
queue.append(1)
queue.popleft()  # 두 번째 입력값인 4가 popleft 된다

print(queue)  # deque([3, 2, 1])
queue.reverse()
print(queue)  # deque([1, 2, 3])
```

> 큐를 구현할 때 기본 자료형인 list 는 pop 시 남은 값들을 새로운 인덱스에 할당하게 되므로 처리 속도가 느리고,
> 덱(deque) 라이브러리는 LinkedList 방식으로 구현되어 고정 크기의 O(1) 시간 복잡도를 가져 속도가 빠르다.
