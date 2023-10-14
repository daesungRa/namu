---
title: "Audit Logging in Amazon Databases"
created: 2023-10-07 14:00:00 +0900
updated: 2023-10-14 14:29:00 +0900
author: namu
categories: cloud
permalink: "/cloud/:year/:month/:day/:title"
image: https://www.pullrequest.com/blog/aws-cloudwatch-vs-cloudtrail-whats-the-difference/images/difference-between-aws-cloudwatch-and-cloudtrail.jpg
image-view: true
image-author: catalinmpit
image-source: https://www.pullrequest.com/blog/aws-cloudwatch-vs-cloudtrail-whats-the-difference/
---

---

### 목차

- [CloudWatch 와 CloudTrail 의 용도별 차이점](#cloudwatch-와-cloudtrail-의-용도별-차이점)
- [Database Audit Logging](#database-audit-logging)

### 참조

- <a href="https://www.novelvista.com/blogs/cloud-and-aws/cloudwatch-vs-cloudtrail-a-detailed-comparison" 
target="_blank">CloudWatch VS CloudTrail a detailed comparison</a>
- <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html" 
target="_blank">Working with log groups and log streams</a>
- <a href="https://aws.amazon.com/ko/blogs/database/configuring-an-audit-log-to-capture-database-activities-for-amazon-rds-for-mysql-and-amazon-aurora-with-mysql-compatibility/" 
target="_blank">Configuring an audit log</a>

---

<br>
## 들어가며

**Amazon 데이터베이스 서비스**의 **audit logging 및 monitoring 방법**을 설명합니다.<br>
AWS 에서 기본적으로 감사 로깅은 **Amazone CloudWatch** 와 **Amazon CloudTrail** 서비스를 통해 이루어집니다.

여기서 데이터베이스 인스턴스 리소스에 발생하는 행위(CRUD) 감사에는
**cloudWatch log groups 및 log streams** 가 사용되고 AWS 계정 행위(권한부여, 보안 등) 감사에는
**CloudTrail 추적(trail) (+ Amazon Athena)** 사용된다고 이해하면 됩니다.

**본 포스트에서는 데이터베이스 행위 관점**에서 설명하겠습니다. 대상은 **Amazon RDS** 와 **Amazon DocumentDB** 입니다.

<br>
### CloudWatch 와 CloudTrail 의 용도별 차이점

가볍게 두 서비스 간의 차이점을 짚고 넘어가겠습니다.

**CloudWatch** 는 **어플리케이션 리소스의 운영상 데이터, 성능 메트릭(지표), 이벤트 등을 수집하여 뷰를 제공하고 이상 현상을
모니터링**합니다. 대표적으로 CPU/MEM/Requests per sec or min 에 대한 정보가 있으며 커스터마이징을 통해 복합적인 뷰를 구성할
수도 있습니다. 이를 통해 시스템 위험 조기 발견, 긴급 대응 및 서비스 성능 최적화가 가능합니다.

**Amazon Databases 모니터링**과 관련해서 CloudWatch 는 DB 리소스 자체의 로그 데이터를 수집하여 뷰를 제공할 수 있는데,
이는 **log groups 및 log streams** 로 할 수 있습니다. (모니터링이 되는 다른 리소스에 대해서도 가능함)

![Amazon CloudWatch](https://d1.awsstatic.com/reInvent/reinvent-2022/cloudwatch/Product-Page-Diagram_Amazon-CloudWatch.
095eb618193be7422d2d34e3abd5fdf178b6c0e2.png)

**CloudTrail** 서비스는 **AWS 계정의 거버넌스, 컴플라이언스(규정 준수), 운영 감사, 보안위험 감사**를 위해 사용됩니다.
따라서 AWS Management Console, AWS SDKs, command-line tools 등을 통한 계정, 서비스 인프라 관련 행위 로그나 이벤트 뷰를
제공합니다.

**Amazon Databases 서비스** 관련해서 CloudTrail 은 DB 자체의 로그나 기록을 알 수는 없고
생성된 서비스 **인스턴스 자원에 대한 특정 계정의 접근권한 변경, 타입 변경, 보안수준 변경 등에 대한 히스토리**를 제공합니다.
당연히 이러한 것들은 AWS 콘솔, SDK, 커맨드 라인 통해 이루어진 행위입니다.

![Amazon CloudTrail](https://d1.awsstatic.com/product-marketing/CloudTrail/product-page-diagram_AWS-CloudTrail_HIW.
feb63815c1869399371b4b9cc1ae00e78ed9e67f.png)

따라서 **감사(Audit) 로깅 관점**에서 **CloudTrail** 은 **AWS 계정의 행위**를,
**CloudWatch** 는 **AWS 인프라 자원 및 서비스 내 행위**를 기록한다고 이해하면 좋습니다.

<br>
### Database Audit Logging

AWS 의 데이터베이스 행위 감사를 위해서 **CLoudWatch log groups** 생성해야 합니다.
로그 그룹을 직접 생성하기보다는 **콘솔의 각 데이터베이스 인스턴스, 클러스터 설정에서 감사 로그를 전송하는 방식**으로 진행합니다.

1. **감사 로그 전송 설정이 되어있는 옵션 그룹(파라미터 그룹) 생성**
     - AWS 콘솔에서 **RDS(DocumentDB) 이동 > Option groups(Parameter groups) 이동 > Create group(Create) 클릭**
     - 그룹명, 설명, DB 엔진(클러스터 패밀리), 버전 등 필요정보 입력 후 생성 (* default 그룹은 수정이 불가)
     - **감사 로그 전송 설정 추가**
         - **(RDS, mariadb)** 생성된 옵션 그룹에서 Add option 클릭하여 **MARIADB_AUDIT_PLUGIN** 의 **SERVER_AUDIT_EVENTS**
         설정값에 **QUERY**, **QUERY_DDL** 등 필요한 설정 추가
         - **(DocumentDB)** 생성된 파라미터 그룹에 들어가 **'audit_logs'** 설정값을 **disabled** 에서
         **활성화로 변경 (all, ddl, enabled 등)**
         - **Apply immediately** 지정 후 완료
2. **생성한 옵션 그룹(파라미터 그룹)을 인스턴스(클러스터)에 지정**
    - RDS(DocumentDB) 콘솔에서 **새 인스턴스(클러스터) 생성하거나 기존것 선택하여 수정**하기
        - **(생성 시)** 맞는 버전의 Database Engine options 을 선택하고, Database(Cluster) options 부분에서
        **위에 생성한 옵션(파라미터) group으로 Option(Cluster parameter) group 지정** 후 **Create database(cluster)**
        - **(수정 시)** 설정 중 Database(Cluster) options 부분에서 **위에 생성한 옵션(파라미터) group으로
        Option(Cluster parameter) group 지정** 후 **Apply immediately** 선택하고 **Modify DB Instance(cluster)**
3. **로그 그룹 스트림 확인하기**
    - **CloudWatch** 콘솔에서 **Logs > Log groups** 이동
    - RDS 데이터베이스 혹은 DocumentDB 클러스터 **이름에 해당하는 audit 로그 그룹이 생성되었는지 확인**
        - **(RDS 예시) /aws/rds/[DB name]/audit**
        - **(DocDB 예시) /aws/docdb/[Cluster name]/audit**
        - **만약 로그 그룹이 생성되지 않았다면 해당 데이터베이스(클러스터) 재시작 후 기다려보기**
    - 생성된 **audit 로그 그룹으로 이동 > Log streams 에서 이름에 해당하는 스트림** 클릭, 확인

> #### Log streams 예시(행위, authenticate)
> 
> ```json
> 2023-10-06T13:37:46.773+09:00     {"atype":"authenticate","ts":16965***,...}
> {
>     "atype": "authenticate",
>     "ts": 1696567066773,
>     "remote_ip": "10.**.**.**:51**",
>     "user": "",
>     "param": {
>         "user": "**admin",
>         "mechanism": "SCRAM-SHA-1",
>         "success": true,
>         "message": "",
>         "error": 0
>     }
> }
> ```
> 







