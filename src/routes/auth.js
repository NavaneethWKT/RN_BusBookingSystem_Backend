const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {
  findUserByEmail,
  addUser,
  enrichUser,
} = require('../store');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const match = bcrypt.compareSync(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.json(enrichUser(user));
});

router.post('/signup', (req, res) => {
  const { name, phone, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = addUser({
    id: `user-${uuidv4()}`,
    name,
    phone: phone || '',
    email,
    pic: pic || '',
    passwordHash,
  });
  res.status(201).json(enrichUser(newUser));
});

module.exports = router;
