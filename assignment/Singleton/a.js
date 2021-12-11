const User = require('./cache.js');
const makeUser = require('./b.js');

const user1 = User;
user1.setInfo('James Gosling', 'JG@email.com');

const user2 = makeUser();

console.log(user1.getInfo());
console.log(user2.getInfo());
