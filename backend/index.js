const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db.connection");
const connectRedis = require("./config/redis.config");
const weatherRoutes = require("./routes/weather.route");
const authRoutes = require("./routes/auth.route");
const {
  fetchWeatherDataForMetroCities,
} = require("./services/weather.service");
const startAlertCheck = require("./services/alert.service");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

connectDB();
(async () => {
  const redisClient = await connectRedis();
  app.set("redisClient", redisClient);
})();

app.use("/api", weatherRoutes);
app.use("/api/auth", authRoutes);

io.on("connection", (socket) => {
  socket.on("authenticate", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.username;

      if (!decoded.username || !decoded.userId) {
        throw new Error("Invalid token format");
      }
      socket.auth = {
        authenticated: true,
        username: username,
        userId: decoded.userId,
      };

      socket.emit("authStatus", {
        authenticated: true,
        username: username,
      });

      console.log(`User ${username} authenticated`);
    } catch (error) {
      console.error("Socket authentication failed:", error);
      socket.auth = { authenticated: false };
      socket.emit("authStatus", { authenticated: false });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

startAlertCheck(io);
fetchWeatherDataForMetroCities(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
