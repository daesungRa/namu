---
title:  "[알고리즘] DFS, BFS"
created:   2020-09-09 02:12:24 +0900
updated:   2020-09-27 18:22:23 +0900
author: namu
categories: algorithm-practical
permalink: "/algorithm-practical/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2017/11/12/18/32/book-2943383__480.png
image-view: true
image-author: 200degrees
image-source: https://pixabay.com/ko/users/200degrees-2051452/
---

<br>
## 들어가며

[안경잡이개발자](https://ndb796.tistory.com/)님의
[**_이것이 취업을 위한 코딩테스트이다 with python 유튭 강의_**](https://www.youtube.com/watch?v=PqzyFDUnbrY&list=PLRx0vPvlEmdBFBFOoK649FlEMouHISo8N&index=3)에서
참조했다.

\+ [**_프로그래머스 dfs, bfs 고득점 kit 문제들_**](https://programmers.co.kr/learn/courses/30/parts/12421)도 추가했다.

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

재귀 함수는 무한 루프에 빠지지 않도록 종료조건을 명시하는 것이 관건이다.
다음은 재귀 함수를 활용한 팩토리얼 구현 예제이다.

```python
# recursive -> factorial


def factorial(i):
    if i <= 1:  # 종료조건 명시!
        return 1
    return i * factorial(i - 1)


if __name__ == '__main__':
    print(factorial(5))
```

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

위의 기본 DFS 알고리즘에서 핵심 로직은 반복문으로 구성되었다.
이것을 보다 간편하게 구현하고 싶을 때 stack 특성을 활용하여 재귀함수를 이용할 수도 있다.
이때는 재귀 호출 시마다 공통적으로 사용하는 visited list 를 전달해줘야 한다.

```python
# DFS using recursive


def dfs_recursive(graph: dict, visited: list, node: str):  # LIFO
    visited.append(node)
    for next_node in graph[node]:
        if next_node not in visited:  # 더 이상 방문되지 않은 노드가 없는 경우가 종료조건!
            dfs_recursive(graph=graph, visited=visited, node=next_node)
    return visited


if __name__ == '__main__':
    # ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    print(dfs_recursive(graph=GRAPH, visited=[], node='A'))
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

<br>
## 실전 풀이

프로그래머스 [고득점 kit](https://programmers.co.kr/learn/courses/30/parts/12421) 에 출제된 문제들이다.

**타겟 넘버**: n 개의 음이 아닌 정수 리스트를 각각 적절히 더하거나 빼서 타겟 넘버를 만드는 방법의 수 구하기

제한사항은 다음과 같다

- 주어지는 숫자의 개수는 2개 이상 20개 이하입니다.
- 각 숫자는 1 이상 50 이하인 자연수입니다.
- 타겟 넘버는 1 이상 1000 이하인 자연수입니다.

입출력 예

| numbers | target | return |
|:--|:--|:--|
| [1, 1, 1, 1, 1] | 3 | 5 |

```python
from itertools import product


def dfs_solution(numbers, target):
    result = [numbers[0], -numbers[0]]
    for num_idx in range(1, len(numbers)):
        temps = []
        for num in result:
            temps.append(num + numbers[num_idx])
            temps.append(num - numbers[num_idx])
        result = temps
    return result.count(target)


def permutation_solution(numbers, target):
    set_list = [(x, -x) for x in numbers]
    dup_permu = product(*set_list)
    sum_mapping = list(map(sum, dup_permu))
    return sum_mapping.count(target)
```

두 풀이법은 주어진 numbers 의 각 요소를 깊이우선탐색 원리에 따라 더하거나 빼는 경우의 수들을 반복해서 구해내는 점에서 원리적으로 같다.

**_dfs_solution_** 은 numbers 의 첫 번째 수의 + 혹은 - 값을 초기값으로 시작하여
나머지 numbers 의 요소들을 누적적으로 더하거나 빼나간다.

**_permutation_solution_** 은 중복순열을 사용하는 방법이다.
먼저 주어진 numbers 의 모든 더하기 빼기 사례들을 나열하고(set_list),
그 사례들에 따라 모든 경우의 수를 중복까지 허용한 중복순열로 나타낸다(dup_permu).
그렇게 구해진 순열의 각 경우들을 sum 하여(sum_mapping) 그중 target 과 같은 결과들을 count 한다.

이 풀이법들은 numbers 의 길이 n 에 따라 2 의 배수로 분기되는 **이진 트리의 양상을 보이며, O(2ⁿ) 의 시간복잡도**를 갖는다.
말단 노드들 중 target 값을 같는 경우를 count 해야 하므로 사실상 완전 탐색방식이다.

**네트워크**: 주어진 컴퓨터의 개수 n, 노드 간 연결정보 2차원 배열 computers 를 토대로 총 네트워크 개수 구하기

제한사항은 다음과 같다

- 컴퓨터의 개수 n은 1 이상 200 이하인 자연수입니다.
- 각 컴퓨터는 0부터 n-1인 정수로 표현합니다.
- i번 컴퓨터와 j번 컴퓨터가 연결되어 있으면 computers[i][j]를 1로 표현합니다.
- computer[i][i]는 항상 1입니다.

입출력 예

| n | computers | return |
|:--|:--|:--|
| 3 | [[1, 1, 0], [1, 1, 0], [0, 0, 1]] | 2 |
| 3 | [[1, 1, 0], [1, 1, 1], [0, 1, 1]] | 1 |

```python
from collections import deque  # for BFS


# Using DFS
def make_graph(n, computers):
    graph = {i: set() for i in range(n)}
    for idx1, com1 in enumerate(computers):
        for idx2, com2 in enumerate(com1):
            if com2 == 1 and idx1 != idx2:
                graph[idx1].add(idx2)
    return graph


def dfs(graph, start_node):
    visited = []
    stack = [start_node]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.append(node)
            stack.extend(reversed(list(graph[node])))
    return sorted(visited)


def solution(n, computers):
    nodes = sorted([node for node in range(n)])
    graph = make_graph(n, computers)
    visited = dfs(graph, 0)
    answer = 1
    while nodes != visited:
        for node in nodes:
            if node not in visited:
                visited.extend(dfs(graph, node))
                visited.sort()
                answer += 1
    return answer


# Using BFS
def solution(n, computers):
    def bfs(node, visited):
        queue = deque()
        queue.append(node)
        visited[node] = 1
        while queue:
            v = queue.pop(0)
            for i in range(n):
                if computers[v][i] == 1 and visited[i] == 0:
                    visited[i] = 1
                    queue.append(i)
        return visited
    visited = [0 for i in range(n)]
    answer = 0
    for i in range(n):
        try:
            visited = bfs(visited.index(0), visited)
            answer += 1
        except ValueError as ve:
            print(f'[LIST-INDEX-ERROR] {ve}')
    return answer
```

컴퓨터의 개수 n 과 연결정보 computers 로 graph 를 만들어 첫 번째 컴퓨터(0 번 인덱스)부터 dfs 탐색을 실시한다.

만약 **하나의 네트워크**라면 모든 노드를 방문했을 것이므로, 최초 반환된 visited list 가 전체 node list 와 같을 것이다.
**두개 이상의 네트워크**라면 분절된 노드가 있을 것이므로, 정렬된 node list 에서 방문되지 않은 가장 낮은 노드부터 시작해
한번 더 dfs 탐색을 실시하며, 새로운 탐색 시마다 네트워크 개수를 1씩 증가시킨다. 이때 반환된 visited list 는 기존의 그것에 extend 시킨다.

다른 사람이 푼 **bfs 방식**도 visited list 를 채워나가되, 분절된 노드가 있다면 네트워크 개수를 1씩 증가시키며 추가 탐색하는 원리는 같다.
