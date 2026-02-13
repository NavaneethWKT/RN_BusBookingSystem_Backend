const express = require('express');
const {
  findUserById,
  findBusById,
  findBookingById,
  createBooking,
  cancelBooking,
  enrichBooking,
} = require('../store');

const router = express.Router();

router.post('/book', (req, res) => {
  const { userId, busId, numberOfSeats } = req.body;
  const seats = Math.max(1, parseInt(numberOfSeats, 10) || 1);
  if (!userId || !busId) {
    return res.status(400).json({ error: 'userId and busId required' });
  }
  if (!findUserById(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!findBusById(busId)) {
    return res.status(404).json({ error: 'Bus not found' });
  }
  const booking = createBooking({ userId, busId, numberOfSeats: seats });
  if (!booking) {
    return res.status(400).json({ error: 'Not enough seats available' });
  }
  res.status(201).json(enrichBooking(booking));
});

router.post('/cancel/:bookingId', (req, res) => {
  const booking = cancelBooking(req.params.bookingId);
  if (!booking) {
    return res.status(400).json({
      error: 'Booking not found or already cancelled/completed',
    });
  }
  res.json(enrichBooking(booking));
});

router.get('/:bookingId', (req, res) => {
  const booking = findBookingById(req.params.bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(enrichBooking(booking));
});

module.exports = router;
