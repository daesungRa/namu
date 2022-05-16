---
title:  "[02] 오라클 기본 정리 - DB 생성하기"
created:   2022-05-05 21:00:00 +0900
updated:   2022-05-13 20:00:00 +0900
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

1. [데이터베이스 개념 정리](#1-데이터베이스-개념-정리)
    - [전역 데이터베이스와 SID](#전역-데이터베이스와-sid)
    - [오라클 계정 == 데이터베이스 == 스키마](#오라클-계정--데이터베이스--스키마)
2. [데이터베이스 생성하기](#2-데이터베이스-생성하기)
    - [테이블 스페이스](#테이블-스페이스)
    - [데이터베이스 생성하기](#데이터베이스-생성하기)
    - [테이블 스키마 생성하기](#테이블-스키마-생성하기)

### 시리즈

- <a href="{{ site.github.url }}/database/2022/04/09/oracle-default-01" target="_blank">
[01] 오라클 기본 정리 - 오라클 살펴보기</a>
- <a href="{{ site.github.url }}/database/2022/05/13/oracle-default-03" target="_blank">
[03] 오라클 기본 정리 - 쿼리</a>

### 참조

- <a href="https://docs.oracle.com/en/database/oracle/oracle-database/19/netrf/local-naming-parameters-in-tns-ora-file.html#GUID-47DAB4DF-1D35-46E5-B227-339FF912E058"
target="_blank">General Syntax of tnsnames.ora</a>
- <a href="https://docs.oracle.com/cd/E11882_01/network.112/e41945/concepts.htm"
target="_blank">Identifying and Accessing the Database</a>

---

<br>
## 들어가며

이전 글인 **<a href="{{ site.github.url }}/database/2022/04/09/oracle-default-01" target="_blank">
[01] 오라클 기본 정리 - 오라클 살펴보기</a>** 로부터 이어집니다.

<br>
## 1. 데이터베이스 개념 정리

오라클에서 **데이터베이스**, **SID**, **계정**, **스키마** 등의 용어에 혼선이 있을 수 있으므로, 전체적으로 정리해 보겠습니다.

<br>
## 전역 데이터베이스와 SID

**전역 데이터베이스**는 데이터, 스키마, 메타데이터 등 실제 저장되는 오브젝트 요소의 집합을 가리키는
**일반적인 데이터베이스와는 다른 개념**입니다. (일반적인 데이터베이스 개념은 잠시 뒤 설명)
이것은 말 그대로 Oracle 을 처음 설치할 때 만들어지는 전체 틀을 의미합니다.

오라클 데이터베이스를 처음 설치한다면 전역 데이터베이스 이름이
**'XE'**(Oracle Express Edition)로 자동 지정되거나 **'ORCL'**(Oracle Standard Edition) 등으로 사용자 지정할 수 있을 것입니다.

![oracle global database name](
https://docs.oracle.com/cd/E97665_01/html/rpm_81_installation_12c/img/GUID-2EC500E5-96F5-4ADE-A5DF-8FB534E9C99B-default.png)
<small>image by
**<a href="https://docs.oracle.com/cd/E97665_01/html/rpm_81_installation_12c/GUID-84EB3EFA-A000-4CC3-919F-BE402774D8D8.htm"
target="_blank">docs.oracle.com</a>**</small>

단일 데이터베이스 시스템에서 단일 인스턴스로 환경을 구축한다면,
이 **전역 데이터베이스 이름**과 **데이터베이스 인스턴스의 이름이 일치**하게 됩니다.

여기서 인스턴스란 **오라클 백그라운드 프로세스 및 메모리(SGA)의 총체**를 의미하며 이것과 연결된 데이터베이스의 데이터를 포함합니다.
그리고 **사용자 프로세스(접속 툴 또는 어플리케이션)는 꼭 인스턴스를 통해서만 접속이 가능**합니다.

따라서 **<a href="{{ site.github.url }}/database/2022/04/09/oracle-default-01#데이터베이스-인스턴스" target="_blank">
이전 글</a>**에서 살펴봤듯이, 접속하고자 하는 하나의 데이터베이스에 용도 및 설정에 따라 **여러 인스턴스가 생성될 수** 있으며(사용자
프로세스가 리스너에 요청하여 특정 인스턴스에 접속하고 서버 프로세스 및 PGA 가 생성, 할당되는 절차 참조),
이런 경우 **각 인스턴스 이름은 전역 데이터베이스 이름과는 다를 수 있습**니다.<br>
(for example, ORCL1, ORCL2, ... can be used on a RAC(Oracle Real Application Clusters) System)

전역 데이터베이스명과 인스턴스명을 조회하는 쿼리는 다음과 같습니다.

```sql
-- check database name
SELECT NAME, DB_UNIQUE_NAME FROM V$DATABASE;  -- ORCL, orcl

-- check instance name
SELECT INSTANCE FROM V$THREAD;  -- orcl
```

그리고 인스턴스의 이름을 용어적으로 **SID(Oracle System Identifier)** 라 하기 때문에, 어플리케이션 단에서 DB 접속세팅을 할 때는
**HOST(서버IP)**, **PORT**, **SID** 정보가 필요하게 됩니다.

리스너가 참조하는 접속 설정관련 파일은 **[Oracle Home]\network\admin\tnsnames.ora** 입니다.<br>
다음은 **sales** 인스턴스에 접속하는 리스너 설정 예시입니다.
(참조:
<a href="https://docs.oracle.com/en/database/oracle/oracle-database/19/netrf/local-naming-parameters-in-tns-ora-file.html#GUID-47DAB4DF-1D35-46E5-B227-339FF912E058"
target="_blank">General Syntax of tnsnames.ora</a>)

```text
sales =
(DESCRIPTION =
  (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.10.10)(PORT = 1521))
  (CONNECT_DATA = (SID = sales))
)
```

<br>

> **Service name**
> - **service name** 은 일종의 **인스턴스 별칭(Alias)** 입니다.
> - 데이터베이스 클러스터 구성에서 서비스 추가 혹은 인스턴스 확장으로 인해 인스턴스명이 변경되는 경우, **service name** 을 사용하면
> 클라이언트 단에서는 동일한 서비스명만 사용하므로 굳이 **SID** 를 재설정할 필요가 없게 됩니다.
> ```sql
> -- check service name
> SELECT NAME, VALUE, DISPLAY_VALUE
>   FROM V$PARAMETER
>   WHERE NAME LIKE '%service_name%';  -- service_names, sales, sales
> ```

<br>

다중 인스턴스 환경에서 **service name** 을 설정하는 예시는 다음과 같습니다.

```text
sales =
(DESCRIPTION =
  (ADDRESS_LIST =
    (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.10.10)(PORT = 1521))
    (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.10.20)(PORT = 1521))
  )
  (CONNECT_DATA =
    (SID = sales)
    (SERVICE_NAME = sales.us.example.com)
  )
)
```

접속하는 사용자 클라이언트 어플리케이션 단에서는 **SID** 로 접속 설정하거나 **SERVICE_NAME** 으로 접속 설정하는 차이만이 존재합니다.

물론 이것 외에 **접속하고자 하는 오라클 계정(데이터베이스) 정보는 별도로 입력**해야 합니다.<br>
(ex. SCOTT/tiger)

추가적으로 오라클 리스너를 활용해 여러 데이터베이스 서버로 로드밸런싱 설정도 가능합니다.
더 자세한 설명은 **<a href="https://docs.oracle.com/cd/E11882_01/network.112/e41945/concepts.htm"
target="_blank">오라클 공식 문서</a>**를 참조하세요.

<br>
## 오라클 계정 == 데이터베이스 == 스키마

여기서의 **데이터베이스**는 앞서 설명한 **전역 데이터베이스**와는 다르게
우리가 일반적으로 생각하는 **테이블, 인덱스, 시퀀스 등 실질적인 오브젝트 데이터를 담고 있는 것**을 말합니다.

그리고 이러한 오브젝트 데이터는 **스키마(Scheme)** 라고도 할 수 있습니다.

**스키마**란, 특정 테이블 컬럼의 **속성, 범주, 제약조건 등의 정의와 같은 논리적으로 설계된 데이터 저장 구조**를 의미합니다.
다른 말로 **테이블에 대한 메타 데이터**로 볼 수도 있습니다.
**스키마**는 테이블뿐 아니라 뷰, 인덱스 등의 설계도 지칭합니다.

다시 말해 **데이터베이스**라 함은 저장되는 데이터의 구조에 대한 설계 그 자체이며, 이를 **스키마** 라고 합니다.

또한 실질적으로 저장되는 **로우(RAW) 데이터**는 아무리 많은 양이 저장된다 하더라도 이 데이터 설계구조를 절대 벗어날 수 없으므로,
데이터베이스 그 자체라기보다는 데이터베이스가 저장하는 데이터라고 볼 수 있습니다.

<br>

- 오라클에서 **데이터베이스**는 곧 **오라클 계정**이라는 점을 이해해야 합니다. (중요!)

<br>

그 이유는 오라클에서 생성되는 모든 오브젝트(TABLE 등)는
**```CREATE [OBJECT] [NAME]```** 형태의 쿼리를 실행하는 계정에 종속되기 때문입니다.
따라서 **오라클 계정**은 곧 **스키마**이기도 합니다.
그리고 이러한 **스키마** 메타정보와 데이터는 **계정**에 연동된 **테이블 스페이스(Tablespace)** 에 저장됩니다.

계정이 곧 스키마를 소유하는 데이터베이스면서 해당 정보는 계정에 연동된 특정 테이블 스페이스에 저장된다는 것은
**오라클 고유의 데이터베이스 개념**으로, 다른 제품인 **MySQL** 의 그것과는 다릅니다.
**MySQL** 에서 데이터베이스는 계정에 연동되지 않고, 말 그대로 **특정 업무 도메인에서 필요한 스키마 및 메타데이터의 집합**입니다.

- 일반적으로 생각되는 **데이터베이스** 개념의 제품 간 차이
    - **MySQL**: 데이터베이스
    - **오라클**: 계정, 스키마

오라클과 MySQL 의 비교는
**<a href="https://docs.oracle.com/cd/E12151_01/doc.150/e12155/oracle_mysql_compared.htm#CHDIIBJH"
target="_blank">이 글</a>**을 참조하세요.

> **새로운 도메인의 데이터베이스를 생성한다면?**
> - **MySQL**: **```CREATE DATABASE```** 쿼리로 생성
> - **ORACLE**: **```CREATE TABLESPACE```**, **```CREATE USER```**, 쿼리로 전용 테이블 스페이스 생성 이후 그것을 새로 생성한
> 계정에 할당(**```ALTER USER SET [USERNAME] DEFAULT TABLESPACE [TBS NAME]```**)

<br>
## 2. 데이터베이스 생성하기

다음으로 데이터베이스를 생성하는 과정을 살펴보겠습니다.

오라클에서 데이터베이스의 생성은

> **테이블 스페이스 생성** > **계정(데이터베이스) 생성** > **계정에 테이블 스페이스 할당** > **오브젝트 스키마 생성**

의 순서로 진행됩니다.

먼저 테이블 스페이스에 대해 살펴보겠습니다.

<br>
## 테이블 스페이스

테이블 스페이스는 오라클의 **논리적 구성요소 중 가장 큰 단위**이며 **Permanent**, **Temporary**, **Undo** 세 가지 타입으로 존재한다고
**<a href="{{ site.github.url }}/database/2022/04/09/oracle-default-01#3-논리적-구조" target="_blank">이전 글</a>**에서
설명했습니다.
그리고 각 테이블 스페이스는 **용도에 따라 서로 독립적**이며 각각 **고유의 물리적 할당공간(data file)**을 갖습니다.
테이블 스페이스의 **data file 은 할당 용량 및 증분단위에 따라 여러 개**가 될 수 있습니다.

만약 새로운 업무 도메인으로 데이터베이스를 생성한다면, **적절한 용량의 테이블 스페이스를 생성**하고 **데이터베이스 스키마를 소유할 계정을
생성**한 후 **테이블 스페이스를 계정에 할당**해야 합니다.
그럼 해당 계정에서 생성한 모든 정보(스키마, 데이터)는 할당한 테이블 스페이스 내에 저장됩니다.

먼저 현존하는 테이블 스페이스를 확인해보겠습니다.

```sql
SELECT TABLESPACE_NAME, CONTENTS, EXTENT_MANAGEMENT
  FROM DBA_TABLESPACES;
```

```text
  TABLESPACE_NAME   CONTENTS    EXTENT_MANAGEMENT
1 SYSTEM            PERMANENT	LOCAL
2 SYSAUX            PERMANENT	LOCAL
3 UNDOTBS1          UNDO    	LOCAL
4 TEMP              TEMPORARY	LOCAL
5 USERS             PERMANENT	LOCAL
```

<br>
### SYSTEM

**SYSTEM** 테이블 스페이스는 **Permanent** 타입이며 extent 확장 시 **Locally Managed** 방식으로 관리됩니다.
이 테이블 스페이스는  **오라클을 실행하고 운영하는 데 필요한 정보들과 관리자용 데이터를 저장**하기 때문에
**항상 활성화된 상태(Online)**에 있습니다. 또한 이것은 오라클 최초 설치 시 자동으로 생성됩니다.

> **Locally Managed** 방식이란, 확장되는 extent 의 메타데이터를 테이블 스페이스 내부에서 직접 관리하는 것입니다.
> **Dictionary Managed** 방식은 데이터 사전에서 관리하기 때문에 테이블 스페이스 외부적인 참조가 필요하게 되어,
> 성능상 **Locally** 방식이 권장됩니다. (기존의 **Dictionary** 방식은 **Locally** 방식으로 migration 가능)

<br>
### SYSAUX

**SYSAUX** 테이블 스페이스는 **SYSTEM** 테이블 스페이스의 보조 역할을 하며
**SYSTEM** 에는 없지만 중요한 기능을 담당하는 컴포넌트를 포함합니다.
따라서 **SYSAUX** 테이블 스페이스가 비활성 상태에 있게 되면 몇몇 데이터베이스 기능들이 실패하게 됩니다.
이것도 마찬가지로 **Permanent** 타입이며 **Locally Managed** 이며 오라클 설치시 자동으로 생성되고,
**삭제(DROP)하거나 이름을 변경**할 수 없습니다.

<br>
### Undo (UNDOTBS1)

이것은 **undo 정보**만을 저장하기 위해 사용되는 특수 목적 테이블 스페이스입니다.
따라서 **기타 다른 segment types(other object. such as tables or indexes)** 를 생성할 수 없습니다.
오라클 데이터베이스는 **zero or more undo tablespaces** 를 갖습니다.
**automatic undo management** 모드에서 **각 오라클 인스턴스는 (오직) 하나의 undo tablespace 에 할당**됩니다.
**Undo data** 는 오라클에 의해 자동으로 생성 및 유지되는 **undo 세그먼트**를 활용해 **undo 테이블 스페이스 내에서 관리**됩니다.

트랜잭션에서 최초의 **DML** 이 실행되면 트랜잭션은 현재의 undo 테이블 스페이스의 undo 세그먼트에 할당됩니다.
그리고 드물게 **인스턴스에 지정된 undo 테이블 스페이스가 없는 경우**라면 트랜잭션은 **system undo segment** 에 바인드됩니다.
(첫번째 undo 테이블 스페이스가 생성되고 online 상태가 되기 전에 어떠한 사용자 트랜잭션도 실행하지 마십시오.)

각각의 undo 테이블 스페이스는 **undo 파일들의 셋으로 구성**되어 있으며 **Locally Managed** 됩니다.

<br>
### 데이터 정렬을 위한 Temporary 테이블 스페이스 (TEMP)

**Temporary** 타입의 테이블 스페이스인 **TEMP** 는 **SQL** 구문 실행 시 생성되는 임시 데이터를 저장하는데,
이때 **더 효율적인 정렬 수행을 위한 공간**으로 사용됩니다.
**단일 SQL operation** 은 정렬의 목적으로 하나 이상의 temporary 테이블 스페이스를 활용할 수 있습니다.

모든 데이터베이스는 계정에 할당된 temporary 테이블 스페이스를 가져야 하며,
별도의 환경설정이 없다면 기본적으로 자동 생성된 **TEMP** 테이블 스페이스가 default 로 지정됩니다.
따라서 특정 계정을 생성하고 별도의 temporary 테이블 스페이스를 지정하지 않았다면 쿼리수행 시
정렬을 위해 **TEMP** 테이블 스페이스를 사용한다고 보면 됩니다.

<br>
### USERS

일반적인 **Permanent** 테이블 스페이스의 하나인 **USERS** 테이블 스페이스는
**지정된 계정에서 생성되는 객체(tables or indexes, ...)와 데이터(영구 데이터)를 저장**합니다.
이것은 오라클 설치시 자동으로 생성되며,
**특정 데이터베이스(계정) 생성 후 별도의 기본 테이블 스페이스를 지정하지 않았다면 여기(USERS)에 저장을 시도**합니다.

앞서 테이블 스페이스는 안정성을 위해 **용도에 따라 서로 독립적으로 관리(물리적, 논리적 측면 모두에서)**되어야 한다고 했기 때문에,
만약 특정 데이터베이스(계정)의 객체 및 데이터가 **SYSTEM** 테이블 스페이스같은 곳에 할당되어 저장된다면 **이는 매우 나쁜 사례**입니다.
따라서 별도지정 없이 새 계정이 생성되면 기본적으로 **USERS** 테이블 스페이스로 저장 시도되는 것입니다.

만약 **USERS** 테이블 스페이스에도 **privileged**(권한 부여) 되지 않았다면 테이블 생성 자체가 불가합니다.

<br>
## 데이터베이스 생성하기

새 데이터베이스를 생성할 때는 도메인에 맞는 **전용 테이블 스페이스**를 생성하는 것이 좋습니다.
그 이유는 해당 데이터베이스에서 **필요한 만큼의 물리적 용량을 적절하게 할당**할 수 있고,
전용 테이블 스페이스 내에서 **모든 오브젝트 및 데이터를 독립적으로 관리**할 수 있기 때문입니다.
그럼 테이블 스페이스의 데이터 블록에 문제가 발생해도 오라클 운영에 필요한 **SYSTEM** 테이블 스페이스에 영향을 미치지 않을 수 있습니다.

만약 전용 테이블 스페이스 없이 계정만 생성한다면 default **USERS** 테이블 스페이스에 저장이 시도되니 꼭 용도에 맞게 결정하시기 바랍니다.

먼저 오라클에 전역적으로 설정된 **'기본 영구 테이블 스페이스'** 와 **'기본 임시 테이블 스페이스'** 파라미터값이
각각 **USERS**, **TEMP** 로 되어 있는 것을 확인합니다.

```sql
-- 전역변수 확인
SELECT *
  FROM DATABASE_PROPERTIES
  WHERE PROPERTY_NAME IN ('DEFAULT_PERMANENT_TABLESPACE', 'DEFAULT_TEMP_TABLESPACE');
```

```text
PROPERTY_NAME                 PROPERTY_VALUE  DESCRIPTION
DEFAULT_PERMANENT_TABLESPACE  USERS           Name of default permanent tablespace
DEFAULT_TEMP_TABLESPACE       TEMP            Name of default temporary tablespace
```

이후 데이터베이스 생성시 **DDL** 작업을 위해 **SYSTEM** 관리자 계정으로 접속한 후 진행합니다.<br>
(참조: <a href="https://docs.oracle.com/cd/E18283_01/appdev.112/e10766/tdddg_connecting.htm" target="_blank">
오라클 데이터베이스 접속하기</a>)

생성할 데이터베이스명은 **MALL** 입니다.

```sql
CREATE TABLESPACE MALL
  DATAFILE 'D:\PROGRAMS\ORACLE\ORADATA\ORCL\MALL01.DBF'  -- data file 경로 지정
  SIZE 256M
  AUTOEXTEND ON NEXT 1M MAXSIZE 1G;
```

테이블 스페이스를 아무런 옵션 없이 생성한다면 기본적으로 **CONTENTS='PERMANENT'**, **READ WRITE**,
**AUTOEXTENSIBLE='NO'** 모드로 생성됩니다.
이 때는 자동 증분이 되지 않기 때문에 **저장용량이 지정 사이즈를 넘게되면 에러가 발생**합니다(The default SIZE is 1MB).
따라서 **AUTOEXTEND ON** 으로 두고, 증분시 next 사이즈를 **1M**, 최대 사이즈를 **5G** 로 지정합니다.
이 때도 **MAXSIZE 용량을 초과하면 에러가 발생**합니다.

만약 이미 생성된 **테이블 스페이스에 추가 data file 을 할당**하거나 **data file 의 크기를 수정**하려면
다음과 같이 **ALTER DDL** 을 활용합니다.

```sql
-- data file 추가
ALTER TABLESPACE MALL
  ADD DATAFILE 'D:\PROGRAMS\ORACLE\ORADATA\ORCL\MALL02.DBF'
  SIZE 128M
  [AUTOEXTEND ON NEXT 1M MAXSIZE 1G];

-- data file 크기 변경(AUTOEXTENSIBLE='NO')
ALTER DATABASE
  DATAFILE 'D:\PROGRAMS\ORACLE\ORADATA\ORCL\MALL02.DBF'
  RESIZE 1G;
```

data file 의 크기를 **RESIZE** 옵션으로 수동 변경할 수 있는데, 이때는 자동증분상태가 아니어야 합니다.

테이블 스페이스를 **오프라인 설정하거나 삭제**하려면 다음과 같이 합니다.<br>
(**SYSTEM**, **TEMP(default temp)**, **UNDO** 테이블 스페이스는 오프라인 설정 및 삭제 불가)

```sql
-- offline 설정
ALTER TABLESPACE MALL OFFLINE;

-- 테이블 스페이스 삭제
DROP TABLESPACE MALL
  INCLUDING CONTENTS AND DATAFILES CASCADE CONSTRAINTS;
```

삭제 옵션은 차례대로 **세그먼트 삭제**, **data file 삭제**, **참조 무결성 제약조건 삭제**입니다.

**테이블 스페이스**와 할당된 **data file 정보**를 확인합니다.

```sql
-- 테이블 스페이스 확인
SELECT *
  FROM DBA_TABLESPACES WHERE TABLESPACE_NAME='MALL';
-- 할당된 data file 확인
SELECT FILE_NAME, FILE_ID, TABLESPACE_NAME, (BYTES / 1024 / 1024) AS BYTES, STATUS, AUTOEXTENSIBLE
  FROM DBA_DATA_FILES WHERE TABLESPACE_NAME='MALL';

-- 이름, 파일경로, used, free, total, available, autoextensible 확인
SELECT DF.TABLESPACE_NAME AS TBS_NAME,
       DF.FILE_NAME AS FILE_PATH,
       TO_CHAR(((DF.BYTES - FS.FREE) / 1024 / 1024), '999') || 'MB' AS USED,
       TO_CHAR((FS.FREE / 1024 / 1024), '999') || 'MB' AS FREE,
       TO_CHAR((DF.BYTES / 1024 / 1024), '999') || 'MB' AS TOTAL,
       TO_CHAR((FS.FREE / DF.BYTES * 100), '999.99') || '%' AS AVAILABLE,
       DF.AUTOEXTENSIBLE AS AUTOEXTENSIBLE
  FROM (
    SELECT FILE_ID, TABLESPACE_NAME, FILE_NAME, SUBSTR(FILE_NAME,1,200) AS FILE_NM, SUM(BYTES) AS BYTES, AUTOEXTENSIBLE
      FROM DBA_DATA_FILES
      GROUP BY FILE_ID, TABLESPACE_NAME, FILE_NAME, SUBSTR(FILE_NAME,1,200), AUTOEXTENSIBLE
  ) DF,
  (
    SELECT TABLESPACE_NAME, FILE_ID, SUM(NVL(BYTES,0)) AS FREE
      FROM DBA_FREE_SPACE
      GROUP BY TABLESPACE_NAME, FILE_ID
  ) FS
  WHERE DF.TABLESPACE_NAME=FS.TABLESPACE_NAME AND DF.FILE_ID=FS.FILE_ID AND DF.TABLESPACE_NAME='MALL';
```

다음으로 계정을 생성합니다.
**계정명은 곧 데이터베이스명으로 취급**되기 때문에 이름 그대로 짓습니다.

```sql
-- 계정 생성
CREATE USER MALL
  IDENTIFIED BY malluser
  DEFAULT TABLESPACE MALL
  TEMPORARY TABLESPACE TEMP
  QUOTA UNLIMITED ON MALL;

-- 기본 테이블 스페이스 변경시
ALTER USER MALL
  DEFAULT TABLESPACE MALL;
ALTER USER MALL
  QUOTA UNLIMITED ON MALL;
```

**DEFAULT TABLESPACE** 로 **MALL** 을 지정하고, **TEMPORARY TABLESPACE** 로 **TEMP** 를 지정합니다.
**UNLIMITED ON** 옵션은 **MALL** TBS 에 제한 없는 공간 할당을 의미합니다.

```sql
-- MALL 계정에 할당된 기본, 임시 테이블 스페이스 확인
SELECT USERNAME, DEFAULT_TABLESPACE, TEMPORARY_TABLESPACE, ACCOUNT_STATUS
  FROM DBA_USERS
  WHERE USERNAME='MALL';
-- MALL 계정의 TS 할당정보 확인(MAX_BYTES=-1, QUOTA UNLIMITED 여부 확인)
SELECT *
  FROM DBA_TS_QUOTAS
  WHERE USERNAME='MALL';

GRANT CONNECT, RESOURCE, CREATE TABLE, CREATE VIEW TO MALL;
GRANT CREATE SESSION, CREATE PROCEDURE, CREATE SEQUENCE TO MALL;

SELECT * FROM DBA_SYS_PRIVS WHERE GRANTEE='MALL';
```

위와 같이 **MALL** 계정에 대한 할당정보를 확인한 후 필요한 privilege(권한) 할당합니다.

<br>
## 테이블 스키마 생성하기

다음으로 **MALL** 데이터베이스의 **MALL_USER**, **MALL_PRODUCT** 테이블 스키마를 생성합니다. 테이블 스키마는 데이터베이스에
속해야 하기 때문에 **MALL** 계정으로 접속합니다.<br>
(참조: <a href="https://docs.oracle.com/cd/E18727_01/doc.121/e12897/T302934T458266.htm" target="_blank">
Oracle Naming Convention</a>)

```sql
-- connect by MALL
CONN MALL/malluser

-- MALL_USER
CREATE TABLE MALL_USER (
  USER_NO NUMBER(10) DEFAULT 0,
  USERNAME VARCHAR2(30) NOT NULL UNIQUE,
  PASSWORD VARCHAR2(100) NOT NULL,
  SIGNUP_DATE DATE DEFAULT SYSDATE NOT NULL,
  PWD_CHANGE_DATE DATE DEFAULT SYSDATE NOT NULL,
  LAST_LOGGED_IN DATE,

  CONSTRAINT mall_user_no_pk
    PRIMARY KEY (USER_NO)
);

-- MALL_PRODUCT
CREATE TABLE MALL_PRODUCT (
  PROD_NO NUMBER(10) DEFAULT 0,
  OWNER_NO NUMBER(10),
  PROD_NAME VARCHAR(100) NOT NULL,
  PRICE NUMBER(10) NOT NULL,
  REGIST_DATE DATE DEFAULT SYSDATE NOT NULL
);
-- add foreign key constraint
ALTER TABLE MALL_PRODUCT
  ADD CONSTRAINT mall_fk_prod_user
    FOREIGNKEY(OWNER_NO)
    REFERENCES MALL_USER(USER_NO) ON DELETE SET NULL;
```

각 컬럼의 **데이터 타입**을 정의하고 **제약조건**을 설정합니다.

**NUMBER 타입(precision [, scale])**

- 숫자형 타입
- **p(정밀도)는 소수점 이하 포함하여 최대(기본) 38자리**까지 설정 가능하며
**s(스케일)은 소수점 자릿수로 -84에서 127 범주**를 가짐
- 스케일은 생략 가능, 둘다 생략하면 **최대 범주로 설정**함

**VARCHAR2 타입(size [BYTE \| CHAR])**

- 가변문자열 타입
- **최대 4000(byte 또는 char) size**. 지정한 size 범주내에서 **실제 저장되는 데이터 크기에 따라 size 가 변동**함
- **자원 save 측면에서 좋으나, 공간 조정 및 주소 재설정 추가작업으로 인해
고정문자열 타입인 CHAR 에 비해 실행 성능이 느림** (**CHAR** 는 그 반대조건)
- **size [BYTE \| CHAR]**
    - 기본 BYTE 크기이며, CHAR 로 크기 단위를 명시하면 BYTE 크기에 상관없이 글자수에 맞게 입력됨.
    (**한글은 글자당 2BYTE 이므로, 한글 10CHAR 이면 20BYTE** 임)

**DATE 타입**

- 날짜형 타입 (year, month, day, hour, minute and second)
- 일자에 따라 **덧셈 및 뺄셈**이 가능
- 조회시 **TO_CHAR 함수**로 문자열 변환하여 출력
    ```sql
    SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS DT
      FROM DUAL;
    ```
- **SYSDATE** 는 오라클 시스템 시간

**TIMESTAMP 타입**

- **DATE** 타입의 확장으로, **milliseconds 및 timezone 정보**까지 포함<br>
**```2022-05-13 19:24:31.434175```**
- **TIMESTAMP WITH TIME ZONE** 타입으로 스키마를 지정하면,
    - 조회시 **시간대 정보**를 포함하여 출력함. (시간대 정보가 없다면 불완전 데이터)
    - **SYSTIMESTAMP** 함수를 사용하면 기본적으로 오라클 데이터베이스 서버 시간대로 출력되며,
    서로 다른 인스턴스 timezone 간 암시적으로 변환하지 않으므로 **시간대 정보와 함께 해당 시간대에서의 시간**이 출력됨
        ```sql
        SELECT SYSTIMESTAMP
          FROM DUAL;
        ```
        -- 출력결과
        ```text
        SYSTIMESTAMP
        ----------------------------------
        2022-05-13 19:24:31.434175 +09:00  -- +09:00 은 Asia/Seoul 시간대
        ```
    - **AT TIME ZONE** 절을 함께 사용하면 명시적으로 변환 가능
        ```sql
        SELECT SYSTIMESTAMP
               AT TIME ZONE 'America/New_York' AS NY_DATE
          FROM DUAL;
        ```
- **TIMESTAMP WITH LOCAL TIME ZONE**
    - 이것도 **TIMESTAMP WITH TIME ZONE** 과 마찬가지로 시간대 정보를 포함
    - 차이점은 인스턴스에 접속한 **세션(Session)** 의 로컬 시간대로 변환하여 출력함.
    - 예를 들어 오라클 접속 세션이 서울, 뉴욕 두 개가 존재한다면 **각 세션의 지역 시간대에 맞게 변환**되어 시간이 출력됨
        ```sql
        ALTER SESSION SET TIME_ZONE='Asia/Seoul';
        SELECT TZ_DATE FROM TZ_TEST;
        
        ALTER SESSION SET TIME_ZONE='America/New_York';
        SELECT TZ_DATE FROM TZ_TEST;
        ```
        -- 출력결과
        ```text
        Session altered.
        TZ_DATE
        ----------------------------------
        2022-05-13 19:24:31.434175
        
        Session altered.
        TZ_DATE
        ----------------------------------
        2022-05-13 06:24:31.434175
        ```

자세한 데이터 타입 정보는 **<a href="https://docs.oracle.com/cd/A58617_01/server.804/a58241/ch5.htm"
target="_blank">오라클 데이터 타입</a>**을 참조하세요.

**제약조건**은 **UNIQUE**, **NOT NULL**, **PRIMARY KEY**, **FOREIGN KEY**, **CHECK**, **DEFAULT** 등이 있습니다.

- **UNIQUE**: 중복값 입력받지 않음
- **NOT NULL**: NULL 값 입력받지 않음(NULL 혹은 빈 값 입력)
- **PRIMARY KEY**: 테이블 식별 키. **UNIQUE + NOT NULL** 의 특성을 가지며 유일성을 보장함
- **FOREIGN KEY**: 외래 키. 다른 테이블의 컬럼을 참조함
- **CHECK**: CHECK 조건에 부합하는 값만 입력 허용
- **DEFAULT**: 데이터 입력 없을 시 DEFAULT 에 지정한 값으로 입력됨

제약조건은 **mall_user_no_pk**, **mall_fk_prod_user** 와 같이 테이블에 종속되어 생성됩니다.

위 테이블 생성 쿼리에서 보다시피 제약조건은 **```CREATE TABLE```** 의 컬럼정의 라인 옆에 바로 지정하여 생성할 수도 있고,
다음 라인에 **```CONSTRAINT [제약조건명]```** 형식으로 별도로 이름을 지정하여 생성할 수도 있습니다.

혹은 테이블을 생성한 이후 **```ALTER TABLE [테이블명] ADD CONSTRAINT [제약조건명]```** 형식으로 추가할 수도 있습니다.

향후에 제약조건 수정의 가능성이 있다면 **제약조건명을 지정하지 않는 방식보다는 명시적으로 지정하여 생성**하시기 바랍니다.

```sql
-- MALL 데이터베이스에 속한 제약조건 조회
SELECT OWNER, CONSTRAINT_NAME, CONSTRAINT_TYPE, TABLE_NAME, SEARCH_CONDITION
  FROM USER_CONSTRAINTS;
```
```text
OWNER   CONSTRAINT_NAME    CONSTRAINT_TYPE  TABLE_NAME    SEARCH_CONDITION
MALL    MALL_FK_PROD_USER  R                MALL_PRODUCT  (null)
MALL    SYS_C007560        C                MALL_USER     "PASSWORD" IS NOT NULL
MALL    SYS_C007561        C                MALL_USER     "SIGNUP_DATE" IS NOT NULL
MALL    SYS_C007562        C                MALL_USER     "PWD_CHANGE_DATE" IS NOT NULL
MALL    MALL_USER_NO_PK    P                MALL_USER     (null)
MALL    SYS_C007559        C                MALL_USER     "USERNAME" IS NOT NULL
MALL    SYS_C007564        U                MALL_USER     (null)
MALL    SYS_C007565        C                MALL_PRODUCT  "PROD_NAME" IS NOT NULL
MALL    SYS_C007566        C                MALL_PRODUCT  "PRICE" IS NOT NULL
MALL    SYS_C007567        C                MALL_PRODUCT  "REGIST_DATE" IS NOT NULL
```

명시적으로 지정한 제약조건 외에는 오라클에서 자동으로 생성된 것을 볼 수 있습니다.

다음으로 **NUMBER** 타입 컬럼의 **자동 증가(AUTOINCREMENT)** 를 적용해 보겠습니다.
AUTOINCREMENT 가 적용된 컬럼은 **사용자 등록번호**, **제품 번호**, **게시글 번호**와 같은
**유일성과 연속성을 필요**로 하는 값에 사용됩니다.

**MySQL** 은 **AUTO_INCREMENT** 기능이 있지만 **Oracle** 은 그렇지 않으므로 **시퀀스(Sequence)** 를 생성해야 합니다.
(혹은 MAX() 값을 조회하여 +1 하도록 할 수도 있습니다)

> ### Sequence
> **UNIQUE** 숫자값을 생성하기 위한 database object. 지정한 **INCREMENT BY** 만큼 증가값이 자동 생성되며
> **MAXVALUE** 까지 생성됨. 한번 올라간 시퀀스를 다시 줄일 수는 없음

시퀀스를 사용한 **DML 이 다시 롤백되어도 시퀀스는 되돌아가지 않는다**는 점도 참고하시기 바랍니다.

```sql
-- 스키마별로 시퀀스 생성
CREATE SEQUENCE user_seq
  INCREMENT BY 1
  START WITH 1
  MINVALUE 1
  MAXVALUE 999
  NOCYCLE NOCACHE NOORDER;
CREATE SEQUENCE product_seq
  INCREMENT BY 1
  START WITH 1
  MINVALUE 1
  MAXVALUE 999
  NOCYCLE NOCACHE NOORDER;

-- 시퀀스 확인
SELECT * FROM USER_SEQUENCES;
SELECT user_seq.CURRVAL AS user_seq_curr, product_seq.CURRVAL AS product_seq_curr
  FROM DUAL;  -- 현재값 확인
```

**INCREMENT BY** 는 증감 간격, **START WITH** 는 시작값입니다.

- **MINVALUE**: 최소값 지정. **CYCLE** 일 경우 재시작되는 최소값을 의미함. **NOMINVALUE** 일 경우 최소값 없음
- **MAXVALUE**: 최대값 지정. **CYCLE** 일 경우 최소값으로 이동하나 **NOCYCLE** 일 경우 초과시 에러 발생.
**NOMAXVALUE** 일 경우 최대값 없음
- **[CYCLE \| NOCYCLE]**: 시퀀스 넘버 순환여부(**default NOCYCLE**)
- **[CACHE \| NOCACHE]**: 캐싱 여부(**default CACHE 20**). 지정한 숫자만큼 **번호를 미리 생성(캐싱)**하여 메모리에 보관, 속도 개선
- **[ORDER \| NOORDER]**: 순서보장 여부(**default NOORDER**). **요청 들어온 순서를 보장**하나, 그만큼 시스템 부하가 존재함.
일반적인 PK 생성 시에는 불필요하나, 타임스탬프의 용도로 사용되는 특정 조건에서 유용함

선착순 이벤트의 경우 수초 내에도 많은 동시 사용자가 인입될 수 있으므로, **CACHE** 와 **ORDER** 옵션을 적절히 사용해야 합니다.

다음 시퀀스값은 **```[시퀀스명].NEXTVAL```** 로, 현재 시퀀스값은 **```[시퀀스명].CURRVAL```** 로 가져옵니다.

스키마에 맞춰서 다음과 같이 데이터를 입력합니다.

```sql
-- mall_user
INSERT INTO MALL_USER
  VALUES (user_seq.NEXTVAL, 'user1', 'malluser1', SYSDATE, SYSDATE, null);
INSERT INTO MALL_USER
  VALUES (user_seq.NEXTVAL, 'user2', 'malluser2', SYSDATE, SYSDATE, null);

-- mall_product
INSERT INTO MALL_PRODUCT
  VALUES (product_seq.NEXTVAL, (
    SELECT USER_NO FROM MALL_USER WHERE USERNAME='user1'
  ), 'product1', 100, SYSDATE);
INSERT INTO MALL_PRODUCT
  VALUES (product_seq.NEXTVAL, (
    SELECT USER_NO FROM MALL_USER WHERE USERNAME='user1'
  ), 'product2', 200, SYSDATE);
INSERT INTO MALL_PRODUCT
  VALUES (product_seq.NEXTVAL, (
    SELECT USER_NO FROM MALL_USER WHERE USERNAME='user2'
  ), 'product3', 300, SYSDATE);
INSERT INTO MALL_PRODUCT
  VALUES (product_seq.NEXTVAL, (
    SELECT USER_NO FROM MALL_USER WHERE USERNAME='user2'
  ), 'product4', 400, SYSDATE);
INSERT INTO MALL_PRODUCT
  VALUES (product_seq.NEXTVAL, (
    SELECT USER_NO FROM MALL_USER WHERE USERNAME='user2'
  ), 'product5', 500, SYSDATE);

-- show inserted info
SELECT * FROM MALL_USER;
SELECT * FROM MALL_PRODUCT;
```
```text
USER_NO USERNAME PASSWORD  SIGNUP_DATE PWD_CHANGE_DATE LAST_LOGGED_IN
1       user1    malluser1 22/05/15    22/05/15        null
2       user2    malluser2 22/05/15    22/05/15        null

PROD_NO OWNER_NO PROD_NAME PRICE REGIST_DATE
1       1        product1  100   22/05/15
2       1        product2  200   22/05/15
3       2        product3  300   22/05/15
4       2        product4  400   22/05/15
5       2        product5  500   22/05/15
```

데이터 삽입 후 **SELECT** 시 위와 같은 결과를 볼 수 있습니다.
각 테이블별로 **_NO** 컬럼의 값이 자동 증가하였고, **MALL_PRODUCT** 의 외래키로 **MALL_USER** 의 PK 가 입력되었습니다.

<br>

다음글인
**<a href="{{ site.github.url }}/database/2022/05/13/oracle-default-03" target="_blank">
[03] 오라클 기본 정리 - 쿼리</a>**
로 이어집니다.
