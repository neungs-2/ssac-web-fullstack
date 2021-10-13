# React 사용법

## 1. npm 초기화 및 리액트 설치

- `npm init -y`
- `npm install react react-dom serve`
  - node_modules directory 생성
  - package-lock.json 생성
  - package.json 생성

<br><br>

## 2. 웹팩 빌드 만들기

- `npminstall --save-dev webpack webpack-cli`
- **webpack.config.js** 파일을 아래와 같이 생성
  - (index.js 파일이 있는 프로젝트) 루트 폴더에 저장

```js
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist', 'assets'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devtool: '#source-map',
};
```

<br><br>

## 3. 바벨 의존 관계 설치

- `npm install babel-loader @babel/core --save-dev`

<br><br>

## 4. 프리셋 설치 및 .babelrc 생성

- 프리셋: 바벨에게 파일 변환 방식을 알려주는 것
- `npm install @babel/preset-env @babel/preset-react --save-dev`
- 프로젝트 루트에 **.babelrc** 생성 후 아래와 같이 작성

```sh
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

<br><br>

## 5. 웹팩 생성하여 번들 만들기

- `npx webpack --mode development`
- 오류 난다면 import문 파일경로 오타 확인

<br>

### Tip. 웹팩 실행 명령어 생성

- 웹팩 실행 가능한 지름길 명령어 (원하면 추가)
- package.js 파일에 npm 스크립트 추가
- 추가 후 `npm run build` 로 명령 가능
- 개인적으로 큰 메리트 없는 듯

```sh
"script":{
  "build" : "webpack --mode production"
},
```

<br><br>

## 6. 번들 로딩하기

- 번들이 존재하는 dist 폴더에 index.html 위치시킴
- index.html에 번들 로딩하는 script 추가

```html
<body>
  <div id="root"></div>
  <!-- 아래 script 추가 -->
  <script src="assets/bundle.js"></script>
</body>
```

<br><br>

---

## **create-react-app**
- 복잡한 과정을 편하게 줄일 수 있는 방법

<br>
### 방법1 
- `npm install -g create-react-app` 으로 cra 설치
- `create-react-app 생성할-프로젝트-폴더명` 으로 생성할 프로젝트 폴더에서 cra 실행

### 방법2
- 미리 설치하지 않고 `**npx create-react-app 생성할-프로젝트-폴더명**` 으로 설치 없이 한번에 실행

***404 Error 발생 시***
- 에러 메시지 : npm ERR! 404 Not Found - GET https://registry.npmjs.org/creat-react-app - Not found 
- **trouble shooting**
  - 1) 방법 1을 이용하기
  - 2) `npm config set registry http://registry.npmjs.org` 를 실행 후 방법2 실행

### CRA 설치 이후
- `npm start` 혹은 `yarn start`로 실행하여 3000번 포트에서 실행 가능
- `npm test` 혹은 `yarn test`를 통해 테스트 실행 가능
- `npm run build` 혹은 `yarn build`를 통해 번들 생성
