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

(1) activity_main.xml

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

(2) strings.xml

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

(3) R.java

- 리소스 ID(strings.xml 의 변수와 같은)를 참조하기 위한 클래스로, 주소록처럼 사용
- 새 리소스가 등록되면 컴파일 후 해당 정보가 R 클래스에 자동으로 등록되는데, 그 작업을 ```aapt:Android Asset Packaging Tool``` 가 수행
- 따라서 개발자가 임의로 변경하면 안됨!

---

#### 1.3 안드로이드 프로젝트의 구성 (2)

(1) MainActivity.java

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

(2) AndroidManifest.xml

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
액티비티는 직접적으로 보이지 않으면, 이 액티비티 안의 View 가 사용자에게 보여지는 실체입니다.

> 안드로이드 앱 > 여러 액티비티 > 액티비티를 구성하는 View

(1) 액티비티와 View

- View의 파생 클래스는 매우 다양, 각 클래스별 지원하는 속성이나 기능이 많음

(2) View의 종류

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

---

#### 2.1

#### 2.1.1

#### 2.1.2

---

#### 2.2

#### 2.2.1

#### 2.2.2

#### 2.2.3

---

#### 2.3

#### 2.3.1

#### 2.3.2

<br>
## 3. TextView와 ImageView (1)

<br>
## 4. TextView와 ImageView (2)

<br>
## 5. LinearLayout의 속성

<br>
## 6. 렐레티브레이아웃과 프레임레이아웃
