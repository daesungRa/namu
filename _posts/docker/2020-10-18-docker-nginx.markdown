---
title:  "[도커실습04] Nginx 이미지 만들기"
created:   2020-10-18 14:13:28 +0900
updated:   2020-10-18 14:13:28 +0900
author: namu
categories: docker
permalink: "/docker/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2018/03/30/15/11/poly-3275592_1280.jpg
image-view: true
image-author: Manuchi
image-source: https://pixabay.com/ko/users/manuchi-1728328/
---


---

[목차]

1. [들어가며](#들어가며)
2. [Ningx 빌드를 위한 Dockerfile](#ningx-빌드를-위한-dockerfile)
3. [이미지 빌드 후 컨테이너 실행하기](#이미지-빌드-후-컨테이너-실행하기)

---

<br>
## 들어가며

이번에는 nginx 이미지를 만들어보자.

사실 docker hub 에 [nginx official images](https://hub.docker.com/_/nginx) 가 이미 존재한다.
간편하게 그것을 가져다 쓸 수도 있겠지만,
공부하는 입장에서 최소한의 경량 ubuntu 이미지에 직접 nginx 를 설치하고 이를 이미지화 하는 과정은 많은 도움이 될 것이다.
나중에 nginx 이미지를 커스터마이징할 때도 유용할 것이다.

<br>
## Ningx 빌드를 위한 Dockerfile

앞서 만든 [base 이미지](https://daesungra.github.io/namu/docker/2020/10/11/docker-base) 를
기반으로 시작해보자.<br>
위치는 ```/home/docker-user/workdir/server-nginx/Dockerfile``` 이다.

![docker nginx 01](https://daesungra.github.io/namu/assets/post-img/docker_nginx01.png)

Dockerfile 커맨드가 상당히 짧다. 이는 [layer](https://docs.docker.com/storage/storagedriver/#images-and-layers) 로
축적되는 이미지 빌드방식 덕분에 base 우분투 이미지를 미리 만들어 둘 수 있기 때문이다.

- RUN : 패키지 관리자 업데이트 후 nginx 설치. 그리고 workdir 로 지정할 ```/serve/server-nginx``` 를 생성한다.
- WORKDIR : 생성한 디렉토리를 WORKDIR 로 지정.
- CMD : 이미지를 컨테이너화할 때 자동으로 실행되는 커맨드이다.
    - ```nginx -g "daemon off;"``` 커맨드는 nginx 를 foreground 로 실행한다는 의미이다.
    - 따라서 컨테이너 자체를 ```-d``` 옵션으로 background 로 생성 및 실행하면 컨테이너에서 자동으로 nginx 가 돌고 있게 된다.
    - 이것은 잠시 후에 docker run 커맨드에서 확인해보자.
- EXPOSE : 컨테이너를 생성할 때 80 포트를 노출한다.
    - 이로써 컨테이너는 80 으로 들어오는 요청들을 수용할 수 있다.
    - nginx 는 기본적으로 80 요청을 받아 default 페이지를 노출하거나 redirect 한다.

<br>
## 이미지 빌드 후 컨테이너 실행하기

![docker nginx 02](https://daesungra.github.io/namu/assets/post-img/docker_nginx02.png)

docker 의 ```build``` 커맨드는 정의된 ```Dockerfile``` 기반으로 이미지를 생성하는 명령이다.

- --rm, --force-rm : 중간 layer 이미지들의 컨테이너를 삭제하는 옵션이다.
- -t : 이미지에 태그를 붙인다. 'name:tag' 포맷이다.

위 두 옵션 이후에는 실행할 Dockerfile 이 존재하는 디렉토리를 입력한다.
nginx 이미지를 만들 것이기 때문에 server-nginx 디렉토리를 지정했다.

명령을 실행하고 나타나는 ```Step 1/7 : FROM base:20.10.1``` 과 같은 Step 들은,
보면 알겠지만 Dockerfile 에 명시된 각각의 커맨드들을 하나씩 실행하는 것을 의미한다.
각각의 아래를 보면 ```컨테이너 id 값이 생성```된 후 ```Removing intermediate container``` 되는데,
이것들은 각각의 컨테이너가 생성되었다가 삭제되는 과정을 나타낸다.

![docker nginx 04](https://daesungra.github.io/namu/assets/post-img/docker_nginx04.png)

이미지가 잘 생성되었다! 이제 컨테이너를 실행해보자.

![docker nginx 05](https://daesungra.github.io/namu/assets/post-img/docker_nginx05.png)

- -i : interactive 모드로써 STDIN 이 활성화된다. bash 명령을 입력할 때 Not attached 여도 표준입력 가능.
- -t : pseudo-TTY 모드로써 bash 명령의 결과가 셸 라인에 표시된다.
- -d : detached 모드로써 컨테이너가 백그라운드 데몬으로 실행된다.
- --name : 컨테이너 이름 지정
- -p : 컨테이너가 수용할 포트정보. 위 경우 컨테이너 외부에서 8243 포트로 request 가 들어가면 컨테이너 내부에서는 80 포트로 수용한다.

이후 컨테이너화할 이미지 이름을 태그와 함께입력한다.
그러면 이미지 생성 시 지정한 CMD 가 자동으로 실행된다(nginx -g "daemon off;").

이제 ```docker ps -a``` 커맨드로 잘 실행중인 것을 확인할 수 있다.

![docker nginx 06](https://daesungra.github.io/namu/assets/post-img/docker_nginx06.png)

컨테이너 외부인 Host OS 상에서 ```curl localhost:8243``` 으로 호출하면 ```run``` 시에 지정한 8243 포트 -> 80 포트로
컨테이너에 들어간다. 이를 주시하고 있던 nginx 에 의해 default 페이지가 출력된 것을 확인할 수 있다.

```exec``` 명령으로 컨테이너에 들어가 ```service``` 확인을 하면 nginx 가 실행중임을 볼 수 있다.

다음으로는 경량 python 웹 프레임워크의 끝판왕, ```Flask 베이스 이미지```를 만들어보자.
