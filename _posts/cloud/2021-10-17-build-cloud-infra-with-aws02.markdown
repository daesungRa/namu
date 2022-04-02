---
title:  "[03][AWS 퍼블릭클라우드 실습] EC2 생성"
created:   2021-10-17 10:12:00 +0900
updated:   2022-04-01 21:23:00 +0900
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
2. [서비스 인스턴스 만들기](#서비스-인스턴스-만들기)
    - [(1) 인스턴스 생성하기](#1-인스턴스-생성하기)
    - [(2) 인스턴스 터미널 접속](#2-인스턴스-터미널-접속)
    - [(3) 기본 웹 애플리케이션 환경 구축](#3-기본-웹-애플리케이션-환경-구축)
    - [(4) NAT 를 활용해 private 인스턴스 인터넷 연결](#4-nat-를-활용해-private-인스턴스-인터넷-연결)
        - [[4-1] NAT 삭제하기](#4-1-nat-삭제하기)
3. [ELB 를 활용해 부하분산 트래픽 적용하기](#elb-를-활용해-부하분산-트래픽-적용하기)
4. [추가 사항](#추가-사항)

### 시리즈

- <a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies" target="_blank">
[01][AWS 퍼블릭클라우드 실습] 용어 정리</a>
- <a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01" target="_blank">
[02][AWS 퍼블릭클라우드 실습] VPC 구축</a>

---

<br>
## 들어가며

이전 글인
**<a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01" target="_blank">
[02][AWS 퍼블릭클라우드 실습] VPC 구축</a>**
에서 이어집니다.

![aws infra diagram]({{ site.github.url }}{% link assets/post-img/aws-infra-diagram01.png %})

> RDS 데이터베이스 인스턴스도 구성도에 있지만, **VPC 및 서비스 인프라 구축** 관점에서 굳이 필요하지 않기 때문에
> 본 시리즈에서는 포함하지 않습니다.

<br>
## 서비스 인스턴스 만들기

서비스 인스턴스를 생성하기 위해
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#elastic-compute-cloud-ec2"
target="_blank">EC2</a>** 서비스 페이지로 이동합니다.

### (1) 인스턴스 생성하기

> EC2 를 처음 접하신다면 **<a href="https://aws.amazon.com/ko/ec2/pricing/" target="_blank">Amazon EC2 요금</a>**
> 체계를 확인해 보시기 바랍니다.<br>
> 인스턴스 타입별 시간당 USD 를 한달치 원화로 계산해 월별 비용을 예측할 수 있습니다.

우상단의 '인스턴스 시작' 클릭한 후 생성할 인스턴스의
이미지(<a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01#amazon-machine-image-ami"
target="_blank">AMI</a>)를 선택합니다.

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
이 서브넷은 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#availability-zone"
target="_blank">가용영역</a>** ```ap-northeast-2a``` 에 존재함을 기억하시기 바랍니다.
인스턴스 IP 주소는 **'10.20.10.31'** 로 입력합니다.

이중화를 위해 가용영역 ```ap-northeast-2b``` 의 **'my-subnet-private02'** 에도 동일한 과정으로
**'10.20.20.32'** 주소로 인스턴스를 생성하도록 합니다.

이 둘은 서로 다른 AZ 의 인스턴스이지만 동일한 서비스를 제공할 것이고,
인입되는 트래픽은 public 영역의
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#elastic-load-balancer-elb"
target="_blank">로드밸런서</a>** 를 통해 분산될 것입니다.

```text
단계 4. 스토리지 추가 (EBS)
    - root 볼륨(dev/sda1 장치)에 크기 8GiB 로 추가 (기본)
    - 볼륨 유형은 '범용 SSD' 이며, 종료시 삭제 옵션 체크, 암호화는 기본값(aws/ebs)으로~
```

**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#amazon-elastic-block-storage-ebs"
target="_blank">EBS</a>** 는 일반 PC 에서 하드디스크(SSD, HDD)를 생각하면 됩니다. EC2 전용이지만 별도의 블록으로 생성되므로
서비스 인스턴스가 삭제될 때 함께 삭제되도록 '종료시 삭제' 옵션을 선택합니다.

볼륨 용량은 기본값인 8GiB 로 합니다.
추후 더 늘릴 수 있지만(유연성), 한번 확보된 용량을 줄일 수는 없습니다.

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
터미널 액세스는 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#aws-systems-manager---session-manager"
target="_blank">SSM</a>** 세션 매니저 접속을 할 것이기 때문에 무시합니다.

SSM 접근 규칙은 다음 단계에서 추가해 보도록 하겠습니다.

```text
단계 7. 인스턴스 시작 검토
    - 선택한 AMI 정보, 인스턴스 유형, 보안 그룹, 인스턴스 세부 정보, 스토리지 정보 확인 후 시작하기
    - SSM 접속을 사용할 것이므로 '키 페어 없이 계속' 선택 후 인스턴스 시작
```

이제 인스턴스 목록으로 가보면 'my-service-01', 'my-service-02' 인스턴스가 대기중으로 나타나며,
잠시 기다리면 실행 중 상태로 활성화됩니다.
이제 인터넷 접속이 불가능한 private subnet 내에 가상 PC가 생성되었습니다.

<br>
### (2) 인스턴스 터미널 접속

> 생성된 인스턴스 터미널 접속을 위해 널리 사용되는 방식은
> <a href="https://en.wikipedia.org/wiki/Secure_Shell" target="_blank">SSH(Secure Shell Protocol)</a>
> 22 포트로 원격접속하는 것입니다.
> Public 서브넷에 생성된 인스턴스면 Security Group 설정을 통해 원격접속 세팅을 할 수 있지만,
> 본 시리즈의 경우 Private 서브넷에 인스턴스가 생성되므로 불가합니다.
> 
> 이 문제를 해결하는 일반적인 방법은 Public DMZ 망에
> <a href="https://en.wikipedia.org/wiki/Bastion_host" target="_blank">Bastion Host(배스천 호스트)</a>를 두고
> 한 단계 보안망을 거쳐서 접속하는 것입니다.
> 
> 다음의 SSM 세션콘솔을 통한 접속은 SSH 세팅, Bastion Host 구축 등의 단계 없이 AWS 웹콘솔에서 직접 인스턴스에 터미널 접속하는
> 방법입니다. AWS 웹콘솔은 일련의 보안절차를 거쳐 접속하므로, 안정성이 확보된다 볼 수 있습니다.
>
> (하지만 더욱 철저한 보안성을 요구하는 사내환경에서는 애초에 이러한 진입점을 두지 않기 위해 Site-to-Site VPN 연동 서비스를 활용하여
> 사내 VPN 형태로 Bastion Host 를 구성하기도 합니다.)

터미널 접속으로 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#aws-systems-manager---session-manager"
target="_blank">SSM</a>** 세션 매니저를
사용할 것이기 때문에 앞서 SSH 22 포트를 열어놓지 않았습니다.
따라서 **SSM 환경**을 세팅해 보겠습니다.

단계는 **a. SSM <a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#aws-identity-and-access-management-iam"
target="_blank">IAM</a> 롤 생성 및 적용**,
**b. SSM 을 위한 <a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#vpc-endpoint"
target="_blank">엔드포인트</a> 생성**,
**c. <a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#security-group-sg"
target="_blank">보안 그룹</a> 세팅** 순입니다.

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

SSM 세션 매니저 접속은 **AWS 웹 콘솔을 통해 외부에서 private 서브넷 내 인스턴스에 접근**하는 것이므로(별도 인터넷 경유 없이),
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

SSM 세션 매니저 터미널 접속은 AWS 의 서비스중 하나로써 동일 리전내 고객의 VPN 에 구축된 인스턴스에 직접적으로 접속하는 것입니다.
이와 관련 규칙들은 private 서브넷 내의 서비스 인스턴스와 VPC 엔드포인트에 적용되어 있습니다.
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
**EC2 페이지에서 활성화된 인스턴스를 클릭하고, 상단의 '연결' > 'Session Manager' 탭** 에서도 확인 가능합니다.

> **동일하게 작업했는데 세션 매니저에 활성화되지 않는 경우?**
>> 별다른 문제가 없는것 같은데 활성화되지 않는 경우가 종종 발생했습니다.
>> 이 경우 인스턴스를 재시작해 보거나 새로 생성하며 IP 주소를 바꿔보는 등 시도해보시기 바랍니다.
>> 최초 한 번만 연결 성공하면 그 이후는 계속 연결이 잘 됐습니다.
>> (보통은 10분 ~ 15분 정도 기다려 보십시오.)

<br>
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
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ sudo passwd root
New password:
Retype new password:
passwd: password updated successfully
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$
ssm-user@ip-10-20-10-31:/var/snap/amazon-ssm-agent/4047$ su - root
Password:
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# apt-get update
0% [Connecting to ap-northeast-2a.clouds.ports.ubuntu.com (2001:67c:1562::15)] [Connecting to ports.ubuntu.com (2001:67c:1562::15)] [Connecting to download.docker.com (2600:9000:2001:5c00:3:db06:4200:93a1)] [C
```

> 위와 같이 root 권한 접속 이후 실사용자 및 어드민 계정 세팅, 기본 패키지 설치 및 sudoers 설정 등 기본적인 작업이 필요하나
> 지금은 시리즈의 복잡성을 낮추기 위해 root 권한으로만 진행하겠습니다.

그런데 위와 같이 SSM 세션 매니저로 인스턴스에 접근은 성공했지만
private 서브넷 내에 있고 외부망 연결설정을 하지 않았기 때문에 'apt-get' 패키지 매니저가 외부와 인터넷 통신을 하지 못합니다.

따라서 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#nat-gateway-nat"
target="_blank">NAT</a>** 를 활용해 환경 구축시에만 임시적으로 외부 인터넷 리퀘스트가 가능하도록 해봅시다.

(만약 VPC 구축 단계에서 NAT 를 만들어두지 않았다면
**<a href="{{ site.github.url }}/cloud/2021/09/18/build-cloud-infra-with-aws01#4-optional-nat-게이트웨이-생성-및-적용"
target="_blank">여기</a>** 로 가서 만듭니다.)

<br>

---

<br>
### (4) NAT 를 활용해 private 인스턴스 인터넷 연결

NAT 게이트웨이 생성 후 EIP 할당된 상태라고 가정합니다.

```text
[NAT 를 Private 전용 라우트 테이블에 적용]
- 라우트 테이블 탭에서 private 전용 테이블인 'my-route-private' 선택
- 라우트 탭에서 '라우트 수정'
    - 목적지는 '0.0.0.0/0', 타겟은 'My-NAT' 규칙 추가
```

외부와 통신할 private 인스턴스가 속한 서브넷의 **라우트 테이블(사설 전용 테이블)에 퍼블릭 서브넷에 붙힌 NAT 방향 규칙을 추가**합니다.

이제 private 인스턴스에서 이 게이트웨이를 통하는 Outbound 트래픽은
**<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#internet-gateway-igw"
target="_blank">IGW</a>** ('my-igw') 를 지나 인터넷 통신이 가능합니다.

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

<br>
#### (4-1) NAT 삭제하기

> 다음으로 웹앱 구축을 해야하기 때문에 모든 과정을 마친 후 NAT 삭제하시기 바랍니다.

NAT 게이트웨이를 활용한 트래픽과 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#elastic-ip-address-eip"
target="_blank">EIP</a>** 에 대한 비용이 발생하므로
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
다시 웹앱 환경 구축으로 돌아오겠습니다.

> 포트 포워딩을 위한 프록시 웹서버는
> <a href="https://www.nginx.com/resources/wiki/" target="_blank">Nginx</a>, 웹앱은 파이썬
> <a href="https://flask.palletsprojects.com/en/2.1.x/" target="_blank">Flask</a>

외부와의 통신이 필요하므로 아직 NAT 연결은 삭제하면 안 됩니다.

```text
[Nginx 설치]
root@ip-10-20-10-31:~# apt-get install nginx
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:
  fontconfig-config fonts-dejavu-core libfontconfig1 libgd3 libjbig0 libjpeg-turbo8 libjpeg8 libnginx-mod-http-image-filter
  libnginx-mod-http-xslt-filter libnginx-mod-mail libnginx-mod-stream libtiff5 libwebp6 libxpm4 nginx-common nginx-core
Suggested packages:
  libgd-tools fcgiwrap nginx-doc ssl-cert
The following NEW packages will be installed:
  fontconfig-config fonts-dejavu-core libfontconfig1 libgd3 libjbig0 libjpeg-turbo8 libjpeg8 libnginx-mod-http-image-filter
  libnginx-mod-http-xslt-filter libnginx-mod-mail libnginx-mod-stream libtiff5 libwebp6 libxpm4 nginx nginx-common nginx-core
0 upgraded, 17 newly installed, 0 to remove and 95 not upgraded.
Need to get 2432 kB of archives.
After this operation, 7891 kB of additional disk space will be used.
Do you want to continue? [Y/n] y
Get:1 http://ap-northeast-2.ec2.archive.ubuntu.com/ubuntu focal/main amd64 fonts-dejavu-core all 2.37-1 [1041 kB]
Get:2 http://ap-northeast-2.ec2.archive.ubuntu.com/ubuntu focal/main amd64 fontconfig-config all 2.13.1-2ubuntu3 [28.8 kB]
Get:3 http://ap-northeast-2.ec2.archive.ubuntu.com/ubuntu focal/main amd64 libfontconfig1 amd64 2.13.1-2ubuntu3 [114 kB]

...

root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# systemctl status nginx.service
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2022-03-29 09:28:00 UTC; 1min ago
     ...
```

패키지 업데이트 후, root 권한으로 nginx 를 설치하면 바로 구동까지 이어집니다.

다음으로 nginx 서버설정 파일인 /etc/nginx/sites-available/default 파일을 vi 에디터로 열고 포트 포워딩 설정을 해줍니다.

```text
[Nginx 포트 포워딩 설정]
root@ip-10-20-10-31:~# vim /etc/nginx/sites-available/default

...

server {
    listen 8888 default_server;
    listen [::]:8888 default_server;

    root /var/www/html;

    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        proxy_pass http://localhost:8000;
    }
}

...
```

":wq" 입력하여 설정 저장 후 나옵니다. 이로써
기본 서버가 8888 포트를 리스닝하게 되며 들어온 요청들은 'http://localhost:8000;', 즉 8000 포트의 서비스로 포워딩됩니다.
(이후 구축할 Flask 서버앱의 서비스 포트가 8000)

이제 변경된 설정을 적용하기 위해 nginx 서비스를 재기동합니다.

```text
root@ip-10-20-10-31:~# systemctl restart nginx.service
root@ip-10-20-10-31:~# systemctl status nginx.service
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2022-03-29 09:28:52 UTC; 5s
     ...
```

서버로 Flask 앱을 활용할 것이기 때문에 파이썬 환경을 구축해줍니다.

파이썬을 버전별로 유연하게 관리할 수 있는 pyenv 를 활용합니다.

```text
root@ip-10-20-10-31:~# sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
xz-utils tk-dev
Reading package lists... Done
Building dependency tree
Reading state information... Done
curl is already the newest version (7.68.0-1ubuntu2.7).
curl set to manually installed.
wget is already the newest version (1.20.3-1ubuntu2).
wget set to manually installed.
xz-utils is already the newest version (5.2.4-1ubuntu1).
xz-utils set to manually installed.
The following additional packages will be installed:
  binfmt-support binutils binutils-common binutils-x86-64-linux-gnu bzip2-doc cpp cpp-9 dpkg-dev fakeroot g++ g++-9 gcc gcc-9 gcc-9-base
  libalgorithm-diff-perl libalgorithm-diff-xs-perl libalgorithm-merge-perl libasan5 libatomic1 libbinutils libc-dev-bin libc6 libc6-dev libcc1-0
  libclang-cpp10 libcrypt-dev libctf-nobfd0 libctf0 libdpkg-perl libdrm-amdgpu1 libdrm-intel1 libdrm-nouveau2 libdrm-radeon1 libexpat1 libexpat1-dev

...

Setting up tk8.6-dev:amd64 (8.6.10-1) ...
Setting up tk-dev:amd64 (8.6.9+1) ...
Processing triggers for mime-support (3.64ubuntu1) ...
Processing triggers for libc-bin (2.31-0ubuntu9.2) ...
Processing triggers for systemd (245.4-4ubuntu3.13) ...
Processing triggers for man-db (2.9.1-1) ...
Processing triggers for install-info (6.7.0.dfsg.2-5) ...
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# git clone https://github.com/pyenv/pyenv.git ~/.pyenv
Cloning into '/root/.pyenv'...
remote: Enumerating objects: 21054, done.
remote: Counting objects: 100% (1483/1483), done.
remote: Compressing objects: 100% (305/305), done.
remote: Total 21054 (delta 1258), reused 1251 (delta 1148), pack-reused 19571
Receiving objects: 100% (21054/21054), 4.22 MiB | 12.58 MiB/s, done.
Resolving deltas: 100% (14241/14241), done.
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# ls -la
total 36
drwx------  6 root root 4096 Apr  1 13:51 ./
drwxr-xr-x 19 root root 4096 Apr  1 13:36 ../
-rw-r--r--  1 root root 3106 Dec  5  2019 .bashrc
-rw-r--r--  1 root root  161 Dec  5  2019 .profile
drwxr-xr-x 12 root root 4096 Apr  1 13:51 .pyenv/
drwx------  2 root root 4096 Apr  1 13:36 .ssh/
-rw-------  1 root root 1482 Apr  1 13:43 .viminfo
drwxr-xr-x  3 root root 4096 Apr  1 13:44 project/
drwxr-xr-x  4 root root 4096 Apr  1 13:36 snap/
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# 
```

패키지 설치 시 빌드이슈를 사전에 방지하기 위해 사전 패키지 설치를 진행한 후,
pyenv 깃 레포지토리를 clone 해옵니다.

마지막에 ls 명령으로 확인하면 .pyenv/ 디렉토리가 생성된 것을 볼수 있습니다.

다음으로 pyenv 환경설정 후 원하는 버전을 세팅합니다.

```text
root@ip-10-20-10-31:~# export HOME=/root
root@ip-10-20-10-31:~# export PYTHON_ROOT=$HOME/.pyenv
root@ip-10-20-10-31:~# export PATH="$HOME/.pyenv/shims:$HOME/.pyenv/bin:$PATH"
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# eval "$(pyenv init -)"
root@ip-10-20-10-31:~# eval "$(pyenv virtualenv-init -)"
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# pyenv install 3.8.13
Downloading Python-3.8.13.tar.xz...
-> https://www.python.org/ftp/python/3.8.13/Python-3.8.13.tar.xz
Installing Python-3.8.13...
Installed Python-3.8.13 to /root/.pyenv/versions/3.8.13
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# pyenv global 3.8.13
root@ip-10-20-10-31:~# pyenv versions
  system
* 3.8.13 (set by /root/.pyenv/version)
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# python --version
Python 3.8.13
```

pyenv 환경변수 설정 및 초기화 후 3.8.13 버전을 세팅했습니다. (셸 환경변수를 유지하려면 .bashrc 파일 하단에 위 내용을 기록합니다)

다음으로 파이썬 Flask 프로젝트를 설치 후 기동해보겠습니다.

```text
root@ip-10-20-10-31:~# mkdir -p ./project/server-flask
root@ip-10-20-10-31:~# ls -lR ./project/
./project/:
total 4
drwxr-xr-x 2 root root 4096 Mar 31 12:40 server-flask

./project/server-flask:
total 0
root@ip-10-20-10-31:~# 
root@ip-10-20-10-31:~# cd ./project/server-flask/
root@ip-10-20-10-31:~/project/server-flask# 
root@ip-10-20-10-31:~/project/server-flask# 
```

Flask 설치를 위한 디렉토리를 생성하고 해당 위치로 이동합니다.

```text
root@ip-10-20-10-31:~/project/server-flask# git init
Initialized empty Git repository in /root/project/server-flask/.git/
root@ip-10-20-10-31:~/project/server-flask# 
root@ip-10-20-10-31:~/project/server-flask# git remote add upstream https://github.com/daesungRa/server-flask.git
root@ip-10-20-10-31:~/project/server-flask# git remote -v
upstream        https://github.com/daesungRa/server-flask.git (fetch)
upstream        https://github.com/daesungRa/server-flask.git (push)
root@ip-10-20-10-31:~/project/server-flask# 
root@ip-10-20-10-31:~/project/server-flask# git pull upstream master
remote: Enumerating objects: 145, done.
remote: Counting objects: 100% (145/145), done.
remote: Compressing objects: 100% (106/106), done.
remote: Total 145 (delta 58), reused 103 (delta 31), pack-reused 0
Receiving objects: 100% (145/145), 33.65 KiB | 6.73 MiB/s, done.
Resolving deltas: 100% (58/58), done.
From https://github.com/daesungRa/server-flask
 * branch            master     -> FETCH_HEAD
 * [new branch]      master     -> upstream/master
root@ip-10-20-10-31:~/project/server-flask# 
root@ip-10-20-10-31:~/project/server-flask# git status
On branch master
nothing to commit, working tree clean
root@ip-10-20-10-31:~/project/server-flask# 
```

git 프로젝트를 활성화하고
<a href="https://github.com/daesungRa/server-flask" target="_blank">server-flask 프로젝트</a>를
가져옵니다.(git pull)

(**server-flask** 는 제가 사용하는 Flask 퀵스타트 프로젝트입니다.)

```text
root@ip-10-20-10-31:~/project/server-flask# pip install -U virtualenv
root@ip-10-20-10-31:~/project/server-flask# virtualenv venv
root@ip-10-20-10-31:~/project/server-flask# . ./venv/bin/activate
(venv) root@ip-10-20-10-31:~/project/server-flask# pip install -r requirements.txt
(venv) root@ip-10-20-10-31:~/project/server-flask# cp ./conf.d/apps.yaml.sample ./conf.d/apps.yaml
(venv) root@ip-10-20-10-31:~/project/server-flask# nohup sh run_app.sh &
run_app.sh: 2: Bad substitution
[2022-04-02 03:34:32 +0000] [37650] [INFO] Starting gunicorn 20.0.4
[2022-04-02 03:34:32 +0000] [37650] [INFO] Listening at: http://127.0.0.1:8000 (37650)
[2022-04-02 03:34:32 +0000] [37650] [INFO] Using worker: gevent
[2022-04-02 03:34:32 +0000] [37653] [INFO] Booting worker with pid: 37653
```

위와 같이 pip, virtualenv 툴로 파이썬 가상환경을 구축하고 필요한 패키지를 설치한 후 서버를 기동합니다.
서버 실행 스크립트를 데몬 프로세스처럼 실행하기 위해 nohup 툴을 사용합니다.

```text
(venv) root@ip-10-20-10-31:~/project/server-flask# curl http://localhost:8888
<p>This is index page!</p>
(venv) root@ip-10-20-10-31:~/project/server-flask# 
(venv) root@ip-10-20-10-31:~/project/server-flask# curl http://localhost:8000
<p>This is index page!</p>
(venv) root@ip-10-20-10-31:~/project/server-flask#
```

서버 인스턴스 내부에서 curl 로 호출시 잘 응답되는 것을 볼수 있습니다.
nginx 를 거치려면 8888 포트로(http), nginx 를 거치지 않고 8000 포트로 호출되는 것을 볼 수 있습니다.

> **서버 이중화를 위해 [인스턴스 터미널 접속](#2-인스턴스-터미널-접속) 과정을 한번 더 진행합니다.**
> 
> 'my-subnet-private02' 서브넷, 'my-service-02(10.20.20.32)' 인스턴스**

> **private 인스턴스는 외부로의 아웃바운드 통신이 필요없을 시 [NAT 게이트웨이 연결을 삭제](#optional-nat-삭제하기)하도록 합시다**

<br>
## ELB 를 활용해 부하분산 트래픽 적용하기

앞서 기동한 Flask 서버는 private 서브넷에 구축되었기 때문에 VPC 외부에서는 접근할 수 없습니다. (외부 사용자의 직접적 서비스 접근 불가)

따라서 Public 대역에 **<a href="{{ site.github.url }}/cloud/2021/09/18/aws-terminologies#elastic-load-balancer-elb"
target="_blank">로드밸런서(ELB)</a>** 를 생성하여 진입점을 만들어주도록 합시다.

로드밸런서는 RR(Round Robin) 방식의 트래픽 다중화 배분에 최적화된 부하분산을 담당합니다.

우선 로드밸런서에 적용할 **대상 그룹(타겟 그룹)**을 생성합니다.
대상 그룹은 사전에 정의된 request 들을 로드밸런서가 어떤 대상에게 어떤 방식(protocol, port)으로 route 할지 지정하는 일종의 규칙입니다.

```text
[대상 그룹 생성]
1. AWS 웹콘솔 EC2 서비스의 '대상 그룹' 탭으로 이동하여 '대상 그룹 생성' 클릭
2. 대상 타입은 '인스턴스', 대상 그룹명은 'my-TG-service'
3. Protocol 은 'HTTP', Port 는 '8888'
4. VPC 는 'My-VPC' 선택, Protocol version 은 'HTTP1'
5. 헬스 체크는 'HTTP' 의 '/health' path 로 라우팅
6. 태그명은 'Name' 에 'my-TG-service' 후 다음 클릭
7. 타겟 등록
    - 'my-service-01', 'my-service-02' 선택, Ports for the selected instances 는 '8888' 포트
    - Include as pending below 클릭하여 타겟 그룹에 포함
8. 대상 그룹 생성 클릭!
```

다음으로 로드밸런서를 생성합니다.

```text
[로드밸런서 생성]
1. EC2 서비스의 '로드밸런서' 탭으로 이동하여 '로드 밸런서 생성' 후 'Application Load Balancer' 의 'create' 클릭
2. 로드밸런서 이름은 'my-ELB-service'
3. Scheme 은 'internet-facing', IP address type 은 'IPv4'
4. Network mapping 의 VPC 는 'My-VPC'
    - Mapping 은 가용영역 'ap-northeast-2a', 'ap-northeast-2b' 선택하여 이중화
    - 가용영역별 'my-subnet-public01', 'my-subnet-public02' 서브넷 각각 선택
5. 보안그룹(Security groups)은 'my-SG-public' 선택
6. 리스너 및 라우팅은 HTTP:80 리스너에 'my-TG-service' 타겟 그룹으로 라우팅되도록 지정
7. 태그명은 'Name' 에 'my-ELB-service'
8. 요약 내용 확인 후 '로드밸런서 생성' 클릭
```

이렇게 ELB 중 한 종류인 ALB 가 생성됩니다.<br>(ALB 는 application 계층에서 부하분산을 수행하는 로드밸런서)

초기 프로비저닝 상태를 기다리다 보면 몇분후 active 상태가 됩니다.

생성한 로드밸런서를 클릭하여 **'DNS name'** 값을 보면,<br>
**'my-ELB-service-482 ... .ap-northeast-2.elb.amazonaws.com'** 과 같은 형태로 도메인명이 생성된 것을 볼 수 있습니다.

브라우저에서 DNS 이름으로 접속하면 Flask 인스턴스 로컬 테스트에서 보았던 **'<p>This is index page!</p>'**
문구를 확인할 수 있습니다.

> **요청 순서**
> 1. 브라우저 request
> 2. AWS ELB 부하분산
> 3. private 서브넷의 Flask 인스턴스로 라우팅
> 4. 인스턴스 내 nginx 가 8888 라우팅 요청을 Flask 서버앱(8000)으로 proxy_pass
> 5. 서버의 응답, 브라우저에서 확인

```text
[브라우저에서 DNS 접속하기]
'<p>This is index page!</p>' 확인!
```

<br>
## 추가 사항

다음은 추가로 더 살펴보면 좋은 서비스들입니다.

### (1) 인증서 및 도메인 등록

앞선 단계에서는 HTTP 프로토콜을 통한 기본적인 접속만 가능했습니다.

**AWS ACM, Route53** 서비스를 활용하면 인증서 발급 및 도메인 설정과 HTTPS 보안접속이 가능합니다.

<br>
### (2) 데이터베이스 적용

안정성 높은 관계형 데이터베이스의 사용이 필요하다면, EC2 인스턴스에 직접 데이터베이스를 설치하기보단
**AWS RDS** 인스턴스를 구축하여 연결하는 것이 더 좋습니다.

RDS 는 Oracle, MySQL, MariaDB, PostgreSQL, Microsoft SQL Server 등의 버전을 사용할 수 있습니다.

AWS 에서는 NoSQL 서비스인 **DocumentDB(MongoDB)**, 캐싱 서비스인 **ElastiCache** 도 존재합니다.

<br>
### (3) 요금 절감 전략

**스팟 인스턴스(Spot Instance), Savings Plan** 등의 서비스로 EC2 인스턴스의 연간 요금을 1/2 ~ 1/3 가량 줄일 수 있습니다.
