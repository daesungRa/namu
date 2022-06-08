---
title:  "[03] 오라클 기본 정리 - 쿼리"
created:   2022-05-13 21:00:00 +0900
updated:   2022-06-02 22:33:00 +0900
author: namu
categories: database
permalink: "/database/:year/:month/:day/:title"
image: https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png
image-view: true
image-author: logos-world.net/oracle-logo/
image-source: https://logos-world.net/oracle-logo/
---

---

### 목차

1. [쿼리의 동작방식](#1-쿼리의-동작방식)
    - [Data Dictionary(데이터 사전)](#data-dictionary-데이터-사전)
    - [SELECT 동작방식](#select-동작방식)
    - [DML 동작방식](#dml-동작방식)
    - [다중 사용자 트랜잭션](#다중-사용자-트랜잭션)
2. [쿼리 정리](#2-쿼리-정리)
    - [DUAL](#dual)
    - [사용자 관리 쿼리](#사용자-관리-쿼리)
    - [테이블 관리 쿼리](#테이블-관리-쿼리)
    - [조인](#조인)
    - [단일행 함수](#단일행-함수)
    - [복수행 함수](#복수행-함수)
    - [계층형 쿼리](#계층형-쿼리)
    - [기타 쿼리](#기타-쿼리)
3. [쿼리 튜닝 목록](#3-쿼리-튜닝-목록)

### 시리즈

- <a href="{{ site.github.url }}/database/2022/04/09/oracle-default-01" target="_blank">
[01] 오라클 기본 정리 - 오라클 살펴보기</a>
- <a href="{{ site.github.url }}/database/2022/05/05/oracle-default-02" target="_blank">
[02] 오라클 기본 정리 - DB 생성하기</a>

### 참조

- <a href="https://www.oracle-world.com/category/architecture/"
target="_blank">oracle-world.com ARCHITECTURE articles</a>

---

<br>
## 들어가며

이전 글인 **<a href="{{ site.github.url }}/database/2022/05/05/oracle-default-02" target="_blank">
[02] 오라클 기본 정리 - DB 생성하기</a>** 로부터 이어집니다.

<br>
## 1. 쿼리의 동작방식

사용자 프로세스의 접속은 인스턴스를 통해 이루어지는만큼 접속한 사용자가 요청하는 쿼리 또한
**인스턴스 내부의 메모리 공간에서 수행**됩니다. (**<a href="{{ site.github.url }}/database/2022/04/09/oracle-default-01#2-sga"
target="_blank">이전 글의 SGA 개념 참조</a>**)

쿼리의 동작방식에서 첫 번째 단계는 **SGA** 내부의 **Shared pool** 에 속한 **Library cache** 에 **동일 쿼리에 대한
execution plan** 이 있는지 확인하는 것입니다. (**soft parse**)

그리고 모든 구문이 해석될 때는 항상 **데이터 사전**을 참조하게 됩니다.
**데이터 사전** 정보는 마찬가지로 **SGA** 내부의 **Shared pool** 에 **Dictionary cache** 에 적재되어 있습니다.

![instance detail](https://docs.oracle.com/cd/E11882_01/server.112/e40540/img/cncpt325.gif)
<small>refer to
**<a href="https://docs.oracle.com/cd/E11882_01/server.112/e40540/startup.htm#CNCPT005"
target="_blank">docs.oracle.com</a>**</small>

쿼리의 동작방식을 살펴봄에 앞서, **데이터 사전**에 대해 살펴보겠습니다.

<br>
### Data Dictionary(데이터 사전)

오라클 인스턴스에서 사용자가 요청한 모든 쿼리는 대상 테이블의 스키마 정보 및 권한 관계를 체크하기 위해 **데이터 사전**을 참조합니다.
(참조: **<a href="https://docs.oracle.com/cd/E11882_01/server.112/e40540/datadict.htm"
target="_blank">오라클 Docs 데이터 사전</a>**)

**(1)** 데이터 사전은 **데이터베이스의 관리형 메타데이터**를 제공합니다.

- **데이터베이스 내 모든 객체**의 컬럼 및 제약조건 등 **스키마 정보**, **객체 할당공간 정보** 저장
- **계정**과 **계정의 권한 및 역할 정보**, **계정 감사(auditing) 정보** 저장
- 중요한 참조정보를 제공하는 만큼 **오라클 데이테 관리의 핵심**

**(2)** 데이터 사전은 **읽기 전용(Read-Only)** 으로 **쿼리 수행시 항상 참조**됩니다.

- 빈번한 참조가 예상되므로 인스턴스 메모리 상에 적재<br>
**```SGA > Shared pool > Dictionary cache```**
- **DDL** 쿼리가 수행되면 이에 맞게 데이터 사전도 업데이트

**(3)** 데이터 사전은 **SYS** 계정의 **SYSTEM 테이블스페이스**에 기본 참조 테이블(**base table**)로 관리됩니다.

- 오직 **오라클 데이터베이스 시스템에 의해서만 Writer/Read** 되며, **일반 사용자는 직접 접근이 불가**
(most data is stored in a cryptic format)
- 따라서 일반 사용자가 조회 시 **권한 및 역할에 따라 다른 뷰(View)** 로 나타남
- 뷰의 Prefix 규칙
    - **```DBA_```**: 관리자용, 모든 객체
    - **```ALL_```**: 모든 사용자용, 해당 사용자에게 부여된 권한에 따름
    - **```USER_```**: 모든 사용자용, 해당 사용자에게 귀속된 객체
    - **```V$_```**: 서버의 성능이나 시스템 관련정보, 파라미터값 확인

예를 들어 여러 계정 정보를 확인하기 위해 다음의 뷰를 활용하는데,
실행하는 계정의 권한에 따라 출력 결과의 차이가 있습니다.

```sql
SELECT * FROM DBA_USERS;  -- 모든 사용자 정보 출력. only SYSDBA can use, show all columns including TABLESPACE
SELECT * FROM ALL_USERS;  -- 모든 사용자 정보 출력. 허용된 스키마까지 확인. 제한된 컬럼 조회됨
SELECT * FROM USER_USERS;  -- 현재 접속중 사용자정보 출력
```

```sql
SELECT NAME, VALUE, DISPLAY_VALUE
  FROM V$PARAMETER
  WHERE NAME LIKE '%service_name%';  -- service name 확인
```

**(4) 데이터 사전 활용예제: 테이블 정의서 만들기**

**<a href="https://tragramming.tistory.com/75" target="_blank">tragramming.tistory.com</a>** 블로그 글을 참조했습니다.

```sql
-- 테이블 정의서('USER$' owned by 'SYS')
-- 컬럼정보, 테이블 제약조건, 컬럼 제약조건, 코멘트 조회
SELECT UTC.TABLE_NAME AS TABLE_NAME,
    UTC.COLUMN_NAME AS COLUMN_NAME,
    CASE WHEN UTC.DATA_TYPE IN ('VARCHAR2')
      THEN UTC.DATA_TYPE || '(' || UTC.DATA_LENGTH || ')'
      ELSE UTC.DATA_TYPE
      END AS DATA_TYPE,
    CASE WHEN UTC.NULLABLE = 'Y' THEN 'Y'
      ELSE ''
      END AS NULLABLE,
    CASE WHEN T1.COLUMN_NAME IS NOT NULL THEN 'Y'
      ELSE ''
      END AS IS_PK,
    UCCM.COMMENTS AS COMMENTS
  FROM USER_TAB_COLUMNS UTC
    LEFT OUTER JOIN
    (
      SELECT DISTINCT COLUMN_NAME
        FROM USER_CONSTRAINTS UC
        INNER JOIN
        USER_CONS_COLUMNS UCC
        ON UC.CONSTRAINT_NAME = UCC.CONSTRAINT_NAME
        AND UC.CONSTRAINT_TYPE = 'P'
    ) T1
    ON UTC.COLUMN_NAME = T1.COLUMN_NAME
    LEFT OUTER JOIN
    USER_COL_COMMENTS UCCM
    ON UTC.TABLE_NAME = UCCM.TABLE_NAME
    AND UTC.COLUMN_NAME = UCCM.COLUMN_NAME
  WHERE UTC.TABLE_NAME = 'USER$';  -- input table name you wanna check
```

<br>
### SELECT 동작방식

**SELECT** 쿼리는 오라클 운영 시 가장 빈번하게 사용됩니다.

요청된 쿼리와 동일한 **execution plan** 이 인스턴스 **SGA** 의 **Library cache** 에 존재하지 않는 경우
**Hard parse** 를 수행합니다. **Library cache** 내에는 **SQL 영역(area)** 이 존재하는데,
이곳에 해석된(parsed) 이전 쿼리의 해시값이 저장되어 새로 들어온 쿼리의 해시값과 동일한지 체크합니다.
동일한 해시값이 없다는 것은 새로운 구문 해석(parse)을 의미하는데,
다음의 네 단계로 execute 됩니다. (**FETCH** 단계는 **SELECT statements only**)

![instance detail](http://www.oracle-world.com/wp-content/uploads/2018/10/05_SELECT_processing.png)
<small>refer to
**<a href="https://www.oracle-world.com/architecture/select-statement-processing/"
target="_blank">oracle-world.com</a>**</small>

**(1) PARSE**

- **구문 확인**: 명령어 키워드의 순서 등 쿼리가 **문법적으로 정확한지** 확인
- **의미 확인**: **컬럼명과 오브젝트명이 정확한지** 확인 (바로 여기서 **Data Dictionary Cache** 의 메타데이터 크로스체킹)
- **권한 확인**: 사용자/어플리케이션이 쿼리의 오브젝트에 접근하기에 **적절한 권한을 가지고 있는지** 확인

**PARSE** 작업후 **Oracle OPTIMIZER** 가 **execution plan** 을 생성합니다.
이는 **OPTIMIZER** 가 쿼리가 어떻게 실행될 지 결정한다는 것을 의미합니다.

**(2) BIND**

- bind 및 host 변수를 실제 값으로 대체

최적의 **execution plan** 이 선택된 후, **오라클은 모든 변수들을 바인딩(bind)**하고 **EXECution** 단계로 진행합니다.

**(3) EXEC**

- explain plan 기반으로 작업 수행

실행 단계에서 오라클은 쿼리 대상 오브젝트와 관련된 **데이터 블록**을 읽어들여 **버퍼 캐시에 적재**합니다.
이 과정은 **I/O** 작업을 수반하기에 **메모리에서 바로 읽어들이는 것에 비해 매우 느립**니다.
만약 해당 오브젝트 정보가 **메모리에 이미 적재되어 있다면 다시 읽어들이지 않고 메모리에서 빠르게 불러**옵니다.

**(4) FETCH** (SELECT statements only)

- 사용자에게 결과셋 반환

<br>

> **explain plan**<br><br>
> 오라클 최적화 도구(Oracle optimizer)에 의해 선택된 실행 계획(execution plans)을 보여줌. 구문의 실행 계획이란
> 오라클이 구문 수행을 위해 실행하는 작업의 순서

<br>

파싱에는 **soft parse** 와 **hard parse** 가 존재합니다.
앞서 살펴봤듯 전자는 사전에 수행된 (완전히) 동일한 쿼리가 메모리에 존재하면 수행되고, 후자는 새로 전달된 쿼리를 해석 시 수행됩니다.

둘 간의 차이는 서버 프로세스에 의해 생성된 **SQL 쿼리의 해시값**이 동일한지에 따라 좌우되는데,
전달된 쿼리 내에 **대소문자 혹은 띄어쓰기의 작은 차이**만 존재해도 전혀 다른 해시가 생성된다는 사실을 꼭 기억하시기 바랍니다.
**soft parse** 와 **hard parse** 는 오라클의 성능 면에서 큰 차이를 보입니다.
(이것은 DBA 가 쿼리를 튜닝할 때 가장 기초적인 점검 사항)

특히 **프로시저(procedure)**는 구문상의 작은 차이가 발생하지 않기 때문에 파싱의 성능 면에서 좋습니다.

이 외에도 **바인드 변수(bind variables)**를 사용하는 습관은
오라클의 관점에서 (입력값만 다르지) 동일한 SQL 쿼리 해시를 생성하기 때문에 권장됩니다.

요청된 쿼리와 동일한 해시가 **SQL area** 에 존재하여 **soft parse** 가 진행되는 경우,
위 단계 중 **PARSE** 는 건너뛰고 **EXEC** 와 **FETCH**(SELECT statements only) 단계만 실행됩니다.

다음은 대소문자만 다르고 완전히 동일한 두 쿼리의 해시값이 어떻게 생성되는지 확인하는 예시입니다.

```sql
-- first run this query
SELECT * FROM dual;

-- then run this one again with all uppercase letters
SELECT * FROM DUAL;

-- check the sql hashes 
SELECT sql_id, sql_text, hash_value
  FROM v$sql
  WHERE 1=1
    AND lower(sql_text) LIKE '%select%from dual%';

   sql_id     |       sql_text      | hash_value
--------------------------------------------------
0x735fvggtnu6 | SELECT * FROM DUAL  | 3741111110
3vyt9wdmca69b | SELECT * FROM dual  | 1724193067
-- As you can see Oracle evaluated it as two different queries.
```
<small>(참조: <a href="https://www.oracle-world.com/architecture/select-statement-processing/"
target="_blank">SELECT Statement Processing</a>)</small>

<br>
### DML 동작방식

**DML** 프로세싱은 **FETCH** 단계만 제외하고 **SELECT** 와 동일한 과정을 거칩니다.

쿼리의 해싱을 비교한 후 구문을 해석하고 **execution plan** 을 생성하는 **PARSE** 단계, 변수를 실제값으로 대체하는 **BIND** 단계는
동일하고, 쿼리를 수행하는 **EXEC** 단계에서 차이가 있습니다.

제품의 가격을 100원에서 1000원으로 변경하는 다음의 **UPDATE** 쿼리를 예시로 들겠습니다.

```sql
UPDATE MALL_PRODUCT
  SET PRICE = 1000  -- origin value is 100
  WHERE PROD_NO = 1;
```

**EXEC** 단계에서 오라클은 먼저 **대상 오브젝트(가격이 100원이고 제품번호가 1) 정보**가 있는 **데이터 블록**을 가져와
**메모리 버퍼 캐시**에 적재합니다.
그리고 **요청된 변경 사항(100 -> 1000)**은 버퍼 캐시 내 대상 오브젝트가 **UPDATE** 되기 이전에 **REDO 로그 버퍼**에 먼저 저장됩니다.

이를 간략히 표현하면 다음과 같습니다.

```text
--- Buffer Cache 영역 ---   --- Redo Log Buffer 영역 ---
|  100                 |   |      1; 100; 1000;       |
|                      |   |                          |
------------------------   ----------------------------
```

**Redo 로그 버퍼** 메모리 영역도 **인스턴스 SGA** 에 존재함을 기억하시기 바랍니다.

이후 버퍼 캐시에 있는 **대상 데이터 블록의 정보(100)**는 **UNDO(트랜잭션이 커밋되기 전까지 모든 변경 사항을 저장)** 블록에
**오브젝트 참조 정보(PROD_NO=1)**와 함께 저장되고, 변경할 **새 정보로 대체(1000)**됩니다.

```text
--- Buffer Cache 영역 ---   --- Redo Log Buffer 영역 ---
|  1000                |   |      1; 100; 1000;       |
|       UNDO 100(=> 1) |   |                          |
------------------------   ----------------------------
```

그리고 **쿼리를 요청한 사용자는 구문이 완료되었다는 메세지를 받는데**,
버퍼 캐시에서 변경 사항이 적용된 현재 상태는 아직 **commit or rolled back** 되기 이전입니다.

따라서 트랜잭션을 운용하는 사용자는 최종적으로 **커밋 또는 롤백 여부를 결정**해야 합니다.

만약 진행중인 트랜잭션의 **커밋 또는 롤백**이 최종적으로 이루어지지 않으면
**해당 데이터 블록이 락(LOCK)**이 걸리게 되고, 업데이트된 **최신 데이터를 다른 사용자가 확인할 수 없습**니다.
(락이 걸리면 다른 사용자는 해당 블록에 대해 **UPDATE** 혹은 **FETCH** 작업을 진행할 수 없음)
이 때는 변경 이전의 **old data 만 확인**할 수 있습니다.

**롤백**의 경우는 매우 단순합니다.
롤백시에는 방금전 **UNDO 에 저장했던 예전값을 다시 되돌리게** 됩니다.
이 때는 **Redo 로그 버퍼**에서 다시 쓰기 작업이 필요 없으며, 모든 것은 원래 상태로 돌아갑니다.

또한 트랜잭션의 사용자가 **커밋을 실행**하면 **Redo 로그 버퍼**의 모든 항목들이 **LGWR(Log Writer)** 서버 프로세스에 의해
**Redo 로그 파일**에 저장되고 **Redo 로그 버퍼**는 비워지게 됩니다.
이 때는 커밋되는 트랜잭션에서 생성된 **SCN(System Change Number)** 또한 엔트리에 포함되어 **Redo 로그 파일**까지 함께 저장됩니다.
그리고 대상 데이터 블록은 lock 이 걸려 있는 상태로부터 **lock 이 released** 됩니다.

**커밋의 여부**는 **버퍼 캐시(메모리)에 적용되어 있는 UPDATE 변경 사항이
데이터 파일(물리적 디스크)에 실제 write 되는 것과는 완전히 별개**입니다.
버퍼 캐시에는 적용되었지만 데이터 파일에는 적용되지 않은 변경 사항을 **Dirty Buffer** 라 합니다.
그리고 **Dirty Buffer** 가 파일에 기록되는 것은 **DBWR(Database Writer)** 서버 프로세스에 의해 이루어집니다.
**DBWR** 는 몇몇 상황에서 실행되는데, **CKPT(Checkpoint)** 프로세스가 실행(보통 수 초마다 실행)된 직후 혹은
**버퍼 캐시에 가용한 블록이 부족해진 경우**입니다.

**커밋의 여부**와 **버퍼 캐시 변경의 파일 write 여부**가 완전히 별개이기 때문에,
아직 커밋되지 않았지만 **DBWR** 에 의해 파일에 이미 기록된 변경 사항이 있을 수도 있고,
커밋이 되었는데도 아직 물리적으로 write 되지 않은 변경 사항이 있을 수도 있습니다.
이러한 특징은 **빈번한 I/O 에 따른 부하를 줄이고** 상대적으로 가벼운 **메모리 영역을 효율적으로 사용**하기 위한 오라클의 전략입니다.

**Redo Log** 정보가 **Dirty Buffer** 정보보다 훨씬 경량이기 때문에,
**I/O 작업의 측면에서 트랜잭션 커밋 시 리두 로그정보를 즉시 write 하고 dirty buffer 는 별도로 한 번에 write 하는 것**이
오라클의 성능 면에서 좋습니다.
이러한 각 작업들은 **DBWR**, **LGWR** 등의 서버 프로세스에 의해 체계적으로 관리됩니다.

이 기능이 오라클에서 가능한 이유는 **인-메모리로 데이터 블록을 적재하여 최신 변경 사항에 대한 빠른 참조가 가능**하고,
**Redo 로그 파일**에 트랜잭션의 시계열적인 모든 진행사항이 저장되어 **롤백이나 장애시 회복의 작업이 용이**하기 때문입니다.

<br>
### 다중 사용자 트랜잭션

실제 오라클 데이터베이스 시스템에서는 수많은 트랜잭션의 쿼리가 동시적으로 수행됩니다.
이것이 어떻게 가능한지 **3개의 서로 다른 트랜잭션에서 DML 을 동시 수행**하는 다음의 예시를 통해 살펴보겠습니다.

![multi-user concurrent transactions](https://www.oracle-world.com/wp-content/uploads/2018/10/08_Multi-user.png)
<small>refer to
**<a href="https://www.oracle-world.com/architecture/multi-user-concurrent-transactions/"
target="_blank">oracle-world.com</a>**</small>

위와 같이 세 개(빨, 녹, 보라)의 **Dirty buffers** 와 **Redo 로그 버퍼**가 각각 생성되었다고 가정합니다.

그리고 **user3(보라색)** 가 가장 먼저 변경 사항을 **커밋**합니다.
이 때는 **Redo Log Buffer** 에 존재하는 모든 엔트리들이 비워지며 **LGWR** 에 의해 **Redo Log Files** 에 저장되는데,
엔트리 중 커밋된 보라색(user3) 엔트리에만 **SCN(System Change Number)** 이 생성되어 포함됩니다.

이는 **Redo Log File** 에 완료된 트랜잭션의 SCN 과 함께 리두 로그가 저장됨으로써
**언제든지 데이터 변경 사항을 추적할 수 있음**을 의미합니다.

그리고 버퍼 캐시에 존재하는 변경사항들인 **Dirty Buffers** 가
**DBWR 에 의해 데이터 파일에 write 되는 것은 앞서 설명한 것처럼 커밋의 여부와는 별개**이므로,
굳이 보라색 엔트리의 커밋과 함께 write 되지는 않습니다. (**DBWR** 스케줄에 따라 무관하게 write 될 수도 있음)

만약 동시 트랜잭션 쿼리로 인해 인스턴스에 데이터 충돌이 일어난다면,
**Redo Log File** 의 정보를 참조하여 커밋된 트랜잭션과 SCN, 아직 커밋되지 않은 트랜잭선의 시계열적인 진행 상황을 고려하여
**Recover(회복) 작업**을 진행할 수 있습니다.

<br>
## 2. 쿼리 정리

다음으로 유용한 쿼리를 정리합니다.

<br>
### DUAL

**DUAL**은 오라클 자체 제공 테이블로써, 간단한 함수를 이용해서 계산되는 임시 결과값을 확인할 수 있습니다.

**DUAL TABLE?**
- 별도의 테이블 생성 없이 값을 알고싶을 때 사용되며, 임시 데이터가 저장됨
- SYS 가 소유하나, 다른 사용자도 접근 가능
- 오직 한 행, 한 컬럼을 담고 있음 (DUMMY: X)

```sql
-- check system date
SELECT SYSDATE FROM DUAL;
SELECT TO_CHAR(SYSDATE, 'YY-mm-dd HH:MM:SS') FROM DUAL;  -- check system date with custom format
SELECT SYSTIMESTAMP FROM DUAL;  -- ex. 22/04/24 21:01:29.344000000 +09:00
SELECT CURRENT_DATE FROM DUAL;

-- DUAL 테이블로 임의의 USER 생성하여 UNION ALL 후 전체 조회
-- USERS 테이블 생성 없이 확인가능
SELECT USERS.*
FROM (
    SELECT 'u1' as NAME, 32 as AGE FROM DUAL
    UNION ALL
    SELECT 'u2', 43 FROM DUAL
    UNION ALL
    SELECT 'u3', 29 FROM DUAL
) USERS
WHERE AGE >= 30;  -- NAME: AGE => u1: 32, u2: 43
```

DUAL 테이블을 활용하면,
마지막 USERS 예제처럼 실제 테이블을 생성하지 않고도 원하는 형태의 사용자 조회 쿼리를 테스트해볼 수 있습니다.

<br>
### 사용자 관리 쿼리

계정 목록 조회 시, 접속 계정 및 권한에 따라 다른 형태의 뷰를 활용합니다.

<br>

> **뷰(VIEW)란?**
> - 계정 조회, 테이블 조회 등 핵심적인 정보 조회는 보통 VIEW 로 쿼리함 (ALL_USERS, DBA_USERS, USER_USERS,
> ALL_TABLES, USER_TABLES, TAB)
> - 뷰는 **DB 에 존재하는 테이블을 관점에 따라 재조합 또는 요약해서 보여주는 기능**을 하는데,
> - 계정이나 테이블 조회의 경우 관리자(SYS)가 볼 수 있는 세부 정보를 일반 사용자에게 보여줄 수 없기 때문에 뷰를 사용함
> - 기타 여러 목적으로 뷰를 생성해 사용할 수 있음

<br>

```sql
-- check current access user
SHOW USER;

-- check users (except password)
SELECT * FROM DBA_USERS;  -- 모든 사용자 정보 출력. only SYSDBA can use, show all columns including TABLESPACE
SELECT * FROM ALL_USERS;  -- 모든 사용자 정보 출력. 허용된 스키마까지 확인. 제한된 컬럼 조회됨
SELECT * FROM USER_USERS;  -- 현재 접속중 사용자정보 출력

SELECT * FROM ALL_USERS WHERE USERNAME LIKE '%SCOTT%';  -- 계정명으로 LIKE 조회
SELECT *
  FROM DBA_USERS
  WHERE PASSWORD_CHANGE_DATE >= TO_DATE('20220430', 'YY/MM/DD');  -- 패스워드 변경일로 조회, only SYSDBA can use
```

<br>
**오라클의 관리자 계정과 권한**에 따라 접근 가능한 정보 및 동작의 차이가 존재합니다.

<br>
**SYS 권한**: 오라클 DB 의 최고 관리자(Super user, DBA role)이자 DB 시스템 오너

- 오라클 DB 의 모든 기본 테이블 및 뷰 데이터 딕셔너리는 **SYS** 의 스키마로 저장됨
- 이러한 기본 테이블과 뷰 데이터 딕셔너리는 무결성 유지를 위하여 오직 database 에 의해서만 조작됨
- 어떤 유저나 관리자에 의해서도 직접적으로 수정되지 않음
- 또한 **SYS** 는 **SYSDBA** 권한으로 부여되기 때문에, 백업이나 복구 등 높은 레벨의 관리작업을 수행 가능
- **```CONN SYS /AS SYSDBA```**

<br>
**SYSTEM 권한**: 시스템 운영을 위한 관리자(SYSOPER role) 역할

- 그러나 SYS 와는 다르게 **DB 생성 권한이 없으며, 다른 유저의 데이터에 접근 불가**
- **SYSTEM** 은 **SYSOPER** 권한으로 부여되기 때문에, 운영을 위한 기본적인 권한을 갖음
- **백업 및 복구**, **DB 업그레이드** 작업을 제외한 관리기능을 수행함
- 만약 일일 모니터링과 같은 목적의 관리자 계정이 필요한 경우,
**SYSTEM** 을 그대로 사용하지 말고 별도의 **모니터링용 관리계정** 생성이 권장됨
- **```CONN SYSTEM```**

<br>
**SYSOPER 권한**

- 인스턴스와 데이터베이스에 대한 startup, mount, open shutdown, dismount, close 권한
- 데이터베이스 백업, 로그파일을 이용한 복구 등에 대한  database backup, archive log, recover 권한

<br>

```sql
-- check user privileges
-- 'SYSTEM'(DBA role): 'GLOBAL QUERY REWRITE', 'CREATE TABLE', 'DEQUEUE ANY QUEUE',
--     'ENQUEUE ANY QUEUE', 'SELECT ANY TABLE', 'MANAGE ANY QUEUE',
--     'UNLIMITED TABLESPACE', 'CREATE MATERIALIZED VIEW', ...
-- 'SCOTT': 'CONNECT', 'RESOURCE', 'CREATE TABLE', 'CREATE VIEW', ...
SELECT * FROM DBA_SYS_PRIVS WHERE GRANTEE='SYSTEM';  -- only SYSDBA can use for DBA_SYS_PRIVS
SELECT * FROM USER_SYS_PRIVS;  -- 현재 접속한 세션 사용자의 권한 조회

-- check table privileges
SELECT * FROM DBA_TAB_PRIVS WHERE GRANTEE='SYSTEM';

-- check role privileges
SELECT * FROM DBA_ROLE_PRIVS WHERE GRANTEE='SYSTEM';

-- create user
-- CREATE USER [username] IDENTIFIED BY [password];
ALTER SESSION SET "_ORACLE_SCRIPT"=true;  -- after ORACLE 12c
CREATE USER SCOTT IDENTIFIED BY 'tiger';  -- 'C##SCOTT' after ORACLE 12c

-- grant privileges to user
-- GRANT [privileges] TO [user | role | PUBLIC] [WITH ADMIN OPTION];
GRANT CONNECT, RESOURCE, CREATE TABLE, CREATE VIEW TO SCOTT;
GRANT CREATE SESSION, CREATE PROCEDURE, CREATE SEQUENCE FROM SCOTT;

-- revoke privileges from user
-- REVOKE [privileges] FROM [user | role | PUBLIC]
REVOKE CONNECT, RESOURCE FROM SCOTT;

-- drop user
DROP USER SCOTT;  -- 'C##SCOTT' after ORACLE 12c
DROP USER SCOTT CASCADE;  -- drop with contained instances, tables
```

**오라클 12c** 이후의 버전에서는 멀티테넌시 컨테이너 공용계정의 USERNAME 앞에는 **'C##'** 붙이도록 되어 있습니다.

관련해서는
**<a href="https://docs.oracle.com/en/database/oracle/oracle-database/21/cncpt/CDBs-and-PDBs.html#GUID-FC2EB562-ED31-49EF-8707-C766B6FE66B8"
target="_blank">CDB(Container DB), PDB(Pluggable DB) 개념</a>** 을 확인해보시기 바랍니다.<br>(추가로 참조해볼 글:
**<a href="https://blogger.pe.kr/840" target="_blank">PDB 에 dba 계정 만들기</a>**)

12c 이상의 환경에서 계정명을 특정할 때 11g 처럼 사용하려면 **"_ORACLE_SCRIPT"=true** 의 세션 변경 명령을 수행해야 합니다.

<br>
### 테이블 관리 쿼리

테이블 목록 조회 시, 접속 계정의 권한에 따라 다른 형태의 뷰를 활용합니다.

```sql
-- check tables
SELECT * FROM DBA_TABLES;  -- 모든 테이블 정보 출력. only SYSDBA can use
SELECT * FROM ALL_TABLES;  -- 권한이 있는 모든 테이블 정보 출력 (권한을 부여받은 다른 계정 소유 테이블 포함)
SELECT * FROM USER_TABLES;  -- 쿼리를 수행한 계정이 소유한 테이블 정보 출력. 제한된 컬럼 조회됨 (OWNER 컬럼 제외됨)
SELECT * FROM TAB;  -- USER_TABLES 조회와 유사하나 TNAME, TABTYPE, CLUSTERID 세 개 컬럼만 조회됨

SELECT * FROM ALL_TABLES WHERE OWNER LIKE '%SYSTEM%';  -- 테이블 소유자(OWNER) 기준으로 조회

-- check table schema
SELECT COLUMN_NAME, DATA_TYPE, CHAR_LENGTH, DATA_LENGTH, NULLABLE, DATA_DEFAULT
  FROM USER_TAB_COLS
  WHERE TABLE_NAME='MALL_USER';

-- create table
-- CREATE TABLE [tname] (
--   column_1 data_type column_constraint,
--   column_2 data_type column_constraint,
--   ...
--   table_constraint
-- );
CREATE TABLE T1 (
  T1_NO NUMBER UNIQUE,
  NAME VARCHAR2(30) NOT NULL,
  ID NUMBER,

  CONSTRAINT t1_id PRIMARY KEY (ID)
);

-- alter table schema
-- ALTER TABLE [tname] [ADD | MODIFY] [colname] data_type(size);
-- ALTER TABLE [tname] RENAME COLUMN [old colname] TO [tobe colname];
-- ALTER TABLE [tname] DROP COLUMN [colname];
ALTER TABLE T1 ADD TEST VARCHAR2(10);
ALTER TABLE T1 MODIFY TEST VARCHAR2(20) DEFAULT 'This is test';
ALTER TABLE T1 MODIFY TEST INVISIBLE;  -- 12g 버전 이상
ALTER TABLE T1 MODIFY TEST VISIBLE;  -- 12g 버전 이상
ALTER TABLE T1 RENAME COLUMN TEST TO TEST1;
ALTER TABLE T1 DROP COLUMN TEST1;

-- drop table
-- DROP TABLE [tname] [CASCADE CONSTRAINT | PURGE];
DROP TABLE T1;
DROP TABLE T1 PURGE;  -- 테이블 완전 삭제(휴지통으로 가지 않음)
PURGE RECYCLEBIN;  -- 휴지통 비우기
```

<br>
**테이블 수정(ALTER) 시 주의사항**

테이블 수정은 **기존 데이터의 변형 혹은 프로그램적 오류를 유발할 수 있으므로 충분히 고려**하여 수행합시다.

**MODIFY** 커맨드에서 **INVISIBLE** 로 변경하면 컬럼이 숨김처리되면 컬럼 목록의 맨 마지막으로 이동됩니다.
다시 **VISIBLE** 처리하여 숨김 해제합니다. **컬럼 순서를 변경**하고자 할 때 이 기능을 활용하면 유용합니다.
(11g 버전 이하에서는 컬럼 순서 변경을 위해 테이블을 재생성해야 함)

<br>
**테이블 삭제(DROP) 시 주의사항**

테이블 삭제는 데이터가 많을수록 **매우 위험한 작업**이므로 꼭 필요하다면 수많은 검증과 확인을 거치고 수행해야 합니다(!!)

- **CASCADE** 옵션을 넣으면 외래 키(FK) 하위 테이블들도 연쇄 삭제
- **CONSTRAINT** 옵션은 테이블에 생성된 제약조건들 삭제
- **ORACLE 10g** 이상 버전에서 테이블 삭제시 휴지통으로 이동됨
    - 휴지통도 **공간을 점유**하므로, 삭제하는 테이블의 rows 가 많으면 그 만큼 공간을 차지하게 됨
    - rows 가 너무 많으면 먼저 삭제하는게 좋은데,
    **```DELETE FROM [tname];```** 으로 모든 rows 를 삭제할 수 있겠지만(이것도 휴지통 이동),
    - **```TRUNCATE TABLE [tname];```** 으로 테이블을 비워진 초기 상태로 만드는 커맨드가 유용함 (이 때는 **복구 불가**)
- **PURGE** 옵션을 사용하면 **휴지통(recyclebin)**으로 옮겨지지 않고 테이블 완전 삭제됨
    - **```DROP TABLE [taname] CASCADE CONSTRAINT PURGE;```**
- 휴지통 복구 명령: **```FLASHBACK TABLE [tname] TO BEFORE DROP;```**
- 휴지통 비우기 명령: **```PURGE RECYCLEBIN;```**, 이후 복구 불가

가급적이면 테이블 삭제보다는 **사용되지 않는 행을 disable 처리**하거나,
꼭 삭제해야 한다면 **별도의 저장소에 모든 데이터를 압축/백업**해두어 혹시모를 상황에 대비합시다(!!!)

<br>
### 조인

관계형 데이터베이스에서 정규화된 여러 테이블에서 필요한 조건에 해당하는 데이터만 골라서 조회하기 위해 **JOIN** 을 사용합니다.
조인 문법은 **오라클**과 **ANSI 표준**이 살짝 다르나 기본 원리는 동일합니다.
둘 다 많이 사용되므로 꼭 알아두시기 바랍니다.

**오라클 조인**
```sql
SELECT DEPT.NAME, EMP.NAME
  FROM DEPARTMENT DEPT, EMPLOYEE EMP
  WHERE DEPT.NO=EMP.DEPTNO;
```

**ANSI 표준 조인**
```sql
SELECT DEPT.NAME, EMP.NAME
  FROM DEPARTMENT DEPT [INNER] JOIN EMPLOYEE EMP
  ON DEPT.NO=EMP.DEPTNO;
```

**JOIN** 절과 **WHERE/ON** 절의 차이 외에 원리는 동일합니다.
**WHERE/ON** 절은 조건절로, 모든 조건비교에 사용됨을 기억합시다.

다만 먼저 기술된 **선행 테이블(driving table, inner table)**을 먼저 조회한 이후
조인 조건에 따라 **후행 테이블(driven table, outer table)**을 조회하기 때문에,
**선행 테이블에 조회할 데이터가 적은 테이블을 지정**해야 성능 면에서 유리합니다.

> #### 카티션 곱(Cartesian Product)
> 기본적으로 테이블 간 조인은 행렬의 곱과 같습니다. 조인 조건이 없거나 부정확하면 테이블별 전체 데이터를 조회하게 되는데,
> 이것을 **카티션 곱**이라고 합니다.<br>
> 기본적으로 **(3X2) X (2X5) = (3X5)** 과 같은 행렬이 도출되나,
> 실제 테이블 대상으로 수행하면 겹쳐지지 않는 컬럼까지 모두 출력하기 위해 더 커다란 크기의 행렬이 도출되기도 합니다.<br>
> 따라서 불필요한 조회를 최소화하기 위해 **정확한 조건을 지정하여 조인을 수행**하시기 바랍니다.
> #### 카티션 곱을 사용하는 경우
> 각 원본 테이블을 반복적으로 읽어들이는 것보다 **카티션 곱으로 한 번에 데이터를 복제**하는 것이 유리한 경우도 있습니다.
> 예를 들어 **대량의 쿼리 테스트용 데이터를 생성**하기 위해 카티션 곱을 사용하기도 합니다.
> #### 주의할 점
> 수백만건 이상의 너무 많은 복제본 데이터를 반환하면 **메모리 초과로 어플리케이션이 다운**될 수도 있으므로
> 충분히 주의한 후 사용하도록 합시다.

다음은 세 개의 연관 테이블을 조인하는 예제입니다.

```sql
-- 학생의 이름, 학생의 학과명, 학생의 지도교수 이름 출력하기
-- Oracle
SELECT STD.NAME, DEPT.NAME, PROF.NAME
  FROM STUDENT STD, DEPARTMENT DEPT, PROFESSOR PROF
  WHERE STD.DEPT_NO=DEPT.NO
    AND STD.PROF_NO=PROF.NO;

-- ANSI
SELECT STD.NAME, DEPT.NAME, PROF.NAME
  FROM STUDENT STD JOIN DEPARTMENT DEPT
  ON STD.DEPT_NO=DEPT.NO
  JOIN PROFESSOR PROF
  ON STD.PROF_NO=PROF.NO;
```

이 외 **비등가 조인(Non-Equi JOIN)**, **아우터 조인(Outer JOIN)**, **셀프 조인(Self JOIN)** 모두 숙지하시기 바랍니다.

<br>
### 단일행 함수

**단일행 함수**는 한 번에 하나의 데이터를 입력받아 하나의 결과를 반환하며,
**복수행 함수**는 동시에 여러 데이터를 입력받아 하나의 결과를 반환합니다.

단일행 함수는 입력되는 데이터 타입에 따라 **문자 함수**, **숫자 함수**, **날짜 함수**, **변환 함수(묵시적 형변환, 명시적 형변환)**,
**일반 함수**, **정규식 함수** 등으로 구분됩니다.

<br>
**1) 문자 함수**

- **INITCAP**: 첫 글자만 대문자 변환
- **LOWER**: 전부 소문자 변환
- **UPPER**: 전부 대문자 변환
- **LENGTH**: 문자열 길이 출력
- **LENGTHB**: 문자열 길이를 바이트 값으로 출력 (ex. LENGTHB('안녕') -> 4Byte)
- **CONCAT**: 두 문자열을 결합. \|\| 연산자와 동일
- **SUBSTR**: 지정한 위치의 문자로부터 지정한 자릿수까지 추출 (ex. SUBSTR('한글', 1, 2) -> '한글')
    - 생일 추출의 예: **```SELECT SUBSTR(BIRTH, 3, 4) FROM CUSTOMER;```** -> '1231'
    - 전화번호 뒤 네자리 예: **```SELECT SUBSTR(TEL, -4, 4) FROM CUSTOMER```** -> '0000' (**- 붙으면 뒤에서부터 카운트**)
- **SUBSTRB**: 지정한 위치의 문자로부터 지정한 바이트 자릿수까지 추출 (ex. SUBSTRB('한글', 1, 3) -> '한')
- **INSTR**: 지전한 문자의 위치 추출 (ex. INSTR('A*B#', '#') -> 4)
- **INSTRB**: 지정한 문자의 위치 바이트 값 추출 (ex. INSTRB('한글A#', '#') -> 8)
- **LPAD**: 왼쪽에 지정한 문자를 채움
- **RPAD**: 오른쪽에 지정한 문자를 채움
- **LTRIM**: 왼쪽에서 지정한 문자 삭제
- **RTRIM**: 오른쪽에서 지정한 문자 삭제
- **REPLACE**: 특정 문자열 치환

> 한글은 2 Byte 일수도 있고 3 Byte 일수도 있습니다. 오라클 설정이나 환경에 따라 다릅니다.

- 이름을 10자리로 출력하되, 빈자리는 앞에서부터 자릿수로 채워서 출력
    - **```SELECT LPAD('Charles', 10, SUBSTR('0123456789', 1, 10-LENGTH('Charles'))) FROM DUAL;```**
- 전화번호에서 국번만 '*' 로 치환하여 출력
    - **```SELECT REPLACE('02)6255-9875', SUBSTR('02)6255-9875', INSTR('02)6255-9875', ')', 1, 1) + 1, 4), '****') FROM DUAL;```**

<br>
**2) 숫자 함수**

- **ROUND**: 지정한 소수점 자릿수에서 반올림 후 반환 (ex. ROUND(12.345, 2) -> 12.35)
    - **ROUND(123.45, 0) -> 123**
    - **ROUND(123.45, -1) -> 120**
- **TRUNC**: 지정한 소수점 자릿수 이하를 버림 후 반환 (ex. TRUNC(12.345, 2) -> 12.34)
    - **TRUNC(123.45, 0) -> 123**
    - **TRUNC(123.45, -1) -> 120**
- **MOD**: 지정한 숫자로 나눈 후 나머지 반환 (ex. MOD(12, 10) -> 2)
- **CEIL**: 입력한 숫자와 가장 근접한 큰 정수 반환
- **FLOOR**: 입력한 숫자와 가장 근접한 작은 정수 반환
- **POWER**: 지정한 숫자만큼의 제곱승 결과 반환 (ex. POWER(3, 3) -> 27)

<br>
**3) 날짜 함수**

일반적으로, **날짜 + 숫자 = 날짜**, **날짜 - 숫자 = 날짜**, **날짜 - 날짜 = 숫자** 로 인식됩니다.

또한 오라클은 **시스템 시간을 운영체제로부터 가져온다**는 사실도 기억합시다.

오라클 접속 세션에서 직접 쿼리를 통해 관리한다면, **날짜 포맷을 맞추기** 위해 다음과 같은 DDL 쿼리를 수행합니다.

```sql
-- set system datetime format
ALTER SESSION SET NLS_DATE_FORMAT='YYYY-MM-DD HH24:MI:SS';
```

- **SYSDATE**: 현재 시스템 날짜와 시간
- **MONTHS_BETWEEN**: 지정한 두 날짜간 개월 수. 반환값은 숫자 타입
    - **```SELECT MONTHS_BETWEEN('22/02/28', '22/01/31') FROM DUAL;```** -> 1
    - 오라클은 **윤일에 대한 별도의 계산이 없음**
    - **```MONTHS_BETWEEN('12/03/01', '12/01/31'), MONTHS_BETWEEN('14/03/01', '14/01/31')```**
    - ==> **12년도는 윤일이 포함되어 하루가 더 많지만,
    윤일이 없는 년도와 결과값은 같음. 따라서 윤일이 포함된 년도는 별도로 관리해줘야 함**
- **ADD_MONTHS**: 지정한 개월수를 더함
- **NEXT_DAY**: 입력한 날짜를 기준으로 돌아오는 다음 날짜 반환
    - 윈도우OS: **```SELECT NEXT_DAY(SYSDATE, '월') FROM DUAL;```**
    - 리눅스OS: **```SELECT NEXT_DAY(SYSDATE, 'MON') FROM DUAL;```**
- **LAST_DAY**: 입력한 날짜가 속한 달의 마지막 날짜 반환
    - **```SELECT LAST_DAY(SYSDATE) FROM DUAL;```** -> 2022-05-31 15:09:33
- **ROUND**: 지정된 날짜를 반올림. 정오를 기준으로 오후면 다음 날짜, 오전이면 당일 반환
- **TRUNC**: 지정된 날짜를 버림. 무조건 당일 반환

- **근속개월수 구하기**
    - **```SELECT ROUND(MONTHS_BETWEEN(TO_DATE('2022-05-29'), '2021-02-15'), 1) FROM DUAL;```** -> 15.5 (개월)

<br>
**4) 형변환 함수**

전화번호 끝자리를 얻고자 할때, 데이터가 숫자값으로 저장되어 있다면 문자를 대상으로 하는 **SUBSTR 함수를 사용할 수 없을 것**입니다.
이 때 **숫자형을 문자형으로 변환하는 형변환 함수**를 사용하면 편리할 것입니다.

- **묵시적 형변환**: 오라클이 자동으로 데이터 형변환
    - **```SELECT 2 + '2', '3' + 3 FROM DUAL; ```** -> 4, 6

묵시적 형변환의 경우, 해당 컬럼에 인덱스가 생성되어 있으면 **Index Suppressing error** 가 발생하며 속도가 느려질 수 있습니다.
성능 저하의 주범이 될 수 있으므로 이를 잘 고려하여 사용해야 합니다.

- **명시적 형변환**: 명시적으로 변환할 타입을 지정
    - **TO_CHAR**, **TO_NUMBER**, **TO_DATE**

<br>
**5) 일반 함수**

일반함수는 **데이터 타입에 관계없이 사용 가능**합니다.
일반적으로 많이 사용되는 함수들을 살펴봅니다.

- **NVL**: NULL 값을 만나면 다른 값으로 치환해서 출력
    - **NVL(sal, 0)**: salary 에서 null 값은 0으로 치환하여 출력
    - 0이 아닌 다른 숫자, 문자, 날짜형도 가능
- **NVL2**: **NVL** 을 확장하여 NULL 아닐 경우에 출력할 값도 지정 가능
    - **NVL2(comm, sal+comm, sal)**: commission 이 있을 경우 salary 에 더해서 출력, null 값이라면 salary 만 출력
- **DECODE**: IF 문을 사용해야 하는 조건문 처리. 코딩에서처럼 중첩해서 다양하게 사용 가능
    - **DECODE(deptno, 101, 'HR', 'Other')**: 부서번호가 101이면 'HR'을, 아니라면 'Other' 출력
    - **DECODE(deptno, 101, 'HR', 102, 'CE', 'Other')**: 부서번호가 101이면 'HR'을, 102라면 'CE'를, 아니라면 'Other' 출력
    - **DECODE(deptno, 101, DECODE(manager, null, 'Head', 'Member'))**: 부서번호가 101인 경우, 매니저가 null 이면 'Head'를,
    아니라면 'Member'를 출력
- **CASE**: **DECODE** 가 '='(equals to) 조건을 비교한다면 **CASE** 는 대소비교 등 확장된 조건 지정 가능
    ```sql
    -- 전공번호 201번인 학생들을 출력하되, 학생번호와 이름, 지역번호를 출력
    SELECT STD_NO, NAME,
        CASE(SUBSTR(tel, 1, INSTR(tel, ')', 1, 1)-1))
          WHEN '02' THEN 'SEOUL'
          WHEN '031' THEN 'GYEONGGI'
          ELSE 'ETC'
        END AS LOCATION
      FROM STUDENT
      WHERE MAJOR=201;
    ```
    ```sql
    -- 전공번호 201번인 학생들을 출력하되, 학생번호와 이름, 태어난 분기 출력
    SELECT STD_NO, NAME,
        CASE
          WHEN SUBSTR(JUMIN, 3, 2) BETWEEN '01' AND '03' THEN '1/4'
          WHEN SUBSTR(JUMIN, 3, 2) BETWEEN '04' AND '06' THEN '2/4'
          WHEN TO_CHAR(BIRTH, 'MM') BETWEEN '07' AND '09' THEN '3/4'
          WHEN TO_CHAR(BIRTH, 'MM') BETWEEN '10' AND '12' THEN '4/4'
        END BIRTH_QUARTER
      FROM STUDENT
      WHERE MAJOR=201;
    ```

<br>
**6) 정규식 함수**

**유닉스에서 사용하는 정규식을 활용**하여 더 다양한 검색이 가능합니다.

간단한 정규식 기호를 잠시 살펴보겠습니다.

- **^**: 캐럿. 해당 문자로 시작되는 line 출력 (ex. **^pattern**)
- **$**: 달러. 해당 문자로 끝나는 line 출력 (ex. **pattern$**)
- **.**: 한 자리를 차지하는 모든 문자. 즉 어떤 문자든 한 자를 의미 (ex. **S\.\.\.E** => S 로 시작하여 E 로 끝나는 5글자)
- **+**: 해당 문자가 한 번 이상 반복됨을 의미 (ex. **[a-z]+**)
- **\***: 해당 문자가 0번 이상 반복됨. 모든이라는 의미 (ex. **[a-z]***)
- **?**: 해당 문자의 존재여부를 표현. 존재할 수도, 존재하지 않을 수도 있음
- **()**: 그룹을 표현. 기입된 표현식을 그룹으로 처리
- **[]**: 기입된 문자 중 한 문자 (ex. **[Pp]attern**)
- **[^]**: 기입된 문자에 해당하지 않는 한 문자. not 을 의미 (ex. **[^a-m]attern**)
- **{n}**: n 번 반복. **{n,}** 은 n 번 이상 반복, **{n,m}** 은 최소 n 번 이상 최대 m 번 이하 반복을 의미
(ex. **[0-9]{2,5}** => 숫자가 최소 2번 최대 5번 반복됨)

정규표현식의 조건을 서술하는 **Flag** 는 다음과 같습니다.

- **g**: Global 의 의미로, 대상 문자열 내 모든 패턴들을 검색 (ex. **/^[0-9]/g**)
- **m**: Multi line 의 의미로, 대상 문자열이 여러 줄이어도 검색
- **i**: Ignore case 의 의미로, 대소문자 구분하지 않음 (ex. 대표적으로 이메일 표현식)

**대표적인 정규표현식**을 살펴봅니다.

**이메일**
- **/^[0-9a-zA-Z]\([-\_.]?[0-9a-zA-Z])\*@[0-9a-zA-Z]\([-\_.]?[0-9a-zA-Z])\*.[a-zA-Z]{2,3}$/i**

**휴대폰**
- **/^01([0\|1\|6\|7\|8\|9]{1})-?\\d{3,4}-?\\d{4}$/g**

**URL start with 'http(s)://'**
- **/^http[s]?:\/\/(www.)?([-_.:\/]?[0-9a-zA-Z]+)\*[\/]?$/gm**

**URL start with 'http(s)://' or 'www.'**
- **/^((http[s]?:\/\/)\|(www.))(www.)?([-_.:\/]?[0-9a-zA-Z]+)\*[\/]?$/gm**

이것보다 더 엄밀한 정규식을 만들거나 간결하게 바꿀 수 있으므로 고민해보시기 바랍니다. 

다음으로 **오라클에서 사용되는 정규식 함수**를 살펴봅니다.

- **REGEXP_REPLACE**: 지정한 패턴을 찾아 치환
    - 문법: **REGEXP_REPLACE(source_char, pattern, replace_string [, position(default 1)
    [, occurrence(default 0) [, match_param(c, i, m)]]])**
    - **```REGEXP_REPLACE(TEXT, '[0-9]', '*')```**: 모든 숫자를 '*' 문자로 치환
    - **```REGEXP_REPLACE(TEXT, '\d', '\1-*')```**: 모든 숫자 뒤에 '-*' 문자 붙이기
    - **```REGEXP_REPLACE(IP, '\.', '/', 1, 1)```**: ip 주소에서 A 클래스 첫 번째 dot(.)을 '/' 로 치환 (ex. **192/168.0.1**)
    - **```TRIM(REGEXP_REPLACE('aaa    bbb, '[ ]{2,}', ' '))```**:
    문자열에서 두 칸 이상의 공백을 모두 한 칸으로 치환 후 앞뒤로 TRIM
    - **```REGEXP_REPLACE('abc 1232022-12-3199sdf  23', '(\d{4})-(\d{2})-(\d{2})', '\1/\2/\3')```**
    => '**abc 1232022/12/3199sdf  23**'
- **REGEXP_INSTR**: 지정한 패턴의 시작 위치를 반환
    - 문법: **REGEXP_INSTR(source_char, pattern [, position [, occurrence [, return_opt [, match_param [, subexpr]]]]])**
    - **```REGEXP_INSTR('a1b2c3d4e5', '[a-zA-Z]', 2, 3)```**: 두 번째 위치의 알파벳에서부터 세 번째에 위치하는 알파벳의 위치 반환
    => 7
- **REGEXP_SUBSTR**: 지정한 패턴을 찾아 반환
    - 문법: **REGEXP_SUBSTR(source_char, pattern [, position [, occurrence [, match_param [, subexpr]]]])**
    - **```REGEXP_SUBSTR('Hello~ 여기는 www.rr.co.kr 사이트입니다.',
    '((http[s]?:\/\/)|(www.))(www.)?([-_.:\/]?[[:alnum:]]+)*[\/]?', 1, 1)```** => '**www.rr.co.kr**'
- **REGEXP_LIKE**: 정규식 패턴과 매칭되는 결과를 검색
    - 문법: **REGEXP_LIKE(source_char, pattern [, match_param])**
    - **```REGEXP_LIKE(TEXT, '[a-zA-Z] [0-9]')```**: 소문자로 시작, 숫자로 끝. 소문자 부분과 숫자부분 사이에 공백 하나
    - **```REGEXP_LIKE(TEXT, '[[:space:]]')```**: 문자열 내 공백 검색. 띄어쓰기와 탭, 개행 모두 포함 (**\s** 와 동일)
    - **```REGEXP_LIKE(TEXT, '^[A-Z][0-9]{3}')```**: 영대문자와 숫자 각각 3자씩
    - **```REGEXP_LIKE(TEXT, '^[a-z]|^[0-9]')```**: 소문자로 시작하거나 숫자로 시작
    - **```REGEXP_LIKE('Cat', '^ca', 'i')```**: 대소문자 구분 없이 'ca' 문자 포함
- **REGEXP_COUNT**: 지정한 패턴의 횟수를 반환
    - 문법: **REGEXP_COUNT(source_char, pattern [, position [, match_param]])**
    - **```REGEXP_COUNT(TEXT, 'c', 1, 'i')```**: 대소문자 구분 없이 첫 번째 position 부터 'c' 개수 반환

<br>
### 복수행 함수

**복수행 함수**는 **SELECT** 이후 발생한 **복수의 ROW** 혹은 **그룹화 결과**를 입력값으로 받아 결과를 반환합니다.
따라서 **그룹 함수**라고도 합니다.

모든 그룹 함수에서 중요한 것은 **NULL** 값의 포함 여부입니다.
**\*** 를 사용하면 **NULL 을 포함**하여 동작하고, **컬럼명을 지정**하면 **데이터가 있는 경우만(NOT NULL)** 대상으로 동작합니다.

먼저 그룹 함수들을 살펴봅니다.

- **COUNT**: 총 건수 반환. **\*** 사용시 전체 건수, **컬럼명 지정**시 **NULL** 제외한 건수 반환
- **SUM**: 합계 반환
- **AVG**: 평균 반환. **NULL** 여부에 따라 모수가 달라지기 때문에 별도 처리를 해줘야 함
    - **commission 컬럼값이 null 인 직원들은 0 처리**
    ```sql
    -- 커미션 컬럼을 지정했으므로 null 인 행을 제거하기 때문에 null 인 직원들이 모수에서 제외되는 문제 발생
    SELECT AVG(COMM) FROM EMP;
    -- 커미션이 null 이면 0 으로 처리하여 모수에 모든 직원을 포함
    SELECT AVG(NVL(COMM, 0)) FROM EMP;
    ```
- **MAX/MIN**: **가장 큰 값/가장 작은 값** 반환. 전체 검색을 하므로 시간이 오래 걸리므로, **인덱스 사용**이 매우 권장됨
- **STDDEV/VARIANCE**: **분산/표준편차** 반환. (통계적 계산방법은 별도 찾아보기!)

다음은 간단한 **GROUP BY** 예제입니다.

```sql
-- 부서별 평균 급여 구하기
SELECT DEPTNO, JOB, AVG(NVL(SAL, 0)) AS AVG
  FROM EMP
  GROUP BY DEPTNO, JOB
  HAVING AVG(NVL(SAL, 0)) > 2000;
  ORDER BY 1, 2 ASC;
```

위 쿼리는 **GROUP BY 로 먼저 분류**해 놓고 각 그룹을 대상으로 그룹 함수가 수행됩니다.
그룹화할 컬럼이 여러개인 경우 **GROUP BY 절에 순서에 맞게 입력**하면 됩니다.

**그룹화된 결과(그룹함수 반환값)를 대상으로 조건절을 사용**하려면 **WHERE** 절이 아닌 **HAVING** 절을 사용해야 합니다.
그러나 만약 **일반 컬럼을 대상**으로 한다면 **WHERE** 절을 사용해야 합니다.

이후 **ORDER BY** 에 입력된 대로 **DEPTNO**, **JOB** 순서로 정렬됩니다.
ORDER BY 절이 없으면 그룹화 후 정렬되지 않습니다.

<br>

다음으로 보다 상세한 계산에 특화된 **분석 함수**들을 살펴보겠습니다.
분석 함수는 복잡한 쿼리나 로직을 단순화할 수 있습니다. 그룹 함수의 확장이라고 생각하면 좋습니다.

- **ROLLUP**: 입력한 컬럼에 따라 그룹을 계층적으로 세분화해 소계를 계산
    - **N** 개의 컬럼을 지정하면 **N+1 Level** 의 소계(소그룹)가 생성됨

> **부서별 평균 급여와 사원 수와 부서와 직업별 평균 급여 및 사원 수, 전체 사원의 평균 급여와 사원 수를 구하세요.**

굉장히 복잡한 쿼리가 예상됩니다.

**(1) 부서별 평균 급여와 사원 수**를 구하고, **(2) 부서와 직업별 평균 급여 및 사원 수**를 구하고,
**(3) 전체 사원의 평균 급여와 사원 수** 총 세 개의 요구사항이 함께 있는 상황입니다.
각 조건별로 대상 그룹이 다르기 때문에 세 개의 쿼리로 계산 후 **UNION ALL** 해야 할것 같습니다.

```sql
SELECT DEPTNO, NULL JOB, ROUND(AVG(SAL), 1) AVG_SAL, COUNT(*) CNT_EMP
  FROM EMP
  GROUP BY DEPTNO  -- 부서별
UNION ALL
SELECT DEPTNO, JOB, ROUND(AVG(SAL), 1) AVG_SAL, COUNT(*) CNT_EMP
  FROM EMP
  GROUP BY DEPTNO, JOB  -- 부서와 직업별
UNION ALL
SELECT NULL DEPTNO, NULL JOB, ROUND(AVG(SAL), 1) AVG_SAL, COUNT(*) CNT_EMP
  FROM EMP  -- 전체
ORDER BY DEPTNO, JOB;  -- 정렬!
```

```text
DEPTNO JOB       AVG_SAL CNT_EMP
    10 CLERK        1300       1
    10 MANAGER      2450       1
    10 PRESIDENT    5000       1
    10            2916.7       3
    20 ANALYST      3000       2
    20 CLERK         950       2
    20 MANAGER      2975       1
    20              2175       5
    30 CLERK         950       1
    30 MANAGER      2850       1
    30 SALESMAN     1400       4
    30            1566.7       6
                  2073.2      14
```

결과는 만족스럽지만 쿼리가 너무 복잡하고 지저분해 보입니다.<br>
**ROLLUP** 함수를 사용하면 더욱 간결한 문법으로 동일 결과를 도출할 수 있습니다.

```sql
SELECT DEPTNO, JOB, ROUND(AVG(SAL), 1) AVG_SAL, COUNT(*) CNT_EMP
  FROM EMP
  GROUP BY ROLLUP(DEPTNO, JOB);
```

2 개의 컬럼을 지정했으므로 **2+1 Level** 의 그룹의 생성되는데,
**DEPTNO 그룹**, **DEPTNO+JOB 그룹**, **전체 그룹**이 순차적으로 집계되어 위와 동일한 결과를 도출합니다.

- **CUBE**: **ROLLUP** 의 지정한 컬럼에 따른 소계뿐 아니라(순서 중요) **모든 그룹에 대한 전체 총계(순서 무관)**도 계산.
모든 경우에 대한 소그룹화를 진행하기 때문에 시스템 리소스 소모가 더 존재함

앞선 예시에서 **ROLLUP** 함수는 **(1) 부서별 평균 급여와 사원 수**, **(2) 부서와 직급별 평균 급여와 사원 수**,
**(3) 전체 사원의 평균 급여와 사원 수** 세 그룹을 순차적으로 생성하여 소계를 반환했습니다.

만약 여기서 **(4) 직급별 평균 급여와 사원 수**도 포함해서 구해야 한다면,
**사실상 모든 지정 컬럼에 대한 순서에 무관한 전체 소계를 구하는 결과**가 됩니다.
이 때는 **ROLLUP** 이 아닌 **CUBE** 함수를 사용합니다.

**CUBE** 함수 계산에서 소그룹은 **2^N Level**(2의 N승) 만큼 생성됩니다.

```sql
SELECT DEPTNO, JOB, ROUND(AVG(SAL), 1) AVG_SAL, COUNT(*) CNT_EMP
  FROM EMP
  GROUP BY CUBE(DEPTNO, JOB)
  ORDER BY DEPTNO, JOB;
```

```text
DEPTNO JOB       AVG_SAL CNT_EMP
    10 CLERK        1300       1
    10 MANAGER      2450       1
    10 PRESIDENT    5000       1
    10            2916.7       3
    20 ANALYST      3000       2
    20 CLERK         950       2
    20 MANAGER      2975       1
    20              2175       5
    30 CLERK         950       1
    30 MANAGER      2850       1
    30 SALESMAN     1400       4
    30            1566.7       6
       ANALYST      3000       2  <-- 이 부분부터 추가됨! ((4) 직급별 평균 급여와 사원 수)
       CLERK      1037.5       4
       MANAGER    2758.3       3
       PRESIDENT    5000       1
       SALESMAN     1400       4
                  2073.2      14
```

이것 외에 **GROUPING SETS**, **LISTAGG**, **PIVOT**, **LAG**, **LEAD**, **RANK**, **DENSE_RANK**, **누계 집계하기**
등의 그룹화 함수와 기능들이 존재하니 추가적으로 살펴보시기 바랍니다.

<br>
### 계층형 쿼리

관계형 데이터베이스에서는 부서별, 직급별, 혹은 상품별 등 **트리형 위계구조**가 있을 수 있습니다.
이러한 상하 구조를 표현하는 것을 **계층형 쿼리(Hierarchical Query)**라 합니다.

계층형 쿼리에서 사용되는 키워드들은 다음과 같습니다.

- **START WITH**: 트리의 루트노드 조건을 지정
- **CONNECT BY PRIOR**: 조회되는 행들의 상하관계 조건을 지정. **PRIOR** 키워드가 붙은쪽 컬럼으로 탐색 방향이 결정됨
- **ORDER SIBLINGS BY**: 계층형 쿼리 조회 결과를 정렬하되, **LEVEL** 이 동일한 **형제노드(SIBLINGS)**끼리만 수행

**CONNECT BY** 절을 사용하면 조회 결과에 따라 트리의 **LEVEL** 이 발생하며 이를 추가적으로 활용할 수 있습니다.
예를 들어 **부서별 트리구조를 출력하는 쿼리**에서 상하관계의 조건이 되는 **dept_name** 컬럼을 다음과 같이 조회하면,

**```LPAD(dept_name, (LEVEL-1)*2, ' ')```**

**LEVEL** 만큼 좌측에 공백이 붙은 후 부서명이 출력됩니다.

**PRIOR** 키워드는 루트 노드로부터 탐색방향을 결정합니다.
예를 들어 **```CONNECT BY PRIOR [자식조건] = [부모조건]```** 이라면 **START WITH** 키워드로 지정된 행으로부터 자식 노드들을 탐색해
나가고, **```CONNECT BY [자식조건] = PRIOR [부모조건]```** 이라면 부모 노드들을 탐색해나갑니다.
각각 순방향 트리, 역방향 트리가 됩니다.

**SELECT** 절에는 **WHERE** 조건검색이 있을 수 있는데 계층형 쿼리의 경우,

- **START WITH** > **CONNECT BY** > **WHERE**

순서로 구문이 수행됩니다.
따라서 **WHERE** 조건은 계층형 구조가 생성된 이후에 적용된다는 사실을 알아두시기 바랍니다.
예를 들어 **```WHERE LEVEL < 4```** 조건을 추가하면 트리구조에서 레벨 4 미만의 노드들만 계층형으로 출력됩니다.

**게시판 데이터베이스**에서는 **게시글과 답글**, **댓글과 대댓글**을 계층형으로 표현할 수 있습니다.<br>
다음의 예제를 참조하여 계층형 쿼리를 이해하시기 바랍니다.

```sql
-- Creation
-- 유저 (no, username)
CREATE TABLE B_USER (
  USER_NO NUMBER PRIMARY KEY,
  USERNAME VARCHAR2(50) NOT NULL UNIQUE
);
-- 게시글 (no, owner, title, contents, created, updated, deleted, delete)
CREATE TABLE B_POST (
  POST_NO NUMBER PRIMARY KEY,
  OWNER_NO NUMBER,
  TITLE VARCHAR2(200) NOT NULL,
  CONTENTS VARCHAR2(2000),
  CREATE_DATE DATE DEFAULT SYSDATE NOT NULL,
  UPDATE_DATE DATE DEFAULT NULL,
  DELETE_DATE DATE DEFAULT NULL,
  IS_DELETE NUMBER(1) DEFAULT 0,

  CONSTRAINT b_post_fk_user FOREIGN KEY(OWNER_NO) REFERENCES B_USER(USER_NO) ON DELETE CASCADE,
  CONSTRAINT b_post_deletecheck_boolean CHECK(IS_DELETE IN (0, 1))
);
-- 댓글 (no, owner, post, parent, contents, created, updated, deleted, delete)
CREATE TABLE B_COMMENT (
  COMMENT_NO NUMBER PRIMARY KEY,
  OWNER_NO NUMBER,
  POST_NO NUMBER,
  PARENT_NO NUMBER DEFAULT NULL,
  CONTENTS VARCHAR2(2000),
  CREATE_DATE DATE DEFAULT SYSDATE NOT NULL,
  UPDATE_DATE DATE DEFAULT NULL,
  DELETE_DATE DATE DEFAULT NULL,
  IS_DELETE NUMBER(1) DEFAULT 0,

  CONSTRAINT b_comment_fk_user FOREIGN KEY(OWNER_NO) REFERENCES B_USER(USER_NO) ON DELETE CASCADE,
  CONSTRAINT b_comment_fk_post FOREIGN KEY(POST_NO) REFERENCES B_POST(POST_NO) ON DELETE CASCADE,
  CONSTRAINT b_comment_deletecheck_boolean CHECK(IS_DELETE IN (0, 1))
);

-- 시퀀스
CREATE SEQUENCE b_user_seq
  INCREMENT BY 1
  START WITH 1
  MINVALUE 1
  MAXVALUE 999
  NOCYCLE NOCACHE NOORDER;
CREATE SEQUENCE b_post_seq
  INCREMENT BY 1
  START WITH 1
  MINVALUE 1
  MAXVALUE 999
  NOCYCLE NOCACHE NOORDER;
CREATE SEQUENCE b_comment_seq
  INCREMENT BY 1
  START WITH 1
  MINVALUE 1
  MAXVALUE 999
  NOCYCLE NOCACHE NOORDER;

SELECT * FROM USER_TABLES WHERE TABLE_NAME LIKE 'B_%';
SELECT * FROM USER_SEQUENCES WHERE SEQUENCE_NAME LIKE 'B_%';
```

```sql
-- Insertion
-- 유저
INSERT INTO B_USER (USER_NO, USERNAME) VALUES (b_user_seq.NEXTVAL, 'b_user1');
INSERT INTO B_USER (USER_NO, USERNAME) VALUES (b_user_seq.NEXTVAL, 'b_user2');
INSERT INTO B_USER (USER_NO, USERNAME) VALUES (b_user_seq.NEXTVAL, 'b_user3');

-- 게시글
INSERT INTO B_POST (POST_NO, OWNER_NO, TITLE, CONTENTS)
  VALUES (b_post_seq.NEXTVAL, (
    SELECT USER_NO FROM B_USER WHERE USERNAME='b_user1'
  ), 'Post 1', 'This is post 1');

-- 댓글
INSERT INTO B_COMMENT (COMMENT_NO, OWNER_NO, POST_NO, PARENT_NO, CONTENTS)
  VALUES (b_comment_seq.NEXTVAL, (
    SELECT USER_NO FROM B_USER WHERE USERNAME='b_user2'
  ), (
    SELECT POST_NO FROM (
      SELECT POST_NO FROM B_POST WHERE OWNER_NO=1 ORDER BY POST_NO ASC
    ) WHERE ROWNUM=1
  ), NULL, 'Hello, I''m user2!!');
INSERT INTO B_COMMENT (COMMENT_NO, OWNER_NO, POST_NO, PARENT_NO, CONTENTS)
  VALUES (b_comment_seq.NEXTVAL, (
    SELECT USER_NO FROM B_USER WHERE USERNAME='b_user1'
  ), (
    SELECT POST_NO FROM (
      SELECT POST_NO FROM B_POST WHERE OWNER_NO=1 ORDER BY POST_NO ASC
    ) WHERE ROWNUM=1
  ), (
    SELECT COMMENT_NO FROM (
      SELECT COMMENT_NO FROM B_COMMENT WHERE OWNER_NO=2 ORDER BY COMMENT_NO ASC
    ) WHERE ROWNUM=1
  ), 'hi.');
INSERT INTO B_COMMENT (COMMENT_NO, OWNER_NO, POST_NO, PARENT_NO, CONTENTS)
  VALUES (b_comment_seq.NEXTVAL, (
    SELECT USER_NO FROM B_USER WHERE USERNAME='b_user3'
  ), (
    SELECT POST_NO FROM (
      SELECT POST_NO FROM B_POST WHERE OWNER_NO=1 ORDER BY POST_NO ASC
    ) WHERE ROWNUM=1
  ), NULL, 'I''m user3, happy to meet you!');
INSERT INTO B_COMMENT (COMMENT_NO, OWNER_NO, POST_NO, PARENT_NO, CONTENTS)
  VALUES (b_comment_seq.NEXTVAL, (
    SELECT USER_NO FROM B_USER WHERE USERNAME='b_user1'
  ), (
    SELECT POST_NO FROM (
      SELECT POST_NO FROM B_POST WHERE OWNER_NO=1 ORDER BY POST_NO ASC
    ) WHERE ROWNUM=1
  ), (
    SELECT COMMENT_NO FROM (
      SELECT COMMENT_NO FROM B_COMMENT WHERE OWNER_NO=3 ORDER BY COMMENT_NO ASC
    ) WHERE ROWNUM=1
  ), 'oh, hello user3.');
INSERT INTO B_COMMENT (COMMENT_NO, OWNER_NO, POST_NO, PARENT_NO, CONTENTS)
  VALUES (b_comment_seq.NEXTVAL, (
    SELECT USER_NO FROM B_USER WHERE USERNAME='b_user2'
  ), (
    SELECT POST_NO FROM (
      SELECT POST_NO FROM B_POST WHERE OWNER_NO=1 ORDER BY POST_NO ASC
    ) WHERE ROWNUM=1
  ), (
    SELECT COMMENT_NO FROM (
      SELECT COMMENT_NO FROM B_COMMENT WHERE OWNER_NO=3 ORDER BY COMMENT_NO ASC
    ) WHERE ROWNUM=1
  ), 'welcome user3!');

COMMIT;

-- 조회
SELECT * FROM B_USER;
SELECT * FROM B_POST;
SELECT * FROM B_COMMENT;
SELECT b_user_seq.CURRVAL, b_post_seq.CURRVAL, b_comment_seq.CURRVAL
  FROM DUAL;

-- 계층형 조회
SELECT COMMENT_NO, PARENT_NO, LEVEL, LPAD(' ', (LEVEL-1)*2, ' ') || CONTENTS AS CONTENTS
  FROM B_COMMENT
  START WITH PARENT_NO IS NULL
  CONNECT BY PRIOR COMMENT_NO = PARENT_NO
  ORDER SIBLINGS BY COMMENT_NO;
```

계층형 조회 결과는 다음과 같습니다.

```text
COMMENT_NO PARENT_NO LEVEL  CONTENTS
         1      null     1  Hello, I'm user2!!
         2         1     2    hi.
         3      null     1  I'm user3, happy to meet you!
         4         3     2    oh, hello user3.
         5         3     2    welcome user3!
```

계층형 쿼리를 수행할 때 주의할 점은 다음과 같습니다.

- 쿼리내 **키워드 수행 순서**를 기억하여 잘 구성하기
- **CONNECT BY** 절에는 서브쿼리 사용 불가
- **START WITH**, **CONNECT BY**, **WHERE** 절에서 사용되는 컬럼의 인덱스를 반드시 생성해두기(대용량 처리속도 개선)

**CONNECT_BY** 키워드 관련 유용한 함수들이 존재합니다.

- **SYS_CONNECT_BY_PATH**: 루트 노드로부터 해당 행까지 지정한 열의 값을 지정한 문자열로 구분하여 순차적으로 나열
- **CONNECT_BY_ISLEAF**: 트리에서 가장 마지막 노드(잎사귀) 포함여부를 지정.
**WHERE** 조건으로 0 값을 주면 마지막 노드를 포함하지 않고, 1 값을 주면 포함
- **CONNECT_BY_ROOT**: 해당 노드(행)의 최상위 부모값 출력

이것들을 활용한 종합적인 쿼리는 다음과 같습니다.

```sql
SELECT COMMENT_NO, PARENT_NO, CONNECT_BY_ROOT COMMENT_NO AS ROOT_NO, LEVEL,
    LPAD(' ', (LEVEL-1)*2, ' ') || CONTENTS AS CONTENTS,
    SYS_CONNECT_BY_PATH(CONTENTS, '-> ') AS CONTENTS_PIPE
  FROM B_COMMENT
  START WITH PARENT_NO IS NULL
  CONNECT BY PRIOR COMMENT_NO = PARENT_NO
  ORDER SIBLINGS BY COMMENT_NO;
```

```text
COMMENT_NO PARENT_NO ROOT_NO LEVEL  CONTENTS                        CONTENTS_PIPE
         1      null       1     1  Hello, I'm user2!!              -> Hello, I'm user2!!
         2         1       1     2    hi.                           -> Hello, I'm user2!!-> hi.
         3      null       3     1  I'm user3, happy to meet you!   -> I'm user3, happy to meet you!
         4         3       3     2    oh, hello user3.              -> I'm user3, happy to meet you!-> oh, hello user3.
         5         3       3     2    welcome user3!                -> I'm user3, happy to meet you!-> welcome user3!
```

만약 **WHERE CONNECT_BY_ISLEAF=0** 조건을 추가하면 마지막 노드가 아닌 **COMMENT_NO 1, 3 번 행이 출력**되고,
1 값이 할당되면 **COMMENT_NO 2, 4, 5 번 행이 출력**됩니다.

<br>
### 기타 쿼리

기타 참조할만한 쿼리를 정리합니다.

```sql
-- check product info
SELECT * FROM PRODUCT_COMPONENT_VERSION;

-- check database name
SELECT * FROM v$database;
SELECT NAME, DB_UNIQUE_NAME FROM v$database;  -- check database name

-- check thread info. 'INSTANCE' column is sid
SELECT * FROM v$thread;
SELECT INSTANCE FROM v$thread;  -- check sid
```

**sqlPlus** 로 접속 시 기본 설정 쿼리입니다.

오라클 데이터베이스 시작
```text
SQL> CONN sys /as sysdba
비밀번호 입력: 
연결되었습니다.
SQL> 
SQL> SHOW USER;
USER은 "SYS"입니다
SQL> 
SQL> startup
ORACLE instance started.

...

SQL> 
```

프롬프트 변경(sqlplus), 현재 접속계정 출력

```text
SQL> SET sqlprompt "_USER>"
SYS> 
```

<br>
## 3. 쿼리 튜닝 목록

**SELECT** 쿼리의 구조가 불필요한 스캐닝이나 중복조회 등으로 인해 오라클로 하여금 비효율적으로 동작하게 하는 경우,
대상 데이터의 양이 많아질수록 수행 속도는 기하급수적으로 느려집니다.

따라서 언제나 **최적화된 구조로 쿼리를 튜닝**하고자 하는 고민이 필요합니다.

이를 위해 튜닝의 냄새가 나는 내용들을 목록화하여 정리합니다.

<br>
### ```SELECT * FROM [tname] ...``` 지양하기

**불필요한 데이터를 조회하지 않고 엔드 유저에게 꼭 필요한 데이터만을 반환**하도록 컬럼을 명시적으로 지정하는 것이
오라클의 성능과 데이터 트래픽 면에서 좋습니다.
간혹 테이블의 컬럼 스키마가 변경되기도 하고, 의도치 않게 보안을 필요로 하는 컬럼이 포함될 수도 있습니다.

<br>
### 동일 쿼리라면 대소문자 통일

[SELECT 동작방식](#select-동작방식)에서 살펴보듯
오라클에 전달된 쿼리는 **SGA** 메모리 영역에서 파싱 및 execution plan 수립 절차를 밟는데,
만약 이전에 수행된 **동일한 쿼리(의 해시)**가 존재한다면 **그것의 정보를 메모리에서 가져와(soft parse)** 재활용합니다.
(이전 쿼리의 해시 정보는 **Library cache** 내 **SQL 영역(area)** 에 존재함)

![instance detail](https://docs.oracle.com/cd/E11882_01/server.112/e40540/img/cncpt325.gif)
<small>refer to
**<a href="https://docs.oracle.com/cd/E11882_01/server.112/e40540/startup.htm#CNCPT005"
target="_blank">docs.oracle.com</a>**</small>

이는 새 오브젝트 세그먼트를 적재하는 디스크 I/O 및 새로운 구문 해석의 **PARSE** 단계를 건너뛰기 때문에 성능 면에서 큰 차이가 발생합니다.

```sql
-- first run this query
SELECT * FROM dual;

-- then run this one again with all uppercase letters
SELECT * FROM DUAL;

-- check the sql hashes 
SELECT sql_id, sql_text, hash_value
  FROM v$sql
  WHERE 1=1
    AND lower(sql_text) LIKE '%select%from dual%';

   sql_id     |       sql_text      | hash_value
--------------------------------------------------
0x735fvggtnu6 | SELECT * FROM DUAL  | 3741111110
3vyt9wdmca69b | SELECT * FROM dual  | 1724193067
-- As you can see Oracle evaluated it as two different queries.
```
<small>(참조: <a href="https://www.oracle-world.com/architecture/select-statement-processing/"
target="_blank">SELECT Statement Processing</a>)</small>

<br>
### 바인드 변수 활용하기

비슷한 맥락에서 쿼리문에 고정적으로 할당되나 값만 변화하는 **변수**는 별도 선언을 통해 처리하여 **soft parse** 되도록 하는 것이 좋습니다.

**바인드 변수(bind variable)**는 호스트 환경에서 선언되는 호스트 변수라고도 하며, **VARIABLE** 키워드로 선언합니다.
이것에 값을 할당하거나 참조하려면 **선언된 변수명 바로 앞에 콜론(:)**을 붙입니다.

```sql
VARIABLE view_count NUMBER;
EXEC :view_count := 1;
PRINT :view_count;
```

**cx-oracle** 에서 **바인드 변수(bind variable)** 활용하여 쿼리를 생성하면 다음과 같습니다.

```python
owner_no = get_owner_no()
sql = 'SELECT PRODUCT_NO, OWNER_NO, NAME' \
      '  FROM MALL_PRODUCT' \
      '  WHERE OWNER_NO=:owner_no;'
cursor.execute(sql, owner_no)
```

**sql 쿼리문** 자체는 변하지 않으면서 파이썬에서 변수처리로 얻어진 값을 동적으로 삽입할 수 있습니다.

**MyBatis** 에서 **바인드 변수(bind variable)** 활용하여 쿼리를 생성하면 다음과 같습니다.
**\<bind/\>** 로 변수를 사전에 생성했다고 가정하면,

```sql
-- MyBatis 내부 생성 쿼리
-- OWNER 가 owner_no 변수에 해당하는 제품목록 조회
<select id="getProductInfo" resultType="hashmap">
  <bind name="ownerNo" value="_parameter.getOwnerNo()"/>
  SELECT PRODUCT_NO, OWNER_NO, NAME
    FROM MALL_PRODUCT
    WHERE OWNER_NO=#{ownerNo};
</select>
```

바인드 변수는 **비 PL/SQL 변수**로 **VARIABLE** 키워드로 정의 후 모든 블록에서 사용 가능합니다.

<br>
### DISTINCT 사용 줄이기

**DISTINCT** 는 **SELECT** 시 중복제거를 위해
**```SELECT DISTINCT [col1], [col2], ... FROM [tname]```** 형식으로 사용되며,
**SELECT** 키워드 바로 직후에 위치해야 합니다.

이는 성능 면에서 **추가적인 정렬작업을 동반**하고 굳이 필요하지 않은 경우가 많으므로 정말 필요한 경우가 아니라면 지양합시다.

<br>
### 단일 쿼리 지향하기

여러 번 DB 쿼리 요청하여 빈번한 통신이 발생하게 하는 것보다 **단일 쿼리로 한 번의 호출로 처리하는 것**이 좋습니다.

예를 들어 **프로그램 상에서 loop** 를 돌며 매번 쿼리를 보내는것보다 한 번에 데이터를 가져와 루프 도는 것이 낫습니다.

혹은 특정 값을 **SELECT** 하여 수정 후 **UPDATE** 하는 것보다 하나의 **UPDATE** 문으로 처리하는 것이 좋습니다.
이 때는 서브쿼리로 대상 필드를 **SELECT** 하도록 할 수 있습니다.

```sql
-- ex. 'user_1' 계정의 모든 게시글 조회수 1 올리기
UPDATE POST SET VIEW_COUNT=VIEW_COUNT+1
  WHERE OWNER_NO=(
    SELECT USER_NO FROM USER WHERE USERNAME='user_1'
  );
```

<br>
### Index 활용하기

**SELECT** 관점에서 테이블에 적절한 인덱스를 생성하는 것은 매우 권장됩니다.

<br>
### **INNER JOIN** 과 **LEFT OUTER JOIN** 중 전자의 성능이 더 좋음
