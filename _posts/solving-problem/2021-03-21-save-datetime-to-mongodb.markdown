---
title:  "MongoDB에 datetime형 데이터를 저장할 때"
created:   2021-03-21 17:04:25 +0900
updated:   2021-03-30 01:25:31 +0900
author: namu
categories: solving-problem
permalink: "/solving-problem/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2014/02/04/10/13/clocks-257911_1280.jpg
image-view: true
image-author: jarmoluk
image-source: https://pixabay.com/ko/users/jarmoluk-143740/
---

<br>
## 들어가며

사실 NoSQL 뿐만 아니라 어느 형태의 DB 이든 간에 datetime 데이터를 저장할 때는 고려할 점이 많습니다.
그 중 대표적인 것이 시간대를 지정하는 것인데,
요즘의 웹앱 제품들은 국제화(Internationalization)를 염두에 두고 만들어지기 때문에 이는 중요한 이슈입니다.

제가 실무에서 사용중인 mongodb 에서 datetime 객체는
**[UTC 시간대(이하 timezone)](https://www.timeanddate.com/time/aboututc.html)를 표준으로 저장**됩니다.
따라서 이와 다른 timezone 이라면 datetime 정보에 대한 제공 시 프로그램적으로 시간을 조정하는 과정이 필요합니다.

이 포스트에서는 datetime 객체에 timezone 정보를 지정하는 방법을 중심으로 간략하게 살펴보겠습니다.
테스트 환경은 MongoDB + Python3 입니다.

<br>
## Aware VS Naive

파이썬의 **[datetime](https://docs.python.org/3/library/datetime.html)** 객체는
tzinfo 속성값으로 timezone 정보를 포함할 수 있습니다.
하지만 별도로 지정해주지 않으면 단순히 날짜+시간 정보만 저장됩니다(tzinfo에는 NoneType class가 저장됩니다).
정말 단순히 날짜+시간만을 표현하는 것이죠. 이 경우 같은 datetime 객체에 대해서 한국과 미국에서는 서로 다른 시점으로 해석될 수 있습니다.

timezone 정보가 포함되지 않은 datetime 객체를 **"Naive"** 하다고 합니다.
반대로 timezone 정보가 포함되어 있으면 **"Aware"** 상태라고 합니다.

> [python org 문서](https://docs.python.org/3/library/datetime.html)를 참조해보면,
>timezone information 을 포함하는지 여부에 따라 "aware"와 "naive"가 구분된다고 합니다.

대표적인 파이썬 timezone 라이브러리인 **[pytz](https://pypi.org/project/pytz/)** 에 저장되어 있는 세계의 시간대들을 확인해 봅시다.

```python
import pytz

print(pytz.all_timezones)

# OUTPUT >> ['Africa/Abidjan', 'Africa/Accra', ... 'Asia/Seoul', ... 'UTC', ...]
```

<br>
## Aware 객체 만들기

물론 timezone 정보가 없기 때문에 Naive 객체는 다루기 쉽습니다.
timezone 고려를 하지 않아 시간을 비교하거나 기간을 계산할 때 코딩하기가 수월하죠.
하지만 앞서 기술했듯이 이는 국제화 환경에서 혼선을 야기시킬 수 있습니다. 따라서 약간 불편하더라도 **Aware 객체를 사용**하도록 합니다.

한국 timezone(KST, 'Asia/Seoul', +0900) 정보를 포함하는 Aware 객체를 생성하는 예시 코드를 봅시다.

```python
import datetime
import pytz


UTC = pytz.timezone('UTC')
KST = pytz.timezone('Asia/Seoul')


dt_naive = datetime.datetime.now()  # datetime.datetime(2021, 3, 30, 0, 0)
dt_aware_kst = dt_naive.astimezone(tz=KST)  # datetime.datetime(2021, 3, 30, 0, 0, tzinfo=<DstTzInfo 'Asia/Seoul' KST+9:00:00 STD>)
dt_aware_utc = dt_aware_kst.astimezone(tz=UTC)  # datetime.datetime(2021, 3, 29, 15, 0, tzinfo=<UTC>)
```

<br>
## datetime 객체를 mongodb 에 저장하기
