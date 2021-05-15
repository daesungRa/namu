---
title:  "[방통대] 이산수학 수업 정리"
created:   2021-04-24 20:06:24 +0900
updated:   2021-04-24 20:06:24 +0900
author: namu
categories: knou
permalink: "/knou/:year/:month/:day/:title"
image: https://www.openuped.eu/images/mooc/crop/Engineering10.jpg
alt: discrete mathematics image
image-view: true
image-author: openuped
image-source: https://www.openuped.eu/courses/details/4/116-discrete-mathematics
---


---

### 목차

1. [이산수학의 개요](#1-이산수학의-개요)
2. [논리](#2-논리)
3. [증명](#3-증명)
4. [집합론](#4-집합론)
5. [](#5-)
6. [](#6-)
7. [](#)
8. [](#)
9. [](#)
10. [](#)
11. [](#)
12. [](#)
13. [](#)
14. [](#)
15. [](#)

### 참조

- 손진곤 (2021). 이산수학. 서울: 한국방송통신대학교출판부.
- 손진곤. 이산수학 강의 (2021). 한국방송통신대학교 UKNOU 캠퍼스

---

<br>
## 들어가며

다음은 2021학년도 1학기 이산수학 수업에 대한 정리입니다.

#### 오리엔테이션

- 컴퓨터를 설명? 전자계산기!
- 지식정보 사회에서 지혜를 가지고 누구에게나 설명할 수 있는 지식체계를 확립할 것
- What? "이산수학" > **이산적인 수학구조에 대해서 연구하는 학문**
    - Discrete 란 분리된 것을 의미
    - 실수집합은 연속적이지만, 정수는 단절적
    - 전자계산기인 컴퓨터는 실세계의 연속적 데이터를 0과 1의 discrete 데이터로 변환하여 취급
    - 이산수학 과목은 이산적 데이터를 처리하기 위해 필요한 수학
- 이 과목의 주요내용
    - 논리, 증명, 집합, 행렬, 관계, 함수, 부울대수, 그래프, 트리, 조합이론, 정수론, 오토마타 및 형식언어
- 학습목적
    - 컴퓨터과학의 기초를 이해하기 위해
    - 문제해결 방법을 모델링(추상화)하는 과정을 이해하고 훈련하기 위해
    - 수학적 논리전개 방법을 익히기 위해
    - 새로운 개념을 체계화시키고 표현할 수 있는 역량을 함양하기 위해 > 프레젠테이션
- 학습방법
    - 약속을 잘 지키자: 정의, 기호논리학, 암기
    - 연습하자: 논리적 사고 및 표현 방법의 훈련

---

#### 이산수학의 개요

- 이산수학 - 개관
- 모델링과 추상화
- 알고리즘 언어
- 이산수학의 응용 분야

---

#### 이산수학 학습 목표

- 이산적인 데이터와 연속적인 데이터를 구분할 수 있다.
- 문제 해결과정에 사용되는 용어들을 도구, 기법, 방법론으로 구분할 수 있다.
- 추상화의 의미를 설명할 수 있다.
- 알고리즘을 기술하기 위한 의사코드의 사용법을 이해하고 올바르게 사용할 수 있다.

---

#### 주요용어

- 이산수학, 연속수학
- 수학적 모델링, 데이터 모델링, 추상화
- 프로그래밍 언어, 순서도, 의사코드

<br>
## 1. 이산수학의 개요

#### 1.1 수학의 분류와 이해

[수학적 분류] 수학에는 **대수학, 해석학, 기하학**이 있습니다.

미지수에 대한 방정식을 만들어 푸는 것을 대수학, 수열이나 급수, 수열의 극한 그리고 미분화 적분에 대한 것을 해석학,
어떤 점으로부터 일정한 거리에 있는 점들의 집합에 대한 것을 기하학이라고 이해하면 됩니다.

수학을 다른 방식으로 분류할 수도 있습니다.

[컴퓨터적 분류] 바로 연속된 수를 다루는지, 단절된 수를 다루는지에 따른 것이 그 기준입니다.

연속된 수를 다루는 것을 **연속수학**, 분절적인 수를 다루는 것을 **이산수학**이라고 이해합니다.

---

#### 1.2 문제해결

문제를 해결하기 위해서는 **도구, 기법, 방법론**이 필요합니다.

수학에서의 도구는 정의나 정리, 기법은 일차연립 방정식, 2차, 3차 방정식과 같은 것들을 의미합니다.
방법론은 정의와 기법을 언제 어디에 어떻게 사용할 것인지에 대한 것을 다룹니다. 즉, 가장 효율적인 도구와 기법을 적재적소에 선택하는 것이죠.

#### 문제해결의 과정

기본적으로 **추상화(abstraction) 또는 모델링**의 단계를 거칩니다.

- 인간: 문제 >> 추상모델 >> 변형된 모델 >> 문제의 해결책 (수학적 모델링 과정)
- 전산: 문제 >> 정보 >> 처리 >> 문제의 해결책 (정보 모델링 과정)

추상화에 익숙하고 잘할수록 문제해결 능력이 높다고 볼 수 있습니다.

> 추상화? <small>(抽象化, abstraction)</small>
>> 정의1. 일정한 인식 목표를 추구하기 위하여 여러 가지 표상이나 개념에서 특정한 특성이나 속성을 빼냄.
>>
>> 정의2. 문제와 관련된 핵심내용만 남기고 관련 없는 내용을 제거하여 문제를 단순화시키는 과정.

사과를 예로 들어봅시다.
분명 지구상에는 다양한 형태와 색과 맛을 가지는 '사과'가 존재할 것입니다.
우리는 그 모든 것들을 통칭해 '사과'라고 명명합니다.
그것은 사과에 해당되는 특성이나 속성을 가지고 있기 때문이며, 우리는 '사과'라는 추상화 과정을 통해 그것을 인식할 수 있습니다.

이것은 사과란 무엇인가에 대한 문제 해결 과정입니다.

그렇다면 컴퓨터에 대해서는 어떨까요?

컴퓨터의 특성을 추상화 하자면, 그것은 입력장치와 기억장치, 처리장치와 제어장치, 그리고 출력장치를 가지고 있는 것입니다.
따라서 이 다섯 가지 기본 특성을 지니는 있는 모든 기기는 컴퓨터라고 추상화할 수 있습니다.

**디지털 논리 회로를 간소화한 그림**을 한번 봅시다. (제 8강. 부울대수, 그림 1-4)
![digital logic circuit01]({{ site.github.url }}{% link assets/post-img/digital_logic_circuit01.png %})

추상화의 과정을 통해 복잡해 보이는 디지털 논리회로를 간소화된 그림으로 표현하였습니다.
AND, OR, NOT 등의 연산을 약속된 기로호 표현해 알아보기가 쉽습니다.

이번에는 도출된 논리식을 더 간소화해 봅시다.

```text
F(X, Y) = X + XY + notXY
        = X(1 + y) + notXY  ∵ 분배법칙
        = X + notXY         ∵ 1 + Y = 1
        = (X + notX)(X + Y) ∵ 분배법칙
        = X + Y             ∵ X + notX = 1
```

위와 같이 디지털 논리회로를 수학적으로 간소화하여 비교한다면,
더 효율적인(간소화하여 논리연산 1번이면 해결) 회로를 선택할 수 있을 것입니다.(문제의 해결)

---

#### 1.3 알고리즘 언어

알고리즘(algorithm)이란, **어떠한 문제(task)를 해결하기 위한 여러 step by step 동작들의 유한한 모임** 으로 정의할 수 있습니다.

1.3.1 알고리즘의 표현 방법에는 **프로그래밍 언어, 플로우 챠트, 수도코드**가 있습니다.

프로그래밍 언어는 잘 알다시피 알고리즘을 상세하게 표현하지만, 통일된 언어가 존재하지 않습니다.
순서도는 약속된 기호로 가장 추상적으로 알고리즘을 도식화하여 흐름에 따라 기술하기에 이해하기 쉽지만,
내용이 복잡하거나 커지면 표현이 어렵습니다.
수도코드 더 발전적이고 추상적인 표현 방식으로, 모호한 부분은 프로그래밍 언어를 차용(C언어 기반)하여 명료하게 하고,
구체적이지 않아도 되는 부분은 자연어로 설명식으로 기술합니다. 추상화하여 이해하기에 가장 좋지만,
알고리즘을 설명하는 용도로면 사용하게 됩니다. 의사코드는 할당문과 제어문을 활용해 표현합니다.

세상의 모든 문제 중 **순서성<small>Sequence</small>, 선택성<small>Selection</small>, 반복성<small>Iteration</small>**을
가지는 것은 알고리즘으로 표현할 수 있습니다.
즉, 컴퓨터 프로그래밍 언어로 구현할 수 있다는 것입니다.
이 세 가지 특성은 의사코드에서 제어문에 속하게 됩니다.

1.3.2 기본 제어구조는 다음과 같습니다.

- 순차 구조
- 선택 구조
    - if 문
    - switch 문
- 반복 구조
    - for 문
    - while 문
    - foreach 문

if 문을 사용한 의사코드 예는 다음과 같습니다. (제 1강. 이산수학의 개요, 예제 1.3)
![psudo01]({{ site.github.url }}{% link assets/post-img/psudo01.png %})

순차, 선택, 반복구조가 포함된 수도코드의 예시를 더 찾아봅시다.

---

#### 1.4 이산수학의 응용분야

이산수학의 응용분야는 다음과 같습니다.
기본적으로 각각의 문제해결을 위한 고민의 결과이며, 예외적인 상황을 하나라도 더 찾아내는 논리성이 중요합니다.

![grounds of discrete mathematics]({{ site.github.url }}{% link assets/post-img/grounds_of_discrete_mathematics.png %})

* 행렬이나 트리는 기계학습(ML)의 AI 딥러닝에 주로 활용된다는 점을 주목합시다.

<br>
## 2. 논리

이번 강의의 학습 목표는 다음과 같습니다.

- **명제와 명제가 아닌 것을 구분**할 수 있다.
- 다양한 **논리연산**의 기능을 이해하고, **합성명제의 진리값**을 구할 수 있다.
    - 명제의 진리값을 통해 합성명제의 진리값을 구하기
- **한정자**가 포함된 **술어논리**를 구사할 수 있다.
- 두 명제의 **논리적 동치**<small>(값이 같다)</small> 여부를 판별할 수 있다.
- **추론규칙**을 이용하여 타당한 추론을 판별할 수 있다.

주요용어: ```명제```, ```논리연산자```, ```조건명제```, ```쌍조건명제```, ```논리적 동치```, ```술어논리```,
```전체한정자```, ```존재한정자```, ```벤 다이어그램```, ```추론규칙``` 

---

#### 2.1 명제

> **명제 (Proposition)**
>> 참과 거짓을 구별할 수 있는 문장이나 수학적 식을 명제라고 합니다.
>> 명제의 진리값은 True T or False F 입니다.

예를 들어, "6은 2의 배수다."와 같은 진술은 참거짓 판별이 가능하여 명제이지만,
"철수는 공부를 잘 한다."와 같은 추상적 진술은 기준이 불문명하여 참거짓 판별이 불가능해 명제가 아닙니다.

비슷한 맥락으로 "2 더하기 3은 7이다."는 거짓이긴 하지만 명제입니다.

그렇다면, "x + 2 = 0" 진술은 어떨까요?
이 때는 x 값을 알 수 없어 명제라 할 수 없습니다.
하지만 x 값이 정해지면 참거짓 판별이 가능하므로, **명제함수**라고 부릅니다.

명제의 종류는 아래와 같습니다.

- 합성명제
- 조건명제, 쌍조건명제
- 항진명제, 모순명제

---

#### 2.2 논리연산

이번엔 **'연산'**에 대해 다뤄봅니다.
더하기 빼기 곱하기 나누기 등도 연산의 하나입니다.
컴퓨터에서 연산은 operation, 연산자는 operator 라고 합니다.

그럼 일반적인 연산에서 필요한 요소들을 알아봅시다.

- 실수 집합: 여러 실수가 담긴 실수 집합을 생각해 봅시다. 거기서 이미 확정된 값은 **실수 상수**, 미지의 값은 **실수 변수**라고 합니다.
- 실수 연산자: 덧셈, 뺄셈, 곱셈, 나눗셈

이들을 통해 **수식**을 도출합니다. > ```0.5x + y```

그렇다면 논리 연산에서 위의 요소들은 어떻게 대응될까요?

- 논리 집합: 논리 상수, 논리 변수가 존재
    - 논리 상수는 T or F 가 확정된 경우를 의미합니다
    - 논리 변수는 아직 참거짓 판별이 되지 않은 명제를 의미합니다
- 논리 연산자: OR, AND, NOT, XOR

앞서 수식을 도출했듯이 논리 연산의 요소(명제, 연산자)들을 통해 합성명제(논리연산식)를 도출합니다.

> **합성 명제**
>> 하나 이상의 명제와 논리연산자 그리고 괄호로 이루어진 명제

---

#### 2.2.1 논리 연산자

- 논리합 (disjunction; or, ∨)
    - 두 명제에 대한 OR 연산
    - p ∨ q
    - 한쪽이라도 T 면 결과도 T
    - 같은 방식으로 삼항 이상의 연산도 가능
    - (하단 진리표01 참조)

- 논리곱 (conjunction; and, ∧)
    - 두 명제에 대한 OR 연산
    - 한쪽이라도 F 면 결과도 F
    - p ∧ q
    - 같은 방식으로 삼항 이상의 연산도 가능
    - (하단 진리표01 참조)

[진리표01 - or, and]<br>
![논리표01](https://t1.daumcdn.net/cfile/tistory/231E9B4455961D0616)
<small>출처: https://thrillfighter.tistory.com/265</small>

- 부정 (negation; ~, ¬)
    - ~p
    - 합성명제이지만 하나의 명제에 부정 연산자가 붙음
    - 연산에는 피연산자가 1개인 1항 연산이 있음(절대값 구하기, 음수 구하기 등)
    - (하단 진리표02 참조)

[진리표02, not]<br>
![논리표02](https://t1.daumcdn.net/cfile/tistory/247CD64F55400ECB1F)
<small>출처: https://thrillfighter.tistory.com/223</small>

- 배타적 논리합 (exclusive or; xor, ⊕)
    - p ⊕ q ≡ (p ∧ ~q) ∨ (~p ∧ q)
    - 한 명제가 T 면 다른 명제는 F 이거나 그 반대여야만 결과가 T
    - (하단 진리표03 참조)

[진리표03, xor, xnor]<br>
![논리표03](data:image/jpeg;base64,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)
<small>출처: http://www.ktword.co.kr/abbr_view.php?m_temp1=4420</small>

xnor는 배타적 논리합의 역입니다. > ~(p ⊕ q)

![xor example01]({{ site.github.url }}{% link assets/post-img/xor_example01.png %})

함께 보기: [진리표04, nor, nand]<br>
![논리표04](https://t1.daumcdn.net/cfile/tistory/2345AE3C55961D0924)
<small>출처: https://thrillfighter.tistory.com/265</small>

---

#### 2.2.2 조건명제

> **조건 명제** (conditional proposition, →)
>> 명제 p, q가 있을 때 명제 p가 **조건**의 역할을, q가 **결론**의 역할을 수행하는 경우

```p → q``` 에서, p는 q의 충분조건, q는 p의 필요조건이라 합니다.
조건명제의 진리표는 다음과 같습니다.

[조건명제 진리표]<br>
![조건명제 진리표](https://blog.kakaocdn.net/dn/KiP1n/btqF5y30YsY/wybx0muxV3LSj66x9bmLJk/img.png)
<small>출처: https://bite-sized-learning.tistory.com/364</small>

주목할 부분은 조건 p가 거짓인 아래 두 경우입니다.
**조건이 F이면 결과가 무엇이든 간에 조건명제 전체는 참(T)로 약속**합니다.

![조건명제 예제01]({{ site.github.url }}{% link assets/post-img/conditional_proposition_example01.png %})

> **쌍조건 명제** (↔)
>> 명제 p, q가 있을 때 명제 p와 q가 **조건**의 역할과 **결론**의 역할을 동시에 수행하는 경우

쌍조건 명제에서는 조건명제의 역방향도 가정합니다.
이는 ```p ↔ q ≡ (p → q) ∧ (q → p)``` 와 같은 형태로 동치입니다.
쌍조건 명제의 진리표는 다음과 같습니다.

[쌍조건명제 진리표]<br>
![쌍조건명제 진리표](http://www.ilbe.com/files/attach/new/20140114/377678/2745531975/2745873014/c865dd18be5f754da18a0dc54d64367d.JPG)
<small>출처: https://ziondragon1.tistory.com/category/?page=33</small>

표에서 보다시피 역방향에 대해서도 조건명제의 약속이 성립하여 참거짓이 판별됩니다.(q → p 열 참조)

쌍조건 명제에서는 정방향 조건명제와 역방향 조건명제가 모두 T 이거나 F 이면 결과가 T 입니다.

- 쌍조건명제의 결과는 XNOR, 즉 ```~(p ⊕ q)```의 결과와 같다는 점을 체크합니다!
    - 배타적 논리합의 역과 동치이다!
    - ```"사람이 살아 있다." ↔ "사람이 호흡을 한다."``` 는 ```T ↔ T``` 이므로 결과가 T 입니다.
    - ```1 + 2 = 9 ↔ 1 x 2 = 9``` 는 ```F ↔ F``` 이므로 결과가 T 입니다.

---

#### 2.2.3 동치

> **논리적 동치** (logical equivalence, ≡)
>> 두 명제 p, q가 논리적으로 동등하다.

논리적으로 동등하다는 말은 **두 명제가 항상 동일한 진리값**을 가진다는 의미입니다.
따라서 두 명제가 동치임을 밝히고자 한다면, 각 명제의 진리표를 작성하여 진리값이 항상 같음을 증명하면 됩니다.

- 역, 이, 대우
    - 조건명제 ```p → q```에 대하여,
    - **역(converse)**은 ```q → p```,
    - **이(inverse)**는 ```~p → ~q```,
    - **대우(contrapositive)**는 ```~q → ~p```를 의미합니다.

역, 이, 대우는 상호간에 다음과 같은 대응관계를 갖습니다.

[역, 이, 대우 대응표]<br>
![역, 이, 대우 대응표](https://t1.daumcdn.net/cfile/tistory/240AF44D5141DCB535)
<small>출처: https://swimming79.com/15</small>

- 논리적 동치 법칙
    1. 교환 법칙<br>
    p ∨ q ≡ q ∨ p<br>
    p ∧ q ≡ q ∧ p<br>
    p ↔ q ≡ q ↔ p<br>
    2. 결합 법칙<br>
    (p ∨ q) ∨ r ≡ p ∨ (q ∨ r)<br>
    (p ∧ q) ∧ r ≡ p ∧ (q ∧ r)<br>
    3. 분배 법칙<br>
    p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)<br>
    p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)<br>
    4. 항등 법칙<br>
    p ∨ F ≡ p<br>
    p ∧ T ≡ p<br>
    5. 지배 법칙<br>
    p ∨ T ≡ T<br>
    p ∧ F ≡ F<br>
    6. 부정 법칙<br>
    ~T ≡ F<br>
    ~F ≡ T<br>
    p ∨ (~p) ≡ T<br>
    p ∧ (~p) ≡ F<br>
    7. 이중부정 법칙<br>
    ~(~p) ≡ p<br>
    8. 멱등 법칙<br>
    p ∨ p ≡ p<br>
    p ∧ p ≡ p<br>
    9. 드모르간 법칙<br>
    ~(p ∨ q) ≡ (~p) ∧ (~q)<br>
    ~(p ∧ q) ≡ (~p) ∨ (~q)<br>
    > 집합론에서,
    >> A 합집합 B 의 여집합은 A 의 여집합 교집합 B 의 여집합과 같다
    >> A 교집합 B 의 여집합은 A 의 여집합 합집합 B 의 여집합과 같다
    10. 흡수 법칙<br>
    p ∨ (p ∧ q) ≡ p<br>
    p ∧ (p ∨ q) ≡ p<br>
    11. 함축 법칙<br>
    p → q ≡ ~p ∨ q<br>
    12. 대우 법칙<br>
    p → q ≡ ~q → ~p<br>

![동치 예제01 - 드모르간]({{ site.github.url }}{% link assets/post-img/equivalence_example01.png %})

- 항진명제(tautology)와 모순명제(contradiction)
    - 합성명제를 구성하는 명제의 진리값과 상관없이,<br>
    (1) 항상 참(T)인 명제를 **항진명제**<br>
    (2) 항상 거짓(F)인 명제를 **모순명제**라 한다.

---

#### 2.3 술어논리

논리는 명제논리와 술어논리로 나눌 수 있습니다.

**명제논리**는 앞서 살펴본 것처럼 전체 진술에 대한 참거짓을 판별하는 논리입니다.
명제 자체가 원자성의 띄기 때문에 주어와 술어에 대한 분리를 수행하지 않습니다.

**술어논리**는 주어와 술어 요소를 분리하여 서술적으로 참거짓을 판별하는 논리입니다.
술어가 수식하는 객체(주부)에 따라 참거짓이 결정되며, 그 형태는 **_```술어(객체)```_**와 같습니다.
여기서는 논리 내부 구조에 대한 분석이 가능합니다.

#### 2.3.1 술어논리와 명제함수

술어논리에는 대표적으로 명제함수가 있습니다.
명제함수는 명제가 아닙니다. (ex. x + 2 = 0)

> **명제함수** (propositional function)
>> 변수의 값에 의해 함수의 진리값이 결정되는 문장이나 식.

- 변수의 명세
    - 변수의 값을 적시
        - (예) 명제함수 ```p(x, y)```가 ```x^2 + y^2 = 4```일 때 ```p(1, 2)```의 진리값은? > F (∵ 5 = 4)
    - 변수의 범위를 제시 > _한정화 (quantification, ∀, ∃)_
        > **전체한정자** (universal quantifier, ∀)
        >> "모든" 또는 "임의의"
        >> 명제함수 ```∀xP(x)```와 같이 사용되었을 경우에는 정의역의 **모든 [임의의] x**에 대해서 P(x)가 참(T)임을 의미한다.

        > **존재한정자** (existential quantifier, ∃)
        >> "존재한다", 하나라도 존재하면 참
        >> 명제함수 ```∃xP(x)```와 같이 사용되었을 경우에는 정의역의 **어떤 x**에 대해서 P(x)가 참(T)임을 의미한다.

#### 2.3.2 타당성 검사

한정자가 사용된 명제함수의 타당성은 **벤 다이어그램**을 통해 직관적으로 검사합니다.
예를 들어, "_모든 평행사변형은 사각형이다_"는 진술의 타당성은
평행사변형의 범주가 사각형의 범주 내에 있음을 확인함으로써 검사합니다.


---

2.4 추론

> **추론** (inference)
>> 참으로 알려진 명제를 기초로 하여 다른 명제를 유도해 내는 과정

(1) 이때 결론의 근거를 제공하는 알려진 명제를 **전제(premise)**,<br>
(2) 새로 유도된 명제는 **결론(conclusion)**이라고 합니다.

- 유효추론
    - 유효추론은 전제를 참(T)이라고 가정하였을 때 결론이 항상 참(T)이 되는 추론입니다.
    - ex. ((p → q) AND (q → r)) → (p → r)
- 추론 규칙 [표 2-12]
    - 기본적인 추론규칙은 **논리적 동치(항진명제)**를 이용합니다.
    - 항진명제를 활용한 추론규칙 표를 참조!

![추론 예제01]({{ site.github.url }}{% link assets/post-img/inference_example01.png %})

<br>
## 3. 증명

<br>
## 4. 집합론
