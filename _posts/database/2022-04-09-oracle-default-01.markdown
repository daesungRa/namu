---
title:  "[01] 오라클 기본 정리 - 오라클 살펴보기"
created:   2022-04-09 19:00:00 +0900
updated:   2022-05-05 20:00:00 +0900
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

1. [기본환경 세팅](#1-기본환경-세팅)
2. [오라클 DB 살펴보기](#2-오라클-db-살펴보기)
    - [기본 구조](#기본-구조)
        - [(1) 기본 구조](#1-기본-구조)
        - [(2) 물리적 구조](#2-물리적-구조)
            - [Redo Log switching](#redo-log-switching)
        - [(3) 논리적 구조](#3-논리적-구조)
    - [데이터베이스? 인스턴스?](#데이터베이스-인스턴스)
        - [(1) 리스너와 인스턴스](#1-리스너와-인스턴스)
        - [(2) SGA](#2-sga)
        - [(3) PGA](#3-pga)
    - [인스턴스에서 쿼리가 동작하는 방식](#인스턴스에서-쿼리가-동작하는-방식)
    - [테이블 스페이스 관리](#테이블-스페이스-관리)
    - [다중 사용자 트랜잭션](#다중-사용자-트랜잭션)

### 시리즈

- <a href="{{ site.github.url }}/database/2022/05/05/oracle-default-02" target="_blank">
[02] 오라클 기본 정리 - 쿼리</a>

### 참조

- <a href="https://goddaehee.tistory.com/281" target="_blank">윈도우 10 오라클 19c 설치</a>
- <a href="https://lemonandgrapefruit.tistory.com/150" target="_blank">CentOS 7(64bit)환경에 oracle 19c 설치</a>
- <a href="https://all-record.tistory.com/76" target="_blank">SQL Developer 설치 및 접속</a>
- <a href="https://www.oracle-world.com/dba-basic/physical-storage-structures/" target="_blank">
오라클 DB 구조(oracle-world.com)</a>
- <a href="https://ittutorial.org/oracle-database-architecture-1-controlfile-datafile-sga-and-pga/"
target="_blank">Oracle Database Architecture</a>

---

<br>
## 들어가며

관계형 데이터베이스의 대표주자 오라클 데이터베이스에 대한 기본적인 개념들을 정리합니다.

환경은 **윈도우10**, **Oracle 19c** 입니다.

<br>
## 1. 기본환경 세팅

**Oracle 19c** 의 설치는 <a href="https://goddaehee.tistory.com/281" target="_blank">여기</a>를 참조하세요.

이후 **sqlplus** 혹은 **SQL Developer** 접속 세팅까지 완료된 상태에서 진행합니다.
(<a href="https://all-record.tistory.com/76" target="_blank">SQL Developer 설치 및 접속</a>,
<a href="https://clapdev.tistory.com/16" target="_blank">SQL Developer 환경설정</a>)

설치가 완료되었음에도 SQL Developer 접속이 불가한 경우 다음의 사항을 확인하세요.

- **방화벽 open**
    - Windows Defender 방화벽 > 고급 설정 > 인바운드 규칙 추가 (포트 1521 로 새 규칙 추가, 이름은 'Oracle local port')
- **오라클 설정 HOST 정보 변경**
    - 카페 와이파이 환경 등에서 호스트 정보가 변경되었을 수 있습니다.
    - cmd 에서 **'hostname'**, **'ipconfig'** 커맨드로 호스트정보 확인 후, **오라클 홈 디렉토리 내 ~\network\admin\** 폴더 하위의
    **listener.ora**, **tnsnames.ora** 설정파일의 HOST 정보를 수정합니다. (ex. HOST=DESKTOP-E*\***\*I, PORT=1521)
    - 타겟 DB SID 는 기본 **xe** 혹은 **orcl** 등 설치시 어떻게 지정했는지 확인해 보시기 바랍니다.
- **'서비스' 에서 Listener 관련 서비스 실행하기**
    - **검색 > 서비스** 켜고, Oracle 관련 서비스들을 찾습니다.
    - 그 중 **OracleOra...Home...TNSListener** 과 같은 형식의 리스너 서비스가 죽어있다면
    **'시작'** 눌러주세요.(실행 상태로 되는지 확인)
- **Oracle 환경변수 확인**
    - 오라클 설치하며 지정한 홈 디렉토리로 환경변수가 자동으로 세팅되지만, 혹시 모르니 확인해봅니다.
    - **제어판 > 시스템 및 보안 > 시스템 > 고급 시스템 설정 > 환경변수**, **시스템 변수 중 Path 경로**에
    설치 시 지정한 오라클 홈 디렉토리가 정상적으로 등록되어 있는지 확인하세요.

필요 시 재부팅 후 SQL Developer 접속 설정을 다시 시도해봅니다.

<br>
> 리눅스에서 오라클 환경세팅은 <a href="https://lemonandgrapefruit.tistory.com/150" target="_blank">이 글</a>을 참조하세요.

<br><br>
## 2. 오라클 DB 살펴보기

오라클 데이터베이스의 기본 구조와 테이블 스페이스, 트랜잭션, Redo Log 에 대해 살펴봅니다.

<br>
## 기본 구조

사용자가 저장하는 데이터들은 표면적으로
**<a href="https://www.appdynamics.com/topics/database-management-systems#~1-what-is-dbms" target="_blank">DBMS</a>**
에 의해 자동 관리되는 것으로 보이지만, 결국에는 어딘가 **물리적 저장장치**에 저장될 것입니다.

또한 물리적으로 저장되는 데이터가 아무렇게나 분포되어 영속성, 정합성이 저하되는 것을 방지하기 위해
**논리적 단위**로 구분되어 관리될 것입니다.

오라클도 이러한 원리를 따르기 때문에, 만약 중급 이상의 개발자가 되기 원한다면
단순히 쿼리만 실행하는 것이 아니라 **오라클의 기본적인 데이터 관리 구조를 이해**해야 합니다.

![oracle physical storage
structures](https://www.oracle-world.com/wp-content/uploads/2019/12/logical_physical_storage-300x267.png)
<small>refer to
**<a href="https://www.oracle-world.com/dba-basic/physical-storage-structures/"
target="_blank">oracle-world.com</a>**</small>

#### (1) 기본 구조

위 이미지와 같이 오라클 데이터베이스는 물리적 구조와 논리적 구조로 나뉘어 있으며,
**Database** 라 함은 기본적으로 사람이 이해할 수 있는 논리적 구조를 의미합니다.

따라서 물리적으로는 파일 이곳 저곳에 저장된 것으로 보이는 데이터가 DBMS 에 의해 관리될 때는 논리적으로 정제되어 나타나게 됩니다.

<br>
#### <a href="https://www.oracle-world.com/dba-basic/physical-storage-structures/" target="_blank">(2) 물리적 구조</a>

오라클에서 데이터는 물리적으로 파일에 저장됩니다.
주요한 물리적 파일들은 다음과 같습니다.

- **Data Files**: 모든 데이터가 저장됨 (*.dbf)
    - 모든 데이터베이스 시스템은 적어도 하나 이상의 data file 을 소유함 (데이터베이스 최초 생성 시 자동으로 생성됨)
    - 논리적 구조에 해당하는 **tablespace**, **segment**, **extent**, **data block** 들이 저장됨
    - 사용자가 트랜잭션을 시작하면 오라클은 먼저 Database Buffer Cache 에서 데이터를 찾고, 다음으로 Data Files 에서 찾음
    ```sql
    -- 데이터 파일 조회
    SELECT * FROM DBA_DATA_FILES;  -- FILE_NAME, TABLESPACE_NAME, STATUS, BLOCKS, ...
    -- or
    SELECT * FROM V$DATAFILE;  -- NAME, STATUS, BLOCKS, ...
    ```

> **Data File Structure**
> - Data File 은 두 개의 모드가 존재함(영구 및 임시)
>     - **Online**: 접근 가능, 어플리케이션이 read and write 가능, 트랜잭션 정보 저장, 물리적으로 수정 불가
>     - **Offline**: 접근 불가, 파일 관련 작업 가능(corruption investigation, renaming, backing up, ...)
> - **Data file header**: stores general and key information about data inside such as
>     - System Change Number (SCN, 트랜잭션이 커밋된 이후 생성되는 incrementing unique number)
>     - Size
>     - Unique identifier of the data file in a database
>     - Unique identifier of the data file in a tablespace
> - **Used block**
> - **Free block**: never used(free and never used), previously used(but still free to be reused)

![data file structure](https://www.oracle-world.com/wp-content/uploads/2020/01/data_file_structure.png)
<small>refer to
**<a href="https://www.oracle-world.com/dba-basic/physical-storage-structures/"
target="_blank">oracle-world.com</a>**</small>

- **Permanent and Temporary Data Files**: Data Files 의 일종
    - **영구보존 파일**들은 Permanent Tablespace 에 저장됨
    - **임시 파일**들은 Temporary Tablespace 에 저장됨
    - **임시 파일**은 세션이 유지되는 동안에 오직 **read-write** 모드로만 존재하고 **NOLOGGING** 옵션으로 생성되며,
    다른 어플리케이션은 읽을 수 없음
    ```sql
    -- 임시 파일 조회
    SELECT * FROM DBA_TEMP_FILES;  -- FILE_NAME, TABLESPACE_NAME, STATUS, BLOCKS, ...
    -- or
    SELECT * FROM V$TEMPFILE;  -- NAME, STATUS, BLOCKS, ...
    ```
- **Control Files**: 오라클 데이터베이스의 두뇌 역할. 데이터베이스를 유연하게 운영하기 위해 이 파일이 필요함 (*.ctl)
    - **data files**, **redo log files**(names, locations) 위치정보 저장
    - **메타데이터 정보** 및 **DB name**, **DBID**, **DB 생성일**, **tablespace** 등 여러 정보 저장
    - **RMAN 백업정보** 저장. Full backup 과 함께 Control File 도 backup 되어야만 함 (자동백업 활성화 필요)
    - 현재의 **System Change Number(SCN)** 또한 저장됨. (SCN 은 트랜잭션이 커밋된 이후 생성되는 incrementing unique number)
    - 오라클은 **PGA**(프로그램 메모리) 를 통해 이 파일을 읽거나 쓸 수 있음 (**SGA**(공유 메모리) 에 있는 다른 데이터 블록들과 다름)
    - **체크포인트 정보** 및 **트랜잭션 정보가 저장된 로그 파일들의 시퀀스 넘버** 저장
    - **Control File** 은 데이터베이스당 한개씩이지만 여러 데이터베이스 인스턴스 정보를 옵셔널하게 가질 수 있으므로, 이 파일이 손상되면
    인스턴스가 실행 불가능하거나 충돌이 일어날 수 있음 (위와 같은 핵심 정보들을 저장하기 때문에 매우 중요)
    - 따라서 접속 장애상황을 예방하기 위해 **Control File** 에 대한 복사본을 가지도록 옵션을 지정할 수 있음
    - 3 개의 복사본을 각각 분리된 디스크에 저장하는 것이 권장됨
    (데이터베이스 start 를 위해 매우 중요한 파일이므로)
    ```sql
    -- control file 조회
    SHOW PARAMETER CONTROL_FILE;
    -- RMAN 백업설정 시, control file 오토백업도 활성화
    CONFIGURE CONTROLFILE AUTOBACKUP ON;
    ```
- **Online Redo Log Files**: 데이터베이스 **회복(recovery)** 을 위해 매우 중요한 Redo Log 파일. 데이터 변경 사항이 저장됨
    - 데이터베이스 실패 혹은 데이터 유실을 방지하기 위해 오라클은 해당 파일을 유지관리 함
    - 데이터베이스에서 실행된 모든 단일 트랜잭션 정보를 포함(커밋되지 않았더라도)
    - 적어도 두 개의 Redo Log 파일을 가지지만 **보통은 여러 개**를 가짐 (one being used and the other one being archived)
    - 회복을 위해서만 사용되지만, **데이터베이스 내부 활동을 체크**하기 위해 절차적으로 탐색이 가능함 (탐색 툴: **Oracle LogMiner**)
    - **다중 인스턴스 모드**에서 각 인스턴스는 **고유의 redo thread** 를 할당받아 동시적으로 데이터베이스에 접근함
- **Password file**: **SYS** 계정의 패스워드 저장 (다른 계정의 패스워드는 **data file** 에 저장됨)
- **Parameter file**(PFILE / SPFILE): 인스턴스의 성공적인 시작을 위한 모든 파라미터 저장

> #### Redo Log switching
> - **active redo log 파일**은 오직 하나(=current), 나머지 하나는 **being archived** 됨
> - 이 파일에 트랜잭션 상세를 기록하기 위하여 오라클은 **Log Writer(LGWR)** 프로세스를 사용함
> - active 파일이 가득 차게 되면 **오라클은 다른 redo log 파일로 전환함(we called this situation 'log switching')**.
> 또는 일정 간격으로 강제 전환할 수 있음
> ![redo log switching](https://www.oracle-world.com/wp-content/uploads/2020/01/redo_log_switch-300x235.png)
> - 데이터베이스가 **NOARCHIVELOG 모드**인 경우 모든 redo log 파일은 재사용될 수 있음
> - 이는 체크포인트(checkpointing, CKPT, checkpoint process) 쓰기가 완료된 직후에 사용 가능함
> (checkpointing 은 **DBWR(database writer)** 프로세스에 의해 실행됨)
> - 만약 반대로 **archive log 모드**인 경우 이 redo log 파일은 오직 체크포인트가 작성되고, archived 된 이후에만 사용 가능함
> - **일반적으로 데이터베이스 운영시 redo log 파일의 다중 복제본**으로 설정됨 (클러스터링 및 높은 고가용성의 이유)
> - 이 경우 **log writer 는 트랜잭션 상세를 여러 개의 redo log 파일들에 동시에 저장**함
> (다중 파일은 여러 디스크에 거쳐 생성되는게 이상적)
>
> **Archived redo log files**
> - 아카이빙된 로그 파일은 **offline 파일**인데, 이는 **데이터베이스 회복** 또는 **대기중인 데이터베이스 업데이트** 용도로 사용됨
>
> **Redo log 파일의 구조**
> - SCN number
> - 변경에 대한 timestamp
> - 트랜잭션 ID
> - 커밋된 트랜잭션의 SCN 및 timestamp (만약 커밋되어 버린다면)
> - Operation type
> - 수정된 data segment 이름 및 타입
>
> <a href="https://www.oracle-world.com/architecture/redo-log/" target="_blank">추가 참조: Redo Log</a>

<br>
#### <a href="https://www.oracle-world.com/dba-basic/logical-storage-structures/" target="_blank">(3) 논리적 구조</a>

데이터의 논리적 구조는 사람에게 친숙합니다.

오라클 데이터베이스의 논리적 구조에서 가장 큰 단위는 **Tablespace**이며,
순차적으로 **Segment**, **Extent**, **Data Block**으로 세분화됩니다.

<br>
## 데이터베이스? 인스턴스?

일반적으로 데이터베이스에 '접속'한다고 생각하지만 실제로는 그렇지 않습니다.<br>
<a href="https://www.oracle-world.com/architecture/instance-architecture/"
target="_blank">**리스너(Listener)** 를 통해 **인스턴스(Instance)** 에 접속</a>한다는 것이 올바른 이해입니다.

<br>

> **데이터베이스와 인스턴스의 차이점**
> - 데이터, 스키마, 메타데이터 등 실제 저장되는 요소들은 **데이터베이스**
> - 그러한 데이터베이스에 접속하여 특정 용도로 사용되는 것은 **인스턴스**
> - 따라서 동일한 데이터베이스로 목적에 따라 각각 다른 여러 인스턴스가 성립될 수 있음
> - 하나의 인스턴스는 오직 하나의 데이터베이스만 열 수 있음
> - 사용자가 접속을 해제해 인스턴스가 끊어져도 데이터베이스의 데이터는 손상되지 않음

<br>
#### (1) 리스너와 인스턴스

- **리스너**: 사용자의 접속 요청(requests)을 받아들여 지정된 인스턴스에 연결
    - 사용자와 인스턴스가 한번 연결되면 이를 **Server Process**라 하고, **사용자 세션**이 형성됨
    - 이후 리스너는 disconnect 됨
- **인스턴스**: 데이터베이스와 통신하는 프로세스, 메모리의 전체 모음
    - **SGA(System Global Area)**: 모든 프로세스에 의해 전역적으로 사용되는 임시 공유 메모리
        - 인스턴스가 종료되면 할당되었던 메모리 영역은 반납됩
        - **Shared Pool**, **Buffer cache**, **Redo Log buffer**, **Streams pool**, **Large pool**, **Java pool**
    - **Process**: **SGA** 가 메모리라면 **Process** 는 CPU 부분을 의미함. 오라클 운영에 필수적인 프로세스들이 존재함
        - **SMON**: 시스템 모니터. 데이터베이스 회복 관리
        - **PMON**: 프로세스 모니터. 다른 모든 프로세스들이 정상 동작중인지 모니터링함
        - **CKPT**: **Checkpoint**. 모든 변경 사항들이 **data file** 및 **redo log file** 에 동기화되도록 함
        - **LGWR**: **Log writer**. **redo log buffer** 로부터 **redo log file** 로 모든 변경 사항들을 연대순으로 기록하는 역할
        - **DBWR**: **Database writer**. **data file** 에 변경 사항을 기록하는 역할 (**dirty buffer**)
    - **Storage**: 앞서 살펴본 **[오라클 기본구조의 물리적 구조](#2-물리적-구조)** 의 물리적 파일들을 의미

> **dirty buffer**
> - **DBWR** 에 의해 **data file**(물리적 파일)에 기록되기 이전에 **SGA** 의 **buffer cache** 에 존재하는 변경 사항을 의미함
> - 변경 사항의 커밋 여부와는 무관함!
> - 따라서 uncommitted 데이터가 **data file** 에 기록될 수도 있는데,
> - 만약 **데이터베이스 충돌이 발생한 경우 instance recovery 가 커밋되지 않은 변경 사항을 정리**하게 됨

리스너가 사용자와 인스턴스 간 연결을 성공시키기 위해 필요한 요소는 다음과 같습니다.

- **HOST**: 서버명
- **PORT**: 접속 포트. 리스너틑 지정된 포트에서 리스닝함 (기본 1521)
- **SERVICE_NAME / SID**

<br>

인스턴스와 인스턴스의 동작에 대한 상세 설명은
**<a href="https://docs.oracle.com/cd/E11882_01/server.112/e40540/startup.htm#CNCPT005"
target="_blank">Oracle Docs - Oracle Database Instance</a>** 를 참조하세요.

**사용자 프로세스 - 서버 프로세스(PGA) - 인스턴스(SGA)** 의 연결 흐름은 다음을 참조하시기 바랍니다.
(**PGA**: 하나의 프로세스에 할당되는 메모리 영역)

![oracle database instance](
https://i0.wp.com/ittutorial.org/wp-content/uploads/2013/10/oracle-database-architecture.jpg?w=472&ssl=1)
<small>refer to
**<a href="https://ittutorial.org/oracle-database-architecture-1-controlfile-datafile-sga-and-pga/"
target="_blank">ittutorial.org</a>**</small>

<br>
#### <a href="https://ittutorial.org/oracle-database-architecture-1-controlfile-datafile-sga-and-pga/" target="_blank">(2) SGA</a>

전역 공유 메모리 영역인 **SGA(System Global Area)** 의 값은 오라클 데이터베이스 생성 시 설정됩니다.
또한 설정된 값에 따라 인스턴스 시작 시 오라클에 의해 운영체제로부터 물리적 메모리가 할당되며, 인스턴스가 종료되면 release 됩니다.

**SGA** 값의 정확하고 최적의 구성은 **오라클 성능에 직접적인 영향**을 미칩니다.

```sql
-- SGA 값 조회
SHOW PARAMETER SGA;  -- NAME(sga_max_size, sga_min_size, sga_target, lock_sga, pre_page_sga, ...), TYPE, VALUE
```

**SGA** 에는 다음 세 개의 주요한 구성요소가 있습니다.

- **Shared Pool**: 데이터베이스 운영 대부분의 영역에서 사용되는 중요한 메모리 영역
    - 모든 트랜잭션의 **쿼리**와 쿼리의 **execution plans(work plans)**, **컴파일된 PL/SQL 코드**들이 저장됨
    (**Library Cache**, **Dictionary Cache**, **Sql Area**, **Table**, **View**, **Metadata**)
    - **Library Cache** 에는 SQL 구문해석이 저장되는데, 이전에 실행되었던 구문을 재활용하는 것을 **soft parse** 라 하고,
    새 구문해석을 **hard parse** 라 함
    - **hard parse** 가 많아지면 당연히 성능이 저하되는데, **DBA 는 이를 손봐서 성능을 개선**할 수 있음
        - **upper-lower case differences**: 대소문자 통일하여 완전 동일한 구문이 되도록 하여 soft parse 되도록 함
        - **assign the 'bind variables'**: 동일 구문에 반복적으로 들어가는 값을 변수화하여 동일한 execution plan 을 만들어
        soft parse 되도록 함
    - **Dictionary Cache** 에는 데이터베이스의 **metadata** 가 저장됨
        - 쿼리 구문이 해석될 때 빈번히 참조됨
        - Who is authorized to access a table
        - Tablespace informations
        - Column information of a table
- **Data Buffer Cache**: 물리적 저장장치로부터 읽어들인 모든 데이터가 적재되는 메모리 공간.
    - 사용자나 어플리케이션에 의해 시작된 트랜잭션 데이터는 이곳에 기록됨
    - **buffer cache** 에는 존재하나 **data file** (물리적 파일)에는 아직 기록되지 않은 변경사항은 **'dirty buffer'** 라 하는데,
    - **dirty buffer** 는 일정 간격으로  **DBWR(Database writer)** 에 의해 **data file** 로 기록됨
- **Redo Log buffer**

**SGA** 각 메모리 파라미터에 할당된 값의 합이 **SGA_MAX_SIZE** 값의 이하가 되도록 해야합니다.

<br>
#### <a href="https://ittutorial.org/oracle-database-architecture-1-controlfile-datafile-sga-and-pga/" target="_blank">(3) PGA</a>

**PGA(Program Global Area)** 는 오라클 인스턴스에서 프로세스가 시작될 때 서버에서 할당되는 물리적 메모리 공간입니다.
하나의 프로세스는 특정 어플리케이션이나 사용자의 데이터베이스 인스턴스 접속 시 만들어지며, 이 프로세스가 종료될 때 메모리도 release 됩니다.

```sql
-- PGA 값 조회
SHOW PARAMETER PGA;  -- NAME(pga_aggregate_target, pga_aggregate_limit, ...), TYPE, VALUE
SHOW PARAMETER WORKAREA_SIZE_POLICY;  -- default AUTO (or MANUAL)
SHOW PARAMETER SORT_AREA_SIZE;  -- VALUE is 65536 (byte)
SHOW PARAMETER PGA_AGGREGATE_TARGET;  -- VALUE is 2437M
```

**PGA** 의 구성요소는 다음과 같습니다.

- **Sort Area**: Order by 또는 Group by 등의 정렬 수행 공간. 메모리 정렬 이후 공간이 부족하면 디스크 추가 활용함
- **Session Information**: 접속된 사용자 프로세스의 세션 정보
- **Cursor State**: 해당 SQL 의 구문 해석 정보(parsing info)가 저장된 주소를 지칭하는 커서
- **Stack Space**: 변수 저장 공간. **bind variable 할당정보 저장**

다음의 파라미터의 값을 설정함으로써 **PGA** 용량을 관리할 수 있습니다.

- **WORKAREA_SIZE_POLICY**(MANUAL or AUTO, default AUTO)
    - **MANUAL** 인 경우 **SORT_AREA_SIZE** 만큼 세션의 **PGA** 가 할당되며, 이를 초과하는 정렬작업의 경우 그것을 나눈 횟수만큼
    **disk I/O** 가 발생함
    - **AUTO** 인 경우 **PGA_AGGREGATE_TARGET** 에 설정된 값 이하까지 자동으로 관리됨. 이 값 이하의 정렬작업이라면
    자동으로 메모리 용량을 할당하여 한 번에 처리됨
- **SORT_AREA_SIZE**: 정렬시 사용되는 메모리 용량을 설정. 세션별로 정해진 크기의 **PGA** 가 할당됨
- **PGA_AGGREGATE_TARGET**: 모든 세션의 **PGA** 크기의 합. AUTO 설정시 자동으로 관리됨

> **PGA_AGGREGATE_TARGET** 설정 시 주의사항
> - **WORKAREA_SIZE_POLICY** 를 **AUTO** 로 설정하고 **PGA_AGGREGATE_TARGET** 값을 지정할 때는 각별한 주의가 필요함
> - 만약 한 세션이 큰 정렬작업을 수행하여 **PGA_AGGREGATE_TARGET** 용량을 전부 자동으로 할당받아 사용하게 된다면,
> - 추가로 접속하는 사용자 세션에 할당 용량 부족으로 인한 에러가 발생할 수 있음
> - 따라서 몇 명의 사용자가 각각 한 번에 얼마 정도씩 메모리를 사용할지 미리 파악하여 **PGA_AGGREGATE_TARGET** 값을 정확히 지정해야 함
> - 평소 사용되는 **PGA** 크기 확인 > **V$PROCESS** 데이터 딕셔너리 뷰에서 조회
>     - 조회시 현존하는 여러 **PGA** 데이터가 나타남
>     - **PGA_USED_MEM**(현재 사용중), **PGA_ALLOC_MEM**(할당된 크기), **PGA_MAX_MEM**(사용했던 최대 크기)

<br>
## 인스턴스에서 쿼리가 동작하는 방식

![instance detail](https://docs.oracle.com/cd/E11882_01/server.112/e40540/img/cncpt325.gif)
<br>
<small>refer to
**<a href="https://docs.oracle.com/cd/E11882_01/server.112/e40540/startup.htm#CNCPT005"
target="_blank">docs.oracle.com</a>**</small>

<br>
## 테이블 스페이스 관리

<br>
## 다중 사용자 트랜잭션

<br>

다음글인
**<a href="{{ site.github.url }}/database/2022/05/05/oracle-default-02" target="_blank">
[02] 오라클 기본 정리 - 쿼리</a>**
로 이어집니다.
