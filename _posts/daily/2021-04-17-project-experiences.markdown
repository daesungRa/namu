---
title:  "개발 경험 정리"
created: 2021-04-14 01:09:24 +0900
updated: 2021-04-14 01:09:24 +0900
author: namu
categories: daily
permalink: "/daily/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2016/12/02/02/09/idea-1876658_1280.jpg
alt: projects image
image-view: true
image-author: qimono
image-source: https://pixabay.com/users/qimono-1962238/
---

<br>

---

1. [[실무] 삼성전자서비스 챗봇 "써비"](#삼성전자서비스-챗봇-써비) (2019-2021)
    - a. [서버](#서버)
        - a-1. [Python](#python)
        - a-2. [Flask](#flask)
        - a-3. [WSGI Middleware](#wsgi-middleware)
        - a-4. [Nginx](#nginx)
    - b. [데이터베이스](#데이터베이스)
        - b-1. [RDBMS vs NoSQL](#rdbms-vs-nosql)
        - b-2. [Series of NoSQL](#series-of-nosql)
        - b-3. [MongoDB](#MongoDB)
2. [[개인] 뉴스마인](#뉴스마인) (2020-2021)

---

<br>
## 들어가며

실무의 프로젝트는 보안 이슈로 인해 상세 업무 단위로 기록하지 않고, 기술 구현 중심으로 기록한다.
하지만 개인 프로젝트는 상관 없이 전 과정을 기록한다.

<br>
## 삼성전자서비스 챗봇 "써비"

2020년부터 서비스를 시작한 <a href="https://www.samsungsvc.co.kr/" target="_blank">삼성전자서비스</a>의
챗봇 "써비" 구축 프로젝트에 참여한 경험이다.
구축 기간은 2019년 중순부터 2020년 초까지이며, 완료 이후 나를 포함한 소수의 인원만 챗봇 운영업무로 전환되고 다른 사람들은 철수하였다.

써비는 삼성전자의 연구개발부서 인력들이 코어 엔진을 개발하였으며,
내가 속한 회사를 비롯한 여러 협력업체들은 챗봇 데이터 통신, 화면 디자인 및 개발, 컨텐츠 및 모니터링 서버 개발 등의 업무를 진행하였다.

### 요약

내가 개발자로써 참여한 첫 프로젝트이다.
신입이었기 때문에 처음에는 매우 작은 부분의 역할이 주어졌지만, 점점 인정을 받아 큰 단위의 업무를 맡게될 수 있었던 뜻깊은 프로젝트이다.
특히, 프로젝트 구축 이후 운영업무로 전환되면서 소스 버전관리 및 배포와 운영 아키텍처 관리의 업무가 주어지며 개인적으로 많은 성장이 있었다.

나는 원래 자바 스프링 프레임워크로 만든 개인 포트폴리오 신입 구직을 했었다.
하지만 지금 회사 신입 면접시에는 삼성전자서비스에 투입될 것이며 파이썬을 다룰 것이라고 해서 적잖은 고민을 했었다.
애초에 사회조사 분석 결과를 통계적으로 분석해 웹 화면에 구현해보고 싶었던 처음의 막연한 생각이 있었기 때문에
데이터 분석과 연관성이 깊은 파이썬을 새로 공부해도 괜찮겠다는 생각을 했다.
결국 2019년 4월 입사하기로 결정했고, 파이썬과 Flask 프레임워크를 새로 공부하여 두달 뒤 프로젝트에 투입되었다.

다음은 기술적 관점에서 지금까지 프로젝트를 통해 얻은 지식등을 요약한다.

### 기술 관점 요약

### a. 서버

- ### Python
    - 파이썬에서 객체지향 개념
        - 파이썬은 객체지향만을 위해 최적화되어 설계되지는 않았다. 프로그램의 흐름에 따라 함수 중심으로 구현할 수도 있다.
        하지만 클래스 및 인스턴스 구현, 상속의 개념을 적용하기에도 수월하기 때문에 객체지향적 프로그래밍에 어려움은 없다.
        나아가 필요에 따라 인터페이스, 추상 클래스와 추상 메서드도 구현할 수 있다.
        > 인터페이스와 추상 클래스의 차이점(다형성, 상속)
        >> 인터페이스와 추상 클래스는 기능 측면에서 그것을 구현하거나 상속받는 하위 클래스에 대해 특정 추상 메서드의 구현을 강제한다는 공통점을 가진다.
        >> 
        >> 하지만 용도 측면에서 둘은 전혀 다른데,
        >> **인터페이스는 자동차의 핸들, 바퀴와 같이 하나의 완성된 객체의 부품으로써의 한정된 메서드들을 강제**한다면,
        >> **추상 클래스는 Car 클래스를 상속받는 Sonata 클래스와 같이 특정 객체의 확장 개념**이다.
        >> 다시 말해, 자동차로써의 기본 기능들을 만족하도록 강제된 소나타, 그랜저 등의 하위 클래스를 의미한다.
        >> 
        >> 따라서 용도 측면에서 봤을 때 하나의 완성된 객체 클래스를 만들기 위해 여러 개의 부품 인터페이스를 동시에 구현하는 것은 당연한 일이고,
        >> 반대로 오직 하나의 추상 클래스로부터만 상속되는 것 또한 당연한 일이다.
        >> Car, Motorcycle 의 두 추상 클래스를 동시에 상속받는 것은 말이 안되지 않는가?
        >> 각각은 move 라는 똑같은 추상 메서드를 가지고 있을텐데, 어느 쪽의 move 를 구현해야 하는가?
        >> 
        >> 자바는 객체지향 관점에서 만들어졌기 때문에 별도의 인터페이스 기능이 있다. 그래서 명확한 구분이 가능하다.
        >> 반면에 파이썬은 꼭 그렇지만은 않아 <a href="https://docs.python.org/3/library/abc.html" target="_blank">abc</a> 모듈을
        >> 적절히 활용하여 인터페이스와 추상 클래스의 기능을 만들어야 한다.
    - 간결하고 직관적인 코드
        - 파이썬을 공부하다 보면
        <a href="{{ site.github.url }}{% link _posts/python/2020-07-09-what-is-pythonic.markdown %}" target="_blank">"파이썬스럽게"</a>라는
        말을 많이 접하게 된다. 이러한 파이썬 철학을 따르자면, 코드는 쓸데없는 군더더기를 배제하여 간결해야 하며 의미가 직관적이고
        모호하지 않아야 한다. 인덴트에 따라 가독성도 좋아야 하고 코드가 충분히 설명적이어야 한다.
    - 파이썬 컴프리헨슨
        - 파이썬 철학의 대표적인 기능이라 할 만한 것이 있다.
        바로 <a href="https://www.w3schools.com/python/python_lists_comprehension.asp" target="_blank">Python List Comprehension</a> 인데,
        이것은 리스트 자료구조를 생성하는 것이 (거의) 한 줄의 간결한 표현으로 가능하도록 한다.
        0부터 짝수인 리스트를 만드는 다음의 예시를 참조하자.
        
        ```python
        even1 = [i*2 for i in range(0, 51)]  # [0, 2, 4, 6, 8, 10, ..., 98, 100]
        even2 = list(map(lambda x: x*2, range(0, 51)))  # Same as even1
        ```
    - 예외처리
        - 파이썬은 <a href="{{ site.github.url }}{% link _posts/python/2020-06-16-python-exception.markdown %}" target="_blank">예외 처리 기능</a>도
        탁월하다. 예외처리를 위해 try-except 구문을 활용하며, 정상 처리시 else 구문을, 무조건 실행을 강제하기 위해 finally 구문을 활용한다.
        그리고 특정 상황에서 예외를 발생시키기 위해 raise 구문을 쓰기도 한다.
        또한 Exception 클래스를 상속받아 내 어플리케이션에 맞는 Custom Exception Class 를 만들 수도 있다.
        
        ```python
        # Get integer value and print
        try:
            var1 = int(input())  # input 's'
        except ValueError as e:
            print(e)  # invalid literal for int() with base 10: 's'
        else:
            print(var1)  # 's'
        
        # next logic..
        ```
    - 컨텍스트 매니저
        - <a href="{{ site.github.url }}{% link _posts/python/2020-08-11-context-manager.markdown %}" target="_blank">Context Manager와 with 구문</a>은
        코드의 간결성을 위해 좋은 도구이다. 특히 파일 처리 시 try-except 구문으로 파일의 open, work, close 흐름을 만들 수도 있지만,
        컨텍스트 매니저를 통해 단 몇 줄만으로 동일한 흐름을 만들어낼 수 있다.
    - 파이썬의 구현, 메모리 관리, GC
        - 언어의 내부원리를 알고 사용하는 것은 그렇지 않은 것보다 언제나 낫다. 파이썬으로 작성된 코드는 기본적으로
        <a href="https://stackoverflow.com/questions/17130975/python-vs-cpython" target="_blank">CPython</a> 에
        의해 byte-code 로 해석되며(C로 번역되는 것은 아님), 성능적인 향상 혹은 확장을 위해
        <a href="https://www.infoworld.com/article/3385127/what-is-pypy-faster-python-without-pain.html" target="_blank">PyPy</a>,
        <a href="https://www.infoworld.com/article/3250299/what-is-cython-python-at-the-speed-of-c.html" target="_blank">Cython</a>,
        등으로 해석되기도 한다.
        - 파이썬에서 특정 데이터는 객체 방식으로 heap 영역에 할당된다. 변수는 이렇게 할당된 객체를 **참조**(a pointer)함으로써 정의되며,
        객체는 참조된 횟수에 따라
        **<a href="https://rushter.com/blog/python-garbage-collector/#:~:text=Reference%20counting%20is%20a%20simple,to%20the%20right%2Dhand%20side." target="_blank">reference count</a> 가 1씩 증가**한다.
        파이썬에서의 메모리 관리는 기본적으로 참조 횟수가 0이 되면 할당이 해제되는 방식으로 이루어진다.
        그리고 여느 객체지향 언어처럼 파이썬의 함수도 stack 영역에서 LIFO 방식으로 호출된다.
        이 과정에서 한번 생성된 객체가 여러 번 참조되거나 count 가 0이 되어 해제될 수 있는 것이다.
        - **<a href="https://docs.python.org/3/library/gc.html" target="_blank">GC</a>**:
        레퍼런트 카운팅 방식은 순환 참조 조건에서 근원적인 결함이 발생한다. 순환 참조는 두 객체가 상호 참조하거나 한 객체가 자신을 참조할 때 발생한다.
        
        ```python
        # Self reference example
        lst = []
        lst.append(lst)
      
        # Destroy the lst reference
        del lst
      
        # Error occurred, but lst object remains
        print(id(lst))  # > NameError: name 'lst' is not defined
        ```
        - 위 코드에서는 자기 자신에 대한 순환 참조 이슈가 발생한다. 이러한 문제를 보조하기 위해 파이썬에서는 GC가 존재하며,
        만약 코드상 위와 같은 결함이 없다는 확신이 있고, 일반적인 상황 이상 고성능의 퍼포먼스가 필요하다면
        GC를 사용하지 않거나 수동으로 전환하는 튜닝을 고려해 볼 수 있다.
    - 경로 다루기
    - 특정 파이썬 버전의 가상환경 만들기

- ### Flask
    - Flask api 와 Blueprint 객체
        - 경량이며 매우 단순한 웹앱을 단기간에 만들기 위해 Flask 기본 app.route 만을 활용할 수도 있겠지만,
        프로젝트가 스케일업 되며 다양한 어플리케이션이 추가되고 url 패턴이 많아질수록 이를 app 차원에서 통합적으로 관리하기 어려워진다.
        이때 어플리케이션 단위별로 Blueprint api 를 분리하면 일관성이 확보되고 유지보수에 용이하다.
        > 블루프린트는 보통 대형 어플리케이션이 동작하는 방식을 단순화하고 어플리케이션의 동작을 등록하기 위한 플라스크 확장에 대한
        > 중앙 집중된 수단을 제공할 수 있다.
        > (<a href="https://flask-docs-kr.readthedocs.io/ko/latest/blueprints.html" target="_blank">readthedocs</a>)
        
        - Flask Blueprint 는 그것 자체로써 독립적인 어플리케이션은 아니지만, Flask app 에 등록됨으로써 각각의 라우트 기능을 제공할 수 있다.
        따라서 표면적으로는 여러 어플리케이션이 하나의 프로젝트에서 동작하는 것처럼 보이지만,
        내부적으로는 여러 Blueprint 객체가 하나의 app 에 등록되어 동작함을 알아야 한다. > WSGI 계층 차원에서는 하나의 app 에 대한 규격만 다루게 된다.

- ### WSGI Middleware
    - WSGI?
        - <a href="http://wsgi.tutorial.codepoint.net/intro" target="_blank">WSGI is the **Web Server Gateway Interface**.</a>
        HTTP 프로토콜로 통신하는 최신 웹 환경에서 WSGI 는 웹서버와 웹앱 간 커뮤니케이션을 위한 중간자 역할을 한다.
        이는 파이썬 표준(<a href="https://www.python.org/dev/peps/pep-3333/" target="_blank">PEP-3333</a>)으로써
        파이썬으로 작성된 웹 어플리케이션에 대한 명세를 담고 있다.(독립적인 소프트웨어가 아니라 interface 임)
        WSGI 는 client 로부터 request 를 받아 어플리케이션으로 전달하고, response 를 반환한다.
        최근에는 WSGI 명세가 python 프레임워크 내에 포함되어 있는게 일반적이다.
    - uWSGI
        - WSGI 에는 여러 종류가 있다.
        (<a href="https://medium.com/django-deployment/which-wsgi-server-should-i-use-a70548da6a83" target="_blank">What the heck is a WSGI server?</a>)
        그 중 <a href="https://uwsgi-docs.readthedocs.io/en/latest/" target="_blank">uWSGI</a> 는
        아마 Django 등에서 오래도록 사용되었던 도구일 것이다.
    - Gunicorn
        - <a href="https://docs.gunicorn.org/en/stable/" target="_blank">Gunicorn</a> 또한 WSGI 의 일종이다.
        이것의 특징은 가볍고 빠르다는 것이다. 간결한 파이썬 환경설정이 특징이며,
        여러 개의 worker process 와 threads 로 request 분산 처리가 가능하다.
        따라서 linux 환경에서 구동되는 프로덕션 서버라면 최근의 모던 웹앱에서 상당히 많이 사용된다.(windows 라면 mod_wsgi)
        내 업무환경, 개인 플젝에서도 이것을 WSGI 로 사용하고 있다.

- ### Nginx
    - Web server
        - HTTP 프로토콜로 통신하는 웹 서비스에는 웹앱과 함께 웹 서버가 존재한다. 웹앱은 사용자 request 에 대한 동적 처리를 담당한다면,
        웹 서버는 페이지를 응답해주는 정적 처리를 담당한다.
    - Apache 와 같이 Nginx 도 웹 서버의 일종이다.

### b. 데이터베이스

- ### RDBMS vs NoSQL

- ### Series of NoSQL

- ### MongoDB

### c. 화면, Script

- ### Vanilla JS

- ### Jquery

- ### Ajax

### d. AWS Infra

- ### EC2

- ### Ubuntu

- ### ELB

- ### CloudWatch

- ### S3

### e. Git, Github

- ### 브랜치 관리 전략

- ### Gitlab 구축

### f. 소스 버저닝 및 배포

- ### Docker

- ### Jenkins

<br>
## 뉴스마인
