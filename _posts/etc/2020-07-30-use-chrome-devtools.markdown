---
title:  (번역) 크롬 개발자도구를 시니어처럼 쓰기
date:   2020-07-30 22:23:00 +0900
author: namu
categories: etc
permalink: "/etc/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2016/09/13/11/04/browser-1666982_1280.png
image-view: true
image-author: 200degrees
image-source: https://pixabay.com/ko/users/200degrees-2051452/
---


---

[목차]

1. [들어가며](#들어가며)
2. [Powerful screenshots](#powerful-screenshots)

---

<br>

출처: [Use Chrome DevTools Like a Senior Frontend Developer](https://medium.com/javascript-in-plain-english/use-chrome-devtools-like-a-senior-frontend-developer-99a4740674)

### 들어가며

**부제: 크롬을 개발환경으로 고른다면 꼭 알아야 할 11가지 팁!**

몇몇 이유로 인해 마침내 당신은 개발을 위해 크롬을 브라우저로 선택하게 되었다고 하자.
그럼 개발자 도구를 열고 코드를 디버깅하기 시작한다.

당신은 때때로 프로그램의 아웃풋을 테스트하기 위해 콘솔 패널을 열거나,
```DOM``` 엘리먼트의 ```CSS``` 코드를 확인하기 위해 속성 패널을 열 것이다.

그러나 당신은 정말로 크롬 개발자 도구를 이해하고 있는가?
사실 그것은 우리의 개발 효율성을 훌륭하게 상승시킬 수 있는 매우 강력하면서도 잘 알려지지 않은 기능들을 제공한다.

이 글에서 나는 당신을 도울 수 있는 가장 유용한 기능들을 소개하고자 한다.

시작하기 전에 커맨드 메뉴를 소개하려고 한다.
커맨드 메뉴는 쉘이 리눅스를 크롬으로 만든 것이다(The Command menu is to Chrome what the Shell is to the Linux).
커맨드 메뉴는 크롬을 다루기 위한 몇 가지 명령들을 입력할 수 있게 허용한다.

첫째로 크롬 개발자 도구를 열고, 다음의 shortcut 을 활용해 커맨들 메뉴를 열어보자.

- windows : Ctrl + Shift + P
- macOS : Cmd + Shift + P

아니면 그냥 아래의 버튼을 클릭해 보자. (상단의 ... 세팅 > Run command)

그럼 여러 강력한 기능들을 실행하기 위해 선택할 수 있는 다양한 명령어들이 존재하는 커맨드 패널로 이동하게 된다.

### Powerful screenshots

화면의 일부를 캡쳐하는 것은 아주 일반적인 요구사항이고,
나는 당신이 이미 컴퓨터에 매우 편리한 스크린샷 소프트웨어를 가지고 있을 거라고 확신한다.
그러나 다음의 작업들을 다 할수 있는가?

- 윈도우 화면에 드러나지 않는 그 어떤 것이라도 포함하는 웹 페이지의 모든 것의 스크린샷을 찍기
- 정확히 ```DOM``` 엘리먼트를 캡쳐하기

이것들은 두 가지 일반 요구사항이지만, 운영체제로부터 온 스크린샷 툴들을 이용해서는 쉽게 해결할 수 없을 것이다.
이 지점에서 우리는 이 요구사항들을 완료하는 것을 돕기 위해 ```Commands``` 를 활용할 수 있다.

이와 관련된 명령어들은:

- Screenshot Capture full size screenshot
- Screenshot Capture node screenshot

### 예제


