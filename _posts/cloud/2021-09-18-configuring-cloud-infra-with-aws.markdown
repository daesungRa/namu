---
title:  "AWS 자원으로 클라우드 인프라 구축하기"
created:   2021-09-18 20:17:42 +0900
updated:   2021-09-18 20:17:42 +0900
author: namu
categories: cloud
permalink: "/cloud/:year/:month/:day/:title"
image: https://media.vlpt.us/images/shanukhan/post/3fb0ab76-ecc0-4208-b255-035dc9e298ea/58f09-amaz.png
alt: linear algebra image
image-view: true
image-author: shanukhan
image-source: https://velog.io/@shanukhan/Top-Reasons-to-Learn-AWS
---


---

### 목차

1. [들어가며](#들어가며)
2. [용어 정리](#용어-정리)
    - [Region](#region), [Availability Zone](#availability-zone),
    [Virtual Private Cloud(VPC)](#virtual-private-cloud-vpc), [VPC subnet](#vpc-subnet), [Route table](#route-table),
    [Internet Gateway (IGW)](#internet-gateway-igw), [NAT Gateway (NAT)](#nat-gateway-nat),
    [VPC endpoint](#vpc-endpoint), [Access Control List (ACL)](#access-control-list-acl),
    [Security Group (SG)](#security-group-sg)
    - [Elastic Compute Cloud (EC2)](#elastic-compute-cloud-ec2), [Elastic Ip Address (EIP)](#elastic-ip-address-eip),
    [Elastic Load Balancer (ELB)](#elastic-load-balancer-elb),
    [Relational Database Service (RDS)](#relational-database-service-rds),
    [Simple Storage Service (S3)](#simple-storage-service-s3),
    [AWS Identity and Access Management (IAM)](#aws-identity-and-access-management-iam), [](#), [](#)
3. [기본 VPC 구축하기](#기본-vpc-구축하기)
4. [서비스 인스턴스 구축하기](#서비스-인스턴스-구축하기)
5. [로드밸런서 적용 및 도메인 등록](#로드밸런서-적용-및-도메인-등록)
6. [데이터베이스 구축하기](#데이터베이스-구축하기)

### 참조

- <a href="https://velog.io/@shanukhan/Top-Reasons-to-Learn-AWS" target="_blank">Top Reasons to Learn AWS</a>
- <a href="https://docs.aws.amazon.com/general/latest/gr/glos-chap.html" target="_blank">AWS 레퍼런스 가이드</a>

---

<br>
## 들어가며

AWS 서비스를 활용하여 고가용성의 유연한 클라우드 네트워크를 구축합니다.

특히, Public 및 Private 서브넷 대역을 독립적으로 구성해 **높은 보안성을 지닌 인프라 구축을 목표**로 합니다.
대략적인 구성도는 다음과 같습니다.

![aws infra diagram]({{ site.github.url }}{% link assets/post-img/aws-infra-diagram01.png %})

```text
- 리전: ap-northeast-2 (대한민국 서울)
- 가용영역: ap-northeast-2a, ap-northeast-2b
- VPC: 10.20.0.0/16
- Public 서브넷: 서로 다른 가용영역에 각각 하나씩
- Private 서브넷: 서로 다른 가용영역에 각각 둘씩, 기본 EC2 와 RDS
- ELB: Application Load Balancer 를 두 가용 영역에 걸쳐 설치, 가용성 확보
```

VPC 대역을 ```10.20.0.0/16``` 으로 지정하고, 이 범주 내에서 여러 서브넷을 분할해 사용합니다.

구성도에서는 public bastion 인스턴스가 존재하지만, 이것 대신 [SSM Agent](#aws-systems-manager---session-manager)
세션 매니저를 활용해 SSH 터미널 접속할 예정입니다.

<br>
## 용어 정리

**'AWS 자원으로 클라우드 인프라 구축하기'** 과정을 진행하며 사용되는 주요 서비스 및 용어 정리입니다.

처음 접하는 용어가 있다면 눈에 익히는 정도로만 가볍게 살펴보시기 바랍니다.
이후 구축 단계를 따라가며 실용적으로 이해할 수 있을 것입니다.

- 참조: <a href="https://docs.aws.amazon.com/general/latest/gr/glos-chap.html" target="_blank">AWS 레퍼런스 가이드</a>

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

NAT 게이트웨이도 외부 인터넷으로의 통신 목적이지만, **인바운드 트래픽을 제한한다는 특성**을 가지고 있습니다.
이 말은 VPC 내부에서 외부로 통신은 가능하지만 NAT 를 통해 외부에서 VPC 내부로 접근은 불가함을 의미합니다.

이를 위해 퍼블릭 서브넷에 NAT 인스턴스가 부착되어 네트워크 주소 변환을 수행합니다(Network Address Translation).

NAT 는 주로 인터넷 연결이 불가능한 프라이빗 서브넷의 인스턴스에서 패키지 다운로드 등의 목적으로 특정 외부 도메인에 접근하기 위해 이용됩니다.
이 때는 퍼블릭 서브넷의 NAT 게이트웨이를 프라이빗 [라우트 테이블](#security-group-sg) 규칙에 추가하게 되며,
아울러 해당되는 프라이빗 [보안 그룹](#security-group-sg)의 outbound 에 443, 80 any open 규칙을 적용해야 합니다.

NAT 게이트웨이에서 주의할 부분은 비용 이슈입니다.
보통은 여기에 [탄력적 IP](#elastic-ip-address-eip)(EIP, 공인 IP)가 할당되어 이에 대한 비용이 청구되고,
프라이빗 인스턴스에서 외부 인터넷 연결 트래픽이 발생할 때마다 추가적인 비용이 발생합니다.

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

### Amazon Machine Image (AMI)

기본적인 OS 및 스토리지, 어플리케이션 등을 포함한 **가상 PC 이미지**입니다.
따라서 적절한 AMI 를 선택해 손쉽게 [EC2](#elastic-compute-cloud-ec2) 인스턴스를 생성할 수 있습니다.

또한 나만의 커스터마이징된 이미지를 생성해 저장하고, 그것을 마켓 플레이스에 올릴 수도 있습니다.

aws docs 의 설명은 다음과 같습니다.

> [EBS](#amazon-elastic-block-store-ebs) 또는 [S3](#simple-storage-service-s3) 에 저장되어 있는 암호화된 머신 이미지입니다.
> 일반적인 컴퓨터의 root drive 템플릿과 유사하며, 여기에는 OS, 데이터베이스 서버, 미들웨어 및 웹 서버와 같은
> 애플리케이션의 계층 및 소프트웨어가 포함될 수 있습니다.

### Amazon Elastic Block Store (EBS)

[EC2](#elastic-compute-cloud-ec2) 인스턴스와 함께 사용하기 위해 블록 레벨 스토리지 볼륨을 제공하는 서비스입니다.

쉽게 컴퓨터의 블록 스토리지라고 생각하면 됩니다.
일반적인 SSD, HDD 타입을 선택해 EC2 서비스에 필요한 저장 용량만큼 생성할 수 있습니다.

<a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html" target="_blank">Amazon EBS volume types</a>
문서를 참고하여 비용과 성능 측면에서 어떤 타입을 선택할지 결정할 수 있습니다.

일반적으로는 **General Purpose SSD**(범용 SSD) 가 비용과 성능에서 적절하기 때문에 권장되고 있습니다.

서비스의 I/O 작업 성능이 중요하다면 **Provisioned IOPS SSD** 를 선택합니다.
IOPS 는 초당 I/O 작업 수입니다.

### Elastic Compute Cloud (EC2)

- Auto Scaling
- Billings
    - Spot Instances
    - Savings Plan

### Elastic Ip Address (EIP)

### Elastic Load Balancer (ELB)

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
## 기본 VPC 구축하기

인프라 구축을 위한 가상 클라우드 사설망을 생성합니다.

### (1) [VPC](#virtual-private-cloud-vpc) 생성

```text
1. 콘솔내 VPC 페이지에서 'VPC 생성' 클릭
2. 이름 태그 작성
    - 'My-VPC'
3. IPv4 CIDR 블록 지정
    - 10.20.0.0/16
    - 약 65,531(2의 16승, 예약 5개 제외)개 ip 자원 사용 가능
4. IPv6 CIDR 블록 없음 선택
5. 테넌시는 기본값으로
6. 태그 작성
    - Name: 'My-VPC'
```

> **테넌시(Tenancy)**
>> AWS 클라우드 사업자는 기본적으로 멀티 테넌트(Multi-tenant) 방식으로 리소스를 제공합니다.
>> 멀티 테넌시란 공통 영역에 여러 하드웨어 리소스들을 배치하고 이를 여러 고객에게 유연하게 할당/해제하는 것을 의미합니다.<br><br>
>> 따라서 데이터센터 관점에서는 유휴 리소스에 대한 관리 비용이 절감되며
>> 사용자 입장에서는 시간과 공간에 구애받지 않고 원하는 리소스를 원하는 만큼 제공받을 수 있습니다.<br><br>
>> 전용 테넌시는 단일 사용자에게 독립된 전용 리소스를 할당하기 때문에
>> 리소스가 다른 사용자와 공유되지 않아 가용성과 보안성이 향상되며 커스터마이징에 용이하게 됩니다.
>> 하지만 그만큼 더 많은 비용이 소요되며 클라우드 사업자로부터 커스터마이징 자원에 대한 유지보수를 받기 어렵다는 단점이 있습니다.

<br>
### (2) VPC [서브넷](#vpc-subnet) 생성

구성도에 나온 대로 [리전](#region) 내 서로 다른 [가용 영역](#availability-zone)에 Public 대역 하나씩과 Private 대역 둘씩을 생성합니다.

```text
1. 서브넷 탭으로 이동하여 '서브넷 생성' 클릭
2. 앞서 생성한 'My-VPC' VPC 선택
3. 서브넷 이름 작성
    - 'my-subnet-public01'
4. 가용 영역 설정
    - ap-northeast-2a
5. IPv4 CIDR 블록 지정
    - 10.20.110.0/24
    - 약 251(2의 8승, 예약 5개 제외)개 ip 자원 사용 가능
6. 태그 작성
    - Name: 'my-subnet-public01'
```

이와 같은 방식으로 5개 더 생성!

```text
- my-subnet-public02: ap-northeast-2b, 10.20.120.0/24
- my-subnet-private01: ap-northeast-2a, 10.20.10.0/24, EC2 인스턴스용(서비스)
- my-subnet-private02: ap-northeast-2b, 10.20.20.0/24, EC2 인스턴스용(서비스)
- my-subnet-private03: ap-northeast-2a, 10.20.30.0/24, RDS 인스턴스용(데이터베이스)
- my-subnet-private04: ap-northeast-2b, 10.20.40.0/24, RDS 인스턴스용(데이터베이스)
```

<br>
### (3) [라우팅 테이블](#route-table) 생성 및 서브넷에 적용

먼저 [인터넷 게이트웨이](#internet-gateway-igw)(IGW)를 생성합니다.

```text
1. 인터넷 게이트웨이 탭으로 이동하여 '인터넷 게이트웨이 생성' 클릭
2. 이름 작성
    - 'my-igw'
3. 태그 작성
    - 'my-igw'
```

다음으로 라우팅 테이블을 생성하고 라우팅 규칙을 지정합니다.

```text
1. 라우팅 테이블 탭으로 이동하여 '라우팅 테이블 생성' 클릭
2. 이름 작성
    - 'my-route-public'
3. 'My-VPC' VPC 선택
4. 태그 작성
    - Name: 'my-route-public'
```

처음 생성한 라우팅 테이블에는 기본적으로 지정한 VPC 의 대역이 설정되어 있습니다.
이 경우 My-VPC 의 대역인 ```10.20.0.0/16```, local 입니다.

또한 지금 생성한 것은 public 전용 테이블이기 때문에 외부 인터넷 연결부를 위해 라우팅을 추가로 설정합니다. 
```0.0.0.0/0``` 대상으로 방금 생성한 인터넷 게이트웨이 'my-igw' 가 부착된 라우팅을 추가합니다.

```text
1. 'my-route-public' 라우팅 테이블 선택
2. 라우팅 탭에서 '라우팅 편집' 클릭 후 '라우팅 추가' 클릭
3. 대상을 0.0.0.0/0 으로 작성하고 두 번째 대상에서 인터넷 게이트웨이 'my-igw' 를 지정
```

'my-route-public' 라우팅 테이블을 앞서 생성한 두 개의 public 서브넷에 연결합니다.

```text
1. '서브넷 연결' 탭에서 '서브넷 연결 편집' 클릭
2. 'my-subnet-public01', 'my-subnet-public02', 각각 선택 후 저장
```

다음으로 private 전용 라우팅 테이블을 생성합니다.

```text
1. 라우팅 테이블 탭으로 이동하여 '라우팅 테이블 생성' 클릭
2. 이름 작성
    - 'my-route-private'
3. 'My-VPC' VPC 선택
4. 태그 작성
    - Name: 'my-route-private'
```

여기도 기본 VPC 대상 라우팅이 지정되어 있습니다.
VPC 내 private 대역을 대상으로 할 것이므로 추가적인 라우팅 설정은 없습니다.

이제 4 개의 private 서브넷에 연결합니다.

```text
1. 'my-route-private' 라우팅 테이블의 '서브넷 연결' 탭에서 '서브넷 연결 편집' 클릭
2. 'my-subnet-private01', 'my-subnet-private02', 'my-subnet-private03', 'my-subnet-private04' 각각 선택 후 저장
```

<br>
### (4) [OPTIONAL] NAT 게이트웨이 생성

[NAT 게이트웨이](#nat-gateway-nat)(NAT)는 outbound 전용 게이트웨이입니다.
이후 **private EC2 인스턴스에서 패키지 다운로드 등 외부 인터넷 연결이 필요할 경우 사용할 것**이기 때문에 미리 생성해 두도록 합시다.

NAT 게이트웨이는 트래픽 발생 시마다 비용이 청구됩니다.
또한 [탄력적 IP](#elastic-ip-address-eip)(EIP)를 붙여야 하기 때문에 이에 대한 비용도 발생합니다.

```text
1. NAT 게이트웨이 탭으로 이동하여 'NAT 게이트웨이 생성' 클릭
2. 이름 작성
    - 'my-nat'
3. 서브넷 선택
    - 'my-subnet-public01' 선택
4. 연결 유형은 '퍼블릭'
5. 탄력적 IP 할당
    - 할당할 유휴 EIP 가 없다면 우측에 '탄력적 IP 할당' 선택하여 새 EIP 를 생성
6. 태그 작성
    - 'my-nat'
```

새로 생성하는 NAT 게이트웨이가 부착되는 곳은 **public 서브넷** 중 하나입니다.
public 서브넷에 부착되는 이유는 이것을 외부 인터넷 연결용으로 사용할 것이기 때문입니다.
따라서 구성도를 보면 private 인스턴스에서 출발한 인터넷향 트래픽은 NAT 를 거쳐 IGW 를 통해 외부로 나간다는 사실을 알 수 있습니다
(구성도는 **<a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html#nat-gateway-scenarios" target="_blank">NAT gateway scenarios</a>** 참조).

![NAT gateway scenarios](https://docs.aws.amazon.com/vpc/latest/userguide/images/nat-gateway-diagram.png)
<br>(```10.0.0.0/24``` 퍼블릭 대역의 삼지창같이 보이는 EIP 기호가 NAT gateway)

또한 NAT 에 EIP 를 할당하는 이유는 인터넷망에서 출발지 리소스가 지정되어야 하기 때문입니다
(IGW 자체로는 리소스 역할을 하지 못함).
EIP 는 오직 NAT 생성 시에만 부착될 수 있으며, 이후에는 따로 분리할 수 없습니다.

나중에 서비스의 트래픽을 위해 [탄력적 로드밸런서](#elastic-load-balancer-elb)(ELB, ALB)를 설치하여
별도의 공인 IP와 도메인이 할당되도록 하겠지만, NAT 게이트웨이는 이 방향으로도 사용되지 않는 **독립적인 인터넷 통로**라고 볼 수 있습니다.

<br>
### (5) 보안 설정

AWS VPC 에서 사용하는 보안 설정은 [**네트워크 ACL**](#access-control-list-acl) 과
[**보안 그룹**](#security-group-sg)(SG) 입니다.

먼저 VPC 및 서브넷을 생성하면 기본 네트워크 ACL 이 서브넷에 적용되어 있습니다.
Inbound 와 Outbound 모두 동일하게 **```100번 any allow```**, **```*번 any deny```** 규칙이 순차적으로 적용되어 있는데,
마지막으로 존재하는 **```*번 any deny```** 의 의미는
기본적으로 앞선 번호의 규칙들 외의 모든 트래픽을 거부하겠다는 의미입니다(일종의 화이트리스트 규칙).

**```100번 any allow```** 의 의미는 모든 리소스의 트래픽을 허용한다는 뜻입니다.
100번은 * 보다 우선순위가 앞선 규칙이므로, 이 ACL 은 현재 모든 리소스의 트래픽을 허용하는 상태입니다.

지금은 기본 상태로 두도록 합니다.

다음으로 **보안 그룹**입니다.
보안 그룹 규칙은 기본적으로 서브넷 내의 [EC2](#elastic-compute-cloud-ec2) 인스턴스 혹은
[로드밸런서](#elastic-load-balancer-elb)에 적용하게 됩니다.

보안 그룹 탭으로 이동하면 default 보안 그룹이 존재합니다.
이것을 커스터마이징해 사용할 수도 있겠지만, 지금은 새로 생성하도록 합니다.

```text
[퍼블릭 전용]
1. 보안 그룹 탭으로 이동하여 '보안 그룹 생성' 클릭
2. 보안 그룹 이름 작성
    - 'my-SG-public'
3. 설명 작성
    - 'My public security group'
4. 'My-VPC' VPC 선택
5. 인바운드 규칙 추가
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '443', '사용자 지정', '0.0.0.0/0', 설명 'from everywhere'
6. 아웃바운드 규칙 추가
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '5020', '사용자 지정', '10.20.10.31/32', 설명 'to service instance'
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '5020', '사용자 지정', '10.20.20.32/32', 설명 'to service instance'
```

방금 생성한 것은 **퍼블릭 전용 보안 그룹**입니다.
로드밸런서에 적용할 것이기 때문에 인바운드는 any 오픈이고,
아웃바운드 타겟은 private 서브넷 내에 생성될 서비스 EC2 인스턴스입니다.
서비스의 인스턴스 포트는 5020 으로 지정합니다.
이로써 외부에서 인입된 사용자의 트래픽은 로드밸런서를 거쳐 private 내 인스턴스로 향하게 됩니다.

이젠 **프라이빗 전용 보안 그룹**을 생성해 보겠습니다.
맨 위에서 보았던 [인프라 구성도](#들어가며)를 보면 프라이빗 서브넷 영역은 EC2 서비스 인스턴스용, RDS 인스턴스용 두 종류가 존재합니다.

```text
[EC2 서비스 인스턴스용]
1. '보안 그룹 생성' 클릭
2. 보안 그룹 이름 작성
    - 'my-SG-private-service'
3. 설명 작성
    - 'My private security group for service'
4. 'My-VPC' VPC 선택
5. 인바운드 규칙 추가
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '5020', '사용자 지정', 'my-SG-public', 설명 'from public subnet'
6. 아웃바운드 규칙 추가
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '3306', '사용자 지정', '10.20.30.21/32', 설명 'to RDS instance'
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '3306', '사용자 지정', '10.20.40.22/32', 설명 'to RDS instance'

[RDS 인스턴스용]
1. '보안 그룹 생성' 클릭
2. 보안 그룹 이름 작성
    - 'my-SG-private-db'
3. 설명 작성
    - 'My private security group for db'
4. 'My-VPC' VPC 선택
5. 인바운드 규칙 추가
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '3306', '사용자 지정', 'my-SG-private-service', 설명 'from private service'
```

'my-SG-private-service' 인바운드는 퍼블릭 서브넷 5020 포트로 지정합니다.
5020 포트로 서비스를 제공할 것이기 때문입니다.
아웃바운드로는 DB 영역의 두 인스턴스로 지정합니다.

나중에 실제 인스턴스를 생성한 이후에는 SSH 터미널 접속을 위해 [SSM](#aws-systems-manager---session-manager) 용 인바운드 룰과
외부 패키지 다운로드 및 업데이트를 위해 아웃바운드 443, 80 룰을 추가할 것입니다.

'my-SG-private-db' 의 인바운드는 3306 포트의 'my-SG-private-service' 로 지정합니다.
서비스 인스턴스의 db 접속을 위함입니다.

이후 필요에 따라 외부 인터넷 연결 혹은 다른 서브넷 인스턴스 등 임시적인 규칙을 추가할 수 있습니다.

<br>
## 서비스 인스턴스 구축하기

서비스 인스턴스를 생성하기 위해 **[EC2](#elastic-compute-cloud-ec2)** 서비스 페이지로 이동합니다.

### (1) 인스턴스 생성하기

우상단의 '인스턴스 시작' 클릭한 후 생성할 인스턴스의 이미지([AMI](#amazon-machine-image-ami))를 선택합니다.

```text
단계 1. Amazon Machine Image(AMI) 선택
    - '빠른 시작' > Ubuntu Server 20.04 LTS (HVM), SSD Volume Type 선택
```

인스턴스의 OS 는 Ubuntu 20.04 LTS 버전을 사용합니다.

```text
단계 2. 인스턴스 유형 선택
    - 프리티어인 't2.micro' 선택
```

```t2.micro``` 의 가상 CPU 수는 1개이고 메모리는 1GB 입니다.
프리티어는 12개월 매달 750시간 해당 사양에 대해서 무료입니다.

만약 이보다 더 많은 자원이 필요하다면
<a href="https://aws.amazon.com/ko/ec2/pricing/" target="_blank">Amazon EC2 요금</a>
을 참조해 적절한 유형을 선택하도록 합니다.

```text
단계 3. 인스턴스 세부 정보 구성
    - 인스턴스 개수는 1개
    - 스팟 인스턴스 선택하지 않음
    - 네트워크 VPC 는 'My-VPC' 선택
    - 서브넷은 'my-subnet-private01'
    - 퍼블릭 IP 자동 할당에서는 '서브넷 사용 설정(비활성화)' 선택
    - IAM 역할은 없음 (나중에 터미널 접속을 위해 SSM role 추가할 것임)
    - 테넌시는 '공유됨 - 공유된 하드웨어 인스턴스 실행' 선택
    - 네트워크 인터페이스에서 기본 'eth0' 에 '10.20.10.31' 입력 (private subnet 내 현재 인스턴스의 IP 주소 지정)
```

'My-VPC' 의 **'my-subnet-private01'** 내에 인스턴스를 생성하도록 합니다.
이 서브넷은 [가용영역](#availability-zone) ```ap-northeast-2a``` 에 존재함을 기억하시기 바랍니다.
인스턴스 IP 주소는 **'10.20.10.31'** 로 입력합니다.

이중화를 위해 가용영역 ```ap-northeast-2b``` 의 **'my-subnet-private02'** 에도 동일한 과정으로
**'10.20.20.32'** 주소로 인스턴스를 생성하도록 합니다.

이 둘은 서로 다른 AZ 의 인스턴스이지만 동일한 서비스를 제공할 것이고,
인입되는 트래픽은 public 영역의 [로드밸런서](#elastic-load-balancer-elb)를 통해 분산될 것입니다.

```text
단계 4. 스토리지 추가
    - root 볼륨(dev/sda1 장치)에 크기 30GiB 로 추가
    - 볼륨 유형은 '범용 SSD' 이며, 종료시 삭제 옵션 체크, 암호화는 기본값으로~
```

[EBS](#amazon-elastic-block-store-ebs) 는 EC2 전용이지만 별도의 블록으로 생성되므로
서비스 인스턴스가 삭제될 때 함께 삭제되도록 '종료시 삭제' 옵션을 선택합니다.

볼륨 용량은 여유있게 30GiB 로 합니다.
추후 더 늘릴 수 있지만 줄일 수는 없습니다.

```text
단계 5. 태그 추가
    - Name: my-service-01
```

**'my-subnet-private01'** 의 Name 태그값은 'my-service-01',
**'my-subnet-private02'** 는 'my-service-02' 로 합니다.

```text
단계 6. 보안 그룹 구성
    - '기존 보안 그룹' 중 'my-SG-private-service' 선택
```

앞서 VPC 단계에서 생성한 EC2 서비스 인스턴스용 보안 그룹인 'my-SG-private-service' 을 적용합니다.

**액세스 권한을 얻으려면 22 포트를 열어야 한다**는 경고가 나타날 수 있습니다.
터미널 액세스는 [SSM](#aws-systems-manager---session-manager) 세션 매니저 접속을 할 것이기 때문에 무시합니다.

SSM 접근 규칙은 다음 단계에서 추가해 보도록 하겠습니다.

```text
단계 7. 인스턴스 시작 검토
    - 선택한 AMI 정보, 인스턴스 유형, 보안 그룹, 인스턴스 세부 정보, 스토리지 정보 확인 후 시작하기
    - SSM 접속을 사용할 것이므로 '키 페어 없이 계속' 선택 후 인스턴스 시작
```

이제 인스턴스 목록으로 가보면 'my-service-01', 'my-service-02' 인스턴스가 대기중으로 나타나며,
잠시 기다리면 실행 중 상태로 활성화됩니다.
이제 인터넷 접속이 불가능한 private subnet 내에 가상 PC가 생성되었습니다.

### (2) 인스턴스 터미널 접속

터미널 접속으로 [SSM](#aws-systems-manager---session-manager) 세션 매니저를
사용할 것이기 때문에 앞서 SSH 22 포트를 열어놓지 않았습니다.
따라서 **SSM 환경**을 세팅해 보겠습니다.

단계는 **a. SSM [IAM](#aws-identity-and-access-management-iam) 롤 생성 및 적용**,
**b. SSM 을 위한 [엔드포인트](#vpc-endpoint) 생성**, **c. [보안 그룹](#security-group-sg) 세팅** 순입니다.

```text
단계 a-1. SSM IAM 역할 생성
    - IAM 페이지의 역할 탭으로 이동, '역할 만들기'
    - 일반 사용 사례 'EC2' 선택 후 다음 단계
    - 'SSM' 키워드 검색해 'AmazonSSMManagedInstanceCore' 정책 셋을 찾아서 선택
    - 태그 작성
        - Name: MySSMRoleForServiceInstance
    - 검토 단계에서 역할 이름 및 설명 작성 후 완료
        - 역할 이름: 'MySSMRoleForServiceInstance'
        - 역할 설명: 'Allows EC2 instances to call AWS services on your behalf.'

단계 a-2. 생성한 롤을 서비스 인스턴스에 적용
    - EC2 인스턴스 우클릭 후 '보안 > IAM 역할 수정' 클릭
    - 자동으로 나타나는 IAM 역할 중 방금 생성한 'MySSMRoleForServiceInstance' 선택 후 저장
```

이 단계에서는 이미 존재하는 정책 셋인 'AmazonSSMManagedInstanceCore' 만 필요했으나
경우에 따라 좀더 세부적인 권한을 지정해야 할 때는 '정책 생성' 을 활용하도록 합니다.

서비스 인스턴스를 생성할 때 IAM 롤을 '없음'으로 지정했었기 때문에
다시 생성한 인스턴스 페이지로 가서 'MySSMRoleForServiceInstance' SSM 롤을 적용합니다.

```text
단계 b. SSM 세션 매니저 접속을 위한 엔드포인트 생성 (총 3개)
    - VPC 페이지의 엔드포인트 탭으로 이동, '엔드포인트 생성'
    - 'ssm', 'ec2' 키워드를 각각 검색해,
    - 'com.amazonaws.ap-northeast-2.ssm', 'com.amazonaws.ap-northeast-2.ssmmessages',
'com.amazonaws.ap-northeast-2.ec2messages' 각 3개의 엔드포인트 생성
    - 'My-VPC' VPC 선택
    - 서브넷 선택
        - 가용 영역 'ap-northeast-2a' 의 'my-subnet-private01'
        - 가용 영역 'ap-northeast-2b' 의 'my-subnet-private02'
    - 프라이빗 DNS 이름 활성화에서 '이 엔드포인트에 대해 활성화' 체크
    - 보안 그룹 'my-SG-private-service' 선택
    - 정책 '모든 액세스' 체크
    - 태그 작성 (각 3개)
        - 'com.amazonaws.ap-northeast-2.ssm'
            - Name: my-endpoint-SSM-service
        - 'com.amazonaws.ap-northeast-2.ssmmessages'
            - Name: my-endpoint-SSMMessages-service
        - 'com.amazonaws.ap-northeast-2.ec2messages'
            - Name: my-endpoint-EC2Messages-service
```

SSM 세션 매니저 접속은 **AWS 웹 콘솔을 통해 외부에서 private 서브넷 내 인스턴스에 접근**하는 것이므로(인터넷 없이),
이 서비스에 맞는 VPC 엔드포인트 확보가 필요합니다.

필요한 엔드포인트 서비스명은 ```ssm```, ```ssmmessages```, ```ec2messages``` 3개이며
네이밍 구성은 'com.amazonaws.[리전명].[서비스명]' 입니다.

엔드포인트 탭으로 이동하여 위 과정을 따라 3개 서비스를 생성하면 됩니다.
그리고 '대기 중' 상태가 '사용 가능' 상태로 바뀌면 완료입니다.

```text
단계 c. private 보안 그룹 세팅
    - 보안 그룹 탭의 'my-SG-private-service' 선택하여 'inbound 룰 수정' 선택
    - 'HTTPS', 'TCP', 443, 'my-SG-private-service'
    - 설명란에 'for SSM Session Manager console', 규칙 저장
```

SSM 세션 매니저 관련 규칙들은 private 서브넷 내의 서비스 인스턴스와 VPC 엔드포인트에 적용되어 있습니다.
따라서 여기에 해당되는 보안 그룹 Inbound 룰을 적용해야 합니다.

세션 매니저 접근을 위해서는 443 HTTPS 인바운드 룰을 추가하면 됩니다.

```text
단계 d. 접속 확인
    - System Manager 페이지의 플릿 관리자 탭으로 이동, '관리형 인스턴스' 확인
```

세팅이 정상적으로 완료되었다면 AWS 시스템 매니저의 플릿 관리자 - Managed Instance 에
'my-service-01', 'my-service-02' 가 나타날 것입니다.

### (3) 기본 웹 애플리케이션 환경 구축

기본적인 HTTP 콜에 응답하기 위한 웹앱 환경을 구축해 봅시다.

웹서버는 Nginx, 웹앱은 파이썬 Flask 로 합니다.

<br>
## 로드밸런서 적용 및 도메인 등록

<br>
## 데이터베이스 구축하기
