---
title: "[03] AWS Cert DVA-C02"
created: 2023-03-29 18:00:00 +0900
updated: 2023-03-29 22:00:00 +0900
author: namu
categories: cloud
permalink: "/cloud/:year/:month/:day/:title"
image: aws-certified-message.png
image-view: true
image-author: none
image-source: ''
---

---

### 목차

- [CLI 환경 구성하기](#cli-환경-구성하기)
- [IAM 모범 사례](#iam-모범-사례)
- [ELB + ASG](#elb--asg)
- [RDS + Aurora + ElastiCache](#rds--aurora--elasticache)
- [Route53, VPC](#route53-vpc)
- [S3, Athena, CloudFront](#s3-athena-cloudfront)
- [AWS CLI, SDK, IAM 역할 및 정책](#aws-cli-sdk-iam-역할-및-정책)
- [ECS, ECR 및 Fargate - AWS 의 도커](#ecs-ecr-및-fargate---aws-의-도커)
- [Elastic Beanstalk](#elastic-beanstalk)
- [AWS CICD: CodeCommit, CodePipeline, CodeBuild, CodeDeploy](#aws-cicd-codecommit-codepipeline-codebuild-codedeploy)
- [CloudFormation](#cloudformation)
- [CloudWatch, X-Ray 및 CloudTrail](#cloudwatch-x-ray-및-cloudtrail)
- [SQS, SNS 및 Kinesis](#sqs-sns-및-kinesis)
- [서버리스: Lambda, DynamoDB](#서버리스-lambda-dynamodb)
- [서버리스: API Gateway](#서버리스-api-gateway)
- [서버리스: SAM - Serverless Application Model](#서버리스-sam---serverless-application-model)
- [서버리스: Step Functions 및 AppSync](#서버리스-step-functions-및-appsync)
- [CDK, Cognito, 고급 자격 증명](#cdk-cognito-고급-자격-증명)
- [AWS 보안 및 암호화: KMS, 암호화 SDK, SSM 파라미터 스토어, IAM 및 STS](#aws-보안-및-암호화-kms-암호화-sdk-ssm-파라미터-스토어-iam-및-sts)
- [기타 서비스](#기타-서비스)

### 시리즈

- <a href="{{ site.github.url }}/cloud/2023/01/28/aws-certificate01" target="_blank">
[01][AWS 자격증 취득하기] SAA-C03</a>
- <a href="{{ site.github.url }}/cloud/2023/02/24/aws-certificate02" target="_blank">
[02][AWS 자격증 취득하기] SAA-C03</a>
- <a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies" target="_blank">
[01][AWS 퍼블릭클라우드 실습] 용어 정리</a>
- <a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01" target="_blank">
[02][AWS 퍼블릭클라우드 실습] VPC 구축</a>
- <a href="{{ site.github.url }}/cloud/2021/10/17/build-cloud-infra-with-aws02" target="_blank">
[03][AWS 퍼블릭클라우드 실습] EC2 생성</a>

### 참조

- <a href="https://docs.aws.amazon.com/index.html" target="_blank">
AWS documentation</a>
- <a href="https://aws.amazon.com/ko/certification/certified-developer-associate/?c=sec&sec=resources" target="_blank">
AWS Certified Developer - Associate</a>
- <a href="https://www.udemy.com/course/best-aws-certified-developer-associate/" target="_blank">
Udemy 강의(Stephane Maarek): AWS Certified Developer Associate 시험 합격을 위한 모든 것!</a>

---

<br>
## 들어가며

AWS DVA-C02 시험을 준비하며, 핵심 개념 및 실습 예제를 정리했습니다.

<br>
### CLI 환경 구성하기

**AWS Command Line Interface(AWS CLI, 최신 버전 2)** 를 활용하면 **AWS Management Console** 에서 제공하는 것과 동일한 기능을
구현하는 명령을 실행할 수 있습니다.

AWS CLI 를 활용하여 서비스의 기능을 살펴보고 리소스를 관리할 **셸 스크립트를 작성**할 수 있습니다.

다음은 **aws 명령어의 환경설정(_```$ aws configure```_) 값**을 추가하는 예시입니다. (OS 환경에 맞는 AWS CLI 사전 설치 필요)
**AWS IAM 계정** 당 2개까지 생성할 수 있는 **access key 정보**는 **CLI 환경 혹은 프로그래밍 방식의 원격 접근 권한**을 위해 사용됩니다.

```text
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: ENTER
```

이렇게 환경을 구성하면 액세스 키 관련 정보가 **홈 디렉토리의 credentials 설정 파일에 저장**됩니다.
credentials 에는 여러 IAM 계정의 정보가 profile 로 저장될 수 있고,
aws 커맨드 이용 시 기본적으로 **default** 로 설정된 계정의 자격증명을 활용합니다.

**_```$ aws s3 ls --profile [계정명]```_** 와 같이 profile 옵션을 추가하면 지정한 계정의 자격증명을 활용하게 됩니다.

ENTER 로 표시된 **output format 의 기본 형태는 JSON** 입니다.

테스트로 보안 그룹을 생성합니다. 이름은 'my-sg' 입니다.
profile 옵션이 없기 때문에 아래 커맨드는 default 자격 증명을 활용하게 됩니다.

```text
$ aws ec2 create-security-group --group-name my-sg --description "My security group"
{
    "GroupId": "sg-903004f8"
}
```

<br>

> ### AWS STS(Security Token Service) 를 활용하여 임시 자격증명 설정하기
> - **장기 자격증명**: 액세스 키만을 활용해 자격증명을 설정하면 액세스 키를 비활성화하거나 삭제하기 전까지 해당 IAM 계정의 권한을 모두
> 사용할 수 있습니다. 이는 보안상 권장되지 않습니다.
> - **단기(임시) 자격증명**: **만료 기한이 정해진 토큰(STS 활용)**이 적용된 임시 자격증명을 생성해 보안성을 높입니다.
> (**임시 자격증명 Access Key Id + Secret Access Key + Token**)
> 
> 임시 자격증명의 토큰은 **권한 없는 IAM 계정**에 **IAM Role 을 입히는(AssumeRole) 방식**으로 생성됩니다.
> 사전 준비를 위해 IAM 계정에는 STS AssumeRole 권한만 부여하고, IAM Role 에는 필요한 권한의 정책을 부여합니다.
> 
> 1. AWS CLI 에서 권한 없는 IAM 계정의 자격증명을 설정 (STS AssumeRole 권한만 있음)
> 2. **_```$ aws sts assume-role```_** 커맨드를 활용해 임시 자격증명 발급
> 3. 발급된 임시 자격증명의 **AccessKeyId, SecretAccessKey, SessionToken** 를 활용해 CLI 의 새 자격증명 설정
> 4. 필요한 권한에 해당하는 커맨드 request 후 response 확인!

<br>

> ### (권장됨) IAM Identity Center(successor to AWS Singel Sign-On) 을 활용하여 자격증명 설정하기
> AWS Organization 등 여러 회사의 **여러 계정들을 중앙에서 관리**하는 목적 혹은 보다 **중앙집중화된 자격증명 관리**를 위해
> IAM Identity Center 의 SSO 기능을 활용하는 것이 권장됩니다.
> 액세스 키를 활용한 기존의 방법은 **액세스 키 분실 및 유출의 잠재적 가능성을 내포**하기도 합니다.
> 자세한 내용은
> **_<a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html" target="_blank">공식 문서</a>_**를
> 참조하세요.

<br>
### IAM 모범 사례

**IAM(Identity and Access Management)** 은 **AWS 리소스에 대한 액세스를 안전하게 제어할 수 있는 웹 서비스**로
모든 AWS 사용 이전에 반드시 구성해야 합니다.
그룹별, 사용자별, 그리고 역할 및 정책 별로 허용되는 **권한(permission)을 최소한의 영역으로 올바르게 정의하는 것**이 중요합니다.<br>
(참조: <a href="https://www.f5.com/labs/learning-center/what-is-the-principle-of-least-privilege-and-why-is-it-important"
target="">principle of least privilege</a>)

- **(!) AWS IAM 계정 설정 외에 Root 계정을 사용하지 말 것**
- **(!) 실제 사용자 한명 당 하나의 AWS IAM 계정 사용**
- **(!) 모든 IAM User 는 특정 IAM Group 에 할당되고, 모든 권한은 IAM Group 별로 부여**
- **(!) 강력한 Password 정책 사용**
- **(!) 모든 IAM 계정(Root 포함)에 MFA(Multi-Factor Authentication) 사용**
- **(!) AWS 서비스에 권한을 부여하기 위해 IAM Roles(역할) 생성 및 사용**
- **(!) 프로그래밍 방식 액세스를 위해 Accesss Keys 사용 (CLI / SDK)**
- **(!) IAM Credentials Report 를 활용해 IAM 계정들의 전반적인 권한 감사를 실시할 것**
- **(!) IAM 계정을 감사할 때는 IAM Access Advisor 를 활용하여 최근 권한 사용 내역을 확인**
- **(!) 절대 IAM 계정 및 Access Keys 를 공유하지 말 것**

<br>
### ELB + ASG

ELB 를 활용한 로드밸런싱과 ASG 를 활용한 스케일 아웃 구성은 가장 흔하게 사용되는 AWS 인프라 조합 중 하나입니다.

**(1)** **고정 세션(Sticky Sessions, Session Affinity)**

ELB 는 **Sticky Sessions** 기능을 제공하여 **하나의 클라이언트가 하나의 인스턴스와 지속적으로 연결**되도록 합니다.
이 기능은 로그인 세션을 유지하는 등 여러 상황에서 유용합니다.

**Sticky Sessions** 은 HTTP 프로토콜의 **Cookie** 를 활용하여 동작하므로 L7 계층을 사용하는 **ALB**, **CLB** 에서 제공됩니다.

이 기능을 활성화하면 타겟 인스턴스들에 대한 **부하 분산의 불균형을 초래할 가능성이** 있습니다.

**a. Application 기반 Cookie**
- **Application Cookie**: ELB 에서 예약하는 **Cookie Names**
    - **AWSALB**, **AWSALBAPP**, **AWSALBTG**
- **Custom Cookie**
    - Application Cookie 로 **예약된 키워드를 제외**하고 어플리케이션 개발자가 **원하는 쿠키 attributes 지정**할 수 있음
    - 커스텀 쿠키는 **Target Group** 단위로 개별적으로 지정해야 함
    - 쿠키 관리는 어플리케이션 차원에서 이루어짐

**b. Duration 기반 Cookie**: ELB 차원에서 **만료 기한을 지정**하는 Cookie
- Application Cookie 는 Application 에서 duration 을 지정함
- duration 은 **1초 ~ 7일까지** 지정 가능하며 **보통 1일**로 지정함
- 쿠키 이름은 **ALB** 의 경우 **AWSALB**, **CLB** 의 경우 **AWSELB**

**(2)** **교차 영역 로드밸런싱(Cross-Zone Load Balancing)**

보통 AZ 간 데이터 통신에는 일정 비용이 발생하나
ELB 의 **교차 영역 로드밸런싱(Cross-Zone Load Balancing)**을 활용한 트래픽 분산의 경우 종류에 따라 다릅니다.

- **ALB** 는 default enabled 이며 비활성화할 수 없고, AZ 간 통신 비용이 발생하지 않습니다.
- **NLB** 는 default disabled 이며, 활성화 시 AZ 간 통신 비용이 발생합니다.
- **CLB** 는 default disabled 이며, 활성화 시 AZ 간 통신 비용이 발생하지 않습니다.

Cross-Zone 로드밸런싱을 활용하면 각 AZ 에 인스턴스 개수가 다르더라도
**전체 인스턴스를 target 으로 하게 되므로 균형있는 트래픽 분산이 가능**합니다.

**(3)** **SSL 인증서**

클라이언트-서버 간 **HTTPS 프로토콜**을 사용하려면 ELB 에 전송 중 암호화를 위한 **SSL 인증서(X.509 인증서)** 적용이 필요합니다.
이러한 인증서는 사설을 이용할 수도 있지만, **지속적 관리(자동 갱신 등)**를 위해
**AWS ACM(AWS Certificate Manager) 서비스**에서 발급받아 ELB 와 연동합니다.

인증서가 적용된 ELB 에서 HTTPS 요청을 받으면 **SSL Termination** 동작이 수행되고, **ELB 는 내부의 백엔드 서버와 HTTP 통신**을 합니다.
AWS 내부 통신은 암호화되지는 않았지만 AWS 사설망을 사용하므로 비교적 안전합니다.

![AWS SSL Termination](https://media.amazonwebservices.com/blog/elb_ssl_http_1.png)

인증서는 **ELB Listener** 에 적용됩니다.
리스너에는 **default certificate** 외에 **optional list of certs** 추가가 가능합니다.
따라서 한 리스너에서 **여러 형태의 도메인**을 지원할 수 있습니다.

**SNI(Server Name Indication)** 는 ELB 리스너로 하여금 클라이언트에게 호출된 Server Name(도메인) 에 해당하는 인증서에 맞는
타겟 그룹 서버를 각각 지정하여 **여러 인증서-타겟 쌍을 동시에 제공**할 수 있도록 합니다.

다시 말해 **하나의 ELB 에서 여러 HTTPS 도메인 라우팅을 제공**하는 개념으로,
version2 인 **ALB** 와 **NLB** 의 리스너에서만 적용 가능합니다.
(v1 인 **CLB** 는 한 번에 하나의 HTTPS 인증서-타겟 쌍만 지정 가능함)

SNI 의 예를 들자면, domain1.example.com 과 domain2.test.com 두 개의 도메인 인증서와 각각에 대응되는 서버와의 연결을
하나의 ELB 리스너에 등록할 수 있습니다.

보통 레거시 서버와 신규 서버의 동시 제공에서 이 기능이 활용됩니다.

**(4)** **Connection Draining**

**Connection Draining** 은 연결된 타겟 인스턴스가 쿨다운될 때 **기존의 클라이언트 연결은 일정 시간 지속**하면서
**새 트래픽은 라우팅하지 않는** ELB 의 기능입니다.
(CLB 에서는 **Connection Draining**, 2세대 ELB 에서는 **Deregistration Delay** 로 불림)

기존의 클라이언트 연결을 지속하는 이유는 **웹사이트 이용자**의 특정 작업이나 파일 다운로드 등이
de-registering(or temporary unhealty) 되는 인스턴스에 이루어지고 있을 수 있기 때문에 **충분한 마무리 시간을 확보**하기 위함입니다.
이 동안 새로운 트래픽은 해당 인스턴스에 들어가지 않습니다.

Connection Draining time 은 **default 300(s)** 이며, **최대 3600초**까지 설정 가능합니다.
**0으로 설정하면 사용하지 않겠다**는 의미입니다.
서버의 클라이언트 요청 처리에 맞게 **draining 시간을 최소화**하는 것이 성능 면에서 좋습니다.

**(5)** **Auto Scailing Group(ASG)**

오토 스케일링을 위해 사용자는 **최대, 최소 및 원하는 용량의 인스턴스 수를 지정**할 수 있습니다.
ASG 는 어떤 정책(ASG Policy)을 사용하더라도 기본적으로 이 범주를 벗어날 수 없습니다.

또한 ASG 는 **ELB 와 결합**하여 **자동화된 스케일링(Auto Scale Out/In)**을 제공합니다.
따라서 ELB 에 의해 unhealty 상태로 인식된 인스턴스는 ASG 에 의해 교체될 수 있습니다.

**a. ASG 활용을 위한 준비물**
- **Min, Max size and Initial Capacity**
- **Launch Templates(newer of Launch configurations)**
    - AMI+Instance Type and EC2 User Data, EBS Volumns, Security Groups, SSH Key Pair, Network+Subnets Information,
- **Auto Scaling Policies** (with **CloudWatch alarm** optional)
- (option) **IAM Roles** will get assigned to EC2 instances

**b. CloudWatch Alarms**
- ASG 은 **CloudWatch 알람**과 결합하여 **CPU, MEM 평균 사용량(Average Usage, %)** 혹은
**ELB 에서 인스턴스 당 전달되는 요청 수(Number of requests per instance)** 등의 **지표(Metrics)**에 따른 정책을 설정할 수 있음
- **Custom Metric** 을 생성하여 알람을 발생시킬 수도 있음
    - 커스텀 지표는 **애플리케이션에서 PutMetric API 를 호출**하여 CloudWatch 로 전송하는 방식으로 생성(ex. 애플리케이션 연결 사용자 수)

**c. ASG Policy 는 <a href="{{ site.github.url }}/cloud/2023/01/28/aws-certificate01#ec2-관련"
target="_blank">EC2 관련 정리의 (7) Auto Scaling 정책 부분</a>을 참조하세요.**

**d. ASG Cooldown 은 <a href="{{ site.github.url }}/cloud/2023/01/28/aws-certificate01#ec2-관련"
target="_blank">EC2 관련 정리의 (7) Auto Scaling 정책 부분의 조정 휴지(Scaling cooldowns)</a>을 참조하세요.**

**(6)** **ELB + ASG 실습**

먼저 **ELB 를 생성**합니다.

1. AWS 콘솔에서 EC2 페이지의 **Load Balancing > Load Balancers** 탭으로 이동하여 **Create Load Balancer** 클릭
2. **ALB(Application Load Balancer)** 선택 후 **ALB 이름** 입력, **Scheme** 은 **Internet-facing**,
**IP 주소로 IPv4** 선택
3. **Network mapping** 에서 **VPC** 선택 후 **여러 가용 영역의 Subnets 선택 (for Multi AZ)**
4. **Security Groups** 은 **인바운드 인터넷 80 포트 any open 룰**로 적용 (**HTTPS 의 경우 443 포트**)
5. **Listeners and routing** 에서 HTTP, 80 의 리스너 생성 및 **새 타겟 그룹 생성을 위해 Create target group 생성**으로 이동
    - **target type** 은 **instances** 로, **TG 이름 입력**, **HTTP**, **80**, **Protocol Version 은 HTTP1**
    - **Health checks** 에서 **적절한 path** 지정 후 **Traffic port 및 임계값** 지정
    - **Register targets** 에서 인스턴스는 ASG 생성하며 연결할 예정
6. 다시 로드 밸런서 화면으로 돌아와 **생성한 target group 선택**하고 완료

다음으로 **ASG 를 생성**합니다.

1. AWS 콘솔에서 EC2 페이지의 **Auto Scaling > Auto Scaling Groups** 탭으로 이동하여 **Create Auto Scaling Group** 클릭
2. Group Name 입력 후 **Launch Template** 선택
    - **Launch Template 있는 경우 6번**으로 이동
    - 없는 경우 **Create Launch Template** 이동
3. Launch Template 의 **이름 및 description** 입력 후 **시작 AMI, Instance Type** 선택
    - Amazon Linux 2 AMI (HVM) architecture: 64-bit (x86), t2.micro
4. 적절한 **SSH Key pair**, **네트워크(VPC, SG) 설정**, **스토리지(8 GiB, EBS, gp2)** 선택
5. Advanced details 열어서 **User data** 에 초기 스크립트 입력 후 **Create Launch Template**
   ```text
    #!bin/bash
    # for user-data to install and launch httpd (Linux 2 version)
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
    echo "<h1>Hello World from $(hostname -f)</h1>" > /var/www/html/index.html
    ```
6. Auto Scaling Group 화면에서 **Configure settings** 이동하여 인스턴스 구매 옵션을 **Adhere to launch template** 으로 선택
(Launch Template 의 설정에 따른다)
7. Network 에서 **VPC** 선택 후 **여러 가용 영역의 Subnets 선택 (for Multi AZ)**
8. 다음 **Configure advanced options** 에서 **Attach to an existing load balancer** 선택 후
**앞서 생성한 로드밸런서의 Target Group** 선택 (Choose from load balancer target groups)
9. **Health Checks - optional** 에서 **ELB 활성화**, **휴지 기간은 300(s)** 로 지정
    - ELB 에서 health check 실패하면 ASG 에서도 해당 인스턴스 비정상 표시, 교체 작업이 일어남
10. **Configure group size and scaling policies** 에서 그룹 크기를 **Desired: 1, Minimum: 1, Maximum: 1** 으로 지정
11. **Scaling Policies** 에서 **Create Dynamic scaling policy** 이동하여 정책 생성 및 선택
    - **Simple scaling** 은 사전에 생성한 **CloudWatch 지표에서 알람**이 발생하면 **설정한 action 에 맞게(Add, Remove, Set to)**
    스케일링
    - **Step scaling** 은 Simple 과 유사하지만, **여러 CloudWatch 알람**에 따라 **단계적인 조치**가 가능
    (ex. 경보 값이 아주 높은 경우 10 개 인스턴스 ADD, 높지 않은 경우 1 개 인스턴스 ADD)
    - **Target tracking scaling** 은 **Metric type** 에 맞는 **구성 인스턴스 당 백로그 계산 메트릭(지표) 값을 기준**으로 스케일링
    (**Average of CPU utilization / network in(bytes) / network out(bytes), ALB request count per target**)
    - **지금은 Target tracking 의 Average of CPU utilization value 40 로 생성!**
12. **Create Auto Scaling Group** 완료
    - 이후 **Instance scale-in protection**, **Notifications(SNS)**, **Tags** 등 적절히 지정

생성한 ASG 에 들어가면 현재 **인스턴스 런칭 상황**, **모니터링**, **Activity history(액티비티 기록)** 등
여러 상태를 확인할 수 있습니다.

**Group size** 를 종류별로 변경하면서 **인스턴스 런칭 동향을 모니터링**해 봅시다.
(**Disired capacity 는 Maximum capacity 를 초과하지 않도록** 구성)

**Scaling Policy** 의 확인은 **ASG Max size 를 3** 정도로 맞추고 **현재 1개인 인스턴스의 CPU 부하를 늘리는** 방식으로 진행합니다.
- **인스턴스에 SSH 접속해서 다음 커맨드 수행** (refer to Amazon linux 2 stress test)
```text
sudo amazon-linux-extras install epel -y
sudo yum install stress -y
stress -C 4  # stress test with vCPU 4EA
```
- **CPU 사용률이 100% 로 늘어남**에 따라 **ASG 의 Activity 히스토리, 인스턴스 현황, ELB 대상 그룹 등록 여부 및 헬스체크** 등 확인

각 테스트마다 **ELB 를 통한 접속**이 원활히 되는지 확인합니다.

> - **인스턴스가 잘 뜨지 않는 경우 ASG Activity history 를 살펴보고,**
> - **Launch Template 관련 구성들을 확인해봅니다. (User data, VPC Subnets 구성, SG 등)**

<br>
### RDS + Aurora + ElastiCache

**AWS 관리형 서비스**인 **RDS** 를 사용하는 이유는 다음과 같습니다.

- **자동화된 프로비저닝 및 OS 패치**
- **지속적인 백업, 타임스탬프 단위 저장 (Point in Time Restore)**
- **모니터링 대시보드**
- **향상된 읽기 성능을 위한 읽기 전용 복제본**
- **DR(Disaster Recovery) 을 위한 다중 AZ**
- **업그레이드를 위한 유지보수**
- **스케일링 확장성 (vertical and horizontal)**
- **DB 의 스토리지로 EBS 사용 (gp2 or io1)**

RDS 의 백업에는 **자동 백업(활성화)**과 **스냅샷**이 있습니다.

- **자동화된 백업**: ability to restore to any point in time
    - **일(daily) 전체 백업**
    - **5분 간격**으로 저장되는 트랜잭션 로그
    - **기본 7일** 보관, **최대 35일**까지 연장 가능
- **DB Snapshots**: **사용자 지정 백업**. **원하는 시점까지** 보관 가능

DB 에 대한 **사용자 트래픽이 예측 불가능**한 경우, **오토 스케일링 기능**을 활용하면 좋습니다.

- **Storage Auto Scaling**: **지정한 임계치(Maximum Storage Threshold 등)**에 따라
**동적으로 RDS DB 인스턴스 Scale out/in** 수행. **Automatically modify storage if:**
    - **Free storage is less than 10% of allocated storage**
    - **Low-storage lasts at least 5 minutes**
    - **6 hours have passed since last modification**

RDS 의 **읽기 전용 복제본**과 **다중 AZ** 의 **개념을 구분**할 줄 알아야 합니다.

> #### 먼저 알아두기: 동기식(Synchronous) 복제와 비동기식(Asynchronous) 복제의 차이
> 동기식과 비동기식의 차이는 **복제본에 변경된 데이터를 어떻게 적용하는가**에 있습니다.
> (**<a href="https://cloudbasic.net/white-papers/synchronous-vs-asynchronous-replication/"
> target="_blank">참조 링크</a>**)
> - **동기식**: **primary 에 write 되는 동시에 replica 에도 적용**되므로 **항상 동기화**되어 있음
> - **비동기식**: **primary 에 write 된 이후에 replica 에 적용**. 거의 실시간으로 보일 수 있으나, **기본적으로 스케줄에 따라(batch)
> 복제되는 개념**이라는 점에서 동기식과는 차이가 있음
> - 따라서 **동기식은 LAN 수준의 대역폭이 필요**하고, **비동기식은 WAN 망** 수준에서도 구성 가능함
> - **동기식의 이점**: **거의 즉각적인 장애 조치가 가능**해 **애플리케이션 중단이 거의 또는 전혀 발생하지 않음**
> - **비동기식의 이점**: **실시간 동기화까지 요구되지 않**아 약간의 연결 저하를 허용하는 환경이나
> **원본과 복제본 서버 간의 물리적 거리가 먼** 경우

- **읽기 전용 복제본(비동기식)**: **읽기 트래픽의 분산 목적! 원본 DB 의 부하를 줄이는 목적!**<br>(참조: _**<a
href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"
target="_blank">Working with DB instance read replicas</a>**_)
    - **최대 5개까지 생성**
    - **세 가지 옵션**: **Within AZ, Cross AZ or Cross Region**
    - **다른 AZ 로의 데이터 전송은 비용이 발생**하지만,
    **RDS Read Replication** 은 **관리형 서비스**이기 때문에 **비용이 발생하지 않음(같은 리전인 경우)**
    - **읽기 전용 인스턴스 및 엔드포인트**를 생성하여 **어플리케이션의 Read 트래픽이 이것을 바라보도록** 함
    - 읽기 전용 인스턴스의 생성은 **원본(primary) DB 의 스냅샷**을 만들어 **새 인스턴스를 시작**하는 방식
    - 복제본은 **비동기식(ASYNC)**으로 생성되기 때문에 **읽기가 일관적으로 유지**됨<br> >> 이 말은 **primary DB 가 update** 되면
    **DB 엔진의 비동기식 복제 기능(method)**을 활용하여 **Read Replica 도 update 된다**는 의미.
    (Asynchronous replication method 는 RDS 에서 런칭 가능한 Oracle, MySQL, PostgreSQL 등 엔진에서 제공하는 기능)
    - **재해 복구**와 같은 상황에서 **Read Replica 를 primary DB 로 승격**시킬 수 있음.
    별개의 새 메인 인스턴스를 생성하는 **비동기식 복구** 방식이기 때문에 동기식 자동복구에 비해 보조적이지만, 시도할만 한 옵션임.
    이 때는 **DB 인스턴스가 재부팅**되고, 승격된 DB 인스턴스에 대한 **어플리케이션의 연결을 재설정**해야 함.
    또한 새 인스턴스에 대한 **읽기 전용 복제본으로 새로 생성**함
- **다중 AZ(동기식)**: **주 목적은 높은 가용성과 내구성!!(60초 이내 자동 Disaster Recovery)**<br>(참조: _**<a
href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"
target="_blank">Working with DB instance read replicas</a>**_)
    - **특정 AZ 에 있는 Master DB instance 로부터 다른 AZ 에 standby instance 복제**
    - **동기식(SYNC) 복제이므로 항상 최신화된 데이터 유지**
    - 읽기 전용 복제본을 승격시키는 과정과는 달리 **다중 AZ 의 장애 조치(failover)는 실시간으로 자동**으로 이루어짐
    - 다중 AZ 를 위해 생성된 **standby instance 는 scaling 을 위해 사용되지 않고 오직 대기 목적으로만** 존재
    ![AWS RDS Multi AZ](
    https://d1.awsstatic.com/product-page-diagram_MAZ_HIW%402xa.245de181144d709479981ab02a5318165b7ed8a9.png)

> _**[실전]** **재해 복구의 목적으로 읽기 전용 복제본을 다중 AZ 용도로 셋업할 수 있습니다!** 시험에서는 둘의 개념과 차이점을
> 분명히 이해하고 있어야 합니다._

> _**[실전]** **단일 AZ(Single AZ) 에서 다중 AZ(Multi AZ) 로의 전환**은 **DB 의 중지 없이 가능**합니다.
> 이것은 콘솔에서 **활성화 설정**하면 자동으로 이루어지며, **내부적으로는 마스터 인스턴스에서 스냅샷이 생성 후 스탠바이가 구성된 다음
> 마스터와 동기식으로 연결**됩니다._

<br>
### Route53, VPC

haha

<br>
### S3, Athena, CloudFront

haha

<br>
### AWS CLI, SDK, IAM 역할 및 정책

haha

<br>
### ECS, ECR 및 Fargate - AWS 의 도커

Amazon 에서 **도커 컨테이너**는 **ECS 클러스터(Elastic Container Service)**를 통해 구성됩니다.
ECS 클러스터 내에서 **ECS 서비스(Tasks)** 가 실행되는 구조입니다.

**(1)** **ECS 클러스터를 구성하는 방식**으로 **용량 공급자(Capacity Provider)**를 활용하게 되는데, Capacity Provider 에는 
**EC2 인스턴스 Launch Type(컨테이너를 띄울 개별 인스턴스를 직접 구성)**과 **AWS Fargate(Serverless service)**가 있습니다.
완전 관리형인 Fargate 를 이용하면 클러스터 내 가상 머신 구성을 프로비저닝하거나 수동으로 관리할 필요가 없습니다.

- **EC2 Launch Type**: 시작 유형으로 **인스턴스 직접 구성을 선택**하는 경우
    - 프로비저닝된 EC2 인스턴스에서 **ECS Agent** 를 설치/실행하여 Amazon ECS 서비스 및 ECS 클러스터에 해당 인스턴스를 등록
    - 이후 **ECS Task** 에 의해 각 인스턴스에서 컨테이너가 적절히 관리됨(starting / stopping)
- **AWS Fargate**: 시작 유형으로 **Fargate 를 선택**하는 경우
    - **서버리스로 자동 관리**되므로 Infrastructure 를 프로비저닝할 필요 없이 알아서 컨테이너를 배치함 (시험에 자주 등장)
    - 이 때는 **ECS Tasks** 만 정의! (CPU / RAM 등 지정)

**(2)** ECS 에서의 도커 이미지는 공식 사이트인 **<a href="https://hub.docker.com" target="_blank">도커 허브</a>** 혹은
도커 이미지 레지스트리 서비스인 **AWS ECR(Elastic Container Registry)** 로부터 가져옵니다. (혹은 기타 도커 레지스트리 서버)

**(3)** ECS 서비스에서 각종 액션 및 컨테이너 작업을 수행하기 위해 **EC2 Instance Profile** 과 **ECS Task Role** 이 사용됩니다.

- **EC2 Instance Profile**: **ECS Agent 에 의해 인스턴스를 식별**하는 용도로 사용됨
    - Profile 을 이용하여 **ECS API calls**, **Send container logs to CloudWatch Logs**, **Pull docker image from ECR**,
    **Secrets Manager or Parameter Store 로부터 민감 데이터 참조(로그인)** 등의 액션 수행
    - 특정 인스턴스를 ECS Agent 를 활용해 직접 컨트롤하는 개념이므로 **Profile 은 EC2 Launch Type (직접 구성 방식) 에서만 사용**됨
- **ECS Task Role**: **정의된 ECS Tasks 별 Role 부여**
    - 예를 들어 하나의 인스턴스 내에서 **S3 접속용 / DynamoDB 접속용 작업(Task) 두개에 해당하는 컨테이너를 각각 run** 할 수 있음
    - **Tasks 별 역할 지정이므로 직접 구성 방식 및 Fargate 모두에서 사용**됨

**S3 접속용 컨테이너를 직접 구성 방식으로 기동하는 시나리오**를 예로 들자면,
**도커 이미지를 Pull 하는 용도로 EC2 Instance Profile 을 사용**하고 **S3 접속 권한을 획득하기 위해 ECS Task Role 이 사용**됩니다.

**(4)** HTTP 및 HTTPS request 수용 시 **ELB 통합을 위해서는 ECS Tasks 가 활용**되며, **ELB(ALB 권장)**는 트래픽을
각 Tasks 에 적절하게 분산합니다. **NLB** 는 **높은 처리량(throughput)** 및 **고성능(high performance)** 을 요하는 상황에서
활용되며 legacy 버전 **CLB 는 연결은 가능하지만 호환성이 부족하여 권장되지 않습**니다.

**(5)** **Amazon ECS 에서의 데이터 지속성**을 위해 **Amazon EFS** 를 **각 ECS Tasks 에 마운트**하는 경우가 있습니다.
여러 Tasks(인스턴스, Fargate, 컨테이너)에서 **일관성 있는 데이터를 공유**하기 위함입니다.

이 때 **EFS 는 EC2 직접 구성 및 Fargate launch types 모든 상황에서 호환**되고, **ECS Tasks 에 직접 마운트**됩니다.
S3 는 여러 AZ 공유가 가능한 저장소이기는 하지만 특성상 ECS Tasks 에 마운트될 수 없습니다.

> AWS 에서는 사용자가 직접 컨트롤하기보다는 **Fargate + EFS** 의 **Serverless 조합이 권장**됩니다.

**(6)** ECS 서비스의 실행은 **ECS 클러스터를 생성**하고, **ECS 서비스(Tasks)를 정의**하는 과정으로 이루어집니다.

- **ECS 클러스터 생성**: **네트워킹**, **인프라 Capacity Provider(Fargate 서버리스, EC2 인스턴스 Launch Type)** 설정
    - 용량 공급자로 **EC2 인스턴스 Launch Type** 을 선택한 경우, **ASG 스펙을 지정하여 클러스터 내 EC2 인스턴스를 수동 조정**
    - ASG 스펙으로 OS/아키텍쳐 및 Min/Max 인스턴스 개수, 인스턴스 타입 설정
- **ECS 서비스(Tasks) 정의**: 하나의 전체적인 서비스 구성을 위한 Task 정의
    - Task 에 필요한 **여러 Docker Container 를 지정**할 수 있음. 각 컨테이너 별 네트워크 통신에 필요한 **Port 정의**
    - 구성하는 Task 에서 사용할 **용량 공급자**(클러스터 생성 시 사전 정의), **OS 시스템 및 CPU/Mem 사이즈**,
    **Task Role**(Role 은 S3, DynamoDB 등 필요시), **스토리지**(Fargate 로부터 기본 20GiB 부여) 지정
    - **Task 가 배포되는 인스턴스에 적용할 Security Group** 적용(HTTP 80, HTTPS 443 등)
- **ECS 서비스(Task) 배포**: ECS 클러스터로 돌아가서, Task 기반으로 배포를 실행
    - 사용할 **Task 를 지정**(Family)하고 **배포할 서비스명**을 입력, **실행할 Task 개수**를 지정
    - 예를 들어 Task 개수를 3개로 하면 동일한 컨테이너 구성의 태스크를 3개 서비스함
    - **로드밸런서로 ALB 생성**하도록 지정 (Create or Use existing ALB)

배포까지 마치게 되면 ALB 생성에서부터 Task 실행으로 서비스 제공이 원활히 이루어지는지 확인합니다.

실습을 위해 **<a href="https://hub.docker.com/r/nginxdemos/hello/" target="_blank">nginxdemos/hello</a>**
도커 이미지를 사용해 봅시다.

> **트래픽이 많아**진다면 배포 옵션에서 **Task 개수** 늘려서 수용량을 조정할 수도 있습니다.(**그만큼 비용 발생**) 
> 
> 이 때, **Capacity Provider** 로 **Fargate 서버리스**를 이용한다면 별도의 수동 프로비저닝 없이 자동으로 인프라가 관리되며,
> 배포 시 생성(혹은 사용)했던 **ALB 는 새로 늘어난 Task 로 트래픽을 분산**시킵니다.
> 
> **태스트 개수를 0**으로 바꾸면 **모든 태스크가 종료**됩니다. 이렇게 **배포 설정은 유지하면서 서비스는 꺼둘 수** 있습니다.

**(7)** 배포된 **ECS Task 의 desired number** 를 **Auto Scaling 으로 자동 조절**할 수 있습니다.

여기에서도 **기존의 ASG** 와 같이 **ALB 의 CPU/Mem/ALB request count per target 지표(metric) 기준**으로 **Scale out/in** 이
이루어지며 **스케일링 방식**도 **Tartet/Step/Scheduled** 등 동일하게 적용 가능합니다.

다만, ECS 클러스터 내 **Task 대상의 스케일링**인 만큼 기존의 **EC2 인스턴스 대상 스케일링과는 다르다는 점**을 꼭 기억하시기 바랍니다.

> #### _ECS Deployment > Fargate + Task Auto Scaling 구성_
> EC2 인스턴스 인프라 프로비저닝을 수동으로 관리하지 않고 배포된 Task 의 개수가 트래픽에 따라 자동으로 조정되도록
> **Fargate + Task Auto Scaling** 으로 **ECS 클러스터 Deploy 를 구성하는 것이 권장**됩니다.
> 서버리스 구성이라 관리도 굉장히 수월해집니다.

**(8)** **ECS Rolling Updates** 는 **태스크 버전 업데이트를 서비스 중단 없이 수행**할 수 있도록 하는 전략입니다.

예를 들어 **Min 50%, Max 100%** 설정이고 **Starting number of tasks 가 4**인 경우,
**절반인 2개 Tasks 를 다음 버전으로 재배포**하고 **다시 100%가 되면 나머지 절반 Tasks 를 버전 업데이트**하는 방식입니다.

![ECS Rolling Updates from
rubygarage.github.io/slides/aws/ecs#/](https://rubygarage.github.io/assets/images/aws/ecs/rolling_update.png)

또는 **Min 100%, Max 150%** 설정인 경우 **현재 4개에서 절반인 2개 추가 Tasks 를 생성**하고 나머지도 업데이트하는 방식으로 진행됩니다.

**(9)** **몇 가지 실제적인 ECS 솔루션 아키텍쳐**를 살펴봅시다.

1. **(Serverless) S3 이미지 업로드 시 ECS 기반 특정 이미지 처리 프로세스 실행**
    - S3 버킷에 이미지가 업로드되면 S3 Event 를 통해 Amazon EventBridge 가 트리거되고,
    - EventBridge 에서는 사전에 정의된 ECS Task 를 실행시키는 Rule 이 실행됨
    - 실행된 ECS Task 는 Fargate 용량 공급자 환경에서 구성되고, 여기에는 S3 및 DynamoDB 접근용 Task Role 이 적용됨
    - Task 는 S3 버킷 내 업로드된 이미지를 가져와 지정 작업을 수행한 후 DynamoDB 에 결과를 저장한 뒤 완료
2. **(Serverless) 한 시간마다 S3 버킷에 대해 배치작업 수행**
    - 한 시간마다 트리거되는 Amazon EventBridge Rule 을 생성
    - Rule 은 트리거마다 사전에 정의된 ECS Task 를 실행 (Fargate, S3 access Role)
    - 실행된 ECS Task 는 S3 에 접근하여 지정 작업 수행 (한 시간마다 S3 파일에 대해 배치Batch 프로세싱)
3. **(Serverless) ECS Service Auto Scaling 활용 큐 메시지 폴링**
    - SQS Queue 메시지를 폴링하는 ECS Task 서비스 생성
    - Task 배포 시 ECS Service Auto Scaling 적용하여 SQS 대기열에 메시지가 많으면 자동으로 Task 추가하도록 구성

<br>
### Elastic Beanstalk

haha

<br>
### AWS CICD: CodeCommit, CodePipeline, CodeBuild, CodeDeploy

haha

<br>
### CloudFormation

haha

<br>
### CloudWatch, X-Ray 및 CloudTrail

haha

<br>
### SQS, SNS 및 Kinesis

haha

<br>
### 서버리스: Lambda, DynamoDB

haha

<br>
### 서버리스: API Gateway

haha

<br>
### 서버리스: SAM - Serverless Application Model

haha

<br>
### 서버리스: Step Functions 및 AppSync

haha

<br>
### CDK, Cognito, 고급 자격 증명

haha

<br>
### AWS 보안 및 암호화: KMS, 암호화 SDK, SSM 파라미터 스토어, IAM 및 STS

haha

<br>
### 기타 서비스

haha
haha
