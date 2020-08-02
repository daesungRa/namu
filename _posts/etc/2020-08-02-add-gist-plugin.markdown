---
title:  지킬 블로그에 플러그인 추가하기(with gist)
date:   2020-07-30 22:23:00 +0900
author: namu
categories: etc
permalink: "/etc/:year/:month/:day/:title"
image: jekyll_logo01.png
image-view: true
---

### 들어가며

[지킬```jekyll```](https://jekyllrb.com/docs/)은 [```ruby on rails```](https://rubyonrails.org/) 프레임워크 기반
정적 사이트 생성기이다. 지금 이 블로그도 지킬로 빌드되어 [```github.io```](https://pages.github.com/) 에서 자동배포되고 있다.
블로그 구축 과정은 꽤나 복잡하니 다음에 다뤄 보기로 하고.. 오늘은 이 지킬 블로그에 새로운 플러그인을 추가하는 방법을 알아보자.

설치할 플러그인은 [**```jekyll-gist```**](https://github.com/jekyll/jekyll-gist)이다.

### 플러그인 추가하기

각 플러그인들은 [Ruby gem](https://rubygems.org/) 이라는 패키지 라이브러리 관리자를 통해 설치 및 관리가 가능하다.
이것을 활용하면 [rubygems.org](https://rubygems.org/) 아카이브로부터 데이터를 가져온다(yum 이나 apt 와 같은 역할).

또한 이 관리자는 사용자 PC의 환경(CPU, OS 등)에 따라서 구분되어 있으므로, 버전을 확인하는것이 꼭 필요하다.
지킬 패키지 관리도 이를 통해 이루어진다.

이제 내 지킬 프로젝트의 Gemfile 에 설치하고자 하는 플러그인을 추가해보자.

```text
$ gem "jekyll-gist"
```

혹은, 곧바로 설치하기 위해 다음과 같이 하거나,

```text
$ gem install jekyll-gist
```

직접 Gemfile 에 라인을 추가한다.

```text
[Gemfile]

...

gem "jekyll", "~> 3.7.4"

...

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  ...
  gem "jekyll-gist", "~> 1.5.0"
  ...
end
```

세 가지 방법은 모두 Gemfile 에 라인을 추가하는 동일한 작업이다. 방법의 차이일 뿐이다.

그러나 만약 의존성을 기입하지 않았다면 gem 을 다룰 때 [```bundler```](https://ruby-korea.github.io/bundler-site/) 가 필요하다.
이것은 자동으로 패키지 의존성을 관리해주는 도구이다.
위 세 번재 방식에서는 ```jekyll-gist``` 1.5.0 버전이 ```jekyll``` 3.7.4 버전에 의존되도록 정의되어 있으나(3.0.0 이상),
나머지 방식에는 따로 정의되지 않았으므로, bundler 를 활용해야 한다. 사실상 항시 bundler 를 통한다고 생각하면 된다.

```text
$ bundler update
```

현재 프로젝트에서 Gemfile 에 기록된 목록대로 패키지 의존성 업데이트를 시도한다.<br>
이제 프로젝트의 ```_config.yaml``` 에 설치한 ```jekyll-gist``` 를 입력하고,

```text
# Build settings
# theme: lagrange
plugins:
  ...
  - jekyll-gist
```

빌드 및 서비스를 해보자.

```text
$ bundle exec jekyll serve
```

빌드 잘 된다!

![my_blog01](https://daesungra.github.io/namu/assets/img/my_blog01.png)

### (별첨) gist 추가해보기

gist 는 코드블럭 등을 github 아카이브에 저장해두고 링크를 통해 참조할 수 있는 너무너무 깔끔하고 손쉬운 기능이다.
이제 플러그인 설치와 빌드가 완료되었으므로, 내 post 에 gist 박스를 추가해보자.

[gist.github.com](https://gist.github.com/) 에 접속하고 github 계정으로 로그인하면 바로 코드블럭을 만들 수 있다.

![gist_smpl01](https://daesungra.github.io/namu/assets/img/gist_smpl01.png)

secret 혹은 public 방식으로 gist 를 create 한 뒤에 생성된 gist 키값을 post 의 원하는 위치에 다음과 같이 추가해주면 된다.

{% gist daesungRa/07ea5ccd0c1b7576e1a4421bff35e944 %}

그럼 gist.github 사이트의 링크로부터 코드블럭을 불러와 삽입해준다!

![gist_smpl02](https://daesungra.github.io/namu/assets/img/gist_smpl02.png)

끝~
