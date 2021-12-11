# **싱글톤 패턴 구현**

## **과제**

- 3개의 파일을 만들고 require가 캐싱된 인스턴스를 재사용하는 것을 보여라.

<br>

```js
//cache.js
// Class 생성 및 modules-caching 방식을 이용
class User {
  constructor() {
    this.name = 'init';
    this.email = 'init@email.com';
  }

  setInfo(name, email) {
    this.name = name;
    this.email = email;
  }

  getInfo() {
    return [this.name, this.email];
  }
}

module.exports = new User();
```

```js
// b.js
// cache.js의 모듈을 이용한 객체를 생성하는 함수를 생성
const User = require('./cache');

const makeUser = () => {
  const user = User;
  return user;
};

module.exports = makeUser;
```

```js
// a.js
// cache.js, b.js를 각각 이용한 두 객체 생성
const User = require('./cache.js');
const makeUser = require('./b.js');

const user1 = User;
user1.setInfo('James Gosling', 'JG@email.com');

const user2 = makeUser();

console.log(user1.getInfo());
console.log(user2.getInfo());
```

**[결과]**

- 만약 `user1`과 `user2`가 각각 다른 인스턴스로 생성되었다면 출력은 다음과 같다.
  - `user1`: ['James Gosling', 'JG@email.com']
  - `user2`: ['init', 'init@email.com']
- 하지만 require한 모듈은 cache에 저장되어 한 인스턴스를 재사용하기 때문에 출력 결과는 아래의 그림과 같다.
  ![image](https://user-images.githubusercontent.com/60606025/145621180-09d91d18-cec9-4f40-90e5-7a3ec8d5b05b.png)

<br><br>

## [참고]

**Singleton Pattern**

- 하나의 프로그램 내에서 하나의 인스턴스가 한 번만 메모리에 할당하여 생성
- 클래스의 인스턴스가 하나만 존재하도록 접근을 중앙 집중화
- 사용할 때마다 객체를 생성하지 않고 필요시 가져다 씀
- 데이터 공유가 쉽고 메모리 낭비 줄임

<br>

**장점**

- _상태정보의 공유_
- _리소스 사용의 최적화_
- _리소스에 대한 접근 동기화_

<br>

## **Node JS와 Singleton**

- Node.js는 한번 require한 모듈을 require.cache에 저장
  - 매번 새로운 인스턴스가 생성되는 것이 아닌 캐싱된 인스턴스를 재사용
- Node.js에서는 굳이 싱글턴을 구현하기보다 module.exports를 사용하는 것이 편리함

<br>
ex) DB 연동 시 최초 require된 시점에서 pool이 생성되고, 그 이후에 require를 수행해도 pool은 더 이상 생성되지 않음. 따라서 DB Pool 생성하는 코드를 모듈화해서 require해서 사용해도 괜찮음

```js
const mysql = require('mysql2/promise');
const config = require('../conf/db');

module.exports = mysql.createPool(config.poolOption);
```
