const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/users.json');

const User = {
  init() {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
  },

  create(userData) {
    this.init();
    const users = this.getAll();
    
    if (users.find(u => u.username === userData.username)) {
      return { success: false, message: 'Username already exists' };
    }

    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const newUser = {
      id: uuidv4(),
      username: userData.username,
      password: hashedPassword,
      fullName: userData.fullName,
      profession: userData.profession,
      joinedOn: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    
    return { success: true, user: newUser };
  },

  getAll() {
    this.init();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  },

  findById(id) {
    return this.getAll().find(u => u.id === id);
  },

  findByUsername(username) {
    return this.getAll().find(u => u.username === username);
  },

  verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
};

module.exports = User;
