---
title:  "[번역] REST API Versioning"
created:   2020-10-25 15:04:25 +0900
updated:   2020-10-25 15:04:25 +0900
author: namu
categories: web
permalink: "/web/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2018/04/06/13/46/poly-3295856_1280.png
image-view: true
image-author: Manuchi
image-source: https://pixabay.com/ko/users/manuchi-1728328/
---


---

[목차]

1. [REST API Versioning](#rest-api-versioning)
2. [When to Version](#when-to-version)
3. [How to Version](#how-to-version)

[참조]

1. [REST API Tutorial](https://restfulapi.net/versioning/)

---

<br>
## REST API Versioning

복잡성을 관리하기 위해 API 버저닝을 수행합니다.
버저닝은 필요한 변경점들을 더 빨리 캐치할 수 있도록 도와줍니다.

> API 를 변경하는 것은 시스템에 대한 당신의 지식과 경험을 향상시키는 데 있어서 꼭 필요합니다.
> 이러한 변화의 영향을 관리하는 것이 현재의 ```client integration``` 중단의 위험으로 다가올 때
> 그것은 큰 도전이 될 수 있습니다.

<br>
## When to Version

API 는 변경 사항이 생겨날 때마다 항상 최신 버전을 유지할 필요가 있습니다.
변경 사항에는 다음의 것들이 있습니다.

- 하나 혹은 여려 요청에 대한 응답 데이터 포맷의 변화
- 요청 혹은 응답 타입의 변화(i.e. integer 를 float 으로)
- 기존의 API 를 제거할 때

**변경 사항**이 있다면 항상 API 또는 컨텐트 [응답 타입](https://www.iana.org/assignments/media-types/media-types.xhtml)의
메이저 버전 번호를 변경해야만 합니다.

새 엔드포인드를 추가하거나 새 응답 파라미터를 추가하는 등 **변경 사항이 없는 경우**, 메이저 버전 번호 변경이 요구되지 않습니다.
그러나 캐싱된 데이터의 버전을 받거나 그 밖의 API 이슈들을 경험하고 있는 고객들에 대한 지원을 위해 변경되는 경우,
트랙킹(to track)을 위해 API 의 마이너 버저닝 하는 것은 도움이 됩니다.

<br>
## How to Version

REST 는 버저닝에 대해 어떠한 특정된 가이드라인을 제공하지 않습니다만, 세 종류의 좀더 일반화된 ```used approaches``` 가 존재합니다.

#### URI Versioning

URI 버저닝을 사용하는 것은 URI 가 단일 리소스를 참조해야 한다는 원칙을 해치는 경우라도 가장 올바르고 일반적인 방법입니다.
당신은 또한 버전이 업데이트될 때 ```client integration``` 을 중단해도 괜찮습니다.

e.g

```text
http://api.example.com/v1
http://apiv1.example.com
```

버전은 숫자일 필요도 없고, "v\[x\]" 와 같은 문법으로 특정되지 않아도 괜찮습니다.
팀이 API 를 생산하는데 있어서 충분히 의미적으로 맞고 버저닝에 따라 충분히 유연하다면
```dates```, ```project names```, ```seasons``` 혹은 그 밖의 다른 식별자들도 대체재가 될 수 있습니다.

#### Versioning using Custom Request Header

A custom header (e.g Accept-version) 는 버전이 변경되어도 당신의 URI 를 그대로 보존할 수 있도록 합니다.
비록 기존의 ```Accept header``` 에 의해 구현된 ```content negotiation``` 동작의 사실상의 복제라고 할지라도 말입니다.

e.g

```text
Accept-version: v1
Accept-version: v2
```

#### Versioning using Accept header

```content negotiation``` 은 ```a clean set of URLs``` 를 보존할 수 있도록 할지 모르지만,
당신은 여전히 서로 다른 버전 하에서 제공되는 특정 내용에 대한 복잡성을 다뤄야만 할 것입니다.
이러한 부담은 어떤 버전의 리소스가 제공되어야 하는지 파악할 책임이 있게 설계된 ```API 컨트롤러```에서
누적적으로 이행되는 경향이 있습니다.
이것의 결과로 리소스를 요청하기 이전에 어떤 헤더를 특정할 지와 관련해서
고객이 알아야 할 API 의 복잡성이 더 높아지는 경향이 있습니다.

e.g

```text
Accept: application/vnd.example.v1+json
Accept: application/vnd.example+json;version=1.0
```

현실 세계에서 API 는 완전하게 정립될 수 없습니다.
그러므로 중요한 것은 이러한 변경점들이 어떻게 관리되는가입니다.
잘 된 문서화와 ```gradual deprecation of API```(API 의 점진적 사용중단? 점진적 버저닝으로 이해..) 는
대부분의 API 에서 수용할 만한 실례가 될 수 있습니다.
