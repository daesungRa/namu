---
title:  docstring
date:   2020-06-21 06:30:00 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: cards.jpg
image-view: true
---

### 들어가며

**개발자는 협업한다.**
개인 토이 프로젝트를 제외하면 거의 필연적으로 다른 개발자들과 협업한다.
프로그래밍 언어로 컴퓨터와 소통하는 것 이상으로 타인과의 소통이 중요한 이유이다.
이 소통을 위해 매우 유용한 기능이 있는데, 그것은 바로 파이썬
**[docstring](https://wikidocs.net/16050)** 이다.

### Docstring, 문서화

`docstring` 은 주석이 아니다.
굳이 이야기하자면 **'문서화'** 라고 명명할 수 있는데, 주석과 문서화의 차이점은
'개발 도중 휘갈겨놓은 쪽지'와 '공식 사용설명서' 간의 차이 정도로 볼수 있을 것 같다.

전자는 자신이 작성한 코드에 대해 이유를 설명하는 경우가 많으며 수만 줄의 코드 곳곳에 흩뿌려져 있어
누가 왜 적어 놓았는지에 대한 히스토리 추적이 어렵다. 따라서 정말 맞는 설명인지도 확신할 수 없다.

하지만 후자는 사용자 중심의 사용설명서로 협업하는 팀 혹은 회사 단위로 규칙을 정해 모두가 함께 작성하므로 신뢰할 수 있다.
공식화된 예제를 통해 해당 코드가 어떻게 동작하는지 시뮬레이션 해볼 수도 있다.

충분히 훌륭한 코드라면 주석이 전혀 필요 없다. 하지만 누군지 모를 사용자를 위해 문서화는 언제나 필요하다.
피치 못할 경우를 제외하고 주석의 사용은 지양되는 것이 좋은 반면, 협업하는 모든 개발자는 합의한 컨벤션대로 문서화에 기여해야 한다.

### Docstring 이란?

> 1. 코드의 특정 컴포넌트에 대한 설명이다. >> 모듈, 클래스, 메서드 or 함수
> 2. 동적 타이핑을 하는 파이썬에서 타입 힌팅 기능을 제공한다.
> 3. 적절한 예제를 통해 컴포넌트의 이해를 돕는다.

`docstring` 은 **[리터럴 문자열(literal string)](https://www.computerhope.com/jargon/l/literal.htm)** 이다.
따라서 `python interpreter` 에 의해 실행되지 않는다.
또한 built-in variable `__doc__` 에 저장되어 help() 도구를 통해 참조할 수 있다.

다음은 dict 자료형의 update 함수에 대한 `docstring` 을 출력한 내용이다.

```python
help(dict.update)
```

```text
Help on method_descriptor:
update(...)
    D.update([E, ]**F) -> None.  Update D from dict/iterable E and F.
    If E is present and has a .keys() method, then does:  for k in E: D[k] = E[k]
    If E is present and lacks a .keys() method, then does:  for k, v in E: D[k] = v
    In either case, this is followed by: for k in F:  D[k] = F[k]
```
