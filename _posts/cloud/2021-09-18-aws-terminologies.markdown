---
title:  "[01][AWS 퍼블릭클라우드 실습] 용어 정리"
created:   2021-09-18 17:00:00 +0900
updated:   2021-09-18 17:00:00 +0900
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

1. [들어가며](#들어가며)
2. [VPC](#vpc)
    - [Region](#region), [Availability Zone](#availability-zone),
    [Virtual Private Cloud(VPC)](#virtual-private-cloud-vpc), [VPC subnet](#vpc-subnet), [Route table](#route-table),
    [Internet Gateway (IGW)](#internet-gateway-igw), [NAT Gateway (NAT)](#nat-gateway-nat),
    [VPC endpoint](#vpc-endpoint), [Access Control List (ACL)](#access-control-list-acl),
    [Security Group (SG)](#security-group-sg), [VPC Peering](#vpc-peering)
3. [EC2](#ec2)
    - [Elastic Compute Cloud (EC2)](#elastic-compute-cloud-ec2), [Amazon EC2 Auto Scaling](#amazon-ec2-auto-scaling),
    [Elastic Ip Address (EIP)](#elastic-ip-address-eip), [Elastic Load Balancer (ELB)](#elastic-load-balancer-elb),
    [Target Groups](#target-groups), [Amazon Machine Image (AMI)](#amazon-machine-image-ami),
    [Amazon Elastic Block Storage (EBS)](#amazon-elastic-block-storage-ebs)
4. [ETC](#etc)
    - [Relational Database Service (RDS)](#relational-database-service-rds),
    [Simple Storage Service (S3)](#simple-storage-service-s3),
    [AWS Identity and Access Management (IAM)](#aws-identity-and-access-management-iam),
    [Multi-Factor Authentication (MFA)](#multi-factor-authentication-mfa),
    [AWS Certificate Manager (ACM)](#aws-certificate-manager-acm)

### 시리즈

- <a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01" target="_blank">
[02][AWS 퍼블릭클라우드 실습] VPC 구축</a>
- <a href="{{ site.github.url }}/cloud/2021/10/17/build-cloud-infra-with-aws02" target="_blank">
[03][AWS 퍼블릭클라우드 실습] EC2 생성</a>

### 참조

- <a href="https://docs.aws.amazon.com/general/latest/gr/glos-chap.html" target="_blank">AWS 레퍼런스 가이드</a>
- <a href="https://www.whizlabs.com/blog/aws-cheat-sheet/" target="_blank">AWS cheat sheet by Pavan Gumaste</a>

---

<br>
## 들어가며

AWS 의 용어를 총정리합니다.

처음 접하는 용어가 있다면 눈에 익히는 정도로만 가볍게 살펴보기 바랍니다.
이후 구축 단계를 따라가며 실용적으로 이해할 수 있을 것입니다.
(참조: <a href="https://docs.aws.amazon.com/general/latest/gr/glos-chap.html" target="_blank">AWS 레퍼런스 가이드</a>)

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

### VPC Peering

VPC 피어링은 일종의 네트워킹 연결입니다.

서로 다른 두 VPC 사이에서 비공개로 트래픽을 라우팅할 수 있도록 하기 위해 VPC 피어링 연결이 사용됩니다.
VPC 연결과 함께 라우트 테이블, Security Group 설정을 진행하면 해당 VPC 의 인스턴스는 동일한 네트워크 안에 있는 것처럼 서로 통신할
수 있습니다. AWS VPC 간의 연결이기 때문에 private 대역의 연결도 가능합니다.

또한 다른 AWS 계정의 VPC 또는 다른 AWS 리전의 VPC 사이에서 VPC 피어링 연결을 생성할 수 있습니다.
VPC 피어링 연결의 생성은 게이트웨이나 AWS Site-to-Site VPN 연결이 아니기 때문에 별도의 물리적 하드웨어에 의존하지 않습니다.
통신에 대한 단일 장애 지점이나 대역폭 병목 현상도 없습니다.

VPC 피어링 연결 생성은 AWS 웹콘솔의 **VPC 서비스 > 피어링 연결 > 피어링 연결 생성** 으로 진행합니다.
현재 소유한 VPC 중에서 **VPC ID(요청자)** 를 지정하고, 내 계정/다른 계정 및 리전을 선택하여 **VPC ID(수락자)** 를 지정합니다.
이후 수락자의 화면에서 피어링 연결을 수락하여 작업을 마칩니다.

주의할 점은 요청자와 수락자 간 중첩되는 CIDR 이 존재하면 안된다는 점입니다.
동일 계정 내에서 그럴 일은 없겠지만, 서로 다른 계정이라면 VPC 의 사설 대역의 CIDR 이 동일하게 설정되어 있을 수 있으므로 사전 확인이
필요합니다.

<br>
## EC2

### Elastic Compute Cloud (EC2)

- Billings
    - Spot Instances
    - Savings Plan

### Amazon EC2 Auto Scaling

### Elastic Ip Address (EIP)

### Elastic Load Balancer (ELB)

탄력적 로드밸런서는 일종의 스위치(L4/L7) 장비로, 단일 진입점 역할을 수행하여 인입되는 요청 트래픽을 지정된 복수의 타겟으로
부하분산시키는 역할을 합니다. 다수의 컴퓨팅 리소스에
**<a href="https://en.wikipedia.org/wiki/Round-robin_scheduling" target="_blank">RR(Round Robin)</a>**
방식으로 부하를 분산함으로써 가용성 및 내결함성을 높이는 이점을 가집니다.

탄력적 로드밸런서는 분산이 필요한 [가용 영역](#availability-zone)에 대한 활성화가 필요합니다.
이 과정에서 네트워크 인터페이스를 자동으로 생성하여 지정한 [서브넷](#vpc-subnet) 내 고정 IP 주소를 가져옵니다.
또한 인터넷 경계(Internet-facing) 용도인 경우 public subnet 당
하나의 [탄력적 IP 주소](#elastic-ip-address-eip)를 연결할 수 있습니다.

부하 분산의 대상은 [타겟 그룹](#target-groups)을 생성하여 로드밸런서에 등록함으로써 적용하는데,
조건에 따른 Health Checking 기능이 있어 다수의 타겟 중 active 상태인 것으로 트래픽을 보내게 됩니다.

또한 시간에 따른 수신 트래픽량의 변화에 맞춰 확장/축소가 자동으로 가능하며([Auto Scaling](#amazon-ec2-auto-scaling)),
인증서([ACM](#aws-certificate-manager-acm)를 적용함으로써 HTTPS 전용 리스너를 생성하여 클라이언트 요청의 암호화 해제가 가능합니다.

탄력적 로드밸런서는 사용자의 니즈에 따라 다음의 세 가지 종류로 나뉩니다.

- **(1) Application Load Balancer** - OSI L7(Layer 7) 의 트래픽을 컨트롤하는 장비로 대표적으로 HTTP/HTTPS 헤더를 필터하고,
둘 이상의 가용영역 내 EC2 인스턴스, 컨테이너, IP 주소 등 여러 대상에 걸쳐 부하를 자동으로 분산하는 장비입니다.
    - **리스너**: 하나 이상의 **리스너(Listener)** 를 생성할 수 있습니다.
    [ACM](#aws-certificate-manager-acm) 인증서를 리스너에 HTTPS 프로토콜로 적용할 수 있습니다.
    리스너는 구성한 프로토콜 및 포트를 사용하여 클라이언트의 연결 요청을 지정한 **규칙(Rule)**에 따라 라우팅합니다.
    - **규칙(Rule)**: 각 **규칙**은 **우선 순위**, **하나 이상의 작업(forward, redirect, fixed-response)**,
    **하나 이상의 조건(host-header, http-request-method, path-pattern, source-ip 중 0개 또는 1개)**으로
    구성되며 지정한 조건이 충족되면 작업이 수행됩니다.
    따라서 규칙의 세부 조건에 따라 여러 타겟 그룹으로 라우팅되도록 세팅할 수도 있습니다.
    - **헬스체크**: 다른 ELB 와 마찬가지로 **Health Checking** 을 수행합니다.
    체크 결과 active 상태가 아닌 대상으로는 트래픽을 보내지 않습니다.
    - **보안**: [보안 그룹](#security-group-sg)을 적용할 수 있습니다.
    따라서 ALB 에 특화된 Security Group 을 독립적으로 생성하는 것이 좋습니다.
- **(2) Network Load Balancer** - OSI L4(Layer 4) 의 트래픽을 컨트롤하는 장비로 TCP/UDP 계층 필터를 수행합니다. 초당 수백만 개의
요청을 처리하여 HTTP 헤더를 처리하는 ALB 보다 빠른 성능을 나타냅니다.
    - **리스너**: 하나 이상의 **리스너(Listener)** 를 생성할 수 있습니다.
    [ACM](#aws-certificate-manager-acm) 인증서를 리스너에 HTTPS 프로토콜로 적용할 수 있습니다.
    리스너는 구성한 프로토콜 및 포트를 사용하여 클라이언트의 연결 요청을 지정한 **[대상 그룹](#target-groups)** 으로 전달합니다.
    - **헬스체크**: 다른 ELB 와 마찬가지로 **Health Checking** 을 수행합니다.
    체크 결과 active 상태가 아닌 대상으로는 트래픽을 보내지 않습니다.
    - **보안**: NLB 는 단순 스위치의 역할을 하기 때분에 별도의 보안 그룹을 적용할 수 없습니다.
    - **[EIP](#elastic-ip-address-eip)**: EIP 를 할당하여 고정적인 인바운드 트래픽을 보장합니다.
    - **[가용 영역](#availability-zone)**: 둘 이상의 가용 영역 활성화가 필요한 ALB 와 다르게 하나의 가용 영역에만 활성화 가능합니다.
    - **NLB+ALB 통합구성**: 특히 **(고정IP + L7스위치)** 기능이 필요한 경우,
    앞단에 EIP 가 할당된 NLB 를 두고 NLB 의 대상 그룹으로 ALB 를 지정할 수 있습니다.
    이는 AWS PrivateLink 를 활용한 ALB 와 NLB 통합구성입니다.
    이 경우에는 ALB 의 대상 그룹에는 부하분산의 대상이 되는 어플리케이션 인스턴스들을 지정하고,
    NLB 의 대상 그룹에는 먼저 생성한 ALB 를 지정합니다.
    그리고 PrivateLink 엔드포인트 서비스를 생성하여 NLB 엔드포인트로 등록합니다.
    (<a href="https://dev.classmethod.jp/articles/alb-nlb-aws-privatelink-fixed-ip-active/"
    target="_blank">관련 포스팅 링크</a>)
- **(3) Gateway Load Balancer** - OSI L3(Layer 3) 인 네트워크 계층에서 작동되는 LB 입니다. 방화벽, 침입 탐지 및 방지 시스템,
심층 패킷 검사 시스템과 같은 **가상 어플라이언스**를 배포, 확장 및 관리할 때 사용됩니다.
    - GWLB 는 모든 포트에서 모든 IP 패킷을 수신하고 리스너 규칙에 지정된 대상 그룹으로 트래픽을 전달합니다.
    - GWLB 를 포함한 가상 써드파티 어플라이언스를 경유하는 GWLB Endpoint 를 생성하여 실 서비스에 적용할 수 있습니다.
    GWLBE 는 GENEVE 캡슐화를 사용하여 트래픽을 보존합니다.
    (<a href="https://docs.aws.amazon.com/ko_kr/elasticloadbalancing/latest/gateway/introduction.html"
    target="_blank">자세한 내용은 GWLB 문서 참조</a>)

탄력적 로드밸런서와 연계되는 AWS 서비스들은 다음과 같습니다.

- **EC2, Auto Scaling** - 기본적인 트래픽 라우팅 대상 인스턴스이며, 수요에 따라 자동으로 인스턴스 수를 UP/DOWN 할수 있습니다.
ELB 에서 Auto Scaling 을 활성화하면 Auto Scaling 에 의해 시작된 인스턴스가 로드 밸런서에 자동으로 등록됩니다.
(종료된 인스턴스도 마찬가지)
<a href="https://docs.aws.amazon.com/autoscaling/latest/userguide/"
target="_blank">Amazon EC2 Auto Scaling 사용 설명서</a>
- **AWS Certificate Manager** - AWS 자체적으로 제공하는 인증서 서비스입니다. ACM 에서 제공한 인증서를 ELB 에 지정할 수 있습니다.
- **Amazon CloudWatch** - ELB 를 모니터링하고 필요에 따라 조치를 취할 수 있게 해줍니다.
<a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/"
target="_blank">Amazon CloudWatch 사용 설명서</a>
- **Amazon ECS** - EC2 인스턴스 클러스터에서 Docker 컨테이너를 실행, 중단 및 관리할 수 있게 해줍니다.
<a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/"
target="_blank">Amazon Elastic Container Service 개발자 안내서</a>
- **AWS Global Accelerator** - 애플리케이션의 가용성과 성능을 향상시킵니다. 액셀러레이터를 사용하여 하나 이상의 AWS 리전에 있는
여러 로드밸런서에 트래픽을 분산합니다.
<a href="https://docs.aws.amazon.com/global-accelerator/latest/dg/"
target="_blank">AWS Global Accelerator 개발자 안내서</a>
- **Route 53** - AWS 도메인 네임서버입니다. 이곳에 원하는 도메인을 비용을 지불하고 등록한 후, ACM 과 함께 ELB 에 적용하여 안정적인
도메인 서비스를 구축할 수 있게 합니다.
<a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/" target="_blank">Amazon Route 53 개발자 안내서</a>
- **AWS WAF** - AWS 웹방화벽으로써 웹 ACL 의 규칙에 따라 요청을 허용하거나 차단할 수 있습니다.
<a href="https://docs.aws.amazon.com/waf/latest/developerguide/" target="_blank">AWS WAF 개발자 안내서</a>

### Target Groups

타겟 그룹은 [ELB](#elastic-load-balancer-elb) 로 들어오는 requests 를 등록된 targets 로 route 하는 역할을 수행합니다.
따라서 새 ELB 나 기존의 ELB 의 listener 를 구성할 때 몇몇 조건들과 함께 등록됩니다.

다시 말해 ELB 가 외부에서 들어온 요청들을 부하분산시킨다면,
그것에 등록된 **타겟 그룹은 분산요청이 어디로 가야할지 대상을 지정하는 역할**을 합니다.

타겟 그룹은 리퀘스트 타입별로 각각 다르게 생성할 수 있습니다.
예를 들어 인스턴스A 와 인스턴스B 를 동일하게 타겟으로 갖지만 protocol, port 리퀘스트 조건을 다르게 하여
서로 다른 타겟 그룹을 목적에 따라 생성할 수 있습니다.

타겟 그룹에서 타겟 타입은 **EC2 인스턴스**, **IP 주소**, **람다 함수**, **내부 ALB** 가 있습니다.

EC2 인스턴스의 경우, 복수의 인스턴스를 지정할 수 있으며
**<a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html"
target="_blank">Amazon EC2 Auto Scaling</a>**
에서 유용하게 사용할 수 있습니다.

IP 주소의 경우, 요청을 라우팅할 IP 주소 대역을 지정함으로써
AWS VPC 뿐아니라 온프레미스(On-Premise) 리소스 대상으로 지정할 때 사용됩니다.

람다 함수의 경우, 서버리스로 특정 조건에 수행되는 람다 함수를 대상으로 라우팅합니다.

내부 ALB 의 경우, 주로 Internet-facing NLB 로 들어온 요청을 Internal ALB 로 라우팅시 사용됩니다.
이 경우 **NLB 는 TCP 필터링, EIP 지정과 함께 Application 수준의 유연한 트래픽 제어가 가능**합니다.

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

### AWS Certificate Manager (ACM)

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
**<a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01" target="_blank">
[02][AWS 퍼블릭클라우드 실습] VPC 구축</a>**
로 이어집니다.
