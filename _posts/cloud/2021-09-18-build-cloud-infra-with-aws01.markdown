---
title:  "[02][AWS 퍼블릭클라우드 실습] VPC 구축"
created:   2021-09-18 20:17:00 +0900
updated:   2022-03-29 22:12:00 +0900
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
2. [기본 VPC 구축하기](#기본-vpc-구축하기)
    - [(1) VPC 생성](#1-vpc-생성)
    - [(2) VPC 서브넷 생성](#2-vpc-서브넷-생성)
    - [(3) 라우팅 테이블 생성 및 서브넷에 적용](#3-라우팅-테이블-생성-및-서브넷에-적용)
    - [(4) [OPTIONAL] NAT 게이트웨이 생성 및 적용](#4-optional-nat-게이트웨이-생성-및-적용)
    - [(5) 보안 설정](#5-보안-설정)

### 시리즈

- <a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies" target="_blank">
[01][AWS 퍼블릭클라우드 실습] 용어 정리</a>
- <a href="{{ site.github.url }}/cloud/2021/10/17/build-cloud-infra-with-aws02" target="_blank">
[03][AWS 퍼블릭클라우드 실습] EC2 생성</a>

### 참조

- <a href="https://velog.io/@shanukhan/Top-Reasons-to-Learn-AWS" target="_blank">Top Reasons to Learn AWS</a>
- <a href="https://docs.aws.amazon.com/general/latest/gr/glos-chap.html" target="_blank">AWS 레퍼런스 가이드</a>

---

<br>
## 들어가며

AWS 서비스를 활용하여 가용성 높은 클라우드 네트워크를 구축합니다.

Public 및 Private 망을 독립적으로 구성하는 것이 특징입니다.
대략적인 구성도는 다음과 같습니다.

![aws infra diagram]({{ site.github.url }}{% link assets/post-img/aws-infra-diagram01.png %})

```text
- 리전: ap-northeast-2 (대한민국 서울)
- 가용영역: ap-northeast-2a, ap-northeast-2b
- VPC: 10.20.0.0/16
- Public 서브넷: 서로 다른 가용영역에 각각 하나씩
- Private 서브넷: 서로 다른 가용영역에 각각 하나씩
- ELB: Application Load Balancer 를 두 가용 영역에 걸쳐 설치, 가용성 확보
```

**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#virtual-private-cloud-vpc"
target="_blank">VPC</a>** 대역을 ```10.20.0.0/16``` 으로 지정하고, 이 범주 내에서 여러 서브넷을 분할해 사용합니다.

구성도에서는 public bastion 인스턴스가 존재하지만, 이것 대신
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#aws-systems-manager---session-manager"
target="_blank">SSM Agent</a>**
세션 매니저를 임시로 활용해 SSH 터미널 접속할 예정입니다.

> RDS 데이터베이스 인스턴스도 구성도에 있지만, **VPC 및 서비스 인프라 구축** 관점에서 굳이 필요하지 않기 때문에
> 본 시리즈에서는 포함하지 않을 예정입니다.

<br>
## 기본 VPC 구축하기

인프라 구축을 위한 가상 클라우드 사설망을 생성합니다.

### (1) **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#virtual-private-cloud-vpc" target="_blank">VPC</a>** 생성

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
### (2) **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#vpc-subnet" target="_blank">VPC 서브넷</a>** 생성

구성도에 나온 대로
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#region" target="_blank">리전</a>**
내 서로 다른 [가용 영역](#availability-zone)에 Public 대역 하나씩과 Private 대역 둘씩을 생성합니다.

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

이와 같은 방식으로 3개 더 생성!

```text
- my-subnet-public02: ap-northeast-2b, 10.20.120.0/24
- my-subnet-private01: ap-northeast-2a, 10.20.10.0/24, EC2 인스턴스용(서비스)
- my-subnet-private02: ap-northeast-2b, 10.20.20.0/24, EC2 인스턴스용(서비스)
```

동종의 서브넷은 가용 영역을 서로 다르게 하여(ap-northeast-2a, ap-northeast-2b) 가용성을 높혔다는 점을 꼭 기억하시기 바랍니다.

<br>
### (3) **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#route-table" target="_blank">라우팅 테이블</a>** 생성 및 서브넷에 적용

먼저 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#internet-gateway-igw"
target="_blank">인터넷 게이트웨이(IGW)</a>** 를 생성합니다.

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
2. 'my-subnet-private01', 'my-subnet-private02' 각각 선택 후 저장
```

<br>
### (4) [OPTIONAL] **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#nat-gateway-nat" target="_blank">NAT 게이트웨이</a>** 생성 및 적용

**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#nat-gateway-nat"
target="_blank">NAT 게이트웨이(NAT)</a>** 는 outbound 전용 게이트웨이입니다.
이후 **private EC2 인스턴스에서 패키지 다운로드 등 외부 인터넷 연결시 사용할 것**이기 때문에 미리 생성해 두도록 합시다.

NAT 게이트웨이는 트래픽 발생 시마다 비용이 청구됩니다.
또한 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#elastic-ip-address-eip"
target="_blank">탄력적 IP(EIP)</a>** 를 붙여야 하기 때문에 이에 대한 비용도 발생합니다.

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

또한 NAT 에 EIP 를 할당하는 이유는 인터넷망에서 퍼블릭 리소스가 지정되어야 하기 때문입니다
(IGW 자체로는 리소스 역할을 하지 못함).
EIP 는 오직 NAT 생성 시에만 부착될 수 있으며, 이후에는 따로 분리할 수 없습니다(NAT 삭제 이후 릴리즈 해야함).

나중에 서비스의 트래픽을 위해
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#elastic-load-balancer-elb"
target="_blank">탄력적 로드밸런서(ELB, ALB)</a>** 를 설치하여
별도의 공인 IP와 도메인이 할당되도록 하겠지만, NAT 게이트웨이는 그것과는 별개의 인터넷 통로라고 볼 수 있습니다.

다음으로 실제 트래픽 라우팅이 활성화되도록 하기 위해,
퍼블릭 서브넷에 생성된 **NAT 게이트웨이를 프라이빗 서브넷의 라우트 테이블에 연결**합니다.

```text
1. 라우팅 테이블 탭으로 이동하여 'my-route-private' 프라이빗 서브넷 선택
2. '라우팅' 탭으로 이동 후 '라우팅 편집' 클릭
3. '라우팅 추가'로 항목을 추가하고 '0.0.0.0/0' 입력, 대상 목록 중 'NAT 게이트웨이' 클릭하여 앞서 생성한 NAT 게이트웨이 선택
4. 변경 사항 저장
```

비로소 'my-route-private' 라우트 테이블이 적용된 프라이빗 서브넷 내의 호스트 자원에서 외부인터넷으로 outbound 라우팅이 가능해졌습니다.

<br>
### (5) 보안 설정

AWS VPC 에서 사용하는 보안 설정은
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#access-control-list-acl"
target="_blank">네트워크 ACL</a>** 과
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#security-group-sg"
target="_blank">보안 그룹(SG)</a>** 입니다.

먼저 VPC 및 서브넷을 생성하면 기본 네트워크 ACL 이 서브넷에 적용되어 있습니다.
Inbound 와 Outbound 모두 동일하게 **```100번 any allow```**, **```*번 any deny```** 규칙이 순차적으로 적용되어 있는데,
마지막으로 존재하는 **```*번 any deny```** 의 의미는
기본적으로 앞선 번호의 규칙들 외의 모든 트래픽을 거부하겠다는 의미입니다(일종의 화이트리스트 규칙).

**```100번 any allow```** 의 의미는 모든 리소스의 트래픽을 허용한다는 뜻입니다.
100번은 * 보다 우선순위가 앞선 규칙이므로, 이 ACL 은 현재 모든 리소스의 트래픽을 허용하는 상태입니다.

지금은 기본 상태로 두도록 합니다.

다음으로 **보안 그룹**입니다.
보안 그룹 규칙은 기본적으로 서브넷 내의
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#elastic-compute-cloud-ec2"
target="_blank">EC2</a>** 인스턴스 혹은
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#elastic-load-balancer-elb"
target="_blank">로드밸런서</a>** 에 적용하게 됩니다.

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
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '80', '사용자 지정', '0.0.0.0/0', 설명 'from HTTP everywhere'
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '443', '사용자 지정', '0.0.0.0/0', 설명 'from HTTPS everywhere'
6. 아웃바운드 규칙 추가
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '8888', '사용자 지정', '10.20.10.31/32', 설명 'to service instance'
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '8888', '사용자 지정', '10.20.20.32/32', 설명 'to service instance'
```

방금 생성한 것은 **퍼블릭 전용 보안 그룹**입니다.
로드밸런서에 적용할 것이기 때문에 인바운드는 any 오픈이고,
아웃바운드 타겟은 private 서브넷 내에 생성될 서비스 EC2 인스턴스입니다.
서비스의 인스턴스 포트는 8888 으로 지정합니다.
이로써 외부에서 인입된 사용자의 트래픽은 로드밸런서를 거쳐 private 내 인스턴스로 향하게 됩니다.

> **Public DMZ(Demilitarized Zone)**
> - 사실 외부 사용자의 트래픽은 로드밸런서에서 내부망인 private 서브넷으로 들어가서는 안되는데요, 그것은 로드밸런서가 독립적인 웹서버의
> 역할을 수행할 수 없기 때문입니다. 이는 사실상 사용자가 내부망에 곧바로 접근하는 것과 마찬가지입니다.
> - 이 문제를 해결하기 위해 **Public DMZ** 를 두어 한 단계 필터를 거쳐야 합니다.
> - 군사용어에서 **DMZ** 는 비무장지대를 의미하는 만큼 **네트워크에서의 DMZ 는 외부망과 내부망 사이의 중간지점**을 의미합니다.
> - 원칙적으로 인프라 네트워크의 내부망은 외부로부터 완전히 차단되어 있어야 하므로, 외부에서 서비스를 이용하는 사용자는 내부망에 직접적으로
> 접근할 수 없습니다.
> - 하지만 서비스는 제공되어야 하기에 중간지대인 DMZ 대역을 구성하여 사용자는 이곳으로 접근하고, 요청은 DMZ 웹서버에서 한번 이상의
> 필터를 거쳐 실서비스에 들어가게 됩니다.
> - 본 AWS 퍼블릭클라우드 실습 시리즈에서도 그렇게 하면 좋겠지만, WEB 용 인스턴스를 추가로 생성해야 하고 웹서버를 설치하는 등 단계가
> 복잡해지므로, **로드밸런서로 인입된 트래픽이 DMZ 를 거쳐 내부망 인스턴스로 들어간다고 가정**하고 진행하겠습니다.

이번에는 **프라이빗 전용 보안 그룹**을 생성해 보겠습니다.
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
    - '사용자 지정 TCP', 'TCP' 프로토콜, port '8888', '사용자 지정', 'my-SG-public', 설명 'from public subnet'
```

'my-SG-private-service' 인바운드는 퍼블릭 서브넷 8888 포트로 지정합니다.
내부적으로 8888 포트로 서비스를 제공할 것이기 때문입니다.
아웃바운드로는 DB 영역의 두 인스턴스로 지정합니다.

나중에 실제 인스턴스를 생성한 이후에는 SSH 터미널 접속을 위해
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#aws-systems-manager---session-manager"
target="_blank">SSM</a>** 용 인바운드 룰과
외부 패키지 다운로드 및 업데이트를 위해 아웃바운드 443, 80 룰을 추가할 것입니다.

이후 필요에 따라 외부 인터넷 연결 혹은 다른 서브넷 인스턴스 등 임시적인 규칙을 추가할 수 있습니다.

<br>

다음글인
**<a href="{{ site.github.url }}/cloud/2021/10/17/build-cloud-infra-with-aws02" target="_blank">
[03][AWS 퍼블릭클라우드 실습] EC2 생성</a>**
로 이어집니다.
