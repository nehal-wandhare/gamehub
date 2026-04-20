const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (Docker service name)
mongoose.connect("mongodb://mongo:27017/gamehub")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ✅ Schema
const scoreSchema = new mongoose.Schema({
  player: String,
  score: Number,
});

const Score = mongoose.model("Score", scoreSchema);

// ✅ Create server
const server = http.createServer(app);

// ✅ Socket config (IMPORTANT)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Socket logic
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("updateScore", async ({ player, score }) => {
    console.log("📥 Score received:", player, score);

    // Save to DB
    await Score.findOneAndUpdate(
      { player },
      { score },
      { upsert: true, new: true }
    );

    // Send updated leaderboard
    const allScores = await Score.find().sort({ score: -1 });

    io.emit("scoreUpdate", allScores);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ API route (backup fetch)
app.get("/api/leaderboard", async (req, res) => {
  const scores = await Score.find().sort({ score: -1 });
  res.json(scores);
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("GameHub Backend Running 🚀");
});

// ✅ IMPORTANT: listen on 0.0.0.0
server.listen(5000, "0.0.0.0", () => {
  console.log("🚀 Backend running on port 5000");
});
