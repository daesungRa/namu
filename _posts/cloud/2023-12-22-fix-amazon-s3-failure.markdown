---
title: "s3 이슈 정리(연결 실패, 수명 주기)"
created: 2023-12-22 15:00:00 +0900
updated: 2023-12-22 15:00:00 +0900
author: namu
categories: cloud
permalink: "/cloud/:year/:month/:day/:title"
image: https://miro.medium.com/v2/resize:fit:720/format:webp/1*X6qpenzLMHjvbKZ5ag6JFg.png
image-view: true
image-author: Amir Mustafa
image-source: https://amirmustafaofficial.medium.com/?source=post_page-----3550e0b87580--------------------------------
---

---

### 목차

- [S3 연결 실패 해결하기](#s3-연결-실패-해결하기)
- [수명 주기 설정하기](#수명-주기-설정하기)

### 참조

- <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/troubleshoot-403-errors.html" 
target="_blank">Troubleshoot Access Denied (403 Forbidden) errors in Amazon S3</a>

---

<br>
### S3 연결 실패 해결하기

**Public accessable S3 bucket** 이라면 단지 방화벽만 오픈하면 되겠지만 **Private subnet 의 Instance 에서 Private bucket 에
접근**하려면 **gateway VPC endpoint 설정**이 필요합니다.

- **IAM Role 생성 및 Instance 연결**
- **S3 bucket policy**
- **gateway VPC Endpoint**
- **Security group outbound rule**
- **기타 원인**

<br>
### 수명 주기 설정하기

**S3 Bucket Lifecycle 을 prefix 값과 함께 설정**하여 특정 패턴의 객체가 일정 시간이 지나면
**<a href="{{ site.github.url }}/cloud/2023/01/28/aws-certificate01#s3-및-기타-스토리지"
target="_blank">다른 스토리지 클래스</a>로 이동되거나 삭제**되도록 할 수 있습니다.

