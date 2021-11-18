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

function compose() {
  var fns = arguments;

  return function runRecursion(obj, idx = fns.length - 1) {
    if (idx === 0) {
      return fns[idx](obj);
    }

    var userInfo = runRecursion(obj, idx - 1);
    return fns[idx](userInfo);
  };
}

console.log(compose(fullName, appendAddr, removeNames)(u));
