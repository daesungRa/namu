---
title:  "[플머스] SQL 문제풀이(SELECT)"
created:   2020-10-09 16:43:23 +0900
updated:   2020-10-09 22:32:18 +0900
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
5. [JOIN](#join)
6. [String, Date](#string-date)

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

SELECT (@hour := @hour + 1) AS HOUR, (
        SELECT COUNT(*)
        FROM ANIMAL_OUTS
        WHERE HOUR(DATETIME) = @hour
    ) AS COUNT
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
여기서는 ```ANIMAL_INS``` 테이블과 ```ANIMAL_OUTS``` 테이블을 함께 사용한다.
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

OUTER JOIN 은 기본적으로 두 테이블 간 일치하지 않는 ROW 까지 모두 표현하며,
LEFT OUTER JOIN 은 왼쪽 항을 기준으로 이를 표현한다.

이제 JOIN 을 통해 정의된 관계를 활용해
```ANIMAL_OUTS``` 에는 존재하지만 ```ANIMAL_INS``` 에는 존재하지 않는 ROW 를 찾아
그것의 아이디와 이름을 반환해주면 된다.

**있었는데요 없었습니다**(lv3): 모든 동물들의 정보 중 보호 시작일보다 입양일이 더 빠른 동물의 아이디와 이름 조회하기
이때 보호 시작일이 빠른 순으로 조회할 것.

```sql
SELECT I.ANIMAL_ID AS ANIMAL_ID, I.NAME AS NAME
FROM ANIMAL_INS AS I INNER JOIN ANIMAL_OUTS AS O
ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE I.DATETIME > O.DATETIME
ORDER BY I.DATETIME ASC;
```

이 문제에서는 동일 ROW 를 기준으로 보호 시작일이 입양일보다 늦은 잘못된 데이터만 추출한다.
그러므로 일치하는 경우만 찾는 ```INNER JOIN``` 을 사용하는데, ```INNER``` 를 생략하여 JOIN 이라고만 입력해도 된다.
다만 가독성과 명료성을 위해 모두 적어주는 것이 좋다.

**오랜 기간 보호한 동물(1)**(lv3): 아직 입양을 못 간 동물 중, 가장 오래 보호소에 있었던 동물 3마리의 이름과 보호 시작일을 조회하기.
이때 보호 시작일이 빠른 순으로 조회할 것.

```sql
SELECT I.NAME AS NAME, I.DATETIME AS DATETIME
FROM ANIMAL_INS AS I LEFT OUTER JOIN ANIMAL_OUTS AS O
ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE O.ANIMAL_ID IS NULL
ORDER BY I.DATETIME ASC
LIMIT 3;
```

표현할 ROW 개수 제한은 ```LIMIT``` 키워드로 한다. 3이라면 3개만 출력하지만, 페이징 처리 시 ```LIMIT 0, 10``` 와 같이 사용한다.
첫번째 항은 인덱스이고, 두번째 항은 인덱스로부터 시작해 출력할 ROW 개수를 의미한다.

**보호소에서 중성화한 동물**(lv4): 모든 동물의 정보 중 보호소에 들어올 당시에는 중성화되지 않았지만,
보호소를 나갈 당시에는 중성화된 동물의 아이디와 생물 종, 이름을 아이디 순으로 조회하기.

SEX_UPON 종류
- \[중성화여부\] \[성별\]
- Neutered, Spayed: 중성화됨(각각 수컷과 암컷, 거세하다와 난소를 제거하다)
- Intact: 중성화 안됨

```sql
SELECT I.ANIMAL_ID ANIMAL_ID, I.ANIMAL_TYPE ANIMAL_TYPE, I.NAME NAME
FROM ANIMAL_INS AS I INNER JOIN ANIMAL_OUTS AS O
ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE I.SEX_UPON_INTAKE LIKE "Intact%"
    AND NOT O.SEX_UPON_OUTCOME LIKE "Intact%"
ORDER BY I.ANIMAL_ID
```

중성화 여부에 대해서 문자열이 ```Intact``` 를 포함하는지 여부만 확인해도 되기는 하지만,
혹시 모를 예외상황을 고려해 보다 명시적으로 조건짓는 것이 낫다(Neutered, Spayed 확인까지).

```sql
WHERE I.SEX_UPON_INTAKE LIKE "Intact%"
    AND NOT O.SEX_UPON_OUTCOME LIKE "Intact%"

INTO

WHERE I.SEX_UPON_INTAKE LIKE "Intact%"
    AND (
        O.SEX_UPON_OUTCOME LIKE "Neutered%"
            OR O.SEX_UPON_OUTCOME LIKE "Spayed%"
    )
```

<br>
## String, Date

**루시와 엘라 찾기**(lv2): 동물 보호소에 들어온 동물 중 이름이 Lucy, Ella, Pickle, Rogan, Sabrina, Mitty 인 동물의
아이디와 이름, 성별 및 중성화 여부를 조회하기

```sql
SELECT ANIMAL_ID, NAME, SEX_UPON_INTAKE
FROM ANIMAL_INS
WHERE NAME IN ('Lucy', 'Ella', 'Pickle', 'Rogan', 'Sabrina', 'Mitty')
```

동물 이름이 제시된 이름들에 속하는지 확인하려면 ```IN``` 키워드를 사용하면 된다.

**이름에 el이 들어가는 동물 찾기**(lv2): 모든 동물의 정보 중 이름에 "EL"이 들어가는 개의 아이디와 이름을 조회하기.
결과는 이름 순으로 정렬.

```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE ANIMAL_TYPE = "Dog" AND NAME LIKE "%EL%"
ORDER BY NAME ASC;
```

테이블명, 컬럼명이나 컬럼값의 대소문자 구분 여부는 DB 환경설정에서 정한다(0 or 1).

**중성화 여부 파악하기**(lv2): 모든 동물의 정보 중 아이디와 이름, 중성화 여부를 아이디 순으로 나열하되,
중성화 여부를 'O', 'X' 라고 표시하기

- 중성화 되었으면 ```SEX_UPON_INTAKE``` 컬럼 문자열에 'Neutered' 또는 'Spayed' 를 포함한다.

```sql
SELECT ANIMAL_ID, NAME,
    CASE
        WHEN
            SEX_UPON_INTAKE LIKE "Neutered%"
                OR SEX_UPON_INTAKE LIKE "Spayed%"
            THEN 'O'
        ELSE 'X'
    END AS Intact
FROM ANIMAL_INS
```

SQL 조건문인 ```CASE ~ WHEN ~ THEN ~ ELSE ~ END``` 구문을 활용해야 한다.

**오랜 기간 보호한 동물(2)**(lv3): 입양을 간 동물 중, 보호 기간이 가장 길었던 동물 두 마리의 아이디와 이름을 조회하기.
이때 결과는 보호 기간이 긴 순으로 조회

```sql
SELECT O.ANIMAL_ID AS ANIMAL_ID, O.NAME AS NAME
FROM ANIMAL_OUTS AS O INNER JOIN ANIMAL_INS AS I
ON O.ANIMAL_ID = I.ANIMAL_ID
ORDER BY (O.DATETIME - I.DATETIME) DESC
LIMIT 0, 2;  /* LIMIT 2 */
```

함정에 빠지지 말자.<br>
오래된 동물이 아니라 오래 보호된 동물이다!!

**DATETIME에서 DATE형 변환**(lv2): 모든 동물의 정보 중 아이디와 이름, 들어온 날짜를 아이디 순으로 조회하기

```sql
SELECT ANIMAL_ID,
    NAME,
    DATE_FORMAT(DATETIME, '%Y-%m-%d') AS 날짜
FROM ANIMAL_INS
```

```DATE_FORMAT``` 키워드를 활용해 날짜 타입의 표현 포맷을 변경할 수 있다.
포맷 문자열은 익숙하니까.

끝~
