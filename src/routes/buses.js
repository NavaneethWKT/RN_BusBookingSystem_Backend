const express = require('express');
const { getBuses, findBusById } = require('../store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getBuses());
});

router.get('/:id', (req, res) => {
  const bus = findBusById(req.params.id);
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }
  res.json(bus);
});

module.exports = router;
