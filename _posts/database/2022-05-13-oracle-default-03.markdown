---
title:  "[03] 오라클 기본 정리 - 쿼리"
created:   2022-05-13 21:00:00 +0900
updated:   2022-05-13 21:00:00 +0900
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
    - [시스템 쿼리](#시스템-쿼리)
    - [DUAL](#dual)
    - [기본 설정 쿼리](#기본-설정-쿼리)
    - [사용자 관련 쿼리](#사용자-관련-쿼리)
    - [테이블 관련 쿼리](#테이블-관련-쿼리)
    - [SELECT](#select)

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

다음으로 실무에서 참조 가능한 쿼리를 정리합니다.

<br>
### 시스템 쿼리

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

<br>
### DUAL

**DUAL 테이블**은 오라클 자체 제공 테이블로써, 간단한 함수를 이용해서 계산되는 임시 결과값을 확인할 수 있습니다.

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
### 기본 설정 쿼리

다음은 **sqlPlus** 로 접속 시 기본 설정 쿼리입니다.

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
### 사용자 관련 쿼리

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

> **오라클의 관리자 계정과 권한**
> - **SYS**: 오라클 DB 의 최고 관리자(Super user, DBA role)이자 DB 시스템 오너
>     - 오라클 DB 의 모든 기본 테이블 및 뷰 데이터 딕셔너리는 **SYS** 의 스키마로 저장됨
>     - 이러한 기본 테이블과 뷰 데이터 딕셔너리는 무결성 유지를 위하여 오직 database 에 의해서만 조작됨
>     - 어떤 유저나 관리자에 의해서도 직접적으로 수정되지 않음
>     - 또한 **SYS** 는 **SYSDBA** 권한으로 부여되기 때문에, 백업이나 복구 등 높은 레벨의 관리작업을 수행 가능
>     - **```CONN SYS /AS SYSDBA```**
> - **SYSTEM**: 시스템 운영을 위한 관리자(SYSOPER role) 역할
>     - 그러나 SYS 와는 다르게 **DB 생성 권한이 없으며, 다른 유저의 데이터에 접근 불가**
>     - **SYSTEM** 은 **SYSOPER** 권한으로 부여되기 때문에, 운영을 위한 기본적인 권한을 갖음
>     - **백업 및 복구**, **DB 업그레이드** 작업을 제외한 관리기능을 수행함
>     - 만약 일일 모니터링과 같은 목적의 관리자 계정이 필요한 경우,
>     **SYSTEM** 을 그대로 사용하지 말고 별도의 **모니터링용 관리계정** 생성이 권장됨
>     - **```CONN SYSTEM```**
> - **SYSOPER 권한**
>     - 인스턴스와 데이터베이스에 대한 startup, mount, open shutdown, dismount, close 권한
>     - 데이터베이스 백업, 로그파일을 이용한 복구 등에 대한  database backup, archive log, recover 권한

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
### 테이블 관련 쿼리

테이블 목록 조회 시, 접속 계정의 권한에 따라 다른 형태의 뷰를 활용합니다.

```sql
-- check tables
SELECT * FROM DBA_TABLES;  -- 모든 테이블 정보 출력. only SYSDBA can use
SELECT * FROM ALL_TABLES;  -- 권한이 있는 모든 테이블 정보 출력 (권한을 부여받은 다른 계정 소유 테이블 포함)
SELECT * FROM USER_TABLES;  -- 쿼리를 수행한 계정이 소유한 테이블 정보 출력. 제한된 컬럼 조회됨 (OWNER 컬럼 제외됨)
SELECT * FROM TAB;  -- USER_TABLES 조회와 유사하나 TNAME, TABTYPE, CLUSTERID 세 개 컬럼만 조회됨

SELECT * FROM ALL_TABLES WHERE OWNER LIKE '%SYSTEM%';  -- 테이블 소유자(OWNER) 기준으로 조회 
```

위 모든 뷰들은 본질적으로 동일한 원본 테이블을 참조하지만, 계정 및 권한에 따라 제한된 정보를 보여줍니다.
