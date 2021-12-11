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
