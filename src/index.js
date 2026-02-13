const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openApiSpec = require("./openapi");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const busesRoutes = require("./routes/buses");
const bookingsRoutes = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/docs.json", (req, res) => res.json(openApiSpec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/buses", busesRoutes);
app.use("/api/bookings", bookingsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
