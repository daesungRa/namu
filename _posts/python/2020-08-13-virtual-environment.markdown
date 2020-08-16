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
5. [gitignore 에 포함할 것들](#gitignore-에-포함할-것들)

[참조]

1. [python.org, "pip and virtual environments"](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)
2. [velog.io](https://velog.io/@doondoony/pipenv-101)

---

<br>
### 들어가며

파이썬에서 **_가상환경 개념_**은 매우 중요하다. 
여러 개의 프로젝트를 동시에 개발할 때 각각 고유한 파이썬 개발환경을 구축하고(의존성 포함)
상호간에 영향을 미치지 않도록 해야 하기 때문이다.
파이썬으로 개발한다면 언제나 가상환경부터 구축해야 한다는 점을 유념해야 한다.

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

이것도 가상환경을 구축하고 관리한다는 점에서 동일하다.<br>
하나 차이점은, ```pip + virtualenv == pipenv``` 라는 것!

> Tip 2
> > pipenv 는 더 편리하지만, 업데이트가 느리고 블랙박스 동작이 있다고 한다. 그래도 현업에 사용하기에 큰 무리는 없다.
> > 내가 그렇게 사용하고 있으니.. 그러므로 pipenv 를 사용하고자 한다면, 먼저 pip, virtualenv 사용법을 확실히 알자.

- 주요 명령어
    <br>pip 와 virtualenv 가 합쳐진 만큼, pipenv 하나만으로 가상환경 생성과 가상환경 내 패키지 관리가 가능하다.
    이를 위한 기본 명령어들을 살펴보자.
    - pipenv --python 3.6 : 3.6 버전으로 가상환경 생성(단순 생성!).
    - pipenv **shell** : 가상환경 쉘 진입. 없다면 생성 후 진입.
    - pipenv **install** [package-name] : 패키지 설치. ```--dev``` 옵션을 붙이면 개발용으로 설치(Pipfile).
    같은 방식으로 버전정보를 추가할 수 있다```~=1.2```.
    - pipenv **lock** : 현재 버전 의존성 그대로 locking(Pipfile.lock).
    이는 **결정론적 빌드**를 보장한다(어떤 상황에서도 같은 환경 보장).
    - pipenv **sync** : locking 된 버전 의존성 그대로 패키지 설치(최신 버전이 아닐 수 있음).
    - pipenv **update** : 설치된 패키지들을 최신 버전으로 업데이트. locking 이 자동으로 이루어진다.
    업데이트를 원하는 특정 패키지 명시 가능.
    
    shell 진입 시 ```Pipfile``` 및 ```Pipfile.lock``` 파일이 생성되며,
    install, lock, sync, update 명령에 따라 패키지 및 패키지 의존성 정보가 기록된다.
    Pipfile 예시는 다음과 같다.
    
    ```text
    [[source]]
    name = "pypi"
    url = "https://pypi.org/simple"
    verify_ssl = true
    
    [dev-packages]  # 개발용은 여기
    django = "*"
    
    [packages]  # 배포용은 여기
    requests = "*"
    django = "*"
    
    [requires]  # 파이썬 버전 및 환경정보
    python_version = "3.6"
    
    [scripts]  # scripts 섹션을 만들고
    start = "python app.py"  # pipenv run start
    ```

- pipenv 설치 및 업그레이드
    <br>virtualenv 와 마찬가지로 일단은 global 영역에 설치 및 업그레이드한다.
    
    ```text
    # windows
    > py -m pip install pipenv
    > py -m pip install --upgrade pipenv
    
    # linux
    $ python -m pip install pipenv
    $ python -m pip install --upgrade pipenv
    ```

- 가상환경 쉘 진입 > 원하는 패키지 설치 > lock
    
    ```text
    # windows
    > cd D:\project\root\
    D:\project\root> py -m pipenv shell  # pipenv 쉘로 진입. 없다면 생성.
    (root-x8NlcEbx) D:\project\root> pipenv install requests
    (root-x8NlcEbx) D:\project\root> pipenv install django
    (root-x8NlcEbx) D:\project\root> pipenv install django --dev
    (root-x8NlcEbx) D:\project\root> pipenv lock
    
    # linux
    $ cd /DATA/project/root/
    /DATA/project/root$ python -m pipenv shell
    (root-x8NlcEbx) /DATA/project/root$ pipenv install requests
    (root-x8NlcEbx) /DATA/project/root$ pipenv install django
    (root-x8NlcEbx) /DATA/project/root$ pipenv install django --dev
    (root-x8NlcEbx) /DATA/project/root$ pipenv lock
    ```

- 가상환경은 어디에 생성되나??
    <br>다음을 실행해 보자.
    
    ```text
    # windows
    (root-x8NlcEbx) D:\project\root> pipenv --py
    C:\Users\[USER]\.virtualenvs\root-x8NlcEbx\Scripts\python.exe
    
    # linux
    (root-x8NlcEbx) /DATA/project/root$ pipenv --py
    $HOME/.local/share/virtualenvs/root-x8NlcEbx/bin/python
    ```
    
    virtualenv 와 다르게(프로젝트 내 venv), pipenv 의 가상환경은 **현재 계정 home 의 숨겨진 디렉토리 내에 생성**된다.
    그러므로 내가 실행하는 프로젝트는 그것이 연계된 home 하위 가상환경의 인터프리터를 활용한다고 생각하면 된다.

- 가상환경 삭제 및 빠져나오기

    ```text
    # windows
    (root-x8NlcEbx) D:\project\root> pipenv --rm
    Removing virtualenv (C:\Users\[USER]\.virtualenvs\root-x8NlcEbx) …
    (root-x8NlcEbx) D:\project\root> exit
    D:\project\root>
    
    # linux
    (root-x8NlcEbx) /DATA/project/root$ pipenv --py
    Removing virtualenv ($HOME/.local/share/virtualenvs/root-x8NlcEbx) …
    (root-x8NlcEbx) /DATA/project/root$ exit
    /DATA/project/root$
    ```
    
    ```pipenv --rm``` 이후 위에서 언급한 **현재 계정 home 의 숨겨진 디렉토리**에서 확인해보면
    방금전까지 있던 가상환경이 삭제된 것을 볼 수 있다. 사실상 ```rm -rf``` 로 실제 경로를 삭제해도 되기는 하다.

### gitignore 에 포함할 것들

팀 전체가 공유하는 프로젝트 github repository 에 가상환경 전체가 올라가 버린다면 참으로 비효율적일 것이다.
그래서 사용하는 것이 최소한의 정보만 기록된 requirements.txt 나 Pipfile, Pipfile.lock 인 것이다.
pipenv 는 전혀 다른 공간에 가상환경을 생성하므로 상관 없지만,
virtualenv 를 사용한다면 ```.gitignore``` 에 ```venv``` 혹은 ```가상환경 디렉토리명```을 추가하자.

끝~!
<br><br>

---

<br>
아 그리고 혹시라도 [**결정론적 빌드**](https://reproducible-builds.org/docs/deterministic-build-systems/)가 무엇인지 궁금하다면
링크를 따라가 문서를 읽어보자. 짧게 설명하자면, 최신 버전의 특정 패키지가 현존하는 프로젝트 의존성을 파괴할지도 모르는 상황 속에서,
언제 어디서나 같은 의존성을 보장하는 재현 가능한 빌드를 상상해보면 된다.
결정론적 빌드 시스템!

> **"Be able to get the exact same set of dependencies on multiple machines"**,
>[Using locked packages](https://docs.npmjs.com/files/package-locks#using-locked-packages)

진짜끝!!
