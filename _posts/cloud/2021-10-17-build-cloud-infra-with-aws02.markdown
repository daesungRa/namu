---
title:  "[AWS 퍼블릭클라우드 실습 02] EC2 생성"
created:   2021-10-17 10:12:22 +0900
updated:   2021-10-17 10:12:22 +0900
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

1. [서비스 인스턴스 구축하기](#서비스-인스턴스-구축하기)
2. [ELB 를 활용해 분산 트래픽 적용하기](#elb-를-활용해-분산-트래픽-적용하기)
3. [데이터베이스 구축하기](#데이터베이스-구축하기)
4. [추가 작업](#추가-작업)

### 시리즈

- [[AWS 퍼블릭클라우드 실습 01] VPC 구축]({{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01)
- [[AWS 퍼블릭클라우드 실습 02] EC2 생성]({{ site.github.url }}/cloud/2021/10/17/build-cloud-infra-with-aws02)

---

<br>
이전 글인 [[AWS 퍼블릭클라우드 실습 01] VPC 구축]({{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01)
에서 이어집니다.

![aws infra diagram]({{ site.github.url }}{% link assets/post-img/aws-infra-diagram01.png %})

<br>
## 서비스 인스턴스 구축하기

서비스 인스턴스를 생성하기 위해
**<a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01#elastic-compute-cloud-ec2" target="_blank">EC2</a>** 서비스 페이지로 이동합니다.

### (1) 인스턴스 생성하기

> EC2 를 처음 접하신다면 **<a href="https://aws.amazon.com/ko/ec2/pricing/" target="_blank">Amazon EC2 요금</a>**
> 체계를 확인해 보시기 바랍니다.<br>
> 인스턴스 타입별 시간당 USD 를 한달치 원화로 계산해 월별 비용을 예측할 수 있습니다.

우상단의 '인스턴스 시작' 클릭한 후 생성할 인스턴스의 이미지(<a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01#amazon-machine-image-ami" target="_blank">AMI</a>)를 선택합니다.

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

필요한 엔드포인트 서비스명은 **```ssm```**, **```ssmmessages```**, **```ec2messages```** 3개이며
네이밍 구성은 **'com.amazonaws.[리전명].[서비스명]'** 입니다.

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

**세션 매니저 접근을 위해서는 443 HTTPS 인바운드 룰을 추가**하면 됩니다.

```text
단계 d. 접속 확인
    - System Manager 페이지의 플릿 관리자 탭으로 이동, '시작하기' 선택
    - '관리형 인스턴스' 에 생성한 서비스 인스턴스들이 나타나는지 확인
    - 접속할 인스턴스 선택 후 '인스턴스 작업' > '세션 시작'
```

세팅이 정상적으로 완료되었다면 AWS 시스템 매니저의 **플릿 관리자 -> Managed Instance** 화면에
'my-service-01', 'my-service-02' 가 나타날 것입니다.

혹은 그 아래 **Session Manager 탭**에서도 볼 수 있고,
**EC2 페이지에서 활성화된 인스턴스를 클릭하고 연결 - 'Session Manager'** 에서도 확인 가능합니다.

> **동일하게 작업했는데 세션 매니저에 활성화되지 않는 경우?**
>> 별다른 문제가 없는것 같은데 활성화되지 않는 경우가 종종 발생했습니다.
>> 이 경우 인스턴스를 재시작해 보거나 새로 생성하며 IP 주소를 바꿔보는 등 시도해보시기 바랍니다.
>> 최초 한 번만 연결 성공하면 그 이후는 계속 연결이 잘 됐습니다.
>> (보통은 10분 ~ 15분 정도 기다려 보십시오.)

### (3) 기본 웹 애플리케이션 환경 구축

기본적인 HTTP 콜에 응답하기 위한 웹앱 환경을 구축하도록 합니다.
웹서버는 Nginx, 웹앱은 파이썬 Flask 로 하겠습니다.

먼저 세션 매니저를 활용해 터미널에 접속합니다.

```text
$ bash
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ 
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ 
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ ls -l /home/
drwxr-xr-x  3 ssm-user    ssm-user    4096 Aug 24 22:55 ssm-user
drwxr-xr-x  3 ubuntu      ubuntu      4096 Aug 15 14:18 ubuntu
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ 
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ 
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ passwd root
New password:
Retype new password:
passwd: password updated successfully
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ su - root
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# apt-get update
0% [Connecting to ap-northeast-2a.clouds.ports.ubuntu.com (2001:67c:1562::15)] [Connecting to ports.ubuntu.com (2001:67c:1562::15)] [Connecting to download.docker.com (2600:9000:2001:5c00:3:db06:4200:93a1)] [C
```

그런데 위와 같이 SSM 세션 매니저로 인스턴스에 접근은 성공했지만
private 서브넷 내에 있기 때문에 'apt-get' 패키지 매니저가 외부와 인터넷 통신을 하지 못합니다.

따라서 [NAT](#nat-gateway-nat) 를 활용해 환경 구축시에만 임시적으로 외부 인터넷 리퀘스트가 가능하도록 해봅시다.

(만약 VPC 구축 단계에서 NAT 를 만들어두지 않았다면 [여기](#4-optional-nat-게이트웨이-생성)로 가서 만듭니다.)

<br>

---

<br>
#### NAT 를 활용해 private 인스턴스 인터넷 연결

```text
[NAT 만들기]
- VPC 페이지의 NAT gateways 에서 'Create NAT gateway' 선택
- 이름 작성
    - 'My-NAT'
- 서브넷 선택
    'my-subnet-public01'
- 연결 타입은 'Public'
- EIP 가 없다면 우측의 'Elastic IP 할당' 클릭 (> 자동으로 생성, 할당됨)
- 태그 작성
    - Name: My-NAT
```

NAT 게이트웨이를 생성하고 EIP 를 할당해 퍼블릭 서브넷에 붙혔습니다.

```text
[NAT 를 Private 전용 라우트 테이블에 적용]
- 라우트 테이블 탭에서 private 전용 테이블인 'my-route-private' 선택
- 라우트 탭에서 '라우트 수정'
    - 목적지는 '0.0.0.0/0', 타겟은 'My-NAT' 규칙 추가
```

외부와 통신할 private 인스턴스가 속한 서브넷의 **라우트 테이블(사설 전용 테이블)에 퍼블릭 서브넷에 붙힌 NAT 방향 규칙을 추가**합니다.

이제 private 인스턴스에서 이 게이트웨이를 통하는 Outbound 트래픽은
[IGW](#internet-gateway-igw)('my-igw') 를 지나 인터넷 통신이 가능합니다.

마지막으로 **private 전용 보안 그룹의 Outbound 에 HTTP, HTTPS any open 룰을 추가**합니다.

```text
[Private SG 에 HTTP, HTTPS any open 규칙 추가]
- Security Groups 탭에서 private 전용 보안그룹인 'my-SG-private-service' 선택
- 'Outbound rules' 탭에서 '아웃바운드 규칙 편집'
    - IPv4, HTTP, 80 port, 0.0.0.0/0, 'for package management'
    - IPv4, HTTPS, 443 port, 0.0.0.0/0, 'for package management'
```

이제 세션 매니저로 private 인스턴스에 접속해 다시 패키지 업데이트 명령을 해봅시다.

```text
...

root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# apt-get update
Hit:1 https://download.docker.com/linux/ubuntu focal InRelease
Hit:2 http://ap-northeast-2a.clouds.ports.ubuntu.com/ubuntu-ports focal InRelease
Get:3 http://ports.ubuntu.com/ubuntu-ports focal-security InRelease [114 kB]
Get:4 http://dl.google.com/linux/chrome/deb stable InRelease [1811 B]
Get:5 http://ap-northeast-2a.clouds.ports.ubuntu.com/ubuntu-ports focal-updates InRelease [114 kB]

...

Get:30 http://ap-northeast-2a.clouds.ports.ubuntu.com/ubuntu-ports focal-backports/universe arm64 Packages [5796 B]
Get:31 http://ap-northeast-2a.clouds.ports.ubuntu.com/ubuntu-ports focal-backports/universe arm64 c-n-f Metadata [276 B]
Fetched 4129 kB in 3s (1414 kB/s)
Reading package lists... Done
```

잘 됩니다!(<del>짝짝</del>)

NAT 게이트웨이를 활용한 트래픽과 [EIP](#elastic-ip-address-eip) 에 대한 비용이 발생하므로
인스턴스 환경 구성 시에만 임시적으로 사용하고 삭제하도록 합시다.

```text
[NAT 게이트웨이 삭제]
- NAT 게이트웨이 탭으로 이동해 'My-NAT' 삭제
    - 'Actions -> delete' (삭제 시간 소요)
- 라우트 테이블의 'my-route-private' 에서 NAT 규칙 삭제
    - '0.0.0.0/0', 'My-NAT'
- NAT 삭제가 완료되면 Elastic IPs 탭에서 할당했던 EIP 릴리즈
    - 'Actions -> Release Elastic IP addresses'
- 보안 그룹 탭의 'my-SG-private-service' 에서 Outbound 룰 삭제
    - IPv4, HTTP, 80 port, 0.0.0.0/0, 'for package management'
    - IPv4, HTTPS, 443 port, 0.0.0.0/0, 'for package management'
```
<br>

---

<br>
다시 웹앱 환경 구축으로 돌아오겠습니다.(웹서버는 Nginx, 웹앱은 파이썬 Flask)

<br>
## ELB 를 활용해 분산 트래픽 적용하기

<br>
## 데이터베이스 구축하기

<br>
## 추가 작업

- 도메인 등록
- 요금 절감 전략(스팟 인스턴스, Savings Plan)
- Auto Scaling
