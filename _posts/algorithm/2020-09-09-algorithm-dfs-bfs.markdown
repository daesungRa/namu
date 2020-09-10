---
title:  "[알고리즘] DFS, BFS"
created:   2020-09-09 02:12:24 +0900
updated:   2020-09-10 23:24:10 +0900
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

<br>
## 재귀 함수

<br>
## DFS

DFS 와 다음으로 살펴볼 BFS 는 각각 stack 과 queue 를 활용하는 그래프 알고리즘(graph algorithm)이다.

깊이(Depth) 우선 탐색이다. **현재 방문된 노드로부터 깊은 노드 순**으로 파고들어간다.
더이상 파고들 노드가 없으면 상위 레벨에서 다음으로 깊은 노드를 탐색한다.

> 여기서 깊이는 정의하기 나름인데, 여기서는 알파벳순을 의미한다. 즉, 더 앞선 알파벳일수록 깊다('C' 보다는 'B'가 앞선다).

> LIFO 에 입각해서 우선적으로 처리되어야 할 노드를 나중에 넣는다고 생각하면 된다.

```python
# DFS
GRAPH = {
    'A': ['B'],
    'B': ['A', 'C', 'H'],
    'C': ['B', 'D'],
    'D': ['C', 'E', 'G'],
    'E': ['D', 'F'],
    'F': ['E'],
    'G': ['D'],
    'H': ['B', 'I', 'J', 'M'],
    'I': ['H'],
    'J': ['H', 'K'],
    'K': ['J', 'L'],
    'L': ['K'],
    'M': ['H'],
}


def dfs_solution(graph: dict, start_node: str):  # LIFO
    visited = []
    stack = [start_node]

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.append(node)
            stack.extend(reversed(graph[node]))  # 깊은 것이 나중에 들어가도록 역정렬

    return visited

if __name__ == '__main__':
    # ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    print(dfs_solution(graph=GRAPH, start_node='A'))
```

<br>
## BFS

너비(Breadth) 우선 탐색이다. **현재 방문된 노드에 인접한 모든 노드를 깊이 우선 탐색 후,
다음 레벨의 모든 노드를 동일한 방식으로 탐색**하는 방식이다.

```python
# BFS
from collections import deque

GRAPH = {
    'A': ['B'],
    'B': ['A', 'C', 'H'],
    'C': ['B', 'D'],
    'D': ['C', 'E', 'G'],
    'E': ['D', 'F'],
    'F': ['E'],
    'G': ['D'],
    'H': ['B', 'I', 'J', 'M'],
    'I': ['H'],
    'J': ['H', 'K'],
    'K': ['J', 'L'],
    'L': ['K'],
    'M': ['H'],
}


def bfs_solution(graph: dict, start_node: str):  # FIFO
    visited = []
    queue = deque()
    queue.append(start_node)

    while queue:
        # pop(0)보다 덱(deque)의 popleft()가 더 빠르다
        #   pop(0) -> 단순 list 자료형으로 pop(0) 시마다 재정렬이 필요하다
        #   popleft() -> deque 는 LinkedList(환형) 로 구현되어 O(1) 의 시간복잡도이다
        node = queue.popleft()
        if node not in visited:
            visited.append(node)
            queue.extend(graph[node])

    return visited

if __name__ == '__main__':
    # ['A', 'B', 'C', 'H', 'D', 'I', 'J', 'M', 'E', 'G', 'K', 'F', 'L']
    print(bfs_solution(graph=GRAPH, start_node='A'))
```
