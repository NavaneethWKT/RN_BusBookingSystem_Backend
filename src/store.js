const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DEFAULT_PASSWORD = 'password123';
const hashedPassword = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

const users = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    phone: '+1 555-0101',
    email: 'alice@example.com',
    pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    passwordHash: hashedPassword,
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    phone: '+1 555-0102',
    email: 'bob@example.com',
    pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    passwordHash: hashedPassword,
  },
  {
    id: 'user-3',
    name: 'Carol Williams',
    phone: '+1 555-0103',
    email: 'carol@example.com',
    pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    passwordHash: hashedPassword,
  },
  {
    id: 'user-4',
    name: 'David Brown',
    phone: '+1 555-0104',
    email: 'david@example.com',
    pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    passwordHash: hashedPassword,
  },
  {
    id: 'user-5',
    name: 'Eve Davis',
    phone: '+1 555-0105',
    email: 'eve@example.com',
    pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
    passwordHash: hashedPassword,
  },
];

const buses = [
  { id: 'bus-1', busName: 'Express One', from: 'New York', to: 'Boston', timeFrom: '08:00', timeTo: '12:00', seatsAvailable: 40, price: 45 },
  { id: 'bus-2', busName: 'Metro Line', from: 'Boston', to: 'New York', timeFrom: '14:00', timeTo: '18:00', seatsAvailable: 35, price: 45 },
  { id: 'bus-3', busName: 'Coastal Cruiser', from: 'Miami', to: 'Orlando', timeFrom: '09:30', timeTo: '13:00', seatsAvailable: 50, price: 35 },
  { id: 'bus-4', busName: 'Sunshine Express', from: 'Orlando', to: 'Miami', timeFrom: '16:00', timeTo: '19:30', seatsAvailable: 50, price: 35 },
  { id: 'bus-5', busName: 'Windy City', from: 'Chicago', to: 'Detroit', timeFrom: '07:00', timeTo: '11:30', seatsAvailable: 42, price: 55 },
  { id: 'bus-6', busName: 'Lakeshore', from: 'Detroit', to: 'Chicago', timeFrom: '13:00', timeTo: '17:30', seatsAvailable: 42, price: 55 },
  { id: 'bus-7', busName: 'Pacific Runner', from: 'Los Angeles', to: 'San Francisco', timeFrom: '06:00', timeTo: '12:00', seatsAvailable: 38, price: 65 },
  { id: 'bus-8', busName: 'Golden Gate', from: 'San Francisco', to: 'Los Angeles', timeFrom: '14:00', timeTo: '20:00', seatsAvailable: 38, price: 65 },
  { id: 'bus-9', busName: 'Lone Star', from: 'Houston', to: 'Dallas', timeFrom: '10:00', timeTo: '14:00', seatsAvailable: 45, price: 40 },
  { id: 'bus-10', busName: 'Texas Express', from: 'Dallas', to: 'Houston', timeFrom: '15:00', timeTo: '19:00', seatsAvailable: 45, price: 40 },
];

const bookings = [];

function getUsers() {
  return users;
}

function getBuses() {
  return buses;
}

function getBookings() {
  return bookings;
}

function findUserById(id) {
  return users.find((u) => u.id === id);
}

function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findBusById(id) {
  return buses.find((b) => b.id === id);
}

function findBookingById(id) {
  return bookings.find((b) => b.id === id);
}

function addUser(user) {
  const newUser = { ...user, id: user.id || `user-${uuidv4()}` };
  users.push(newUser);
  return newUser;
}

function createBooking({ userId, busId, numberOfSeats }) {
  const bus = findBusById(busId);
  const user = findUserById(userId);
  if (!bus || !user) return null;
  if (bus.seatsAvailable < numberOfSeats) return null;

  const booking = {
    id: uuidv4(),
    userId,
    busId,
    numberOfSeats,
    bookedAt: new Date().toISOString(),
    status: 'upcoming',
  };
  bookings.push(booking);
  bus.seatsAvailable -= numberOfSeats;
  return booking;
}

function cancelBooking(bookingId) {
  const booking = findBookingById(bookingId);
  if (!booking || booking.status !== 'upcoming') return null;
  const bus = findBusById(booking.busId);
  if (bus) bus.seatsAvailable += booking.numberOfSeats;
  booking.status = 'cancelled';
  return booking;
}

function enrichUser(user) {
  const { passwordHash, ...rest } = user;
  const userBookings = bookings.filter((b) => b.userId === user.id);
  const upcomingBookings = userBookings
    .filter((b) => b.status === 'upcoming')
    .map((b) => {
      const bus = findBusById(b.busId);
      return { ...b, bus: bus ? { ...bus } : null };
    });
  const bookingHistory = userBookings
    .filter((b) => b.status === 'cancelled' || b.status === 'completed')
    .map((b) => {
      const bus = findBusById(b.busId);
      return { ...b, bus: bus ? { ...bus } : null };
    });
  return { ...rest, upcomingBookings, bookingHistory };
}

function enrichBooking(booking) {
  const bus = findBusById(booking.busId);
  const user = findUserById(booking.userId);
  return {
    ...booking,
    bus: bus ? { ...bus } : null,
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
  };
}

module.exports = {
  getUsers,
  getBuses,
  getBookings,
  findUserById,
  findUserByEmail,
  findBusById,
  findBookingById,
  addUser,
  createBooking,
  cancelBooking,
  enrichUser,
  enrichBooking,
};
