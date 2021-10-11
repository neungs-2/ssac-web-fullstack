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
