---
title:  "[02] 오라클 기본 정리 - 쿼리"
created:   2022-05-05 21:00:00 +0900
updated:   2022-05-05 22:00:00 +0900
author: namu
categories: database
permalink: "/database/:year/:month/:day/:title"
image: https://seekvectorlogo.com/wp-content/uploads/2017/12/oracle-vector-logo.png
image-view: true
image-author: seekvectorlogo.com
image-source: https://seekvectorlogo.com/oracle-vector-logo/
---

---

### 목차

1. [쿼리 정리](#3-쿼리-정리)
    - [시스템 쿼리](#시스템-쿼리)
    - [DUAL](#dual)
    - [기본 설정 쿼리](#기본-설정-쿼리)
    - [사용자 관련 쿼리](#사용자-관련-쿼리)
    - [테이블 관련 쿼리](#테이블-관련-쿼리)
    - [SELECT](#select)

### 시리즈

- <a href="{{ site.github.url }}/database/2022/04/09/oracle-default-01" target="_blank">
[01] 오라클 기본 정리 - 오라클 살펴보기</a>

### 참조

- <a href="" target="_blank"></a>

---

<br>
## 들어가며

관계형 데이터베이스의 대표주자 오라클 데이터베이스에 대한 기본적인 개념들을 정리합니다.

이전 글인 **<a href="{{ site.github.url }}/database/2022/04/09/oracle-default-01" target="_blank">
[01] 오라클 기본 정리 - 오라클 살펴보기</a>** 로부터 이어집니다.

<br>
## 1. 쿼리 정리

쿼리를 정리합니다.

<br>
## 시스템 쿼리

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
## DUAL

**DUAL 테이블**은 오라클 자체 제공 테이블로써, 간단한 함수를 이용해서 계산되는 임시 결과값을 확인할 수 있습니다.

- **DUAL TABLE?**
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
## 기본 설정 쿼리

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
## 사용자 관련 쿼리

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
## 테이블 관련 쿼리

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

<br>
## SELECT
