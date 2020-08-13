---
title: Python 가상환경을 만드는 방법
date: 2020-08-13 20:45:48 +0900
author: namu
categories: python
permalink: "/python/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2017/07/31/14/56/wall-2558279_1280.jpg
image-view: true
image-author: StockSnap
image-source: https://pixabay.com/ko/users/stocksnap-894430/
---


---

[목차]

1. [들어가며](#들어가며)
2. [pip](#pip)
3. [virtualenv](#virtualenv)
4. [pipenv](#pipenv)

[참조]

1. [python.org, "pip and virtual environments"](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

---

<br>
### 들어가며

파이썬에서 **_가상환경 개념_**은 매우 중요하다. 
만약 여러 프로젝트를 개발한다면 각각에 고유한 파이썬 개발환경을 구축하고(의존성 포함)
상호간에 영향을 미치지 않도록 해야 하기 때문이다.
파이썬으로 개발한다면 언제나 가상환경부터 구축해야 한다는 점을 유념하자.

먼저 os global 영역에 파이썬이 설치되어 있다고 가정하고 출발해보자.
python 3.x 버전이라면 무엇이든 가능하다.

### pip

pip 는 파이썬 패키지 매니저이다.
현재 사용하는 파이썬 버전에 의존적인 모든 패키지들을 [pypi.org](https://pypi.org/) 아카이브로부터 설치 및 업데이트 해준다.
os global 영역에 파이썬이 설치되어 있다면 기본적으로 pip 도 설치되어 있다.

- 파이썬과 pip 버전확인 및 pip 업그레이드

    ```text
    # windows
    > py --version
    > py -m pip --version
    > py -m pip install --upgrade pip
    
    # linux
    $ python --version
    $ python -m pip --version
    $ python -m pip install --upgrade pip
    ```

### virtualenv

virtualenv 모듈은 **_프로젝트 내에서 가상환경을 만들어 파이썬 패키지들을 관리_**해준다.
위의 global pip 를 활용해 virtualenv 를 설치한 후, 내 프로젝트를 위한 가상환경을 생성해 보자.

- virtualenv 설치 및 업그레이드

    ```text
    # windows
    > py -m pip install virtualenv
    > py -m pip install --upgrade virtualenv  # 만약 필요하다면 업그레이드!
    
    # linux
    $ python -m pip install virtualenv
    $ python -m pip install --upgrade virtualenv  # 리눅스도 마찬가지.
    ```

> tip 1
> > 당연하겠지만 환경변수에 global python 인터프리터를 등록해 두자. pip 까지 자유롭게 쓰게.

- 가상환경 생성 후 실행
    <br>프로젝트 root 디렉토리로 이동한 후, 그곳에 가상환경을 만들자.
    
    ```text
    # windows
    > cd D:\project\root\
    D:\project\root> py -m virtualenv venv
    D:\project\root> call .\venv\Scripts\activate  # 가상환경 실행
    (venv) D:\project\root> where pip  # 가상환경 내 pip 경로
    
    # linux
    $ cd /DATA/project/root/
    /DATA/project/root$ python -m virtualenv venv
    /DATA/project/root$ source ./venv/bin/activate  # 가상환경 실행
    (venv) /DATA/project/root$ which pip  # 가상환경 내 pip 경로
    ```

- 가상환경 내에서 패키지 설치 > ```requests```

    ```text
    # windows
    (venv) D:\project\root> pip install requests  # ... Successfully installed ...
    (venv) D:\project\root> pip install requests==2.18.4  # 특정 버전 지정
    
    # linux
    (venv) /DATA/project/root$ pip install requests  # ... Successfully installed ...
    (venv) /DATA/project/root$ pip install requests==2.18.4  # 여기도.
    ```

이로써 가상환경 내 파이썬 인터프리터에 ```requests``` 패키지가 설치되었다. python import 를 통해 확인해 보자.

- 패키지 의존성 freezing! > requirements.txt 활용하기
    <br>requirements.txt 는 현재 가상환경에 설치된 패키지들의 정적 의존성 정보를 텍스트 파일로 저장한다.
    이렇게 해두면 나중에 일일히 설치할 필요가 없어진다.
    
    ```text
    # windows
    (venv) D:\project\root> pip freeze > requirements.txt  # 이 파일이 생성된다.
    
    # linux
    (venv) /DATA/project/root$ pip freeze > requirements.txt
    ```
    
    텍스트 파일을 열어보면 다음과 같다.
    
    ```text
    asgiref==3.2.10
    certifi==2020.6.20
    chardet==3.0.4
    Django==3.1
    idna==2.10
    pytz==2020.1
    requests==2.24.0
    sqlparse==0.3.1
    urllib3==1.25.10
    ```
    
    ```requests``` 패키지가 버전 의존성까지 포함해서 기록되어 있다.
    이제 이것을 활용해보면,
    
    ```text
    # windows
    (venv) D:\project\root> pip install -r requirements.txt  # 위 정보를 기반으로 패키지 자동설치.
    
    # linux
    (venv) /DATA/project/root$ pip install -r requirements.txt
    ```
    
    이제 어디서든 가상환경을 쉽게 구축할 수 있다!

- 가상환경 빠져나오기

    ```text
    # windows
    (venv) D:\project\root> deactivate
    D:\project\root>  # 빠져나왔다!
    
    # linux
    (venv) /DATA/project/root$ deactivate
    /DATA/project/root$
    ```

### pipenv

여기서도 가상환경을 구축하고 관리한다는 점에서 완전 동일하다.<br>
하나 차이점은, ```pip + virtualenv == pipenv``` 라는 것!

> Tip 2
> > pipenv 는 더 편리하지만, 업데이트가 느리고 블랙박스 동작이 있다고 한다. pip, virtualenv 사용법을 안 이후에 공부하자.
