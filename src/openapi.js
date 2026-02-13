/** OpenAPI 3.0 spec for Bus Ticket Booking API */
module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Bus Ticket Booking API',
    version: '1.0.0',
    description: 'In-memory bus ticket booking backend. Users, buses, book/cancel, login, signup.',
  },
  servers: [{ url: '/', description: 'Current server' }],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        responses: {
          200: {
            description: 'Service is up',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { ok: { type: 'boolean' } } },
              },
            },
          },
        },
      },
    },
    '/api/users': {
      get: {
        summary: 'List all users',
        tags: ['Users'],
        responses: {
          200: {
            description: 'List of users with booking history and upcoming bookings',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserList' },
              },
            },
          },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID',
        tags: ['Users'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'User with upcoming bookings and booking history',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/buses': {
      get: {
        summary: 'List all buses',
        tags: ['Buses'],
        responses: {
          200: {
            description: 'List of buses',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Bus' },
                },
              },
            },
          },
        },
      },
    },
    '/api/buses/{id}': {
      get: {
        summary: 'Get bus by ID',
        tags: ['Buses'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Bus details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Bus' },
              },
            },
          },
          404: {
            description: 'Bus not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Logged-in user (without password)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          400: {
            description: 'Email and password required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          401: {
            description: 'Invalid email or password',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/auth/signup': {
      post: {
        summary: 'Sign up',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  phone: { type: 'string' },
                  pic: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          400: {
            description: 'Name, email and password required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          409: {
            description: 'Email already registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/bookings/book': {
      post: {
        summary: 'Book a bus',
        tags: ['Bookings'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'busId'],
                properties: {
                  userId: { type: 'string' },
                  busId: { type: 'string' },
                  numberOfSeats: { type: 'integer', minimum: 1, default: 1 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Booking created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BookingEnriched' },
              },
            },
          },
          400: {
            description: 'userId and busId required, or not enough seats',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          404: {
            description: 'User or bus not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/bookings/cancel/{bookingId}': {
      post: {
        summary: 'Cancel a booking',
        tags: ['Bookings'],
        parameters: [
          {
            name: 'bookingId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Booking cancelled',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BookingEnriched' },
              },
            },
          },
          400: {
            description: 'Booking not found or already cancelled/completed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/bookings/{bookingId}': {
      get: {
        summary: 'Get booking by ID',
        tags: ['Bookings'],
        parameters: [
          {
            name: 'bookingId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Booking with bus and user info',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BookingEnriched' },
              },
            },
          },
          404: {
            description: 'Booking not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
      Bus: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          busName: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          timeFrom: { type: 'string' },
          timeTo: { type: 'string' },
          seatsAvailable: { type: 'integer' },
          price: { type: 'number' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string' },
          pic: { type: 'string' },
          upcomingBookings: {
            type: 'array',
            items: { $ref: '#/components/schemas/BookingEnriched' },
          },
          bookingHistory: {
            type: 'array',
            items: { $ref: '#/components/schemas/BookingEnriched' },
          },
        },
      },
      UserList: {
        type: 'array',
        items: { $ref: '#/components/schemas/User' },
      },
      BookingEnriched: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          busId: { type: 'string' },
          numberOfSeats: { type: 'integer' },
          bookedAt: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            enum: ['upcoming', 'cancelled', 'completed'],
          },
          bus: { $ref: '#/components/schemas/Bus' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
