---
title:  "MongoDB 에 datetime 객체 저장하기"
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

사실 NoSQL 뿐만 아니라 어느 형태의 DB 이든 시간을 나타내는 객체를 다룰 때는 고려할 점이 많습니다.
그 중 대표적인 것이 시간대를 지정하는 것인데,
요즘의 웹앱 제품들은 국제화(Internationalization)를 염두에 두고 만들어지기 때문에 이는 중요한 이슈입니다.

제가 실무에서 사용중인 mongodb 에서 datetime 객체는
**[UTC 시간대](https://www.timeanddate.com/time/aboututc.html)를 표준으로 저장**됩니다.
따라서 이와 다른 시간대라면 datetime 정보 제공 시 프로그램적으로 시간대(이하 timezone)를 조정하는 과정이 필요합니다.

이 포스트에서는 python + mongodb 환경에서 datetime 객체를 저장할 때 지켜야 할 두 가지 원칙에 대해 설명하고자 합니다.

<br>
## Aware VS Naive

파이썬의 **[datetime](https://docs.python.org/3/library/datetime.html)** 객체는
tzinfo 속성값으로 timezone 정보를 포함할 수 있습니다.
하지만 별도로 지정해주지 않으면 단순히 날짜+시간 정보만 저장됩니다<small>(tzinfo 에는 기본적으로 NoneType class 가 저장됩니다)</small>.
정말 단순히 날짜+시간만을 표현하는 것이죠. 이 경우 시차로 인해 같은 datetime 객체를 가지고도 한국과 미국에서 해석하는 시점이 다르게 됩니다.

timezone 정보가 포함되지 않은 datetime 객체를 **"Naive"** 하다고 합니다.
반대로 timezone 정보가 포함되어 있으면 **"Aware"** 상태라고 합니다.

> [python org 문서](https://docs.python.org/3/library/datetime.html)를 참조해보면,
>timezone information 을 포함하는지 여부에 따라 "aware"와 "naive"가 구분된다고 합니다.

대표적인 파이썬 timezone 라이브러리인 **[pytz](https://pypi.org/project/pytz/)** 에 저장되어 있는 세계의 timezone 들과
한국 및 UTC 표준 timezone 을 확인해 봅시다.

```python
import pytz

# all timezones
print(pytz.all_timezones)  # ['Africa/Abidjan', 'Africa/Accra', ... 'Asia/Seoul', ... 'UTC', ...]

# KST, UTC timezones
pytz.timezone('Asia/Seoul')  # <DstTzInfo 'Asia/Seoul' KST+9:00:00 STD>
pytz.timezone('UTC')  # <UTC>
```

<br>
## Aware 객체 만들기

물론 timezone 정보를 포함하지 않는 Naive 객체는 상대적으로 다루기 편리합니다.
timezone 고려를 하지 않기 때문에 시간을 비교하거나 기간 계산 시 코딩하기가 수월하죠.
하지만 앞서 기술했듯이 이는 국제화 환경에서 혼선을 야기할 수 있습니다.
따라서 약간 불편하더라도 **Aware 객체를 사용하는 원칙**을 세우는 것이 일관성 면에서 좋습니다.
<br><br>

> 원칙 1. **항상 Aware 객체를 사용하기!**

<br>
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

```dt_```로 시작하는 세 변수는 모두 동일한 시점입니다.
하지만 ```dt_naive``` 변수는 단순히 날짜+시간 정보만 포함하고 나머지 두 변수는 timezone 까지 지정되어 있습니다.
이처럼 datetime 의 astimezone 메서드를 통해 tzinfo 를 설정할 수 있습니다.

그런데 **```dt_aware_kst```와 ```dt_aware_utc```의 차이를 주목해 보세요.** 서로 나타내는 날짜와 시간이 다릅니다.
하지만 개발자는 datetime 객체에 포함된 tzinfo 를 통해 각각 한국 시간대와 UTC 표준 시간대라는 사실을 알 수 있습니다.
이 정보를 활용해 둘이 같은 시점이라는 사실도 도출해낼 수 있겠죠.

> [datetime.astimezone](https://docs.python.org/3/library/datetime.html#datetime.datetime.astimezone)
>> astimezone(tz=None) 메서드는 datetime 객체에 timezone 정보가 없다면 입력된 tz 정보를 tzinfo 에 저장하여 반환하고,
>> 있다면 timezone 간의 차이만큼 날짜 및 시간을 조정하여 새로운 tzinfo 와 함께 반환합니다.

> [datetime.replace](https://docs.python.org/3/library/datetime.html#datetime.datetime.replace)
>> replace(tzinfo=None) 메서드는 날짜 및 시간을 조정하지 않고 tzinfo 만 채워줍니다.
>> 만약 None 을 넣는다면 datetime 객체에서 tzinfo 를 제거하는 효과가 있습니다.

참고로 우리가 사용하는 UTC 와 KST 사이에 +9시간의 차이가 난다는 사실을 알고 있으면 좋습니다.
<small>(두 aware 객체 사이의 시간차를 따져보세요!)</small>

<br>
## Aware 객체를 mongodb 에 저장하기

aware 객체가 mongodb 에 저장될 때는 항상 UTC 를 기준으로 저장됩니다.
따라서 만약 투입되는 datetime 객체가 KST timezone 이라면 UTC timezone 으로 조정됩니다.

```python
import datetime
import pytz
import pymongo


KST = pytz.timezone('Asia/Seoul')

# Create test collection
CLIENT = pymongo.MongoClient("mongodb://localhost:27017/")
TEST_DB = CLIENT.test
TEST_COLLECTION = pymongo.collection.Collection(database=TEST_DB, name='test')


# New document
naive_now = datetime.datetime.now()  # datetime.datetime(2021, 3, 30, 0, 0)
kst_now = naive_now.astimezone(tz=KST)  # datetime.datetime(2021, 3, 30, 0, 0, tzinfo=<DstTzInfo 'Asia/Seoul' KST+9:00:00 STD>)
naive_doc = {'text': "I'm naive!", 'dt': naive_now}
kst_doc = {'text': "I'm kst!", 'dt': kst_now}

# Save document
naive_id = TEST_COLLECTION.insert_one(naive_doc).inserted_id  # ObjectId('6061e43ff5c0b80d7f0a8583')
kst_id = TEST_COLLECTION.insert_one(kst_doc).inserted_id  # another id

# Check document
print(TEST_COLLECTION.find_one({'_id': naive_id})['dt'])  # 2021-03-30 00:00:00
print(TEST_COLLECTION.find_one({'_id': kst_id})['dt'])  # 2021-03-29 15:00:00
```

자, ```# Check document``` 파트의 출력 결과를 보세요.
분명 같은 날짜+시간을 나타내는 naive 와 aware 객체를 mongodb 에 저장했지만,
저장된 결과를 불러오니 차이가 발생했습니다.

위에서 살펴본 ```.astimezone(tz=UTC)``` 의 결과와 같지 않나요?
이는 insert 과정에서 KST aware 객체는 UTC timezone 으로 자동변환되기 때문입니다.
이것을 그대로 find 하는 과정에서 변환된 날짜+시간만이 출력됩니다.
<br><br>

> 원칙 2. **mongodb 에는 항상 UTC aware 객체가 저장된다!**

<br>
사실 이것은 원칙이라기보다는 mongodb 자체의 스펙입니다.
[공식 문서](https://docs.mongodb.com/manual/tutorial/model-time-data/)를 보면,
**```MongoDB stores times in UTC by default```** 라고 설명하고 있습니다.
기본적으로 UTC 시간을 저장한다는 것이고, 뒤에 설명을 좀더 살펴보면 어떠한 local time representations 도 이 형식에 맞춰진다고 합니다.
각 로컬 시간대 간의 차이는 **application 사이드에서 계산하도록 권장하고 있습니다.**

이 원칙에 따르면 datetime 저장 시 aware document 를 사용하는 것이 의미상으로 맞습니다.
왜냐하면 naive document 는 timezone 정보가 없어 아무런 조정 없이 mongodb 에 저장되고, 그것은 그대로 UTC 시간대로 취급되기 때문입니다.
naive 를 조회한다면 application 측에서 시간대 변경로직을 진행하여,
결국 출력되는 시간은 의도와는 다른 **```2021년 3월 30일 9시```**가 되어버리고 맙니다.

<small>+) mongodb 구동 시
[--timeStampFormat](https://docs.mongodb.com/manual/reference/program/mongos/#cmdoption-mongos-timestampformat)
옵션을 사용해 시스템 로컬 시간대를 바라보도록 세팅할 수 있다고는 하나, 이것은 원칙 2에 위배되어 혼선을 야기하게 됩니다.</small>

<br>
## 어플리케이션에서 timezone 변환하기

> 이 항목은 위의 두 가지 원칙에 대한 실제적인 활용예시입니다.

한국에서 동작하는 서버라면 KST timezone 을 사용하게 될 것입니다. 독일이나 호주라면 그곳에 맞는 시간대를 활용하겠죠.
aware 객체를 mongodb 에 저장할 때는 시간대가 자동 변환되기 때문에 별도로 고려할 부분이 없지만,
db 로부터 조회할 때는 공식 문서의 권장에 따라 **어플리케이션 차원에서 역으로 변환하는 과정**이 필요합니다.

또한 서버의 규모가 커질수록 find 하는 경우는 매우 많아질텐데, 그 모든 조회 코드에 astimezone 메서드를 적용하는 것은 굉장히 비효율적입니다.
따라서 지금부터 datetime 을 다루는 class 기반 공통 모듈을 만들어 보겠습니다. 프로젝트명은 test 라고 가정합니다.

**[~/test/mongodb/base.py]**
```python
"""
Base Module for MongoDB
"""

from datetime import datetime
from pytz import timezone

from pymongo import MongoClient
from pymongo.collection import Collection

from test.config import CONFIG


SERVER_TZ = timezone(CONFIG['tz_name'])


class TimeStampedMongodbHandler:
    tz: timezone
    _collection: Collection

    def __init__(self, db_name: str, collection_name: str):
        super().__init__()

        self.tz = SERVER_TZ

        mongo_client = MongoClient("mongodb://localhost:27017/")
        db = mongo_client[db_name]
        self._collection = Collection(database=db, name=collection_name)
    
    def get(self, **kwargs):
        return [
            {
                **doc,
                'created': doc['created'].replace(tzinfo=timezone('UTC')).astimezone(tz=self.tz),
                'updated': doc['updated'].replace(tzinfo=timezone('UTC')).astimezone(tz=self.tz),
            }
            for doc in self._collection.find(kwargs)
        ]

    def post(self, data: dict):
        utc_now = datetime.utcnow().replace(tzinfo=timezone('UTC'))
        return self._collection.insert_one(document={
            **data,
            'created': utc_now.astimezone(tz=SERVER_TZ),
            'updated': utc_now.astimezone(tz=SERVER_TZ),
        }).inserted_id
```

<br>
## 원칙 정리

datetime 객체를 mongodb 에 저장할 때는 항상 aware datetime 객체를 사용하고, db 에 저장되는 모든 날짜+시간정보는 UTC timezone 기준으로 
