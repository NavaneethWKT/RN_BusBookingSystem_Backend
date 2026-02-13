# Bus Ticket Booking API (In-Memory)

Node/Express backend with in-memory data. No database.

## Run

```bash
npm install
npm start
# or
npm run dev   # with --watch
```

Server: `http://localhost:3000`

## Swagger

- **UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **OpenAPI spec (JSON):** [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all users (with booking history & upcoming) |
| GET | `/api/users/:id` | Get one user by id |
| GET | `/api/buses` | List all buses |
| GET | `/api/buses/:id` | Get one bus by id |
| POST | `/api/auth/login` | Login — body: `{ "email", "password" }` |
| POST | `/api/auth/signup` | Signup — body: `{ "name", "email", "password", "phone?", "pic?" }` |
| POST | `/api/bookings/book` | Book — body: `{ "userId", "busId", "numberOfSeats" }` |
| POST | `/api/bookings/cancel/:bookingId` | Cancel a booking |
| GET | `/api/bookings/:bookingId` | Get booking details |

## Initial data

- **5 users** — email `alice@example.com` … `eve@example.com`, password: `password123`
- **10 buses** — various routes (NY–Boston, Miami–Orlando, etc.)

All mutations (signup, book, cancel) update in-memory state; responses reflect current data. Restart resets to initial state.
