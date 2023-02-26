---
title: "[02] AWS 자격증 취득하기: SA - Associate"
created: 2023-02-24 18:00:00 +0900
updated: 2023-02-26 22:00:00 +0900
author: namu
categories: cloud
permalink: "/cloud/:year/:month/:day/:title"
image: https://d2908q01vomqb2.cloudfront.net/9109c85a45b703f87f1413a405549a2cea9ab556/2020/04/30/social_solutions-architect_1024x516.png
image-view: true
image-author: amazon.com
image-source: https://aws.amazon.com/ko/blogs/training-and-certification/my-learning-path-to-become-an-aws-solutions-architect/
---

---

### 목차

- [개념 정리](#개념-정리)
    - [데이터 분석 서비스](#데이터-분석-서비스)
    - [애플리케이션 통합](#애플리케이션-통합)
    - [보안 및 자격증명](#보안-및-자격증명)
    - [관리 및 거버넌스](#관리-및-거버넌스)
    - [네트워크 관련](#네트워크-관련)
    - [인프라 자동화](#인프라-자동화)
    - [컴퓨팅 관련](#컴퓨팅-관련)
    - [재해 복구](#재해-복구)

### 시리즈


- <a href="{{ site.github.url }}/cloud/2023/01/28/aws-certificate01" target="_blank">
[01] AWS 자격증 취득하기: SA - Associate</a>

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

**<a href="{{ site.github.url }}/cloud/2023/01/28/aws-certificate01" target="_blank">이전글</a>**로부터 이어집니다.

> **인프런 <a href="https://www.inflearn.com/course/aws-%EC%9E%90%EA%B2%A9%EC%A6%9D-%EC%96%B4%EC%86%8C%EC%8B%9C%EC%97%90%EC%9D%B4%ED%8A%B8" target="_blank">
AWS Certified Solutions Architect - Associate 자격증 준비하기</a> 강의를 참조했습니다.**

> **"[실전]" 키워드가 달린 부분은 실전문제풀이 이후 출제된 문제 관점에서 개념을 추가로 정리한 내용입니다.**

<br>
## 개념 정리

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
백엔드 API 서버와 연결하여 REST API 를 제공합니다. (Websocket API 도 지원)

> _**[실전]** 퍼블릭 API 의 경우, **권한이 없는 사용자의 무분별한 요청(트래픽)을 차단**하기 위해서는
**a. 정품 사용자와만 공유하는 API 키를 사용하여 사용 계획을 만들**거나, **b. AWS WAF 규칙을 구현하여
악의적인 요청을 대상으로 하고 이를 필터링하는 작업을 트리거**합니다._

**(6)** **AWS Step Functions** 는 AWS 서비스들을 시각적으로 연결하여 구축하는 Workflow 서비스이고,
**Amazon AppFlow** 는 SaaS 애플리케이션과 AWS 간에 안전하게 데이터를 전송할 수 있게 하는 서비스입니다.(API 커넥터 구축)

<br>
### 보안 및 자격증명

**(1)** **KMS(Key Management System)** 는 AWS 에서 암호화 키를 생성하고 관리하는 서비스입니다. **대부분의 AWS 서비스에서 암호화는
KMS 와 관련**되어 있습니다.(EBS 볼륨 암호화, S3 객체 암호화, RDS 데이터 암호화 등)

- **KMS 의 기능**
    - 암복호화를 위한 **키(Key)를 주기적으로 자동 교체**하는 기능
    - **CloudTrail** 과 통합하여 **모든 키 사용에 관한 감사 로그** 제공

**(2)** **개념을 알아둡시다!!**

- **Amazon Cognito**: 애플리케이션에 대한 로그인 및 인증을 제공하는 서비스. 애플, 구글, 페이스북 계정 통합 가능
- **Amazon GuardDuty**: AWS 계정 및 워크로드에서 악의적 활동을 모니터링하고 상세 보안 결과를 제공하는 위협탐지 서비스
- **Amazon Inspector**: EC2, 컨테이너 등에서 소프트웨어 취약성 검색 및 관리
- **Amazon Macie**: AWS 에서 민감한 데이터를 기계학습 및 패턴 일치를 활용해 검색하고 보호

> _**[실전]** 대기업의 관리자가 회사의 **AWS 계정에 대한 암호 화폐 관련 공격(악의적 활동)을 모니터링하고 방지**하고자 할 때,
> **Amazon GuardDuty** 서비스를 활용한다._
> - _GuardDuty 는 탐지 정보를 CloudWatch 등에 제공하고, 관리자는 이를 인지하여 실질적 방어는 별도로 진행하게 됨_

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
**<a href="{{ site.github.url }}/cloud/2023/01/28/aws-certificate01" target="_blank">[이전글]</a>**
