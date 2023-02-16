---
title: "AWS 자격증 취득하기: SA - Associate"
created: 2023-01-28 18:00:00 +0900
updated: 2023-01-28 22:00:00 +0900
author: namu
categories: cloud
permalink: "/cloud/:year/:month/:day/:title"
image: https://d2908q01vomqb2.cloudfront.net/9109c85a45b703f87f1413a405549a2cea9ab556/2021/04/14/social-image-ML-1243x630.png
image-view: true
image-author: amazon.com
image-source: https://aws.amazon.com/ko/blogs/training-and-certification/learn-how-to-operationalize-ml-models-with-new-aws-course/
---

---

### 목차

- [개념 정리](#개념-정리)
    - [IAM policy](#iam-policy), [IAM role](#iam-role), [권한 경계(Permissions Boundary)](#권한-경계permissions-boundary),
    [신뢰 정책(Trust Policy)](#신뢰-정책trust-policy)
    - [EC2 관련](#ec2-관련)
    - [S3 및 기타 스토리지](#s3-및-기타-스토리지)
    - [글로벌-전송](#글로벌-전송)
    - [데이터베이스](#데이터베이스)
    - [데이터 분석 서비스](#데이터-분석-서비스)
    - [애플리케이션 통합](#애플리케이션-통합)
    - [보안 및 자격증명](#보안-및-자격증명)
    - [관리 및 거버넌스](#관리-및-거버넌스)
    - [네트워크 관련](#네트워크-관련)
    - [인프라 자동화](#인프라-자동화)
    - [컴퓨팅 관련](#컴퓨팅-관련)
    - [재해 복구](#재해-복구)
- [오답 노트](#오답-노트)

### 시리즈

- <a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies" target="_blank">
[01][AWS 퍼블릭클라우드 실습] 용어 정리</a>
- <a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01" target="_blank">
[02][AWS 퍼블릭클라우드 실습] VPC 구축</a>
- <a href="{{ site.github.url }}/cloud/2021/10/17/build-cloud-infra-with-aws02" target="_blank">
[03][AWS 퍼블릭클라우드 실습] EC2 생성</a>

### 참조

- <a href="https://aws.amazon.com/ko/training/learn-about/architect/?la=sec&sec=role" target="_blank">
AWS: training page of SA(Solutions Architect)</a>
- <a href="https://www.inflearn.com/course/aws-%EC%9E%90%EA%B2%A9%EC%A6%9D-%EC%96%B4%EC%86%8C%EC%8B%9C%EC%97%90%EC%9D%B4%ED%8A%B8" target="_blank">
인프런 강의(코드바나나님): AWS Certified Solutions Architect - Associate 자격증 준비하기</a>

---

<br>
## 들어가며

신년을 맞아 **<a href="https://aws.amazon.com/ko/certification/benefits/" target="_blank">AWS 자격증 배지</a>**를 
달아보자는 목표를 세웠습니다.

그 중 퍼블릭 클라우드 인프라 전반에 대한 기본적인 이해를 요구하는<br>
**<a href="https://aws.amazon.com/ko/certification/certified-solutions-architect-associate/?ch=sec&sec=rmg&d=1"
target="_blank">Solutions Architect: Associate</a>** 를 취득하기로 정했습니다.

사실 작년동안 회사 내 여러 프로젝트를 진행하며 AWS 퍼블릭 클라우드 인프라를 계속 다뤄왔습니다.

이번 시험을 준비하며 알고있던 개념들을 체계적으로 정리하고, 몰랐던 세부내용까지 학습할 예정입니다.
본 글에서는 부분적으로 알았거나 새로 배운 서비스 위주로 기술하겠습니다.

> 인프런 **<a href="https://www.inflearn.com/course/aws-%EC%9E%90%EA%B2%A9%EC%A6%9D-%EC%96%B4%EC%86%8C%EC%8B%9C%EC%97%90%EC%9D%B4%ED%8A%B8" target="_blank">
AWS Certified Solutions Architect - Associate 자격증 준비하기</a>** 강의를 참조했습니다.

<br>
## 개념 정리

### IAM policy

IAM 정책은 **Json 포맷**으로 이루어집니다.

정책 내에 **Statement** 는 여러 개 있을 수 있고, 구문이 나열된 순서대로 축적되며 적용됩니다.<br>
statement 간 충돌이 있을 경우 나중에 배치된 구문이 적용됩니다.

커스텀 정책은 **IAM 사용자**, **IAM 그룹** 혹은 **IAM 역할(role)**에 각각 지정할 수 있습니다.<br>
AWS 에는 사전에 정의된 다양한 정책이 존재하므로, 검색을 통해 적절히 활용할 수 있습니다.

**<a href="https://awspolicygen.s3.amazonaws.com/policygen.html" target="_blank">AWS Policy Generator</a>**
를 활용해 보다 손쉽게 정책을 생성할 수 있습니다.

<br>
### IAM role

**역할(role)**은 **IAM 사용자**, **IAM 그룹**과 더불어 정책을 구성하는 단위로 사용됩니다.

역할은 **AWS 리소스**에서 사용하는 자격증명이며,
보통 **AWS EC2 리소스에 특정 정책 및 권한을 적용**할 때 사용됩니다.

<br>
### 권한 경계(Permissions Boundary)

**권한 경계**는 IAM 사용자 또는 역할에 최대 권한을 제한하는 기능입니다.<br>
권한 경계가 지정된 사용자는 넓은 범주의 정책 적용을 받더라도 **지정된 권한 경계를 초과하는 권한은 가질 수 없습니다.**

예를 들어 **'admin'** 그룹에 속한 사용자들이 **AmazonEC2FullAccess** 권한을 가진다고 할 때,
**'temp_admin'** 계정에 한해 권한 경계를 **AmazonEC2ReadOnlyAccess** 로 지정해두면
**'temp_admin' 계정은 'admin' 그룹에 속했음에도 EC2 리소스에 대해 읽기 권한**만 가집니다.

<br>
### 신뢰 정책(Trust Policy)

**신뢰 정책**은 **IAM 역할에서 AWS 계정 간 액세스 권한을 위임할 때** 사용됩니다.

예를 들어 개발자들이 테스트 수행을 위해 프로젝트의 프로덕션 권한을 얻을 때 사용할 수 있습니다.<br>
(본래는 프로덕션 권한이 없지만 프로덕션 계정의 역할에서 지정된 신뢰 관계를 통해 임시로 권한을 획득)

<br>
### EC2 관련

**(1)** **인스턴스 구매 옵션**은 다음과 같습니다.

- **온디맨드**: 초당 사용량 청구
- **스팟 인스턴스**: 경매 방식, 가장 저렴할 수 있으나 shutdown 의 위험 존재, 온디맨드에 비해 최대 90%까지 저렴
- **예약 인스턴스**: 1년 ~ 3년, 인스턴스 유형 및 리전 포함 일관된 인스턴스 구성, 온디맨드에 비해 최대 75% 저렴
- **savings plan**: 1년 ~ 3년 기간 동안 시간당 USD 로 일관된 사용량 약정, 초과분은 온디맨드 청구, 온디맨드에 비해 최대 66~72% 저렴
- **전용 호스트/전용 인스턴스**: 단일 테넌트 하드웨어 서버 할당. CPU 소켓, 코어가 지정되면 전용 호스트, 아니면 전용 인스턴스

**(2)** **ENI(Elastic Network Interface)** 는 인스턴스에 부착되어 네트워크 카드(랜카드) 역할을 합니다.

- **네트워크 인터페이스(ENI)**: 일종의 네트워크 카드로 IP, MAC 주소가 할당되며 보안 그룹에 연계되어 네트워크 트래픽 제어
    - 인스턴스에는 여러 ENI 가 부착될 수 있음
    - 이 말은 곧 여러 IP 주소를 부여할 수 있다는 의미!

**(3)** **EC2 배치 그룹(Placement Groups)**이란 가용영역 내 하드웨어 서버랙에서
EC2 인스턴스들을 다양한 형태로 가깝게 배치하는 것을 의미합니다.
배치 전략에 따라 서버랙 전반에 분산되도록 하거나 논리적 파티션 단위로 분할하거나 단일 서버랙에 국한되게 구성할 수 있습니다.

- **클러스터 배치그룹**: 고성능 네트워크 연결로 이루어진 인스턴스 묶음
    - 물리적으로 가깝게! 따라서 네트워크 지연시간이 매우 짧음! 고성능 컴퓨팅(HPC)에 활용
- **파티션 배치그룹**: 인스턴스 그룹을 하드웨어를 공유하지 않는 파티션 단위로 분할
    - 논리적 파티션 그룹! 서로 다른 서버랙의 하드웨어를 엮어서 파티션 구성
    - 따라서 파티션은 하드웨어를 공유하지 않으므로 하나의 하드웨어에 장애가 발생해도 다른 파티션은 영향을 받지 않음
    - 하둡 등 빅데이터 분산처리 시스템에 사용
- **분산형 배치그룹**: 인스턴스 그룹을 별개의 서버랙 단위로 구성
    - 각 분산 그룹은 서로 다른 서버랙이므로 특정 서버랙에 장애가 발생해도 다른 그룹은 안전함
    - 매우 중요하고 고가용성이 필요한 애플리케이션에 적합

**(4)** **EC2 라이프 사이클**에서 **최대절전모드**는 PC의 절전모드와 같음
    
- **라이프 사이클**: 시작, 재부팅, 중지, 종료, 최대절전모드
- **최대절전모드(Hibernate)**: RAM 에 있는 애플리케이션 상태를 저장 후 중지상태로 전환(노트북 절전모드),
메모리에서 불러오므로 부팅 속도가 빠르고 상태가 보존됨

**(5)** **타겟 그룹(Target Group)** 생성 후 **속성(Attributes)**값 세팅 시 공통적으로 **등록 취소 지연(Deregistration delay)**
값을 지정합니다.

- **등록 취소 지연(Deregistration delay)**: Auto Scaling 축소 등으로 등록 취소된 인스턴스에 연결된 request 가 있을 경우,
지정한 시간 동안 지연 후에도 연결이 유효하지 않으면 더 이상 해당 인스턴스에 request 를 보내지 않는 기능. 보통 300초로 지정
- **HTTP/HTTPS 프로토콜을 사용하는 ALB 의 속성**의 경우, **느린 시작 기간(Slow start duration)** 설정을 통해 신규 등록된 타겟에
대한 request 를 선형적으로 증가시킬 수 있고,
**Stickiness Session(고정 세션)** 을 설정해 동일 세션인 경우 동일 인스턴스에 고정적으로 클라이언트 요청이 가도록 할 수 있음
- **TCP/UDP/TLS 프로토콜을 사용하는 NLB 의 속성**의 경우, **등록 해제 시 연결 종료(Connection termination on deregistration)**
설정을 통해 등록 취소 지연이 일어나는 동안 해당 타겟에 대한 활성 연결을 NLB 로 하여금 종료하도록 만들 수 있고,
**클라이언트 IP 주소 보존(Preserve client IP addresses)**을 설정하여 모든 트래픽의 클라이언트의 IP 를 타겟에 그대로 전달할 수 있음.
**Stickiness Session(고정 세션)** 설정도 동일하게 가능

**(6)** **로드 밸런서(ELB, Elastic Load Balancer)**

- **A(Application)LB** 의 경우, **리스너 규칙 조건(IF)값**은,
    - **호스트 헤더 기반**: 지정된 호스트 요청에 대한 타겟 그룹으로 라우팅
    - **Path 기반**: 요청 URL에 따라 라우팅
    - **HTTP 헤더 기반 라우팅**
    - **HTTP request method 기반 라우팅**
    - **Query string 기반**: 쿼리 문자열의 키/값 페어 또는 값을 기반으로 라우팅
    - **Source IP 기반 라우팅**
- **N(Network)LB** 의 경우 네트워크 및 전송계층이므로 **리스너 규칙 조건(IF) 설정 없음**
    - 다만 **고정 IP(EIP) 할당**이 가능함! >> **만약 고정적인 퍼블릭 IP 할당이 필요하다면 NLB 를 고려**해야 함

**(7)** **Auto Scaling** 은 인스턴스를 자동으로 확장하고 축소하는 기능으로,
사용자가 정의한 조정 정책에 따라 개수가 조절됩니다. 혹은 서버의 로드 수에 따라서 조절도 가능합니다.

- **구성 요소**: 오토 스케일링 그룹, 시작 템플릿(AMI, 인스턴스 유형, 스크립트 등 지정), 조정 옵션(조정 정책)
- **조정 정책**: Auto Scaling 을 실행하기 위한 조건
    - 항상 현재 인스턴스 수준 유지 관리
    - 수동 조정(최대, 최소, 원하는 용량만)
    - 일정을 기반으로 조정(시간 및 날짜 함수)
    - 온디맨드(동적) 기반 조정(수요 변화, 예를 들어 CPU 50%)
        - 대상 추적 조정, 단계 조정, 단순 조정, Amazon SQS 기반 크기 조정
    - 예측 조정 사용(Predictive Scaling) > 머신 러닝을 이용하여 CloudWatch 기록 데이터 기반
- **조정 휴지(Scaling cooldowns)**: 인스턴스 증가 혹은 감소 시 처음에는 CPU 사용량이 늘어나는 등 **비정상 상황이 존재할 수 있으므로
조정 휴지 기간**을 가짐. 보통 300초며, 이 동안에는 Auto Scaling Group 은 지표값을 측정하지 않음
- **수명 주기 후크**: Auto Scaling 에서 관리되는 인스턴스는 **Lifecycle hook** 를 거치면서 **launcing or terminating** 되는데,
**훅 기간 중에 필요한 작업을 추가**할 수 있음 (ex. 로그나 실행정보를 감사시스템에 메시지(SQS)로 보내는 작업 추가하기)

**(8)** **EBS(Elastic Block Storage)**는 SSD, HDD 와 같은 하드디스크로 EC2에 부착됩니다.
인스턴스를 시작할 때 함께 생성되는 EBS 는 부트 볼륨으로, 시스템 부팅을 위해 사용됩니다.

- EC2 와 EBS 볼륨은 **같은 AZ 에 있어야** 연결 가능
- 유형: **SSD Type**(범용SSDgp2gp3, 프로비저닝된SSDio1io2), **HDD Type**(처리량최적화st1, 콜드sc1)
- AMI 가 설치되는 부트 볼륨은 범용SSD, 프로비저닝된SSD만 지원함
- **EBS 다중연결(Multi-Attach)**
    - 하나의 볼륨이 여러 EC2 인스턴스에 연결(최대 16개)
    - Nitro 기반 Linux 인스턴스 유형만 가능(동일 AZ)
    - 프로비저닝된SSD만 지원
- **스냅샷**
    - 백업된 EBS 볼륨 데이터는 **다른 AZ 또는 리전에 복사, 생성 가능**
    - **스냅샷으로부터 커스텀 AMI 이미지를 만들어 새 EC2 인스턴스 생성까지 가능함!**
    - 이 때는 설치할 OS가 설치된 부트 볼륨이어야 함
- 이미 존재하는 EBS 볼륨이 암호화되지 않았다면 **스냅샷을 이용하여 암호화된 볼륨으로 재생성** 가능

**(9)** **Instance Store** 는 가상머신인 인스턴스에 물리적으로 부착되는 **임시 블록 스토리지**로,
물리적으로 붙어있기 때문에 고성능이지만 인스턴스가 종료(혹은 최대절전모드)되면 사라지므로
**빠른 IOPs 성능의 임시저장 스토리지**를 요하는 시스템에 적합합니다.

**(10)** **EFS(Elastic File System)** 란 리눅스 환경의 EC2 인스턴스에서 연결하기 위한 **네트워크 파일 스토리지**입니다.
이것은 **인바운드 시 NFS 프로토콜 규칙을 적용하는 보안 그룹**을 지정하는 것이 특징입니다.

- **EFS**: 네트워크 파일 스토리지는 온프레미스를 포함한 여러 원격 서버에서 접속할 수 있으므로
**NFS(Network File System) 프로토콜**을 지원함
    - 보안 그룹을 통해 여러 가용영역에 존재하는 수십~수백 대의 EC2 인스턴스 연결 가능
- **스토리지 클래스 분류**
    - **표준 스토리지(Standard)**: 3개의 가용영역에 데이터 저장, 자주 액세스하는 파일 대상
    - **표준 IA(Standard Infrequent Access)**: 3개 가용영역, 자주 액세스하지 않는 파일 대상
    - **One Zone/One Zone IA**: 1개 가용영역에 자주 액세스하거나/자주 액세스하지 않는 파일 대상
    - **수명 주기 관리** 설정을 통해 자주 액세스하지 않는 파일을 다른 스토리지 클래스로 자동으로 이동시키도록 할 수 있음
- **성능 모드**: 스토리지의 I/O, 읽기 쓰기 속도 조정
    - **기본 범용 성능 모드(General Purpose Performance Mode)**: 일반적인 I/O 성능
    - **최대 I/O 성능 모드(Max ~)**: 높은 성능을 요하는 빅데이터 분석 앱 등에서 사용
- **처리량 모드**: 파일 시스템의 처리량(MiB/s) 조정
    - **기본 버스팅 처리량 모드**: 파일 용량이 커짐에 따라 처리량을 자동 확장
    - **프로비저닝된 모드**: 고정 처리량 지정
- **인스턴스 생성 후 EFS 연결하기!**
    1. **NFS 전용 보안그룹**을 생성한 후 적절한 옵션으로 **EFS 생성하면서 각 가용영역에 해당 NFS 보안그룹 연결**
    2. **EC2 인스턴스**를 생성하며 **스토리지(볼륨)의 파일 시스템을 EFS** 로 지정
        - 인스턴스 생성하며 이전에 생성한 EFS 를 바로 연결할 수 있지만, **생성 이후에 연결할 수**도 있음
        - 보안그룹을 이전에 생성한 **NFS 보안그룹의 인바운드 규칙에서 허용하는 대상**으로 지정 (보통 인스턴스의 보안그룹 혹은 IP)
    3. 생성한 EFS 에서 '연결' 을 클릭하여 **DNS를 통한 탑재** 이후 **EFS 탑재 헬퍼 사용** 혹은 **NFS 클라이언트 사용** 부분 확인
        - 인스턴스에서 **amazon-efs-utils** 패키지 설치 후 EFS 파일 시스템을 마운트(mount)
            - 마운트 정보는 앞서 확인한 명령줄 사용!

<br>
### S3 및 기타 스토리지

**(1)** 오브젝트 스토리지인 **S3(Simple Storage Service)** 는 파일이 아닌 오브젝트 단위로 데이터를 저장합니다.
오브젝트에는 **키, 데이터 및 옵션 메타데이터**가 포함되어 있으며 키값으로 접근이 가능합니다.

- **S3**: 거의 무제한의 저장용량을 제공하며, **버킷**은 오브젝트 저장공간이고 **오브젝트**는 일종의 파일과 같은 객체
    - 버킷은 리전 단위로 생성되며 유일성을 갖춰야 함
    - 개발 오브젝트의 최대 사이즈는 5TB
- **버전 관리**: 동일한 이름의 객체(파일)를 업로드하면 여러 버전으로 저장됨(버전 관리 기능 활성화 필요)
- **암호화**: 데이터 암호화를 위해 **서버 측 암호화(SSE)**와 **클라이언트 측 암호화(CSE)**, **전송 중 암호화(SSL/TLS 이용)**를 사용
- **S3 버킷 정책**: 일반적으로 **버킷 정책**을 주로 사용하며, 정적 웹사이트 호스팅 시에는 퍼블릭 액세스 허용함
    - **버킷 정책**: JSON 형식의 정책으로, AWS 리소스나 특정 계정에 버킷 액세스 권한을 부여
    - **퍼블릭 액세스 차단(버킷 설정)**: 인터넷망에서 접속하는 퍼블릭 액세스를 차단하도록 할 수 있음. 버킷 기본값!
    - **ACL(액세스 제어 목록)**: AWS 계정에 버킷이나 객체 단위로 읽기/쓰기 권한 부여

**(2)** **스토리지 클래스**: S3 서비스는 저장하는 데이터의 특성이나 패턴에 따라 **스토리지 클래스**를 결정할 수 있는데,
이에 따라 비용을 적절하게 절감할 수 있습니다.

- **S3 Standard(범용)**: 짧은 지연과 많은 처리량을 제공하므로 일반적인 용도의 다양한 사례에 사용됨
- **S3 Intelligent-Tiering**: 데이터에 대한 액세스 패턴을 알 수 없거나 변화하는 경우 사용됨.
액세스 패턴을 모니터링하여 빈도가 낮으면 더 저렴한 액세스 계층으로 자동으로 이동
    - 계층 이동: **Frequent Access 계층** >> **Infrequent Access 계층** >> **Archive Access
        계층** >> **Deep Archive Access 계층**
- **S3 Standard-IA(Infrequent)**: 빈번하지 않은 액세스용. 하지만 빠른 액세스가 필요한 데이터에 적합. 최소 과금 기간 30일
- **S3 One Zone-IA**: **S3 Standard-IA(Infrequent)**와 유사하지만, 단일 가용영역에만 저장하므로 비용이 상대적으로 저렴.
대신 그만큼 가용성이 떨어짐.(다른 스토리지 클래스는 최소 3개 AZ 에 데이터를 저장함) 최소 과금 기간 30일
- **Glacier Instant Retrieval(아카이브용)**: 저렴한 비용으로 장기 보관하는 백업 용도. 분기에 한번 액세스하는 오래된 아카이브
데이터 용도로 검색은 밀리초 내에 즉시 이루어짐. 최소 과금 기간 90일
- **S3 Glacier/Glacier Flexible Retrieval(아카이브용)**: 이것은 일 년에 한번 액세스용으로 검색 시간은 몇 분 내지 몇 시간 소요됨
최소 과금 기간 90일
- **S3 Glacier Deep Archive(아카이브용)**: 가장 저렴하며 일 년에 한번 미만 액세스 및 7~10년 이상 장기 보관용으로
검색 시간은 몇 시간. 최소 과금 기간 180일

**(3)** **객체 수명 주기 관리(Lifecycle Policy)**: 오브젝트마다 스토리지 클래스를 일일히 지정할 수는 없으므로, 이를 비용효율적으로
관리해주는 수명 주기 관리 기능을 사용할 수 있습니다.

- 버전 관리가 활성화된 경우, 버전별 수명 주기 정책을 적용할 수 있음
    - ex. **S3 Standard >> (30 days) >> S3 Standard-IA >> (60 days) >> Glacier >> (365 days) >> Delete!**
- Amazon S3 Analytics 로 데이터 액세스 패턴을 분석 후 IA 스토리지 클래스로 옮길 시점을 알려줌

**(4)** S3 에서 **정적 웹사이트를 호스팅**하면 EC2 로 동적 사이트를 호스팅하는 것보다 훨씬 간편하고 저렴하게 운영할 수 있습니다.
이 때는 정적 호스팅을 위한 **인덱스 및 에러 페이지와 기본적인 리소스를 버킷에 업로드**하고, **퍼블릭 액세스 차단을 해제**하도록 합니다.

**(5)** S3 의 **서버 액세스 로깅(Access Logs)**을 활성화하면 버킷의 모든 활동이 로그파일로 저장되어 감사 목적으로 활용할 수 있습니다.
이 때 **로그파일 저장소를 같은 버킷에 두지 말아야** 합니다.(무한루프의 위험) 따라서 액세스 로그 저장용 버킷을 따로 생성해 두면 좋습니다.

**(6)** **S3 Replication(복제 규칙)**이란 버킷 간에 객체를 자동으로 복제하는 기능입니다. 이를 위해 원본과 대상 버킷 모두 버전관리가
활성화되어 있어야 합니다.(다른 계정 버킷간에도 가능)

- **교차 리전 복제(CRR, Cross Region Replication)**: 서로 다른 리전의 버킷으로 복사.
    - 예를 들어, 한국의 객체를 미국에서 빠르게 볼 수 있도록 복제 또는 재해복구의 목적
- **동일 리전 복제(SRR, Same Region Replication)**: 동일 리전 복사.
    - 예를 들어, 동일 데이터를 사용하는 프로덕션과 테스트 계정 간의 복제 혹은
    - 법적 준수사항으로 같은 리전 안에 데이터 복사본을 만들어 놓아야 하는 경우

**(7)** **S3 Glacier Vault Lock** 을 사용하면 저장된 파일을 삭제하거나 편집하지 못하도록 정책적으로 잠글 수 있습니다.
이를 위해 **Vault Lock 정책**을 생성해야 합니다.

- **사용목적**: 데이터 보관 규정 준수 정책이 있는 경우
- **S3 Glacier Vault**: 아카이브 데이터를 저장하는 컨테이너
- **WORM(Write Once Read Many)** 모델을 적용

**(8)** **S3 Object Lock** 객체 잠금 기능을 사용하면 일정 시간 또는 무기한으로 객체가 삭제되거나 덮어쓰이지 않고 읽기만 가능하도록
할 수 있습니다.

**(9)** **Storage Gateway** 란 온프레미스 데이터 센터의 데이터와 AWS 클라우드 스토리지를 연결하는 서비스로,
**S3 파일 게이트웨이**, **FSx 파일 게이트웨이**, **볼륨 게이트웨이**, **테이프 게이트웨이**가 있습니다.

**(10)** **FSx for Lustre** 는 리눅스 환경을 위한 **고성능 병렬 스토리지 시스템(DFS, Distributed File System)**으로
머신 러닝, 빅데이터 등 고성능 컴퓨팅(HPC, High Performance Computing)을 위해 사용할 수 있습니다.

**(11)** **FSx for Windows File Server** 는 윈도우 서버를 위한 파일 공유 서비스이며,
리눅스 파일 공유 스토리지 서비스인 **EFS(Elastic File System)** 와 비교할 수 있습니다.
EFS 가 NFS 프로토콜을 사용하는 반면 이것은 **SMB 프로토콜을 사용**하며,
EFS 와 같이 네트워크 파일 공유 서비스이기 때문에 온프레미스 서버에서도 접근할 수 있습니다.

**(12)** **Snow Family** 는 데이터를 네트워크가 아닌 물리적인 장치에 저장하여 전송할 수 있는 디바이스입니다.
오프라인 데이터 전송 방식이므로, 네트워크 연결이 안정적이지 못한 환경이나
강력한 보안을 요하거나 데이터센터 자체의 마이그레이션을 위해 사용할 수 있습니다.

**(13)** **AWS DataSync** 는 데이터 마이그레이션 서비스로,
온프레미스와 AWS 간 또는 AWS 스토리지 서비스 간 데이터 전송 및 복제를 자동화할 수 있습니다.

- **온프레미스 서버파일** >> **(SMB, NFS protocol)** >> **AWS S3, EFS, FSx for Windows
or S3 Glacier archiving** 자동화
- 전송 중 및 전송 종료 시 데이터 무결성 확인 및 암호화 가능하며, 예약된 일정에 따라 자동 스케줄링 가능
- 온프레미스와 지속적인 연결을 유지하는 **Storage Gateway** 와는 다르게
**DataSync** 는 일회성으로 데이터를 마이그레이션 하므로, 초기 데이터를 옮길 때 적절합니다.

**(14)** **AWS Backup**: AWS 는 다양한 스토리지 서비스의 백업을 중앙집중식 서비스로 제공합니다.
다만 EBS 는 자체적인 스냅샷/백업 시스템을 가지고 있습니다.

- 백업 대상: **FSx, EFS, DynamoDB, EC2, EBS, RDS, Aurora, Storage Gateway(Volume Gateway), VMware 가상머신**
- 마찬가지로 백업 일정, 보존, 모니터링, 수명주기 관리가 가능하며 액세스 정책 및 암호화 등의 기능을 사용할 수 있음
- 교차 리전 및 계정 백업 가능
- 리소스 태그 기반으로 백업정책 구성 가능

<br>
### 글로벌 전송

**(1)** 글로벌 배포 서비스인 **CloudFront** 는 콘텐츠 전송 네트워크 서비스,
즉 AWS 에서 제공하는 **CDN(Contents Delivery Network)** 서비스입니다.
전 세계에 배포된 200개 이상의 엣지 로케이션을 이용해 가까운 지역에 콘텐츠를 빠르게 전송합니다.

- 지역별로 분산 배포되어 오리진 서버의 부하를 줄일 수 있고,
오리진에서 CloudFront 로 전송되는 비용은 부과되지 않으므로 비용 절감 효과가 있음
- 사용자 request header 값에 따라 서로 다른 버전(언어)의 콘텐츠를 캐싱하여 제공할 수 있음
- **가격 등급**: 전체 가격 등급(Price Class All) > 가격 등급 200 > 가격 등급 100
- **Origin Group**: Primary, 보조 오리진으로 그룹을 구성하여 고가용성 확보
- **Lambda@Edge**: CloudFront 엣지에서 람다 함수 실행이 가능
    - ex. A/B 테스트를 위해 사이트의 다양한 버전을 볼 수 있도록 쿠키를 검사하고 URL 을 다시 작성

**(2)** **CloudFront 의 배포** 예제로는,
**오리진 S3 버킷으로 정적 퍼블릭 웹사이트를 생성하고 그것을 토대로 CloudFront 배포를 생성**하는 것이 있습니다.

**(3)** **CloudFront 의 보안**은 다음과 같습니다.

- **뷰어/오리진 프로토콜 정책**: 뷰어 프로토콜과 오리진 프로토콜 각각에 허용되는 프로토콜을 지정할 수 있음(HTTP/HTTPS 등)
- **OAI(Origin Access Identity)**: CloudFront 는 OAI 를 가지고 있으며, 오리진인 S3 버킷에서는 **OAI 가 있는 request 만 연결
허용**시키도록 설정 가능. 이 경우 OAI 없이 직접 버킷에 접속한다면 퍼블릭 액세스라고 할지라도 연결 거부됨
- 추가적인 보안 액세스
    - **Signed URL, Signed Cookies**: URL 은 단일 리소스, 쿠키는 여러 파일 접속시 인증용
    - **지역 제한**: 법률적인 사항으로 국가별 저작권이 다른 경우, 화이트리스트 혹은 블랙리스트 지역제한 옵션 선택
    - **WAF(Web Application Firewall)** 또는 **AWS Shield** 와 결합해 DDoS 공격 방어
    - **필드 레벨 암호화**: 사용자가 제출한 민감정보를 CloudFront 차원에서 비대칭 암호화,
    프라이빗 키를 가진 오리진 애플리케이션에서 복호화하여 사용

**(4)** **Global Accelerator** 는 글로벌 서비스로써, 요청을 보낸 사용자로부터 가장 가까운 위치로 트래픽을 라우팅하여
인터넷 대기시간을 줄이고 전송 성능을 향상시키는 서비스입니다.

- **2개의 Anycast 방식 고정 IP** 할당
- 네트워크 트래픽을 가장 가까운 노드로 전송하는 **Anycast** 라우팅 방식을 사용
- 라우팅 대상은 EIP, EC2, ELB(ALB, NLB) 등의 엔드포인트이고,
Health Check 기능을 통해 서버 장애 발생 시 다른 서버로 라우팅하도록 할 수 있음
- **엣지 로케이션**을 사용하는 것은 **CloudFront**와 같으나,
CloudFront 가 **HTTP 프로토콜로 콘텐츠(페이지, 이미지, 비디오 등)를 캐시**하는데 사용되는 것에 반해
**Global Accelerator** 는 **TCP/UDP 프로토콜 차원에서 최적화된 경로를 찾는데** 사용됨
      
<br>
### 데이터베이스

**(1)** **RDS** 는 AWS 관계형 데이터베이스 서비스이며,
**Aurora**, **PostgreSQL**, **MySQL**, **MariaDB**, **Oracle**, **SQL Server** 등의 데이터베이스를 사용할 수 있습니다.

- **스토리지 유형**: **범용 SSD 스토리지**, **프로비저닝된 IOPS SSD 스토리지**, **마그네틱 스토리지**
- **백업**
    - **자동백업**: RDS 는 DB 트랜잭션 로그를 5분마다 백업, 백업 보존기간은 1일~최대 35일까지 설정 가능
    - **스냅샷**: 수동으로 스냅샷 생성, 스냅샷은 별도의 보존기간 없음
- **보안**: **보안그룹(SG) 적용**, **SSL/TLS 를 활용한 전송 중 암호화**, **KMS 키를 사용한 저장 중 암호화**
    - **암호화되지 않은 DB 인스턴스 암호화**: **스냅샷을 활용해 인스턴스를 새로 생성하면서 KMS 암호화 체크!**
    - **RDS Audit Logs** 기능을 사용해 보안 감사에 활용 (장기 보관을 위해 CloudWatch Logs 에 보낼 수 있음)
- **읽기 전용 복제본(Read Replica)**: 사본 DB 는 읽기만 가능, 읽기 쿼리 성능 향상
- **다중 AZ(Multi-AZ)**: **고가용성** 확보, **재해 복구 용도**, **원본 DB 장애 시 다른 AZ 의 복제 DB 를 사용하여 내구성** 확보
- **RDS Custom** 은 사용자가 필요로 한다면 데이터베이스뿐 아니라 OS 에 대한 관리 권한도 가짐
    - ex. 사용자 지정 DB 및 OS 패키지 설치, 특정 DB 설정 구성, 파일 시스템 구성, 자체 라이선스 관리 등
- **RDS Proxy**: 중간에 프록시 서버가 붙어 데이터베이스와 connection pooling 하고 그것을 여러 애플리케이션이 공유하도록 하는 기능.
프록시의 커넥션 수를 제어하고 공유되므로 데이터베이스 리소스를 효율적으로 사용함

**(2)** **Aurora** 는 RDS 호환형 관계형 데이터베이스로, **AWS 에서 제공하기 때문에 저렴한 비용에 뛰어난 성능**을 나타냅니다.
또한 Read Replica, Backup, Security 등 기본적인 RDS 기능들을 그대로 제공합니다.

- **Aurora**: 개별 DB 인스턴스 기반이 아닌 **여러 인스턴스를 하나로 운영하는 클러스터 DB 기반**으로 운영되어
다른 RDS 보다 **속도는 3~5배 빠름**
- **Aurora DB 클러스터**: 하나 이상의 **DB 인스턴스**와 이 인스턴스의 데이터를 관리하는 **클러스터 볼륨**으로 구성.
Aurora DB 클러스터는 기본 DB 인스턴스에 더해 **최대 15개 Aurora 복제본**을 구성.(복제본은 읽기만)
- **Aurora 복제본(Replica)**: Read Replica. 3개 가용영역에 6개의 데이터 사본으로 구성되어 고가용성 확보.
마스터 DB 장애시 최대 30초 이내에 복제본 중 하나가 기본 DB 인스턴스 역할로 변경되는 Failover 기능 제공.
- **Aurora Auto Scaling**: 최대 15개 이내에서 복제본 수를 자동으로 조정 가능
- **Aurora 글로벌 데이터베이스**: 다른 리전에 복제하여 RTO 1분 이내에 재해복구 용도

- **Aurora Database Cloning**: 원본과 동일한 **복제본 Aurora DB 클러스터를 생성(Staging DB 등)**.
스냅샷을 만들고 복원하는 것보다 빠르고 비용효율적임.
- **Aurora Machine Learning**: 머신러닝을 위해 쿼리로 데이터를 가져와
Amazon SageMaker 또는 Amazon Comprehend 서비스와 통합하여 사용.
- **Aurora 멀티 마스터 클러스터**: 단일 쓰기 전용 마스터 클러스터 혹은 멀티 마스터 클러스터를 활용. 멀티는 모든 인스턴스가 쓰기 가능
- **Aurora Serverless**: DB 인스턴스 운영 및 용량을 수동으로 관리하지 않고, 사용량에 따라 자동으로 확장 혹은 축소하는 기능.
사용한 만큼만 용량 초당 요금으로 지불하므로 DB 사용빈도가 낮은 애플리케이션에 적합

**(3)** **ElastiCache** 는 **인메모리 데이터 스토어**로 1밀리초 미만의 빠른 응답이 필요한 애플리케이션에서 사용합니다.
코드 변경이 필요하며 세션 스토어, 게임 리더보드, 스트리밍 및 분석과 같이 내구성이 필요하지 않는 기본 데이터 스토어로 사용됩니다.

- **ElastiCache**: 오픈소스 인메모리 데이터베이스 솔루션인 **Redis** 또는 **Memchched** 두 가지 유형을 지원
- 인메모리인 만큼 **비용이 높아 일부분이면서 빠른 성능을 요하는 휘발 데이터**에 사용됨
- **RDS Read Replica VS ElastiCache**: **읽기 복제본**은 원본과 지속적으로 동기화되기 때문에 계속 변경되는 쿼리의 읽기 성능 향상에
적합하며, **ECache** 는 캐싱의 목적이므로 동일한 데이터를 빠르게 읽는 속도지향적입니다.(**자주 변경되는 데이터에는 적절하지 않다는 의미**)

**(4)** **DynamoDB** 는 NoSQL 데이터베이스 서비스로 **키-값 문서 데이터 모델**을 지원합니다. 또한 **서버리스 서비스**라 용량에 맞게
자동으로 확장 및 축소(Auto Scaling)하므로 관리 및 운영 오버헤드가 최소화되며, **한 자리 밀리초의 매우 빠른 응답과
초당 수백만개 이상의 request 처리성능을 제공**합니다.

- **DynamoDB Streams**: 테이블에 저장된 항목에 발생하는 변경사항을 캡쳐하여 **Kinesis Data Stream** 으로 보내거나
**Lambda 로 트리거하여 Amazon SNS 로 전송**하는 등의 이벤트 알림 생성 가능
- **읽기 일관성**: **최종적 일관된 읽기(기본값)**는 읽기 처리량을 최대화하여 가장 최근 쓰기 결과를 반영하지 못할 수도 있음. 반대로
**강력한 일관된 읽기**는 읽기 전 성공적인 응답을 수신한 모든 쓰기를 반영한 결과를 반환하도록 하여 상대적으로 느리고 용량을 많이 사용합니다.
- **Amazon S3 와 통합**: **Export to Amazon S3(내보내기)** 혹은 **Import to Amazon S3(가져오기)** 가 가능하며,
데이터 형식은 JSON, Amazon Ion 텍스트 혹은 CSV 가능합니다.

**(5)** 그 외 데이터베이스로 **DocumentDB(MongoDB 호환, JSON)**, **Keyspaces(Cassandra 호환, Wide Column 모델, 대규모 산업용)**,
**Neptune(그래프 데이터베이스, Node 간 관계, 소셜 네트워킹)**, **Quantum Ledger Database(QLDB, 원장 레코드 DB, 은행거래)**,
**Timestream(time series, 시계열 DB, IoT 센서기록)** 이 있습니다.

**(6)** **Database Migration Service(DMS)** 서비스를 활용해 온프레미스-AWS 혹은 AWS 내에서
원본 DB 를 사용하는 중에도 마이그레이션이 가능합니다. 이 기종의 DB 인 경우 **Schema Conversion Tool(SCT)** 를 사용해 스키마를
마이그레이션 대상에 적합하게 변환할 수 있습니다. 마이그레이션 작업을 위해서는 데이터를 옮기기 위한 **중간 복제 인스턴스를 생성**해야 합니다.

<br>
### 데이터 분석 서비스

데이터 분석 서비스 내용은 시험에서 개념적으로 이해하고 있으면 됩니다.

**(1)** **Amazon Athena** 는 표준 SQL 을 사용해 S3 에 저장된 데이터를 분석하는 쿼리 서비스입니다.
CSV, JSON, ORC, Avro 또는 Parquet 등 다양한 데이터 형식을 지원하며, S3 에서 직접 가져오므로 비용 효율적입니다.

- **Athena 연합 쿼리**: **CloudWatch Logs**, **DynamoDB**, **DocumentDB**, **RDS**,
**JDBC 호환 관계형 DB(MySQL, PostgreSQL 등)** 데이터 원본에 대해 쿼리 수행 가능
- **Amazon QuickSight** 와 통합하여 쿼리된 데이터를 시각화할 수 있음

**(2)** **Amazon Redshift** 는 데이터 웨어하우스(의사결정을 위한 정보의 집합) 서비스입니다.

- **데이터 웨어하우스**: 여러 소스로부터 얻은 **구조화/반구조화(정형화/반정형화)된 대량의 데이터**를
중앙 집중화 및 통합하여 자체 분석 기능을 통해 비즈니스적 통찰력을 도출합니다.
- **데이터 로드 대상**: S3, RDS, DynamoDB, Kinesis Data Firehose, EMR, Glue, Data Pipeline 및
EC2, 온프레미스의 모든 SSH 지원 호스트, 다양한 데이터 소스
- **데이터 분석 주체**: 비즈니스 애널리스트, 데이터 엔지니어, 데이터 사이언티스트 및 의사 결정권자가 비즈니스 인텔리전스(BI) 툴 사용

**(3)** **Amazon OpenSearch Service(Amazon Elastic Search Service)** 는 분산 검색 및 분석 툴로,
오픈소스인 **Elasticsearch** 에서 파생되었습니다. 이 서비스는 **로그 분석과 실시간 애플리케이션 모니터링 및 웹사이트 검색** 등을
쉽게 수행할 수 있도록 합니다.

- **다양한 소스에서 스트리밍 데이터**를 **OpenSearch Service 도메인**으로 로드
    - **CloudWatch Logs** 나 **Kinesis Data Firehose** 소스 로드를 기본으로 지원함
    - **S3**, **Kinesis Data Streams**, **DynamoDB** 소스는 **Lambda 함수의 이벤트 핸들러**를 사용해 로드함

**(4)** **AWS QuickSight** 는 클라우드 기반의 **비즈니스 인텔리전스(BI) 시각화 도구**로
의사결정을 돕기 위해 대시보드, 그래프 등의 형태로 데이터 분석결과를 제공합니다.

- CSV 및 Excel 파일 업로드, Salesforce 와 같은 SaaS 애플리케이션 연결, SQL Server, MySQL/PostgreSQL 온프레미스 DB 연결,
Amazon Redshift, RDS, Aurora, Athena, S3 등등 데이터 소스 검색

**(5)** **AWS Glue** 는 데이터 분석을 위한 **ETL(Extract, Transform and Load)** 서비스입니다.
다양한 소스에서 데이터를 검색 및 추출, 데이터 강화, 정리, 정규화 및 결합, 데이터베이스, 데이터 웨어하우스 및 데이터 레이크에
데이터 로드 및 구성 등의 여러 작업을 포함합니다.

![AWS Glue architecture](https://docs.aws.amazon.com/images/glue/latest/dg/images/HowItWorks-overview.png)

**(6)** **AWS Lake Formation** 은 데이터 레이크 서비스로, **Redshift** 가 정형화/반정형화된 데이터를 다룬다면
이것은 구조화되지 않은 데이터까지 모든 유형의 대량의 데이터를 다루는 중앙 집중식 저장소입니다.

**(7)** **Amazon EMR(Elastic MapReduce)** 는 클라우드 빅데이터 플랫폼으로 Hadoop 클러스터를 손쉽게 생성하도록 합니다.

- **MapReduce** 는 분산 병렬처리 컴퓨팅 모델로 머신러닝이나 빅데이터 처리 등에 사용됨
- 데이터 처리를 위한 EMR 클러스터(수십~수백 대의 EC2 인스턴스)를 자동으로 구성하고 확장 및 축소하는 기능을 수행

<br>
### 애플리케이션 통합

**(1)** **Simple Queue Service(SQS)** 는 메시징 큐 서비스로 애플리케이션 간의 **느슨한 결합**을 제공하기 위해 사용됩니다.
느슨한 결합의 활용방식은 **consumer 가 큐 대기열로부터 메시지를 Polling 방식으로 얻어와 순차적으로 처리하는 것**입니다.

- **대기열**: **producer** 는 처리가 필요한 메시지를 대기열에 올려놓습니다.
    - **표준대기열**: 순서와 상관없이 메시지가 전달되며, 가끔 2개 이상의 복사본이 전달될 수 있음 (ex. 파일 업로드, 데이터베이스 항목 추가)
    - **FIFO대기열**: 선입선출! (ex. 쇼핑몰 주문 결재처리 후 배송처리)
- **DLQ, Dead Letter Queue**: 배달 못한 편지 대기열로, 일정 횟수 이상 시도 후 처리되지 못한 메시지는 **SQS 에서 DLQ 로 이관**됨
- **Visibility Timeout(제한 시간 초과, 표시 제한 시간)**: consumer 의 메시지 수신 이후 **완료 응답 신호를 기다리는** SQS 의 기능으로
기본 30초로 세팅됨 (최소 0초 최대 12시간)
    - 연결 또는 앱 문제로 메시지를 다시 수신하는 경우가 있기 때문에 SQS 는 수신된 메시지를 자동 삭제하지 않음
    - Visibility Timeout 기간 동안 남아있는 해당 메시지를 다른 consumer 가 처리하지 못하도록 하여 중복 처리 방지
- **Short Polling VS Long Polling**: **짧은 폴링**은 메시지가 비어 있어도 consumer 의 메시지 요청을 **즉시 반환**하는 방법이고,
**긴 폴링**은 메시지가 빈 경우 **메시지 수신 대기시간(Receive message wait time)동안 기다렸다가 반환**하는 방법
    - 대기시간은 1초부터 최대 20초까지 설정 가능하며, 짧은 폴링에서 대기시간은 0초

**(2)** **Simple Notification Service(SNS)** 는 AWS 의 메시징 서비스입니다. 기본적으로 **Publishers 가 Topic 을 생성하고
Subscribers 에게 메시지를 전송**하는 방식입니다.

- SNS 의 Topic 은 **Push 방식으로 메시지를 전송**하며, 전송 관계는 **A2A** 혹은 **A2P** 로 이루어짐
- 메시징은 **문자, 이메일, S3 버킷 이벤트, CloudWatch 이벤트** 등으로 설정 가능
- Subscriber 는 **A2A: SQS, Lambda, HTTPS, Kinesis Data Firehose / A2P: SMS, Mobile push, Email**
- **SNS + SQS Fan Out 모델**: AWS 의 메시징 서비스를 조합해 Push 및 Polling 모델 구성 가능
![SNS + SQS Fan Out](https://docs.aws.amazon.com/images/sns/latest/dg/images/sns-fanout.png)
    - **SNS** 는 Publisher 에 의해 Topic 에 메시지가 생성되면 바로 **push 하고(Fan Out** 이라고 함),
    **Subscriber 로 등록된 SQS** 는 생성된 메시지를 대기열에 올려 적절히 소비되도록 함
- **SNS FIFO Topic**: SNS **Topic 생성 시 FIFO 방식으로 지정**할 수 있음. 정확한 순서대로 메시지 push.
Fan Out 모델이라면 정확한 순서대로 SQS 대기열 구성
![SNS FIFO ordering](https://docs.aws.amazon.com/images/sns/latest/dg/images/sns-fifo-ordering-2.png)

**(3)** **Kinesis** 는 **실시간 스트리밍 데이터**를 손쉽게 수집, 처리 및 분석하는 서비스입니다.
데이터가 수집된 후에 처리를 시작하는 것이 아닌 데이터가 **수신되는 대로 처리 및 분석**하는 것이 특징입니다.

- 수집대상: **비디오, 오디오, 앱 로그, 웹사이트 클릭스트림 및 IoT 텔레메트리 데이터와 같은 실시간 데이터**
- 서비스 유형:
    - **Kinesis Data Streams**: 수집(캡쳐), 저장 및 처리. 스토리지가 있음!
    - **Kinesis Data Firehose**: 스트리밍 ETL. AWS 데이터 스토어에 로드. 스토리지가 없고 분석도구로 보냄! 거의 실시간 분석!
    - **Kinesis Data Analytics**: SQL 또는 Apache Flink 로 데이터 스트림 분석
    - **Kinesis Video Streams**: 비디오 스트림을 수집, 저장 및 처리

**(4)** **Amazon MQ** 은 **Apache ActiveMQ** 및 **RabbitMQ** 용 관리형 메시지 브로커 서비스입니다. (JMS, NMS API /
AMQP, STOMP, MQTT, WebSocket 메시징 프로토콜)

- **활성(Active)/대기(Standby)** 브로커 배포모드 지원하여 고가용성 및 장애조치 가능
- 사용예
    - **클라우드 기반 애플리케이션 구축시** >> **SNS, SQS 메시지 서비스(스케일링, 고가용성, 성능 및 기능 면에서 우월)**
    - **기존 온프레미스 애플리케이션 혹은 마이그레이션 시 코드 변경 최소화** >> **Amazon MQ 로 호환**

**(5)** **API Gateway** 는 개발자가 API 를 생성, 게시, 유지관리, 모니터링 및 보안 유지를 할 수 있게 하는 서비스입니다.
백엔드 API 서버와 연결하여 REST API 를 제공합니다.

**(6)** **AWS Step Functions** 는 AWS 서비스들을 시각적으로 연결하여 구축하는 Workflow 서비스이고,
**Amazon AppFlow** 는 SaaS 애플리케이션과 AWS 간에 안전하게 데이터를 전송할 수 있게 하는 서비스입니다.(API 커넥터 구축)

<br>
### 보안 및 자격증명

**(1)** **KMS(Key Management System)** 는 AWS 에서 암호화 키를 생성하고 관리하는 서비스입니다. **대부분의 AWS 서비스에서 암호화는
KMS 와 관련**되어 있습니다.(EBS 볼륨 암호화, S3 객체 암호화, RDS 데이터 암호화 등)

- **KMS 의 기능**
    - 암복호화를 위한 **키(Key)를 주기적으로 자동 교체**하는 기능
    - **CloudTrail** 과 통합하여 **모든 키 사용에 관한 감사 로그** 제공

<br>
### 관리 및 거버넌스

**(1)** **AWS Organizations** 는 글로벌 서비스로 조직에 속한 멤버 계정들의 그룹 및 권한을 중앙에서 관리하는 기능을 제공합니다.
조직관리를 위한 그룹화는 **OU(Organization Unit) 단위**로 이루어지며,
전체 계정을 관리하는 계정을 마스터 계정(관리계정, Master Account)이라고 합니다.

- **OU(Organization Unit)**: 그룹화를 위한 조직 단위 (ex. Prod OU > HR OU)
- **SCP(Service Control Policy)**: **서비스 제어 정책**을 생성 및 적용하여 서비스에 대한 액세스 제어.
개별 계정 혹은 OU 단위로 적용 가능하며, 정책은 상속됨

**(2)** **CloudWatch** 는 모든 리소스에 대한 모니터링 서비스를 제공합니다. **지표(Metrics), 대시보드(Dashboard), 로그(Logs),
경로(Alarms)** 기능을 제공합니다.

**(3)** **Amazon EventBridge** 는 거의 실시간으로 이벤트를 자동 전송하는 서비스입니다. (EventBridge > Event Bus)

**(4)** **CloudTrail** 은 AWS 내에서 수행되는 모든 계정 활동 및 작업에 대한 **로그를 기록하는 서비스**입니다.
기본적으로 모든 계정에 대해 활성화되어 있으며, 로그는 S3 버킷에 저장 가능합니다.

- 로그파일은 **KMS 암호화** 가능
- **CloudTrail Insight** 를 사용하여 비정상적인 활동 감지 가능
- **로그 파일 무결성 검증**: S3 버킷으로 로그 전송 이후 유지/삭제/수정 여부 확인 가능
- AWS 계정의 거버넌스, 규정준수, 운영감사, 위험감사에 활용

**(5)** **AWS Config** 는 **AWS 리소스 구성 변경 사항을 로그 기록**하는 기능으로,
계정의 활동을 감사하는 CloudTrail 과는 차이가 있습니다.

**(6)** **AWS Systems Manager(SSM)** 는 시스템 관리를 위한 여러 기능들을 탑재하고 있습니다.
여러 AWS 서비스의 운영 데이터를 중앙집중화하고 AWS 리소스 전체에서 작업 자동화가 가능합니다.
(EC2 인스턴스, 엣지 디바이스, 온프레미스 또는 VM 에 SSM Agent 를 설치하여 관리)

- **애플리케이션 관리**: Application Manager, AppConfig, Parameter Store
- **변경 관리**: Automation, Change Manager, Maintenance Windows
- **노드 관리**: Fleet Manager, Session Manager, Patch Manager
- **운영 관리**: Explorer, OpsCenter, Incident Manager

<br>
### 네트워크 관련

**(1)** **Route53** 은 AWS 의 **DNS(Domain Name System) 서비스**로,
퍼블릭 도메인을 구입/이전하여 인스턴스 혹은 ELB 로 라우팅할 수 있습니다. (AWS 내부사용을 위해 프라이빗 도메인도 생성 가능)

![DNS resolution](
https://d1.awsstatic.com/Route53/how-route-53-routes-traffic.8d313c7da075c3c7303aaef32e89b5d0b7885e7c.png)

- **TTL 값(기본 300초)**을 설정하여 DNS resolver 로 하여금 해당 도메인의 주소를 캐싱해 두도록 할 수 있음
- **상태 검사(Health Check)**: 서버의 상태를 모니터링. 상태가 좋지 않으면 장애조치 구성 가능(-> **Failover 라우팅**)
- **주요 DNS 레코드 유형**: DNS 레코드를 통해 트래픽을 도메인에 라우팅하는 방식을 DNS 에 알려줌
    - **A**: 도메인 네임을 IPv4 주소로 라우팅
    - **AAAA**: 도메인 네임을 IPv6 주소로 라우팅
    - **CNAME**: 도메인 네임을 도메인 네임으로 라우팅
    - **ALIAS**: 도메인 네임을 AWS 리소스(ELB, EC2 등)로 라우팅
    - **MX(Mail eXchanger)**: 이메일 서버 연동 시 메일의 소유를 확인하기 위한 레코드
    - **NS(Name Server)**: 최초 기본 생성, 생성한 DNS 레코드를 가진 DNS 서버를 식별하기 위한 레코드
    - **SOA(Start Of Authority)**: 최초 기본 생성, 도메인의 정보와 권한을 가진 레코드

다음은 Route53 레코드 생성 시 지정하는 라우팅 방식입니다.

- **단순 라우팅 방식(Simple)**: 도메인 네임을 IPv4 주소로 라우팅, 여러 개 설정 시 랜덤으로 주소 반환. 혹은 별칭(alias) 설정으로
AWS 리소스(ELB)로 바로 라우팅 되도록 할 수 있음
- **가중치 기반 라우팅 방식(Weighted)**: 접속자가 요청하는 횟수의 가중치(%)를 기준으로 라우팅하는 방법. 라우팅 대상별 지정한 가중치에
따라 트래픽이 분산됨
- **지연 시간 라우팅 방식(Latency)**: 사용자와 가장 짧은 지연시간을 제공하는(가까운) 리전의 Route53 DNS 로 라우팅
(ex. **미국리전에서 요청한 클라이언트는 미국리전의 Route53 DNS 에서 지정한 대상으로 라우팅되도록 지정!**)
- **지리적 위치 기반 라우팅 방식(Geo Location)**: 사용자가 속한 대륙이나 국가를 기준으로 해당되는 Route53 DNS 로 라우팅
- **장애 조치(Failover) 기반 라우팅**: 상태 검사(Health Check)를 통해 기본(Primary) 라우팅이 실패하면 보조(Secondary)로 자동 라우팅.
따라서 헬스체크를 이전에 생성해 두어야 함
- **다중 값 응답 기반 라우팅 방식(MultiValue)**: Route53 DNS 에서 다수의 값을 반환하는 라우팅.
클라이언트에서는 이중 하나로 접속하게 되고, 만약 특정 리소스에 문제가 생기면 DNS 는 그것을 제외하고 반환함(이 때는 헬스체크 활용)

**(2)** **NACL(Network Access Control List)** 은 **서브넷 레벨에 적용되는 방화벽**으로,
**허용(Allow) 및 거부(Deny) 규칙**을 추가할 수 있습니다.
이는 **보안 그룹(SG, Security Group)**이 개별 인스턴스나 AWS 리소스에 적용되면서 허용 규칙만 추가할 수 있는 것과는 대조적입니다.

- **서브넷 레벨**이기 때문에, 지정된 서브넷 내의 모든 자원에 NACL 의 규칙이 적용됨
- 규칙은 **낮은 규칙 번호**부터 우선순위로 적용됨 (ex. 90 > 100 > 200)
- **상태 비저장 방화벽(Stateless Firewall)**이기 때문에 인바운드 트래픽에 대한 응답은 아웃바운드 규칙을,
아웃바운드 트래픽에 대한 응답은 인바운드 규칙을 따름 (기본 any open 되어있음)
- 외부에서 들어온 요청에 대한 응답 트래픽이 나갈 때 NAT 를 사용하므로, 임시포트 1024-65535 를 열어두어야 함 (기본 any open 되어있음)

**(3)** **NAT Instance** 는 EC2 인스턴스에 NAT 기능을 설치하므로 사용자가 직접 구성해야 합니다.
반면 **NAT Gateway** 는 단순히 public ip 를 통한 인터넷 연결기능만 제공합니다.

**(4)** 지원되지 않는 구성의 **VPC Peering** 에는 **CIDR Overlapping(동일 블록 중첩)** 과
**Transitive Peering(전이적 피어링)** 이 있습니다. (피어링은 1:1 연결만 가능)

**(5)** **AWS PrivateLink** 는 VPC 와 AWS 서비스 간 인터넷 연결이 아닌 프라이빗 연결을 제공하는 서비스입니다.
이를 위해 AWS 내부 네트워크를 사용합니다. (**EC2 인스턴스와 AWS S3 서비스 간 연결**이 대표적)
PrivateLink 가 구현되는 기술로는 **VPC Endpoint** 와 **Endpoint Service(AWS PrivateLink)** 가 있습니다.

- **VPC Endpoint**: 인터넷을 통하지 않고 AWS 서비스에 프라이빗하게 연결할 수 있는 VPC 진입점
    - **게이트웨이 엔드포인트**: 동일 리전의 S3 와 DynamoDB 에 대한 프라이빗 연결 (다른 리전 불가)
    - **인터페이스 엔드포인트**: 서브넷 IP 주소 범위에서 IP 를 가져와 일종의 AWS 내부 서비스용 네트워크 인터페이스를 생성,
    이것을 통해 대부분의 AWS 서비스에 접근 가능
    - **Gateway Load Balancer 엔드포인트**
- **Endpoint Service(AWS PrivateLink)**: VPC 내의 애플리케이션 또는 서비스를 엔드포인트 서비스로 만들어
다른 AWS 계정의 VPC Endpoint 로부터 연결되도록 함. (**같은 리전의 서로 다른 VPC 간 서비스적인 내부 연결** 생성)
    - 물론 VPC 간 연결은 **피어링**을 사용할 수도 있으나,
    피어링은 1:1 연결이므로 일일히 생성해줘야(요청, 수락) 하거나, 사설 IP 대역이 겹치는 등의 이유로 적절하지 않음
    - **엔드포인트 서비스**는 서비스 제공 **벤더 VPC 에 NLB 혹은 GLB 를 생성**하여 이것을 엔드포인트 서비스로 만들어 활용
    - **고객 VPC 에서는 인터페이스 엔드포인트를 생성**하여 대상 엔드포인트 서비스로 연결.
    Customer VPC 가 여럿이어도 각각 인터페이스 엔드포인트만 생성하면 됨

<br>
### 인프라 자동화

**(1)** **CloudFormation** 은 코드를 통해 인프라를 프로비저닝, 관리하는 서비스입니다.(Infrastructure as Code)
쉽게 말해 같은 인프라를 여러 리전에 자동으로 구축할 수 있습니다.

- **구성 요소**: **Template(Json 또는 YAML 형식의 파일)**, **Stack(Template 을 사용해 생성된 리소스)**,
**Change Set(Stack 리소스 변경 사항에 대한 세트)**

빌드 방식은 **Template 파일을 업로드하여 스택을 생성**합니다. AWS 에서 제공하는 **WordPress 템플릿**을 이용해 실습을 권장합니다.

<br>
### 컴퓨팅 관련

**(1)** **컨테이너 서비스**: OS 위에 컨테이너 엔진을 기동하여 여기에서 특정 애플리케이션 구성 라이브러리 패키지를 실행하게 됩니다.
컨테이너 엔진 위에서 기존에 구성한 컨테이너 이미지를 실행할 수만 있다면
OS 로부터 독립적이기 때문에 어떤 플랫폼에서도 그대로 구현이 가능합니다.
컨테이너는 주로 마이크로서비스에서 사용되며, 대표적인 컨테이너 서비스로는 **Kubernetes** 와 **Docker** 가 있습니다.

AWS 에서 컨테이너 서비스는 다음과 같습니다.

- **ECS(Elastic Container Service)**: **Docker** 컨테이너를 배포 및 관리하는 오케스트레이션 서비스. 오케스트레이션이란, 여러
컨테이너를 중앙에서 동시에 관리하는 의미
    1. **ECS 클러스터 생성**: 인프라는 용량 공급자 2개로 **기본 Fargate(서버리스) 로 구성**되며,
    여기에 **EC2 인스턴스 ASG** 혹은 **ECS Anywhere 외부 인스턴스(온프레미스 연결)** 추가가 가능
    2. **태스크 정의**: 배포하고자 하는 **Docker 이미지** URI 를 활용하여 적절한 서버 용량 지정 후 태스크 생성 (ex. nginx 이미지)
    이 때는 해당 서비스의 트래픽을 허용하는 보안그룹(SG)을 별도로 생성
    3. **서비스 생성**: 생성한 ECS 클러스터의 서비스 탭에서 앞서 정의한 태스크를 기반으로 보안 그룹을 적용하여 서비스 배포.
    태스크 개수를 조정하여 클러스터 내에서 몇 개의 컨테이너를 운용할 지 설정 가능, 선택 사항으로 앞단에 로드밸런싱도 설정 가능함
- **EKS(Elastic Kubernetes Service**: AWS 에서 Kubernetes 를 실행하는 서비스. **Kubernetes** 란
대규모 컨테이너 애플리케이션을 배포 및 관리하는 오픈소스 컨테이너 오케스트레이션 시스템
- **AWS Fargate**: **서버리스 컨테이너 서비스**로 **ECS 및 EKS 와 연동되어 컨테이너를 자동으로 관리**. 자동으로 관리하기 때문에
사용자는 서버 프로비저닝, 패치 적용, 클러스터 용량 관리 또는 인프라 관리를 따로 할 필요가 없음
- **ECR(Elastic Container Registry)**: Docker 등의 컨테이너 이미지를 공유 및 배포하는 관리 서비스

**(2)** 대표적인 아마존의 **Serverless** 서비스는 **AWS Lambda**, **AWS Fargate**, **S3**, **DynamoDB**,
**Aurora Serverless**, **SNS**, **SQS**, **API Gateway** 가 있습니다. 실제로 서버가 없는 것은 아니고
서버 용량조정, 프로비저닝, 패치 등의 인프라 관리를 AWS 에서 담당하므로 사용자가 따로 관리할 필요가 없기 때문에 서버리스로 불립니다.

- **Lambda**: **코드를 실행**하여 동작하는 서버리스 컴퓨팅으로 **이벤트 위주**로 트리거되며
**다른 AWS 서비스(S3, DynamoDB, SNS, SQS 등)와 결합**하여 사용됨. 요청할 때만 시스템을 사용하는 온디맨드 방식의 이벤트 중심의 실행
(함수가 최대 15분 이상 돌 수 없으며 한 번에 1000건 이상 실행 불가)
    - ex. S3 이미지 파일 업로드 시 파일 사이즈 조정하는 함수
    - hello-world-python 함수 예제 진행하기

**(3)** **Elastic Beanstalk** 는 **웹 애플리케이션을 배포하고 운영하는 서비스**로, 인프라 리소스를 직접 구성하지 않고
**애플리케이션 코드에만 집중**할 수 있도록 합니다. 따라서 코드를 업로드하기만 하면 용량 프로비저닝, 로드밸런싱, AS 부터
상태 모니터링 등의 배포를 AWS 가 자동으로 처리합니다.

- **대부분의 언어 지원**: Java, .NET, PHP, Node.js, Python, Ruby, Go / Docker 웹 애플리케이션 지원

**(4)** 다음의 **머신러닝** 서비스들의 개념을 이해하도록 합시다.

- **Comprehend**: 텍스트 안에서 특정 항목을 찾아내는 서비스 (ex. 회사 이름, 부정적인 후기 등)
- **Rekognition**: 이미지, 비디오 분석 (얼굴 탐지, 사물 인식)
- **Polly**: 텍스트를 음성으로 변환하는 서비스
- **Lex**: 음성인식 서비스, 챗봇 구현 가능
- **Textract**: 스캔문서에서 문자, 테이블, 양식 추출 섭시ㅡ
- **Translate**: 번역 서비스
- **Transcribe**: 음성을 텍스트로 변환
- **SageMaker**: 머신러닝 모델을 구축, 훈련 및 배포하는 서비스
- **Forecast**: 머신러닝 기반 비즈니스 지표 분석 및 시계열 예측 서비스
- **Kendera**: 지능형 검색 서비스, 간단한 키워드 외에도 자연어 질문을 사용해 원하는 답을 얻을 수 있음
(텍스트 조각, FAQ, PDF 등 관계없음)
- **Personalize**: Amazon.com 에서 실시간 맞춤화 추천에 사용하는 것과 동일한 ML 기술로 애플리케이션 구축이 가능한 서비스
특정 제품 추천, 맞춤화된 제품 순위 재지정, 맞춤화된 직접 마케팅 등 맞춤화 환경 애플리케이션을 손쉽게 구축 가능
- **Amazon Connect**: 클라우드 기반 고객센터 서비스. (전화, 자동 음성응답, 챗봇 등 기술 통합 기능)

<br>
### 재해 복구

**(1)** **Disaster(재해)**란 비즈니스에 심각한 부정적인 영향을 주는 사건을 말합니다.

- **Natural disasters(지진, 홍수)**, **Technical failures(정전, 네트워크 장애)**,
**Human actions(부주의한 조작/설정, 액세스 제한 실패)**

이러한 재해를 극복하는 방법으로 **High Availability** 와 **Disaster Recovery** 가 있는데,
이 둘은 엄밀히 다른 개념이라는 점을 인지해야 합니다.

**(2)** **Disaster Recovery(재해 복구)** 는 **비즈니스의 연속성을 목표**로 **전체 워크로드를 별도의 장소에 복사**하여
지진, 홍수 등의 재난 이벤트에 대응할 수 있도록 합니다.

**재해 복구**는 특정 서비스를 지속하기 위해 **일부 워크로드(워크로드 구성요소)를 다른 가용 영역에 복사**하는
**고 가용성**과는 차이가 있습니다. **고 가용성의 목표는 시스템의 기능 수행 시간의 최대화**에 있습니다.

- **재해 복구의 목표**
    - **Recovery Point Objective(RPO, 복구 시점 목표)**: 얼마만큼의 데이터 손실을 감수할 수 있는가? 백업 기간과 유형에 따라 다름
    - **Recovery Time Objective(RTO, 복구 시간 목표)**: 재해 발생 후 복구 목표 시간. 비즈니스 다운 타임 허용시간.
    장애 조치 시스템 설계에 따라 다름

![Recovery Objectives](https://docs.aws.amazon.com/images/whitepapers/latest/
disaster-recovery-of-on-premises-applications-to-aws/images/recoveryobjectives.png)

- **재해 복구 전략**
    - **(active/passive) Backup & Restore**: Hours, 데이터 백업 및 장애발생 시 백업으로부터 복구
    - **(active/passive) Pilot Light**: 10s of minutes, 코어 시스템만 복제 후 대기 (ex. RDS replica set)
    - **(active/passive) Warm standby**: Minutes, 전체 시스템을 더 작은 스케일로 구성하여 대기
    - **(active/active) Multi-site active/active**: Real-time, 전체 시스템을 동일하게 복제하여 동시 운영.
    가장 비싸므로 Mission critical 한 서비스에서 사용

![Disaster Recovery Strategies](https://docs.aws.amazon.com/images/whitepapers/latest/
disaster-recovery-workloads-on-aws/images/disaster-recovery-strategies.png)

<br>
## 오답 노트!
