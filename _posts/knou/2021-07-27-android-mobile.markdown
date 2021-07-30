---
title:  "[방통대] 안드로이드 수업 정리"
created:   2021-07-27 19:01:24 +0900
updated:   2021-07-27 19:01:24 +0900
author: namu
categories: knou
permalink: "/knou/:year/:month/:day/:title"
image: https://cdn.pixabay.com/photo/2013/10/22/07/56/android-199225_960_720.jpg
alt: android image
image-view: true
image-author: andrekheren
image-source: https://pixabay.com/users/andrekheren-73289/
---


---

### 목차

1. [안드로이드 앱의 구성 및 View](#1-안드로이드-앱의-구성-및-view)
2. [View의 속성](#2-view의-속성)
3. [TextView와 ImageView (1)](#3-textview와-imageview-1)
4. [TextView와 ImageView (2)](#4-textview와-imageview-2)
5. [LinearLayout의 속성](#5-linearlayout의-속성)
6. [렐레티브레이아웃과 프레임레이아웃](#6-렐레티브레이아웃과-프레임레이아웃)
7. [](#)
8. [](#)
9. [](#)
10. [](#)
11. [](#)
12. [](#)
13. [](#)
14. [](#)
15. [](#)

### 참조

- 김상형. 안드로이드 프로그래밍 정복. 한빛 미디어

---

<br>
## 1. 안드로이드 앱의 구성 및 View

안드로이드 수업에서는 안드로이드 환경에서 프로그램을 짜는 과정을 배우게 됩니다.
안드로이드 환경은 크게 모바일, 태블릿, 웨어로 구분됩니다.

#### 1.1 안드로이드 프로젝트

안드로이드 프로젝트에서 '프로젝트'라는 단어를 사용하는 이유는,
여러 종류의 파일 및 프로그램, 심지어는 이미지와 같은 미디어 파일들이 묶여 하나의 앱을 구성하기 때문입니다.

안드로이드 프로젝트는 사용자가 지정한 workspace 내에 폴더/디렉토리로 생성되며, 다음의 핵심 파일을 포함하고 있습니다.

- **java \ MainActivity.java**
    - JAVA 프로그램 파일이 저장되는 폴더 \ MainActivity.java 는 어플리케이션 실행의 시작점
- **build \ R.java**
    - 프로그램 실행을 위한 ID 참조를 위한 모든 속성이 저장된 파일
- **res \ drawable \\**
    - 화면에 표시될 이미지가 저장되는 폴더
- **res \ layout \ activity_main.xml**
    - 레이아웃을 정의한 XML 파일
- **res \ values \ strings.xml**
    - 문자열의 속성을 정의한 XML 파일
    - 일종의 주소록
- **manifests \ AndroidManifest.xml**
    - 프로젝트의 버전이나 이름, 구성, 어플리케이션의 주요 속성을 정의한 XML 파일
    - 이 앱에서 사용하고자 하는 하드웨어 리소스, 소프트웨어, 필요로 하는 SDK, API 버전 등

기본적으로 xml 파일이 사용자 인터페이스 역할을 하면서 이벤트에 따라 java 파일과 상호작용을 합니다.
java 파일은 이벤트 요청에 따라 동적인 작업을 수행합니다.

---

#### 1.2 안드로이드 프로젝트의 구성 (1)

#### (1) activity_main.xml

- 화면 레이아웃을 정의하는 메인 xml
- RelativeLayout 태그가 쟁반이라면, View(TextView 등) 태크 영역은 그릇의 개념

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

#### (2) strings.xml

- 자주 사용되는 문자열을 strings.xml 에서 변수처럼 관리 (app_name 등)
- 사용되는 문자열을 JAVA 로부터 분리, 영어 등 다른 언어로 쉽게 변환하기 위한 목적도 포함
- activity_main.xml 의 뷰에서 문자열 변수로 참조하여 사용
- menu_main.xml에서 사용되는 문자열(action_settings)을 정의

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">HelloWorld</string>
    <string name="hello_world">Hello World!</string>
    <string name="action_settings">Settings</string>
</resources>
```

#### (3) R.java

- 리소스 ID(strings.xml 의 변수와 같은)를 참조하기 위한 클래스로, 주소록처럼 사용
- 새 리소스가 등록되면 컴파일 후 해당 정보가 R 클래스에 자동으로 등록되는데, 그 작업을 ```aapt:Android Asset Packaging Tool``` 가 수행
- 따라서 개발자가 임의로 변경하면 안됨!

---

#### 1.3 안드로이드 프로젝트의 구성 (2)

#### (1) MainActivity.java

- Activity 클래스를 상속받아 새로운 Activity 인스턴스를 생성
- Activity의 역할은 안드로이드 앱의 화면을 구성하거나 사용자와 상호작용하는 것
- 즉, 화면 자체를 액티비티라고 생각하면 편함
- 따라서 **```MainActivity.java```** 는 사용자와 상호작용하여 새로운 액티비티를 생성하거나 요구사항을 만족시키는 작업을 수행

```python
package com.example.myapplication;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
```

#### (2) AndroidManifest.xml

- 응용 프로그램 구성정보 포함
    - 요구되는 최소한의 API 레벨
    - 안드로이드 각 플랫폼 버전에 맞는 API 레벨이 존재
    - 이 API를 통해 코어 라이브러리나 하드웨어에 명령
- 파일명은 프로젝트에 상관 없이 고정
- 안드로이드 앱 컴포넌트 선언
    - 요구되는 하드웨어, 소프트웨어 기능 정의
- 안드로이드 앱의 실행을 위한 소유 권한 정의

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapplication">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MyApplication">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

<br>

> **\* XML 레이아웃의 장점**
>> 레이아웃 재활용(구조와 속성을 함축적으로 기술)
>> 언어 이식성
>> 소스, 화면단 간 분업에 용이
>> 컴파일의 영역이므로 런타임 성능 이슈가 없음
>> XML 컴파일의 결과는 이진 포맷으로 변환되므로 용량상 낭비 없음

<br>

---

#### 1.4 View

**activity_main.xml** 이 화면의 레이아웃이라면, **실제 화면을 구성하고 나타내는 것이 View** 입니다.
(쟁반 위의 그릇 비유)

크고 작은 각각의 레이아웃을 액티비티라고도 부르는데 이것이 화면을 구성하는 기본 단위입니다.
액티비티는 직접적으로 보이지 않으며, 이것 안의 View 가 사용자에게 보여지는 실체입니다.

> 안드로이드 앱 > 여러 액티비티 > 액티비티를 구성하는 View

#### (1) 액티비티와 View

- View의 파생 클래스는 매우 다양, 각 클래스별 지원하는 속성이나 기능이 많음

#### (2) View의 종류

- ViewGroup
    - 직접적으로 보이지 않으며 다른 View 를 담는 쟁반 역할을 함
    - 여러 개의 View를 유기적으로 모아 놓은 것
    - ViewGroup 클래스들은 일반적으로 레이아웃이라고 함
- Widget(위젯)
    - 직접적으로 보이며 사용자 인터페이스를 구성
    - Button, TextView, EditView, RadioButton 등
    - 사용자와의 직접적인 상호작용을 이끌어내며 그 결과를 표현
    - 혹은 입력된 값을 JAVA 프로그램으로(서버로) 전달

**ViewGroup** 을 쟁반 레이아웃, **Widget** 을 반찬 담는 그릇이라 생각하면 편합니다.
ViewGroup은 모아놓은 View들을 배치하는 역할을, 각각의 View는 상호작용을 합니다.

때로 ViewGroup이면서 실제 보이는 Widget처럼 사용되는 **ListView** 와 같은 클래스도 존재합니다.
이것은 여러 View가 모여 구현된 하나의 복합적인 위젯이므로, 그만큼 많은 기능을 수행합니다.

<br>
## 2. View의 속성

본 수업에 들어가기에 앞서, **안드로이드 앱의 전체 실행 과정**을 살펴보겠습니다.
소스코드가 컴파일되어 바이트 실행파일로 변환, 가상머신에서 실행되는 과정 자체는 JAVA의 그것과 유사합니다.

---

#### (1) 컴파일 과정

![android compile01]({{ site.github.url }}{% link assets/post-img/android_compile01.png %})

- **개발자(JDK)**: ```.java``` 형식의 소스파일 작성, 컴파일
- **개발PC(SDK)**: 변환된 ```.class``` 형식의 바이트 코드를 ```.dex``` 형식의 안드로이드 가상머신용 실행 파일로 변환, ```.apk```로 패키징
- **스마트폰(가상머신)**: 안드로이드 폰의 가상머신이 ```.apk``` 내의 ```.dex``` 중심으로 어플리케이션 실행
    - 이전 가상머신은 JIT(Just In Time, 인터프리터) 방식의 
    <a href="https://source.android.com/devices/tech/dalvik" target="_blank">**Dalvik**</a>이었으나,
    - LOLIPOP 이후로는 컴파일 단위로 실행하는 
    <a href="https://source.android.com/devices/tech/dalvik" target="_blank">**ART(Android RunTime)**</a>로 쓰임
    - 스마트폰 발열 및 성능상 컴파일 방식이 유리

#### (2) 안드로이드 앱 배포과정

안드로이드 프로젝트가 컴파일 및 패키징되어 Signing 이후 배포되는 과정입니다.

![android deployment01]({{ site.github.url }}{% link assets/post-img/android_deployment01.png %})

Signing 은 debug key 를 ```.apk``` 파일에 서명하는 방식으로 진행되며, 이는 타인에 의한 위변조 방지 및 개발자 식별 등에 쓰입니다.
배포 시에는 Google Play 에 서명한 key 값을 가지고 올라갑니다.

---

이제 본격적으로 **View**에 대해서 살펴봅시다.

---

#### 2.1 View의 속성 (1)

앞서 쟁반 레이아웃 개념인 **ViewGroup**과 그릇 개념인 **Widget(View)**에 대해 설명했습니다.
또한 레이아웃을 액티비티라고도 부른다고도 했었습니다.

둘의 역할은 다르지만, View 부모 클래스로부터 상속되었다는 공통점이 있습니다.
따라서 View의 전반적인 속성에 대해 살펴보겠습니다.

#### (1) id

- View의 고유한 이름을 정의 (재사용시, 중복 x)
- JAVA나 XML에서 View를 참조할 때 id를 사용
- 따라서 직관적이고 설명적인 작명이 필요함 (이해도, 가독성 상승)

```xml
<Button
    ...
    android:id="@+id/button"  // 'button' id 부여
    android:layout_below="@id/textView"  // id가 'textView'인 위젯 아래에 'button' 배치
    ... />
```

- **@**: id를 ```R.java```에 정의하거나 ```R.java```로부터 참조한다는 의미
- **+**: id를 새로 정의한다는 의미. 참조시에는 붙이지 않음
- **id/**: id를 사용하겠다는 예약어

> **R.java**
>> 이 파일은 주소록이라고 설명했습니다. 따라서 id와 같은 여러 리소스의 이름이 컴파일되어 저장됩니다.

#### (2) clickable, longClickable

- **clickable**: 마우스 클릭 이벤트 허용 여부
- **longClickable**: 롱클릭 이벤트 허용 여부
- **click**: 손가락으로 View를 누르는 것
- **Long click**: View를 누른 채로 잠시 기다리는 것
- 값은 **true** or **false**

이것들은 View 부모 클래스 자체의 속성이므로 ViewGroup 혹은 Widget 모두에서 지정 가능합니다.

---

#### 2.2 View의 속성 (2)

#### (1) background

- View의 배경을 채우는 방법 지정
- 별다른 지정이 없다면 View의 기본 배경이 그려짐
- 여러 가지 객체로 배경을 지정 가능 (색상)

```xml
<Button
    ...
    android:background="@drawable/ic_launcher"  // 'drawble' 내 'ic_launcher' id 객체를 배경으로 지정
    ... />
```

- 'ic_launcher' 는 안드로이드 기본 제공 배경

background 속성은 배경뿐 아니라 색상도 지정할 수 있습니다.

- \#RGB
- \#ARGB
- \#RRGGBB
- \#AARRGGBB

'#' 다음에 16진수로 색상 강도를 조정합니다. (ex. ```android:background="#ffff1325"```)

#### (2) padding

- View와 내용물 간의 간격 지정
- View의 안쪽 여백이며, TextView같은 경우 지정된 만큼 상하좌우 여백이 생김
- paddingTop, paddingRight, paddingBottom, paddingLeft 로 세분화 가능

---

#### 2.3 View의 속성 (3)

#### (1) visibility

- 화면에 View의 표시 유무를 지정
- 실행 중 필요시에만 보이도록 지정할 수 있음
- 별다른 지정이 없으면 보이는 상태로 배치

visibility 속성은 런타임 중 얼마든지 변경 가능합니다.

- **visible**: View가 보이는 상태
- **invisible**: View가 숨겨진 상태이지만 자리는 차지
- **gone**: View가 숨겨진 상태이며 자리도 차지하지 않음

#### (2) focusable

- 키보드 포커스 허용 여부 지정
- View 클래스는 디폴트로 focus 를 받지 않도록 되어 있음
- EditText 나 Button 처럼 사용자 입력이 요구되는 파생 클래스는 focusable 속성이 default **true** 로 지정되어 있음

```xml
<TextView
    ...
    android:id="@+id/textView1"
    android:focusable="false"  // Set focusable to false
    ... />
```

<br>
## 3. TextView와 ImageView (1)

그릇에 해당하는 Widget 중, **TextView** 와 **ImageView** 를 살펴보겠습니다.

---

#### 3.1 TextView 의 속성 (1)

#### (1) TextView 개요

- 화면에 텍스트를 출력하는 위젯
- 고정된 텍스트를 출력 혹은다른 위젯의 제목을 표시
- TextView 의 속성은 Button, EditText 등의 파생 클래스에도 적용됨

```text
-> TextView -> Button
            -> EditText
```

#### (2) text 속성

- 출력할 문자열을 지정하는 속성, default 빈 문자열.
- text="XXX" 와 같은 형식
- 다국어 버전 개발에 유용
- 문자열을 **strings.xml** 에 **id** 를 지정하여 정의해 놓으면 재사용성과 다국어 스위칭에 유리 (변수화!)

- text 정의 방식
    - **"문자열"** - 쌍따옴표로 바로 대입. escape 허용
    - **@[패키지:]type:name** - 리소스에 대한 레퍼런스로 지정(변수처리) 보통 **@string/id** 식으로 지정
    - **?\[패키지:][type:]name** - 테마 속성으로 지정

```xml
<!-- 직접 대입 방식 -->
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="New Text!"
    android:textSize="30dp" />


<!--
    변수 처리 방식.
    R.java 주소록의 "hello_world" 아이디값을 탐색해
    strings.xml 에 등록된 문자열 리소스를 가져옴.
     -> 재사용 및 다국어 처리에 유리
-->
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/hello_world"
    android:textSize="30dp" />
```

#### (3) textColor 속성

- 문자열의 색상 지정. #RGB or #ARGB
- default 로 불투명한 밝은 회식 지정
    - 배경이 밝은색이면 잘 보이지 않음

#### (4) textSize 속성

- text 의 font size 지정
- 사이즈 숫자 뒤에 sp, dp, px, in, mm 등의 단위가 붙음
- 기기 기본 크기에 따라 가변적인 sp 단위가 적절

#### (5) textStyle 속성

- 폰트 속성 > normal, bold, italic
- '|' 로 묶어 두 개 이상의 상수값 지정 가능 (ex. "bold|italic")

---

#### 3.2 TextView 프로젝트

그럼 **TextView** 연습을 위한 안드로이드 프로젝트를 생성해 보겠습니다.

- R.java
- MainActivity.java
- activity_main.xml
- strings.xml
- AndroidManifest.xml

자동으로 생성되는 위 파일들 중 직접적으로 다룰 것은 MainActivity.java, activity_main.xml, strings.xml 세 개입니다.

---

#### 3.3 TextView 의 속성 (2)

---

#### ImageView (1)

<br>
## 4. TextView와 ImageView (2)

<br>
## 5. LinearLayout의 속성

<br>
## 6. 렐레티브레이아웃과 프레임레이아웃
