const u = { id: 1, firstName: 'Gildong', lastName: 'Hong' };

const fullName = (user) => ({
  ...user,
  fullName: `${user.firstName}, ${user.lastName}`,
});

const appendAddr = (user) => ({ ...user, addr: 'Seoul' });

const removeNames = (user) => {
  delete user.firstName;
  delete user.lastName;
  return user;
};

// 모범답안
function compose() {
  var fns = arguments;

  return function rfn(obj, i) {
    i = i || 0;
    if (i < fns.length) {
      return rfn(fns[i](obj), i + 1);
    }
  };
  return rfn(obj);
}

console.log(compose(fullName, appendAddr, removeNames)(u));
