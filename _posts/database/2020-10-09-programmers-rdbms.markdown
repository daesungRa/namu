---
title:  "[플머스] SQL 문제풀이"
created:   2020-10-09 16:43:23 +0900
updated:   2020-10-09 16:43:23 +0900
author: namu
categories: database
permalink: "/database/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2018/03/30/15/11/poly-3275592_1280.jpg
image-view: true
image-author: Manuchi
image-source: https://pixabay.com/ko/users/manuchi-1728328/
---


---

[목차]

1. [SELECT](#select)
2. [SUM, MAX, MIN](#sum-max-min)
3. [GROUP BY](#group-by)
4. [IS NULL](#is-null)

---

<br>
## 들어가며

[_프로그래머스 SQL 고득점 Kit_](https://programmers.co.kr/learn/challenges) 의
문제들을 직접 풀어보았다.

SQL SELECT 구문의 일반적인 실행 순서는 다음과 같다.

```sql
FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY
```
<br>

---

다음은 동물 보호소에 보호중인 동물들에 대한 정보를 나타낸 테이블이다.<br>
base table scheme 는 다음과 같다.

테이블명: **ANIMAL_INS**

| NAME | TYPE | NULLABLE |
|:--|:--|:--|
| ANIMAL_ID | VARCHAR(N) | FALSE |
| ANIMAL_TYPE | VARCHAR(N) | FALSE |
| DATETIME | DATETIME | FALSE |
| INTAKE_CONDITION | VARCHAR(N) | FALSE |
| NAME | VARCHAR(N) | TRUE |
| SEX_UPON_INTAKE | VARCHAR(N) | FALSE |

각 컬럼은 동물의 아이디, 생물 종, 보호 시작일, 보호 시작 시 상태, 성별 및 중성화 여부를 의미한다.

---

<br>
## SELECT

**모든 레코드 조회하기**(lv1): 모든 동물의 정보를 ANIMAL_ID 순으로 조회하기

```sql
SELECT * FROM ANIMAL_INS ORDER BY ANIMAL_ID ASC;
```

**역순 정렬하기**(lv1): 모든 동물의 정보를 ANIMAL_ID 역순으로 조회하기

```sql
SELECT * FROM ANIMAL_INS ORDER BY ANIMAL_ID DESC;
```

**아픈 동물 찾기**(lv1): 모든 동물의 정보 중 아픈 동물들의 아이디와 이름을 ANIMAL_ID 순으로 조회하기

```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE INTAKE_CONDITION = 'Sick'
ORDER BY ANIMAL_ID ASC;
```

**어린 동물 찾기**(lv1): 모든 동물의 정보 중 젊은 동물들의 아이디와 이름을 ANIMAL_ID 순으로 조회하기('Aged' 가 아닌 동물들)

```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE NOT INTAKE_CONDITION = 'Aged'
ORDER BY ANIMAL_ID ASC;
```

**동물의 아이디와 이름**(lv1): 모든 동물의 정보 중 아이디와 이름을 ANIMAL_ID 순으로 조회하기

```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
ORDER BY ANIMAL_ID ASC;
```

**여러 기준으로 정렬하기**(lv1): 모든 동물의 정보 중 아이디와 이름, 보호 시작일을 이름 순으로 조회하기.
이름이 같은 동물 중에서는 보호를 나중에 시작한 동물을 먼저 보여줘야 한다.

```sql
SELECT ANIMAL_ID, NAME, DATETIME
FROM ANIMAL_INS
ORDER BY NAME ASC, DATETIME DESC;
```

**상위 n개 레코드**(lv1): 모든 동물의 정보 중 보호소에 가장 먼저 들어온 동물의 이름을 조회하기

```sql
SELECT NAME
FROM ANIMAL_INS
WHERE DATETIME = (
    SELECT MIN(DATETIME) FROM ANIMAL_INS
);
```

<br>
## SUM, MAX, MIN

**최댓값 구하기**(lv1): 모든 동물의 정보 중 가장 최근에 들어온 동물은 언제 들어왔는지 조회하기

```sql
SELECT MAX(DATETIME) FROM ANIMAL_INS;
```

**최솟값 구하기**(lv2): 모든 동물의 정보 중 보호소에 가장 먼저 들어온 동물은 언제 들어왔는지 조회하기

```sql
SELECT MIN(DATETIME) FROM ANIMAL_INS;
```

**동물 수 구하기**(lv2): 동물 보호소에 동물이 몇 마리 들어왔는지 조회하기

```sql
SELECT COUNT(*) AS count FROM ANIMAL_INS;
```

**중복 제거하기**(lv2): 동물 보호소에 들어온 동물의 이름은 몇 개인지 조회하기.
이름이 NULL 인 경우는 집계하지 않으며 중복되는 이름은 하나로 친다.

```sql
SELECT COUNT(DISTINCT NAME) AS count FROM ANIMAL_INS;
```

<br>
## GROUP BY

**고양이와 개는 몇 마리 있을까**(lv2): 모든 동물의 정보 중 고양이와 개가 각각 몇 마리인지 조회하기.
이때 고양이가 개보다 먼저 조회되도록 하기.

```sql
SELECT ANIMAL_TYPE, COUNT(*) AS count
FROM ANIMAL_INS
GROUP BY ANIMAL_TYPE
ORDER BY ANIMAL_TYPE ASC;
```

**동명 동물의 수 찾기**(lv2): 모든 동물의 이름 중 두 번 이상 쓰인 이름과 해당 이름이 쓰인 횟수를 조회하기.
이때 이름이 없는 동물은 집계에서 제외하며, 이름 순으로 조회되도록 하기.

```sql
SELECT NAME, COUNT(*) AS count
FROM ANIMAL_INS
GROUP BY NAME
HAVING COUNT(NAME) >= 2
ORDER BY NAME ASC;
```

GROUP BY 로 그룹핑된 이후 조건 처리를 할 때는 WHERE 절이 아닌 **HAVING 절**을 활용해야 한다.

<br>

---
다음은 동물 보호소에서 입양 보낸 동물들에 대한 정보를 나타낸 테이블이다.<br>
base table scheme 는 다음과 같다.

테이블명: **ANIMAL_OUTS**

| NAME | TYPE | NULLABLE |
|:--|:--|:--|
| ANIMAL_ID | VARCHAR(N) | FALSE |
| ANIMAL_TYPE | VARCHAR(N) | FALSE |
| DATETIME | DATETIME | FALSE |
| NAME | VARCHAR(N) | TRUE |
| SEX_UPON_OUTCOME | VARCHAR(N) | FALSE |

각 컬럼은 동물의 아이디, 생물 종, 입양일, 이름, 성별 및 중성화 여부를 의미한다.

---

<br>

**입양 시각 구하기(1)**(lv2): 09:00 ~ 19:59 중 시간대별 입양 건수 구하여 시간대 순으로 정렬하기

```sql
SELECT HOUR(DATETIME) AS HOUR, COUNT(*) AS COUNT
FROM ANIMAL_OUTS
GROUP BY HOUR(DATETIME)
HAVING HOUR >= 9 AND HOUR <= 19
ORDER BY HOUR ASC;
```

**입양 시각 구하기(2)**(lv4): 0시부터 23시까지, 각 시간대별 입양 건수 구하여 시간대 순으로 정렬하기

```sql
SET @hour := -1;

SELECT (@hour := @hour + 1) AS HOUR,
    (SELECT COUNT(*) FROM ANIMAL_OUTS WHERE HOUR(DATETIME) = @hour) AS COUNT
FROM ANIMAL_OUTS
WHERE @hour < 23;
```

갑자기 난이도 레벨4로 뛰었다..<br>
기본적으로 ```입양 시각 구하기(1)```과 같지만,
이 문제에서는 구간내 모든 시간대의 값을 각각 구해야 하기 때문에(값이 0이어도)
PL/SQL 의 로컬 변수 선언 기능을 활용하여 시간대 1씩 증가시키며 조회해야 한다.
([참조링크: chanhuiseok](#https://chanhuiseok.github.io/posts/db-6/))

```입양 시각 구하기(1)``` 문제에서도 값이 0이어도 구간내 모든 시간대 값을 구해야 한다면
이와 같은 방식을 활용해야 한다.

위 풀이를 SELECT 구문 실행 순서에 따라 보자면,

1. @hour 변수를 -1 로 초기화(SET 절). 여기서는 비교연산 = 와 구분하기 위해 := 를 사용한다
2. ANIMAL_OUTS 테이블로부터(FROM 절) 값을 가져오되
3. @hour 값이 23 보다 작으면(WHERE 절) 다음 구문을 실행한다
4. @hour := @hour + 1 연산 후 해당 값을 HOUR 컬럼으로 활용(SELECT 절)
5. 서브쿼리로 @hour 값과 같은 시간대(HOUR)의 COUNT 를 구한다

@가 붙어서 초기화된 변수는 프로시저가 종료되어도 값이 유지된다고 한다.
시간 될 때 PL/SQL 도 하나씩 공부해두자..

<br>
## IS NULL

**이름이 없는 동물의 아이디**(lv1): 동물 보호소에 들어온 동물 중, 이름이 없는 채로 들어온 동물의 아이디 조회하기.
단, 아이디는 오름차순 정렬하기.

```sql
SELECT ANIMAL_ID
FROM ANIMAL_INS
WHERE NAME IS NULL
ORDER BY ANIMAL_ID ASC;
```

**이름이 있는 동물의 아이디**(lv1): 동물 보호소에 들어온 동물 중, 이름이 있는 동물의 아이디 조회하기.
단, 아이디는 오름차순 정렬하기.

```sql
SELECT ANIMAL_ID
FROM ANIMAL_INS
WHERE NAME IS NOT NULL
ORDER BY ANIMAL_ID ASC;
```

**NULL 처리하기**(lv2): 모든 동물의 정보 중 동물의 생물 종, 이름, 성별 및 중성화 여부를 아이디 순으로 조회하기.
이때 NULL 기호는 "No name" 으로 표시하기.

```sql
SELECT ANIMAL_TYPE, IFNULL(NAME, "No name") AS NAME, SEX_UPON_INTAKE
FROM ANIMAL_INS
ORDER BY ANIMAL_ID ASC;
```

NULL 값인 경우 지정한 값으로 변환하는 **IFNULL** 함수를 기억하자.

<br>
## JOIN

이제 SQL 의 꽃인 JOIN 파트다.
여기서는 ```ANIMAL_INS``` 테이블과 ```ANIMAL_OUTS``` 테이블을 함께 사용하기도 한다.
이때 ```ANIMAL_OUTS``` 의 ANIMAL_ID 는 ```ANIMAL_INS``` 의 ANIMAL_ID 의 외래키이다.

**없어진 기록 찾기**(lv3): 천재지변으로 인해 일부 데이터가 유실되었을 때,
입양을 간 기록은 있는데 보호소에 들어온 기록이 없는 동물의 아이디와 이름을 아이디 순으로 조회하기

```sql
SELECT O.ANIMAL_ID AS ANIMAL_ID, O.NAME AS NAME
FROM ANIMAL_OUTS AS O LEFT OUTER JOIN ANIMAL_INS AS I
ON O.ANIMAL_ID = I.ANIMAL_ID
WHERE I.ANIMAL_ID IS NULL
```

두 테이블 간 JOIN 구문은 기본적으로 ```FROM``` 구문 안에서 어떤 방식의 JOIN 을 할지 정의하고,
```ON``` 구문 안에서 서로의 관계를 명시한다.
```ANIMAL_OUTS``` 의 ANIMAL_ID 는 ```ANIMAL_INS``` 의 ANIMAL_ID 의 외래키라는 관계가 있다.

이제 JOIN 을 통해 정의된 관계를 활용해
```ANIMAL_OUTS``` 에는 존재하지만 ```ANIMAL_INS``` 에는 존재하지 않는 ROW 를 찾아
그것의 아이디와 이름을 반환해주면 된다.

**있었는데요 없었습니다**(lv3): 모든 동물들의 정보 중 보호 시작일보다 입양일이 더 빠른 동물의 아이디와 이름 조회하기
이때 보호 시작일이 빠른 순으로 조회할 것.

```sql
SELECT I.ANIMAL_ID AS ANIMAL_ID, I.NAME AS NAME
FROM 
```
