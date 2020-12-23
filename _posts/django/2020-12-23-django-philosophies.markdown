---
title: "[번역] 장고의 디자인 철학"
created: 2020-12-23 20:25:27 +0900
updated: 2020-12-23 20:25:27 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: https://miro.medium.com/max/875/1*KwSbyYyqaukruQVofd1HTQ.jpeg
image-view: true
image-author: Why you should use Django for your next project(Abdul Hafeez Abdul Raheem)
image-source: https://codeburst.io/why-you-should-use-django-for-your-next-project-83c775a750d1
---


---

[순서]

1. [Overall](#overall)
2. [Models](#models)
3. [Database API](#database-api)
4. [URL design](#url-design)
5. [Template system](#template-system)
6. [Views](#views)
7. [Cache Framework](#cache-framework)

---

<br>
## 들어가며

장고의 디자인 철학은 무엇일까요?
**_<a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/" target="_blank">공식 페이지의 설명</a>_**을
참조해 봅시다.

> 이 문서는 프레임워크를 만들 때 장고 개발자들이 사용한 기초적인 철학에 대해 설명합니다.
> 이것의 목적은 과거에 대한 설명과 미래에 대한 가이드입니다.

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#overall" target="_blank">Overall</a>

#### 낮은 결합도

장고 스택의 기본적 목표는
<a href="http://wiki.c2.com/?CouplingAndCohesion" target="_blank">결합도를 낮추고 응집도를 높이는</a> 데 있습니다.
프레임워크의 다양한 계층들은 각각 서로간에 대해서 알지("know") 못합니다. 심지어 그런 것이 필요하다고 해도 말입니다.

예를 들어, 템플릿 시스템은 웹 리퀘스트에 대해서 아무것도 알지 못하고 데이터베이스 계층은 데이터가 어떻게 표현되는지 알지 못하며,
뷰 시스템은 프로그래머가 어떤 템플릿 시스템을 사용하는지 신경쓰지 않습니다.

비록 장고가 편의를 위해서 풀 스택의 기능을 제공한다고 하더라도, 각각의 스택 부분들은 어디에 있든지 서로 독립적입니다.

#### 적은 코드

장고 앱은 가능한 한 적은 코드를 사용하며,
<a href="https://brunch.co.kr/@kooslab/144" target="_blank">boilerplate</a>
를 줄입니다.<small>(boilerplate. 재사용 가능한 코드셋이나 프로그램. 역주)</small>
장고는 <a href="https://www.geeksforgeeks.org/code-introspection-in-python/" target="_blank">introspection</a>
과 같이 파이썬의 동적 적합성의 이점을 최대한 활용합니다.<small>(introspection. 파이썬에서 런타임 동적 타입관리 기능을 의미. 역주)</small>

#### 빠른 개발

21세기 웹 프레임워크의 핵심은 웹 개발의 지루한 측면을 빠르게 하는 것입니다. 장고는 웹 개발이 놀라울 정도로 빠르도록 만듭니다.

#### 반복하지 않는 것 (DRY)

모든 특정 개념 또는 데이터는 한 번에 한 곳에만 존재해야 합니다. 반복되는 것은 좋지 않고, 정규화(normalization)는 좋습니다.

그런 이유에서 이 프레임워크는 가능한 한 적은 것으로부터 가능한 한 많은 것들을 연역해야 합니다.(최소한의 모듈로 최대한의 효율을 내야합니다.)

> See also
>> The <a href="http://wiki.c2.com/?DontRepeatYourself" target="_blank">discussion of DRY on the Portland Pattern Repository</a>

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#models" target="_blank">Models</a>

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#database-api" target="_blank">Database API</a>

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#url-design" target="_blank">URL design</a>

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#template-system" target="_blank">Template system</a>

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#views" target="_blank">Views</a>

<br>
## <a href="https://docs.djangoproject.com/en/3.1/misc/design-philosophies/#cache-framework" target="_blank">Cache Framework</a>
