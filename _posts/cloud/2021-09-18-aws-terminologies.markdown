---
title:  "[AWS 퍼블릭클라우드] 용어 정리"
created:   2021-09-17 17:00:00 +0900
updated:   2021-09-17 17:00:00 +0900
author: namu
categories: cloud
permalink: "/cloud/:year/:month/:day/:title"
image: https://www.whizlabs.com/blog/wp-content/uploads/2019/12/AWS_Cheat_Sheet.png
alt: aws terminologies cheat sheet
image-view: true
image-author: By Pavan Gumaste in whizlabs
image-source: https://www.whizlabs.com/blog/aws-cheat-sheet/
---


---

### 목차

1. [VPC](#vpc)
    - [Region](#region), [Availability Zone](#availability-zone),
    [Virtual Private Cloud(VPC)](#virtual-private-cloud-vpc), [VPC subnet](#vpc-subnet), [Route table](#route-table),
    [Internet Gateway (IGW)](#internet-gateway-igw), [NAT Gateway (NAT)](#nat-gateway-nat),
    [VPC endpoint](#vpc-endpoint), [Access Control List (ACL)](#access-control-list-acl),
    [Security Group (SG)](#security-group-sg)
2. [EC2](#ec2)
    - [Elastic Compute Cloud (EC2)](#elastic-compute-cloud-ec2), [Elastic Ip Address (EIP)](#elastic-ip-address-eip),
    [Elastic Load Balancer (ELB)](#elastic-load-balancer-elb), [Amazon Machine Image (AMI)](#amazon-machine-image-ami),
    [Amazon Elastic Block Storage (EBS)](#amazon-elastic-block-storage-ebs)
3. [ETC](#etc)
    - [Relational Database Service (RDS)](#relational-database-service-rds),
    [Simple Storage Service (S3)](#simple-storage-service-s3),
    [AWS Identity and Access Management (IAM)](#aws-identity-and-access-management-iam), [](#), [](#)

### 시리즈

- <a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01" target="_blank">
[AWS 퍼블릭클라우드 실습 01] VPC 구축</a>
- <a href="{{ site.github.url }}/cloud/2021/10/17/build-cloud-infra-with-aws02" target="_blank">
[AWS 퍼블릭클라우드 실습 02] EC2 생성</a>

### 참조

- <a href="https://docs.aws.amazon.com/general/latest/gr/glos-chap.html" target="_blank">AWS 레퍼런스 가이드</a>
- <a href="https://www.whizlabs.com/blog/aws-cheat-sheet/" target="_blank">AWS cheat sheet by Pavan Gumaste</a>

---

<br>
## 들어가며

AWS 의 용어를 총정리합니다.

처음 접하는 용어가 있다면 눈에 익히는 정도로만 가볍게 살펴보기 바랍니다.
이후 구축 단계를 따라가며 실용적으로 이해할 수 있을 것입니다.

- 참조: <a href="https://docs.aws.amazon.com/general/latest/gr/glos-chap.html" target="_blank">AWS 레퍼런스 가이드</a>

<br>
## VPC

### Region

지역적으로 동일한 영역에 속한 AWS 자원들을 의미합니다.

예를 들어 ```ap-northeast-2``` 리전은 대한민국 서울을 의미합니다.

또한 하나의 리전은 둘 이상의 [가용 영역](#availability-zone)(Availability Zone)으로 구성됩니다.

만약 호스팅하고자 하는 서비스의 대상 지역이 대한민국이라면, 서울 리전에 인프라를 구축하는 것이 물리적으로 좋습니다.

### Availability Zone

**리전 내 (물리적으로) 구별된 영역**으로써, 다른 가용 영역의 오류로부터 격리되어 있는 것이 특징입니다.
그리고 동일 리전 내 다른 가용 영역에 대한 저렴하고 지연이 적은 네트워크 연결성을 제공합니다.

보통 ```가용 영역a```, ```가용 영역b```, ```가용 영역c``` 와 같은 방식으로 사용자에게 제공되는데,
같은 a 영역이라 하더라도 실제 물리적 공간은 다를 수 있습니다.
이는 특정 가용 영역에 사용자들이 몰리는 것을 방지하기 위함과 동시에 물리적 자원에 대한 보안 목적도 있습니다.

### Virtual Private Cloud (VPC)

보안성 높은 클라우드 인프라 구축 시 가장 기본이 되는 개념으로써,
용어 그대로 **가상 사설망이 클라우드 네트워크에 구축되어 있는 것**으로 이해할 수 있습니다.

VPC 서비스를 통해 논리적으로 격리된 사설 네트워크를 손쉽게 제공 받을 수 있어 on-premise 인프라 구조에 비해 비용이 획기적으로 절감됩니다.

### VPC subnet

네트워크 계층에서 인터넷 프로토콜의 IP 대역은 크게 8bit 단위
```A class```, ```B class```, ```C class and D class``` 정도로 나눠집니다(총 32bit).
**CIDR 블록은 IP 대역을 이러한 클래스에 구애받지 않고 다양한 범주로 나누도록** 합니다.

그 기준은 bit 단위로 표현되는 서브넷 마스크이며, 이것을 통해 대상 IP 주소가 CIDR 대역에 속해있는지 여부를 판단할 수 있습니다.

예를 들어, ```10.20.110.20``` 주소는 ```10.20.110.0/28``` 대역에는 속해있지 않고, ```10.20.110.16/28``` 대역에 속해 있습니다.

VPC 내에서 **CIDR 서브넷**을 나누는 이유는 여러 용도에 따라 Public 및 Private 대역을 지정하고,
각 리소스에 IP 자원을 유연하고 명확하게 할당하기 위함입니다.

보통 CIDR 대역내 5개 자원은 다음의 역할로 예약되어 있습니다.

```text
- 0번 자원: 서브넷 네트워크 주소
- 1번 자원: (AWS) VPC 라우터용
- 2번 자원: (AWS) DNS 서버
- 3번 자원: (AWS) aws 예약
- 마지막 자원: 네트워크 브로드캐스트 주소
```

### Route table

라우트 테이블을 통해 각 서브넷마다 **트래픽이 어느 곳으로 라우팅될지 설정**합니다.

예를 들어, ```10.20.110.0/24``` 퍼블릭 서브넷에 ```0.0.0.0/0``` 규칙이 설정된 라우트 테이블이 적용되어 있다면
해당 서브넷에서는 외부인터넷과 통신이 가능합니다. 이 경우, 해당 규칙에 [인터넷 게이트웨이](#internet-gateway-igw)(IGW)를 부착합니다.

### Internet Gateway (IGW)

외부 인터넷과의 연결을 위한 게이트웨이입니다.
주로 인터넷 연결을 위한 [라우트 테이블](#route-table) 규칙에 부착되어 VPC 외부의 지정된 IP 주소와 통신이 가능하게 합니다.

하나의 VPC 에는 하나의 IGW 만 부착 가능합니다.

### NAT Gateway (NAT)

NAT(Network Address Translation) 는 전송되는 네트워크 패킷의 IP 헤더 정보를 변환함으로써 **사설망에 있는 여러 로컬 호스트의 요청이
하나의 public 리퀘스트로 나가도록 하는 기술**입니다.
사설망의 private 주소들은 사실 해당 대역 내의 로컬 호스트끼리만 사용되지 보통의 인터넷 영역에서는 유효하지 않지만,
공공의 IPv4 자원이 부족하기 때문에 public IP 하나 당 여러 private 호스트를 구성하는 식으로 사설 네트워크가 구축됩니다.

VPC 의 NAT 게이트웨이도 마찬가지로 private 인스턴스(호스트)로부터 외부 인터넷으로의 통신이 목적입니다.
따라서 public IP 격인 EIP 하나를 붙여 생성하게 되며, 인바운드 트래픽은 불가합니다.

**NAT 는 주로 인터넷 연결이 불가능한 프라이빗 서브넷의 인스턴스에서 패키지 다운로드 등의 목적으로 특정 외부 도메인에 접근하기 위해 이용**됩니다.
이 때는 퍼블릭 서브넷의 NAT 게이트웨이를 프라이빗 [라우트 테이블](#security-group-sg) 규칙에 추가하게 되며,
아울러 해당되는 프라이빗 [보안 그룹](#security-group-sg)의 outbound 에
443, 80 any open 규칙(혹은 접속하고자 하는 타겟 목적지의 주소)을 적용해야 합니다.

NAT 게이트웨이에서 주의할 부분은 비용 이슈입니다.
보통은 여기에 [탄력적 IP](#elastic-ip-address-eip)(EIP, 공인 IP)가 할당되어 이에 대한 비용이 청구되고,
프라이빗 인스턴스에서 외부 인터넷 연결 트래픽에 대한 추가적인 비용이 발생합니다.

### VPC endpoint

해석하자면 VPC 종단점입니다.
**VPC 와 다른 AWS 서비스 간 private connection 을 구성**하기 위해 사용됩니다.
원래 VPC 외부의 도메인 및 서비스로의 접근은 인터넷 연결을 필요로 하지만,
VPC 엔드포인트를 활용하면 이러한 액세스 설정 없이 바로 연결이 가능합니다.

예를 들어, private 인스턴스에서 S3 버킷에 접근할 때 인터넷망을 통해 퍼블릭 도메인을 이용할 수도 있지만
VPC 엔드포인트를 활용해 인터넷 연결 설정 없이 직접적으로 접근할 수 있습니다.

이것 또한 별도의 비용이 발생합니다.

### Access Control List (ACL)

[보안 그룹](#security-group-sg)이 허용 목록만을 관리하는 것과 달리, **ACL 은 허용 및 거부(deny) 목록을 관리**합니다.
따라서 보다 상세하고 유연하게 액세스 리소스가 관리됩니다.

규칙은 Inbound, Outbound 로 나눠지며, 상위 규칙에서부터 하위 규칙 순으로 규칙 번호 단위로 (오름차순) 지정됩니다.
규칙 번호는 100, 200, 300 등 숫자 100 단위인데, 이유는 나중에 보다 상세한 규칙이 추가될 경우를 대비하기 위함입니다.

ACL 은 서브넷에 적용됩니다.

### Security Group (SG)

보안 그룹은 일종의 **화이트리스트 방화벽**입니다.
따라서 특정 타겟 리소스에 어떤 수준의 In/Out bound 규칙을 적용할지 결정하게 됩니다.

보통 SG 룰은 [EC2](#elastic-compute-cloud-ec2) 인스턴스 자원에 적용되고,
[VPC endpoint](#vpc-endpoint), [Load Balancer](#elastic-load-balancer-elb)(ELB) 등에도 적용 가능합니다.

<br>
## EC2

### Elastic Compute Cloud (EC2)

- Auto Scaling
- Billings
    - Spot Instances
    - Savings Plan

### Elastic Ip Address (EIP)

### Elastic Load Balancer (ELB)

### Amazon Machine Image (AMI)

기본적인 OS 및 스토리지, 어플리케이션 등을 포함한 **가상 PC 이미지**입니다.
따라서 적절한 AMI 를 선택해 손쉽게 [EC2](#elastic-compute-cloud-ec2) 인스턴스를 생성할 수 있습니다.

또한 나만의 커스터마이징된 이미지를 생성해 저장하고, 그것을 마켓 플레이스에 올릴 수도 있습니다.

aws docs 의 설명은 다음과 같습니다.

> [EBS](#amazon-elastic-block-storage-ebs) 또는 [S3](#simple-storage-service-s3) 에 저장되어 있는 암호화된 머신 이미지입니다.
> 일반적인 컴퓨터의 root drive 템플릿과 유사하며, 여기에는 OS, 데이터베이스 서버, 미들웨어 및 웹 서버와 같은
> 애플리케이션의 계층 및 소프트웨어가 포함될 수 있습니다.

### Amazon Elastic Block Storage (EBS)

[EC2](#elastic-compute-cloud-ec2) 인스턴스와 함께 사용하기 위해 블록 레벨 스토리지 볼륨을 제공하는 서비스입니다.

쉽게 컴퓨터의 블록 스토리지라고 생각하면 됩니다.
일반적인 SSD, HDD 타입을 선택해 EC2 서비스에 필요한 저장 용량만큼 생성할 수 있습니다.

<a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html" target="_blank">Amazon EBS volume types</a>
문서를 참고하여 비용과 성능 측면에서 어떤 타입을 선택할지 결정할 수 있습니다.

일반적으로는 **General Purpose SSD**(범용 SSD) 가 비용과 성능에서 적절하기 때문에 권장되고 있습니다.

서비스의 I/O 작업 성능이 중요하다면 **Provisioned IOPS SSD** 를 선택합니다.
IOPS 는 초당 I/O 작업 수입니다.

<br>
## ETC

### Relational Database Service (RDS)

### Simple Storage Service (S3)

### AWS Identity and Access Management (IAM)

AWS 웹 콘솔에서 사용하는 **계정별 액세스 및 권한 관리 기능**입니다.

root 유저인 본계정을 제외하고 IAM 서브 계정을 사용자별, 그룹별로 생성해 관리할 수 있습니다.
권한은 정책별로 자유롭게 커스터마이징이 가능하고, 이미 만들어진 정책 셋을 적용할 수도 있습니다.

보통은 사용자 그룹에 권한을 적용하고 개별 사용자를 그룹 내에 포함시키는 방식으로 관리합니다.
또한 사용자별 [MFA](#multi-factor-authentication-mfa) 도 적용해 계정 도용의 가능성을 줄입니다.

IAM 에서는 **역할(Role, 롤)**을 생성할 수 있습니다.
역할은 특정 권한을 갖는 자격 증명이며,
IAM 사용자 생성과 유사하지만 비밀번호와 같은 추가적인 액세스가 필요하지 않습니다.
특정 권한 정책을 갖는 역할을 생성하여 **EC2 인스턴스에 적용**할 수 있습니다.

### Multi-Factor Authentication (MFA)

AWS 콘솔 계정에 적용하는 보안 기능입니다.
MFA 를 적용하면 해당 계정은 콘솔 로그인 시 6자리의 일회성 숫자를 추가적으로 입력해야 합니다.

MFA 생성 코드를 [IAM](#aws-identity-and-access-management-iam) 계정관리에서 제공받아
크롬 확장 프로그램 MFA 도구에 적용해 일회용 암호를 생성합니다.

자세한 내용은 **<a href="https://aws.amazon.com/ko/iam/features/mfa/?audit=2019q1" target="_blank">여기</a>**를
확인하세요.

### AWS Systems Manager - Session Manager

과거 **SSM Agent** 였던 **AWS Systems Manager** 서비스는 AWS 인프라를 모니터링하고 제어하기 위한 여러 기능을 제공합니다.

특히 본 프로젝트에서 사용할 기능은 **Session Manager** 로써,
private subnet 내부에 존재하는 EC2 인스턴스에 ssh 터미널 접속하기 위해 사용합니다.

private 망에 있는 자원들은 기본적으로 인터넷에 연결되어 있지 않기 때문에
public 망에 배스천 자원을 추가로 구축하여 인증을 통해 접근하는 것이 일반적이었습니다.

하지만 이러한 방식은 추가 자원에 대한 비용 문제, 배스천 해킹 혹은 인증 키 분실 등의 위험성이 존재합니다.
따라서 AWS 는 웹 콘솔에서 직접적으로 private 인스턴스에 접근할 수 있는 세션 매니저 기능을 제공하고 있습니다.

물론 이를 위해 AWS 웹 콘솔에 접근 할 수 있는 **계정에 대한 여러 단계 인증 및 최소한의 권한 부여 등의 사전조치가 필요**합니다.
이러한 통합 계정에 대한 보안만 철저히 유지할 수 있다면 인스턴스 콘솔 접속에 대한 보안은 따로 신경쓰지 않아도 됩니다.

### Route 53, Certificate Manager

---

### Web Application Firewall (WAF)

- 웹방화벽

### CloudWatch

### WorkSpaces

### DocumentDB

### DynamoDB

### ElasticCache

<br>

---

<br>
다음글인
**<a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01" target="_blank">[AWS 퍼블릭클라우드 실습 01] VPC 구축</a>**
로 이어집니다.
