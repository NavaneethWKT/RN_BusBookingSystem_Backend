const express = require('express');
const { getUsers, findUserById, enrichUser } = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  const users = getUsers().map(enrichUser);
  res.json(users);
});

router.get('/:id', (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(enrichUser(user));
});

module.exports = router;
