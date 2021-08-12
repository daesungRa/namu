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
7. [레이아웃의 중첩](#7-레이아웃의-중첩)
8. [Canvas와 Toast](#8-canvas와-toast)
9. [이벤트 처리](#9-이벤트-처리)
10. [입력 이벤트 처리](#10-입력-이벤트-처리)
11. [위젯의 이벤트 처리](#11-위젯의-이벤트-처리)
12. [액티비티와 인텐트](#12-액티비티와-인텐트)
13. [ListView와 Spinner](#13-listview와-spinner)
14. [AlertDialog 1](#14-alertdialog-1)
15. [AlertDialog 2](#15-alertdialog-2)

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

```java
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
- 고정된 텍스트를 출력 혹은 다른 위젯의 제목을 표시
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
- '\|' 로 묶어 두 개 이상의 상수값 지정 가능 (ex. "bold\|italic")

---

#### 3.2 TextView 프로젝트

그럼 **TextView** 연습을 위한 안드로이드 프로젝트를 생성해 보겠습니다.

- **R.java** > 컴파일된 주소록
- **MainActivity.java** > 프로젝트 시작점
- **activity_main.xml** > 화면 레이아웃
- **strings.xml** > 문자열 변수
- **AndroidManifest.xml** > 사양 및 정보

자동으로 생성되는 위 파일들 중 직접적으로 다룰 것은 **MainActivity.java**, **activity_main.xml**, **strings.xml** 세 개입니다.

**MainActivity.java** 의 **MainActivity** 클래스는 기본적인 화면 레이아웃을 생성합니다.

```java
public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState):
        setContentView(R.layout.activity_main);
    }
}
```

- **activity_main.xml** 은 레이아웃을 기술
- **MainActivity** 는 컴파일되어 **R.java** 에 정의된 **activity_main** 레이아웃을 불러와 기본 액티비티에 전개
    - **setContentView(R.layout.activity_main);**
- 따라서 레이아웃 내 위젯을 채우려면 그것이 기술되어 있는 **activity_main.xml** 안의 레이아웃을 수정
    - LinearLayout 안의 TextView
- TextView 에 변수처리된 문자열이 있다면, **strings.xml** 내에 해당 문자열을 정의하거나 변경

다음은 **activity_main.xml** 레이아웃, 위젯 수정 예제입니다.
LinearLayout 을 추가하고 그 안에 TextView 위젯을 여러 개 넣습니다.

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    tools:context=".MainActivity"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView
        android:id="@+id/tv1"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        android:textColor="#ff0000"
        android:textSize="18pt"
        android:textStyle="italic"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/tv2"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:focusable="true"
        android:text="@string/tv2_name"
        android:textColor="#ff00ff"
        android:background="#3355bb"
        android:textSize="18sp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/tv3"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:focusable="true"
        android:text="@string/tv3_name"
        android:textColor="#707070"
        android:textSize="3mm"
        android:typeface="serif"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</LinearLayout>
```

LinearLayout 으로 내부 위젯이 순차적으로 나타나되,
**android:orientation="vertical"** 속성으로 인해 세로로 보입니다.

첫 번째 위젯은 text 속성에 직접 문자열을 대입하고, 나머지는 **string.xml** 에 변수처리 되었습니다.
그리고 나머지 속성값들도 확인해볼 수 있습니다.

---

#### 3.3 TextView 의 속성 (2)

#### (1) typeFace 속성

- 글꼴의 모양 지정, 모바일 메모리 환경 제약으로 인해 폰트 개수에 제약이 있습니다.
- normal, sans, serif, monospace

#### (2) width, height 속성

- TextView 의 폭과 높이 (그릇의 사이즈!)
- 절대 크기보다는 상대 크기의 단위를 활용. 기기마다 디스플레이 환경이 다양하기 때문

#### (3) singleLine 속성

- 출력 문자열의 길이가 TextView 위젯의 폭(width)보다 클 때 강제로 한 줄에 출력
- true or false
- 넘어가는 부분은 잘리고, 대신 '...' 생략 표시

---

#### 3.4 ImageView (1)

#### (1) ImageView

TextView 가 문자열을 담는 그릇이라면 ImageView 는 그림을 담는 그릇(위젯)입니다.

#### (2) Src 속성

- 출력할 이미지 지정 (아무 값도 없으면 보이는 것이 없음)
- 색상 정의(#rrggbb 방식) 가능, 외부 이미지 로드 가능
- 기본적인 프로젝트 내 이미지 저장 경로는 **res \ drawable \\** 폴더 내

```xml
<ImageView
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:src="@drawable/banana"
    android:tint="#70ff00ff" />
```

string 변수처리와 같이 **"@drawable/ID"** 와 같은 방식으로 이미지를 지정해줍니다.
마찬가지로 R.java 에 해당 이미지 경로가 컴파일되어 있기 때문에 id 참조가 가능합니다.

#### (3) image 포맷

- jpg, png, gif 포맷
- png 포맷은 Alpha 채널이 있어 반투명도 지원
- 직사각형이 아닌 이미지도 만들 수 있음

#### (4) res \ drawable \\

- 프로젝트 루트 아래에 이 경로가 존재하며, 여기에 이미지 파일들 저장
- 해상도별
    - ldpi: 120 정도 낮은 해상도
    - mdpi: 160 정도 중해상도
    - hdpi: 240 정도 고해상도
    - 이미지 추가 시 res \ drawable-mdpi 폴더에 복사

#### (5) ImageView 프로젝트

레이아웃에 ImageView 위젯을 생성해 봅시다.

- 이미지 파일을 res 폴더에 복사
- **<a href="https://developer.android.com/studio/command-line/aapt2" target="_blank">aapt(Android Asset Packaging Tool)</a>**
가 컴파일 전에 새로 추가된 이미지 파일을 찾아 R.java 에 **"파일명"으로 id 자동 정의**
- 위젯 태그에서 참조는 strings.xml 의 그것과 같이 **id 베이스**로 함
- 따라서 "파일명"은 **영소문자로 작성하되, 공백 없이 특수 기호를 사용하지 말아야 함**(특수문자 중 언더바 정도 허용)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:paddingBottom="10dp"
    android:paddingLeft="30dp"
    android:paddingRight="30dp"
    android:paddingTop="30dp"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/tv3"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:focusable="true"
        android:text="@string/sana"
        android:textColor="#707070"
        android:textSize="36sp"
        android:typeface="serif"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        tools:ignore="SmallSp" />

    <ImageView
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:src="@drawable/sana"
        android:adjustViewBounds="true"
        android:maxHeight="180dp"
        android:contentDescription="@string/sana" />

</LinearLayout>
```

![CUTY SANA Android]({{ site.github.url }}{% link assets/post-img/cuty_sana_android01.png %})

**maxWidth**, **maxHeight** 속성으로 가로 세로 최대크기를 지정할 수 있으며, **adjustViewBounds** 로 이미지 비율을 유지할 수 있습니다.
**tint** 속성은 이미지의 색상을 지정합니다.
무엇보다 에러가 발생하지 않도록 파일명 작성에 유의합시다.

<br>
## 4. TextView와 ImageView (2)

본 강의에서는 3강에서 다루던 **ImageView** 를 마무리하고 **Button**, **EditText** 와 함께 레이아웃에 대해 살펴보겠습니다.

---

#### 4.1 ImageView (2)

#### (1) maxHeight, maxWidth, minHeight, minWidth 속성

- 화면에 출력될 이미지의 최소, 최대 너비와 높이를 지정
- 상대 크기 단위를 사용할 것

#### (2) adjustViewBounds 속성

- 이미지의 종횡비를 유지하는 속성 (true or false)

#### (3) cropToPadding 속성

- Widget 에 주어진 여백에 맞추기 위해 이미지의 일부를 자름
- 예를 들어, ImageView 의 padding 을 20dp 로 주고 cropToPadding="true" 라면, padding 에 맞춰 이미지가 잘라짐

```xml
<ImageView
    android:id="@+id/imageid"
    android:scaleType="centerCrop"
    android:padding="20dp"
    android:cropToPadding="true" />
```

#### (4) tint 속성

- 이미지에 색조를 입힘 (#aarrggbb)
- 색조가 위에 덮여 출력
- 불투명한 색은 src 속성에 단색을 주는 것과 같은 효과

#### (5) scaleType 속성

- 이미지 확대/축소 알고리즘을 지정하여 원래 크기와 다른 이미지를 화면에 표현
- matrix, fitXY, center, centerCrop 등의 알고리즘

---

#### 4.2 Button 과 EditText

버튼과 텍스트 입력 창입니다.
이것들은 사용자의 입력을 받아들이는 대표적인 방법입니다.

이 두 클래스는 **TextView** 의 파생 클래스임을 기억합시다. (text 등의 속성 사용가능)

#### (1) Button

- 기본 사각 모양의 버튼
- 문자열이 들어가 있으며, 사용자가 눌러 명령을 전달할 수 있음

#### (2) EdirText

- 문자열을 입력받는 Widget, 간단히 에디트라 부름
- TextView 의 모든 속성을 사용할 수 있다
- 추가로 문자열 편집 관련 메서드 제공

#### (3) ButtonEdit 프로젝트 - Design Layout(activity_main.xml), MainActivity.java

**activity_main.xml** 의 Design 탭에서 드래그 앤 드롭으로 각 위젯을 생성할 수 있지만,
직접 xml 태그를 타이핑하는 연습을 해서 확실히 이해하도록 합시다.

다음은 **EditText**, **Button** 각각 하나씩 생성한 예제입니다.

```xml
<EditText
    android:id="@+id/et_default"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:hint="@string/default_placeholder"
    android:autofillHints="@string/default_placeholder"
    android:inputType="text"
    android:layout_gravity="center" />

<Button
    android:id="@+id/btn_default"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/btn_confirm"
    android:layout_gravity="center" />
```

이렇게 생성한 위젯들은 재사용을 위해 id 변수처리를 해야 합니다. (JAVA 코드에서 활용)
버튼을 클릭하면 Click Event 가 발생하는데, 이것의 처리는 JAVA 코드 내에서 이루어집니다.

- 버튼 위젯의 ID 를 참조해 **android.widget.Button** 타입의 객체를 생성하여 이것에 **OnClickListener**를 추가
- 그럼 작성한 함수 내용에 따라 **android.widget.Toast** 가 팝업에 나타남

```java
...
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
...

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    
        // Add onclick event to button
        Button btn = (Button) findViewById(R.id.btn_default);
        btn.setOnClickListener(new Button.OnClickListener() {
            @Override
            public void onClick(View v) {
                EditText edit = (EditText) findViewById(R.id.et_default);
                String str = edit.getText().toString();
                Toast.makeText(MainActivity.this, str, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

앱 실행 시 텍스트 입력 후 CONFIRM 클릭하면 해당 팝업창이 나타납니다.

---

#### 4.3 ViewGroup 의 속성 (1)

이제 레이아웃을 의미하는 **ViewGroup** 의 속성을 살펴보겠습니다.

#### (1) layout_width, layout_height 속성

- View 의 폭과 높이 지정
- 자신을 감싸고 있는 부모 View 에 따라 **match_parent**, **wrap_content** 등의 값 활용 (부모 크기만큼 / 내부 컨텐츠 크기만큼)

이런 사이즈 값들은 절대값이 아니라 상대값을 활용해 여러 기기에 유동적으로 적용되도록 합니다.

---

#### 4.4 ViewGroup 의 속성 (2)

#### (1) padding 속성

- View 와 내용물 간의 간격 지정
- padding 이 지정된 ViewGroup 의 내부 위젯은 영향을 받을 수 있음
- paddingTop, paddingRight, paddingBottom, paddingLeft 로 분화 가능

#### (2) layout_margin 속성

- margin 은 반대로 ViewGroup 과 부모와의 간격 지정
- 뿐아니라 형제 View 와의 간격에도 영향
- 이 속성도 마찬가지로 상하좌우 분화 가능

#### (3) padding 과 layout_margin

padding 은 뷰(혹은 레이아웃)의 내부 여백을 채우고, layout_margin 은 속성이 지정된 뷰의 바깥 여백으로 지정되므로 그 특성을 잘 고려합시다.

<br>
## 5. LinearLayout의 속성

<br>
## 6. 렐레티브레이아웃과 프레임레이아웃

**RelativeLayout** 과 **FrameLayout** 은 안드로이드 UI 에서 가장 많이 사용되는 레이아웃입니다.
특히 **FrameLayout** 은 고유한 특성으로 인해 꼭 필요한 경우가 존재합니다.

---

#### 6.1 RelativeLayout 의 속성 (1)

**RelativeLayout** 은 말 그대로 쟁반(ViewGroup)과 그릇(View, Widget)을 상대적으로 배치하는 것입니다.
따라서 항상 기준 요소가 필요하고, 그 기준에 따라 상대적인 위치가 정해지므로, XML 요소의 순서와 실제 화면 배치 순서는 무관합니다.

기준 요소는 일반 위젯이 될 수 도 있고, 부모 뷰그룹이 될 수도 있습니다.
이때, 기준 요소 재사용을 위해 **id 지정은 필수**입니다.

먼저 위젯 간의 상대 속성을 알아봅시다.

#### (1) Widget 간 상대 배치

- **layout_above**: ~의 위에 배치
- **layout_below**: ~의 아래에 배치
- **layout_toLeftOf**: ~의 왼쪽에 배치
- **layout_toRightOf**: ~의 오른쪽에 배치
- **layout_alignLeft**: ~와 왼쪽 변을 맞춤
- **layout_alignTop**: ~와 위쪽 변을 맞춤
- **layout_alignRight**: ~와 오른쪽 변을 맞춤
- **layout_alignBottom**: ~와 아래쪽 변을 맞춤

먼저 기준 요소를 지정합니다.

```xml
<RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:padding="20dp">

    <!-- Target Element -->
    <TextView
        android:id="@+id/target"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/target_text"
        android:layout_centerInParent="true"
        android:textSize="30sp"
        android:background="#00D8FF" />

</RelativeLayout>
```

기준 요소에 상대적으로 각 요소들을 배치해 봅니다.

```xml
...
    <TextView
        android:id="@+id/top"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/top_text"
        android:layout_above="@id/target"
        android:textSize="12sp"
        android:background="#1DDB16" />

    <TextView
        android:id="@+id/right"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/right_text"
        android:layout_toRightOf="@id/target"
        android:textSize="12sp"
        android:background="#1DDB16" />

    <TextView
        android:id="@+id/bottom"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/bottom_text"
        android:layout_below="@id/target"
        android:textSize="12sp"
        android:background="#1DDB16" />
    ...
...
```

**ID "target"** 인 중앙 요소에 상대적인 설정들입니다. 세 개만 작성했는데, 실습을 통해 완성해보면 좋습니다.

#### (2) 부모 ViewGroup or Layout 에 상대 배치

이번에는 부모 요소에 상대적인 배치 속성들입니다.

- **layout_alignParentLeft**: true 이면 부모와 왼쪽 변을 맞춤
- **layout_alignParentTop**: true 이면 부모와 위쪽 변을 맞춤
- **layout_alignParentRight**: true 이면 부모와 오른쪽 변을 맞춤
- **layout_alignParentBottom**: true 이면 부모와 아래쪽 변을 맞춤
- **layout_alignBaseline**: ~와 베이스라인을 맞춤

- **layout_alignWithParentIfMissing**: layout_toLeftOf 등의 속성에 대해 앵커가 발견되지 않으면 부모를 앵커로 사용
- **layout_centerHorizontal**: true 이면 부모의 수평 중앙에 배치
- **layout_centerVertical**: true 이면 부모의 수직 중앙에 배치
- **layout_centerParent**: true 이면 부모의 수평, 수직 중앙에 배치

부모 요소를 기준으로 위 속성들을 활용해 봅시다.

#### (3) 리소스 컴파일러와의 관계

RelativeLayout 에서 상대적으로 얽혀 있는 여러 요소들의 참조관계는 **컴파일 시 한번에 읽도록** 되어 있습니다.
이는 **빠른 배치**가 가능하게 하며, 요소 간 종속적 관계에서 **기준이 되는 요소가 XML 상에서 먼저 정의**되어 있어야 참조할 수 있습니다.

#### (4) 배치상의 어려움

계속 설명했듯 RelativeLayout 은 요소 간 상대적이기 때문에 참조관계를 많이 정의하면 할수록 헷갈리기 쉽습니다.

- 헷갈리다는 의미는, **유지보수성의 저하**로 이어질 수 있음 (직관적인 이해가 어려움)
- 이미 복잡한 상대적 관계를 갖는 요소들이 배치되어 있다면, 그것을 **대체하기가 어려움**
- 또한, 논리적으로 맞지 않는 관계가 형성될 수 있음 (A -> B and B -> A)

---

#### 6.2 RelativeLayout 의 속성 (2)

일반적으로 **부모와 관계되는 기준 요소를 가장 먼저** 정의하고,
부모의 변에 달라붙는 위젯, 나머지 상대 요소 순으로 정의하면 의도한 대로 위치하게 됩니다.

---

#### 6.3 AbsoluteLayout 의 속성

**AbsoluteLayout** 은 RelativeLayout 와는 반대로 **절대 좌표**에 차일드 뷰를 위치시킵니다.
레이아웃, 뷰그룹, 위젯 간의 **관계나 순서에 관계없이 지정한 고정 좌표에만 배치**되므로, 자유도가 높고 위치가 상대적으로 변화될 걱정이 없습니다.

그러나 **이 레이아웃이 실제적으로 사용되지 않는 이유는, 절대 좌표가 다양한 모바일 환경에 적절히 적용될 수 없기 때문**입니다.
x, y 축 고정 좌표에 요소를 위치시키면 화면이 큰 모바일에서는 여백이 많이 발생할 것이고, 반대로 작은 화면의 모바일에서는 잘려서 나올 수 있습니다.
세로 화면, 가로 화면에 따라서도 보여지는 것이 달라지게 됩니다. (<del>공식 문서에서도 사용하지 말라고 합니다.</del>)

- **layout_x**: 가로축 절대 좌표
- **layout_y**: 세로축 절대 좌표

다음은 JAVA 와 함께 유용하게 사용될 수 있는 **FrameLayout** 을 살펴보겠습니다.

---

#### 6.4 FrameLayout 의 속성

**FrameLayout** 에서의 모든 요소들은 **순차적으로 중첩**됩니다. 이 말은, 나중에 중첩된 요소가 가장 앞단에 보이게 된다는 의미입니다.

이것은 빈번하게 사용되지는 않지만, 겹겹이 쌓아나가는 특성을 잘 활용하여 필요한 곳에 적용할 수 있습니다.

- Child Views 를 배치하는 규칙이 따로 없음. 항상 좌상단에 나타남.
- 요소가 두 개 이상일 때는 추가된 순서대로 겹쳐서 표현 (가장 나중 것이 표면에 보임)

특정 조건에 따라 차일드 뷰 하나만 선택적으로 나타나게 할 수 있습니다.

#### (1) FrameLayout 의 속성

- **foreground**: (모든)차일드의 위쪽에 살짝 얹히는 (뚜껑)이미지를 지정함
- **foregroundGravity**: foreground 이미지의 위치를 결정 (default "fill")
- **measureAllChildren**:
    - True 인 경우 레이아웃의 크기를 모든 차일드 뷰 크기에 맞춤 (차일드 중 가장 큰 것)
    - False 인 경우 차일드 중 visibility 속성값이 visible 인 뷰에만 맞춤

Gravity 는 위치를 지정하므로, foregroundGravity 속성은 뚜껑 이미지의 위치를 지정합니다.
기본값인 fill 은 이미지가 프레임 전체를 커버하도록 합니다.

#### (2) FrameLayout 과 JAVA 예제

FrameLayout 은 보이거나 안보이거나, 마지막 요소가 나타나거나... 등등의 특성으로 인해 **JAVA 와 동적인 협업**에 사용됩니다.

- Button 의 클릭 이벤트 리스너를 작성하여 ImageView 의 보여짐 여부를 변경하는 예제
- 이벤트 발생 시 ImageView 의 상태를 조사한 후 visibility 속성을 바꿈

```xml
<!-- activity_main.xml -->

...

<ImageView
    android:id="@+id/img"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@drawable/ic_launcher" />

<Button
    android:id="@+id/btn"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="Click, Button" />

...
```

ImageView 의 이미지는 기본 이미지를 활용했고, visibility 속성이 별도로 지정되어 있지 않으므로 default "visible" 입니다.

```java
/* MainActivity.java */

...

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btn = (Button) findViewById(R.id.btn);
        btn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                ImageView img = (ImageView) findViewById(R.id.img);
                if (img.getVisibility() == View.VISIBLE) {
                    img.setVisibility(View.GONE);
                } else {
                    img.setVisibility(View.VISIBLE);
                }
            }
        });
    }
}

...
```

<br>
## 7. 레이아웃의 중첩

본 강의에서는 TableLayout, 레이아웃의 중첩, 앱 실행 중에 속성을 바꾸는 것을 학습합니다.

---

#### 7.1 TableLayout

**TableLayout** 은 바둑판이라고 생각하면 됩니다.

---

#### 7.2 레이아웃 중첩 (1)

---

#### 7.3 레이아웃 중첩 (2)

---

#### 7.4 실행중에 속성 바꾸기

<br>
## 8. Canvas와 Toast

<br>
## 9. 이벤트 처리

<br>
## 10. 입력 이벤트 처리

<br>
## 11. 위젯의 이벤트 처리

<br>
## 12. 액티비티와 인텐트

<br>
## 13. ListView와 Spinner

<br>
## 14. AlertDialog 1

<br>
## 15. AlertDialog 2
