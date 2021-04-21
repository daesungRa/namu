---
title:  "개발 경험 정리"
created: 2021-04-14 01:09:24 +0900
updated: 2021-04-20 15:06:12 +0900
author: namu
categories: projects
permalink: "/projects/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2016/12/02/02/09/idea-1876658_1280.jpg
alt: projects image
image-view: true
image-author: qimono
image-source: https://pixabay.com/users/qimono-1962238/
---

<br>

---

1. [[실무] 삼성전자서비스 챗봇 "써비"](#삼성전자서비스-챗봇-써비) (2019-2021)
    - A. [서버](#a-서버)
        - A-1. [Python](#a-1-python)
        - A-2. [Flask](#a-2-flask)
        - A-3. [WSGI Middleware](#a-3-wsgi-middleware)
        - A-4. [Nginx](#a-4-nginx)
    - B. [데이터베이스](#b-데이터베이스)
        - B-1. [RDBMS, NoSQL](#b-1-rdbms-nosql)
        - B-2. [Types of NoSQL](#b-2-types-of-nosql)
        - B-3. [MongoDB](#b-3-mongodb)
    - C. [프론트엔드](#c-프론트엔드)
2. [[개인] 뉴스마인](#뉴스마인) (2020-2021)

---

<br>
## 들어가며

실무의 프로젝트는 보안 이슈로 인해 상세 업무 단위로 기록하지 않고, 사용 기술 중심으로 기록한다.
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

다음은 기술적 관점에서 지금까지 프로젝트를 통해 얻은 지식을 요약한다.

### 기술 관점 요약

### A. 서버

### A-1. Python
- 파이썬에서 객체지향 개념
    - 파이썬은 함수 중심으로 구현할 수도 있고, 프로그램의 흐름에 따라 순차적으로 빠르게 구현해낼 수도 있다.
    하지만 클래스 및 인스턴스 구현, 상속의 개념을 적용하기에도 수월하기 때문에 객체지향적 프로그래밍에도 최적화되어 있다.
    나아가 필요에 따라 인터페이스, 추상 클래스와 추상 메서드도 구현할 수 있다.

> #### ■ 인터페이스와 추상 클래스의 차이점 <small>(다형성, 상속)</small>
>
> 인터페이스와 추상 클래스는 기능 측면에서 그것을 구현하거나 상속받는 하위 클래스에 대해 특정 추상 메서드의 구현을 강제한다는 공통점을 가진다.
> 
> 하지만 용도 측면에서 둘은 전혀 다른데,
> **인터페이스는 자동차의 핸들, 바퀴와 같이 하나의 완성된 객체의 부품으로써의 한정된 메서드들을 강제**한다면,
> **추상 클래스는 Car 클래스를 상속받는 Sonata 클래스와 같이 특정 객체의 확장 개념**이다.
> 다시 말해, 자동차로써의 기본 기능들을 만족하도록 강제된 소나타, 그랜저 등의 하위 클래스를 의미한다.
> 
> 따라서 용도 측면에서 봤을 때 하나의 완성된 객체 클래스를 만들기 위해 여러 개의 부품 인터페이스를 동시에 구현하는 것은 당연한 일이고,
> 반대로 오직 하나의 추상 클래스로부터만 상속되는 것 또한 당연한 일이다.
> Car, Motorcycle 의 두 추상 클래스를 동시에 상속받는 것은 말이 안되지 않는가?
> 각각은 move 라는 똑같은 추상 메서드를 가지고 있을텐데, 어느 쪽의 move 를 구현해야 하는가?
> 
> 자바는 객체지향 관점에서 만들어졌기 때문에 별도의 인터페이스 기능이 있다. 그래서 명확한 구분이 가능하다.
> 반면에 파이썬은 꼭 그렇지만은 않아 <a href="https://docs.python.org/3/library/abc.html" target="_blank">abc</a> 모듈을
> 적절히 활용하여 인터페이스와 추상 클래스의 기능을 만들어야 한다.

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
- 간결하고 직관적인 코드
    - 파이썬을 공부하다 보면
    <a href="{{ site.github.url }}{% link _posts/python/2020-07-09-what-is-pythonic.markdown %}" target="_blank">"파이썬스럽게"</a>라는
    말을 많이 접하게 된다. 이러한 파이썬 철학을 따르자면, 코드는 쓸데없는 군더더기를 배제하여 간결해야 하며 의미가 직관적이고
    모호하지 않아야 한다. 인덴트에 따라 가독성도 좋아야 하고 코드가 충분히 설명적이어야 한다.
- 리스트 컴프리헨슨
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
        var1 = int(input())  # input 's' or '1'
    except ValueError as e:
        print(e)  # invalid literal for int() with base 10: 's'
    else:
        print(var1)  # print 1
    
    # next logic..
    ```
- 컨텍스트 매니저
    - <a href="{{ site.github.url }}{% link _posts/python/2020-08-11-context-manager.markdown %}" target="_blank">Context Manager와 with 구문</a>은
    코드의 간결성을 위해 좋은 도구이다. 특히 파일 처리 시 try-except 구문으로 파일의 open, work, close 흐름을 만들 수도 있지만,
    컨텍스트 매니저를 통해 단 몇 줄만으로 동일한 흐름을 만들어낼 수 있다.
- 경로 다루기
    - <a href="{{ site.github.url }}{% link _posts/python/2020-10-28-path.markdown %}" target="_blank">pathlib</a> 사용하기
- 가상환경 만들기
    - <a href="{{ site.github.url }}{% link _posts/python/2020-08-13-virtual-environment.markdown %}" target="_blank">pip or pipenv</a> 활용하기

### A-2. Flask
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
- Pluggable View

### A-3. WSGI Middleware
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
    이것의 특징은 가볍고 빠르다는 것이다. 간결한 파이썬 환경설정이 가능하며,
    여러 개의 worker process 와 threads 로 request 분산 처리가 가능하다.
    따라서 linux 환경에서 구동되는 프로덕션 서버라면 최근의 모던 웹앱에서 상당히 많이 사용된다.(windows 라면 mod_wsgi)
    내 업무환경, 개인 플젝에서도 이것을 WSGI 로 사용하고 있다.

### A-4. Nginx
- Web server
    - HTTP 프로토콜로 통신하는 웹 서비스에는 웹앱과 함께 웹 서버가 존재한다. 웹앱은 사용자 request 에 대한 동적 처리를 담당한다면,
    웹 서버는 페이지를 응답해주는 정적 처리를 담당한다.
- Apache 와 같이 Nginx 도 웹 서버의 일종이다.
    - <a href="https://www.nginx.com/faq/what-is-nginx-how-different-is-it-from-e-g-apache/" target="_blank">How different is it from Apache</a>

### B. 데이터베이스

### B-1. RDBMS, NoSQL
- RDBMS
    - 관계형 모델에서 가장 많이 사용되는 RDBMS 는 엄격한 제약조건과 스키마, 인덱싱, 트랜잭션 처리로 인해 구조화된 데이터 저장시
    <a href="https://database.guide/what-is-acid-in-databases/#:~:text=In%20database%20systems%2C%20ACID%20(Atomicity,occur%20while%20processing%20a%20transaction." target="_blank">ACID</a>,
    무결성을 보장한다. 따라서 사용자가 원하는 형식의 뷰를 조합하기에 용이하고 특정 컬럼의 수정 및 삭제가 편리하다.
- NoSQL
    - 반면에 NoSQL 은 구조화되지 않은(non-tabular) 데이터를 고속으로 축적하는데 용이하다. 약어로써의 의미는
    '<a href="https://en.wikipedia.org/wiki/NoSQL" target="_blank">non-sql</a>' 이기도 하지만,
    data validation 을 거쳐 데이터의 관계성을 확립한다면
    '<a href="https://www.mongodb.com/nosql-explained#:~:text=NoSQL%20databases%20(aka%20%22not%20only,wide%2Dcolumn%2C%20and%20graph." target="_blank">not-only-sql</a>' 로
    이해되기도 한다. 그만큼 유연하면서도 어느 정도 구조화된 데이터를 강제할 수 있다는 것이다.
- NoSQL의 사용
    - 축적된 데이터의 수정 및 삭제가 빈번하지 않고 명료한 정규화와 join 연산이 요구되지 않는 경우,
    아주 많은 데이터에 대한 효율적인 분산처리가 요구될 때(데이터 분석, 빅데이터 등) NoSQL 의 사용을 고려할 수 있다.

### B-2. Types of NoSQL
- Key-Value
    - <a href="https://dzone.com/articles/nosql-database-types-1#:~:text=There%20are%20four%20big%20NoSQL,are%20often%20combinations%20of%20these." target="_blank">NoSQL 에는 여러 종류</a>가 있다.
    이 중 키-값 데이터베이스는 말 그대로 모든 데이터를 키와 값의 쌍으로 저장하며 그만큼 단순하여 많은 양의 데이터를 빠르게 쌓을 수 있다.
    활용예는 in-memory 저장 방식인 <a href="https://redis.io/topics/data-types-intro" target="_blank">Redis</a>,
    아마존의 <a href="https://aws.amazon.com/ko/dynamodb/" target="_blank">DynamoDB</a> 등이 있다.
- Document
    - 문서 기반 데이터베이스로는 MongoDB 가 대표적이며 가장 대중적으로 사용된다. 키-값의 JSON 으로 구성된 하나의 row 를 기본단위로 하며,
    collection 은 이러한 row document 의 집합이다. 하나의 컬렉션은 스키마 및 인덱스 지정이 가능하다.
- Column-Oriented
    - 일반적인 관계형 데이터베이스 모델에서 한 개체에는 여러 속성의 컬럼이 존재하고, 이 개체의 집합으로 릴레이션이 구성된다.
    만약 특정 속성-컬럼의 정보만 중요한 경우 이러한 모델은 full-scan 을 통해 불필요한 오버헤드가 발생할 수 있다.
    이때 Column-Oriented 데이터베이스는 컬럼 중심으로 데이터를 저장하기 때문에 꼭 필요한 속성의 데이터만 빠르게 조회할 수 있다.
    컬럼 지향 조회를 RDBMS 도 충분히 할 수 있겠지만, NoSQL 의 사용은 초대량의 데이터를 가정하고 있다는 사실을 기억하자.
- Graph
    - 소셜 네트워크, 사이언스 논문 인용 또는 에셋 클러스터와 같이 고도로 상호 연결된 데이터 구조에서 그래프 데이터베이스가 활용된다.
    일반적인 그래프 구조와 같이 노드-엣지 관계가 형성되며, 엣지에는 방향성 및 가중치가 부여될 수 있다.
    그래프 데이터베이스는 노드가 많아질수록 상호 연결 관계성이 고도로 복잡해진다.

### B-3. MongoDB
- 설명
    - 기본 단위는 document row 이며, 여러 행이 모여
    <a href="https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection" target="_blank">collection</a> 을 구성한다.
    MongoDB 는 collection 생성 시 옵션 설정을 통해 데이터에 대한 validation 제약,
    <a href="https://docs.mongodb.com/manual/indexes/" target="_blank">index</a> 지정이 가능하다.
    또한 pipeline 쿼리를 통해 복합적인 조회, 수정 및 삭제가 가능한데,
    이는 RDBMS 와 같이 관계성을 가진 현실세계의 개체들을 구조적으로 다룰 수 있게 됨을 의미한다.
    - MongoDB 의 RDBMS 와의 결정적 차이는 정규화의 필요성에서 나타난다.
    복합적인 개체 데이터(ex. 수강신청)에 대해 정규화하여 지속적이고 정교한 관리가 필요하다면 RDBMS 를 쓰는 것이 타당하지만,
    굳이 정규화를 하지 않으면서 삽입, 조회시 성능적인 향상이 요구되는 상황(단순 통계분석을 위한 축적 데이터)이라면 MongoDB 가 더 적절하다.
    - MongoDB 데이터는 뷰단에서 json 도큐먼트 포맷으로 구성되며, bson(binary encoded) 으로 파싱되어 저장된다(<a href="https://www.mongodb.com/json-and-bson" target="_blank">json and bson</a>).
    그리고 이를 bson 타입의 archive dump 파일로 추출하여 다른 시스템에 손쉽게 이식할 수 있다(<a href="https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/" target="_blank">mongodump and mongorestore</a>).
- 기본 쿼리
    - find, insert, update, delete <a href="https://docs.mongodb.com/manual/crud/" target="_blank">기본 CRUD 명령</a>이 있으며,
    - 조회 혹은 filter 시 키워드를 통한 조건비교가 가능하다.
    ```text
    비교연산자: $lt, $gt, $in, $eq, $ne, $nin
    논리연산자: $and, $or, $not, $nor
    배열내 연산자: $elemMatch, $all
    기타: $regex, $size, 등 다양함
    ```
    - 내부 필드 요소 update 시에는 ```$set, $push, $pop, ```
    - pipeline 명령으로 <a href="https://docs.mongodb.com/manual/aggregation/" target="_blank">aggregate</a> 가 있다.
    aggregate 쿼리는 리스트로 전달받은 pipeline 스테이지 명령들의 집합을 순차적으로 수행한다
    (<a href="https://docs.mongodb.com/manual/meta/aggregation-quick-reference/" target="_blank">aggregation Stages</a>).
    경험상 Group-By 와 같은 $group 명령을 많이 사용했고 $match, $unwind, $sort, $limit, $count 등 다양하게 사용했다.
    - RDBMS 쿼리와의
    비교 > <a href="https://docs.mongodb.com/manual/reference/sql-comparison/" target="_blank">SQL to MongoDB Mapping Chart</a>
- Validation, Indexing 전략
    - MongoDB 에서 다루는 데이터에 대한 검증은 파이썬 프로그램 차원에서 이루어진다.

### C. 프론트엔드

- ### Vanilla JS

- ### Jquery

- ### Ajax

### d. Infra

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
