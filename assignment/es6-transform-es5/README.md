# JavaScript 평가 과제

Currying과 Arrow function으로 이루어진 **compose 함수를 ECMAScript 5 형태로 변환**하라.<br>
단, Array.reduce 함수를 사용하지 않고 직접 구현하라.

<br>

```js
const u = { id: 1, fistName: 'Gildong', lastName: 'Hong' };

const fullName = (user) => ({
  ...user,
  fullName: `${user.fistName}, ${user.lastName}`,
});

const appendAddr = (user) => ({ ...user, addr: 'Seoul' });

const removeNames = (user) => {
  delete user.firstName;
  delete user.lastName;
  return user;
};

// 변경할 compose 함수
const compose =
  (...fns) =>
  (obj) =>
    fns.reduce((c, fn) => fn(c), obj);

console.log(compose(fullName, appendAddr, removeNames)(u));
// {id:1, fullName:'Gildong Hong', addr:'Seoul'}
```
