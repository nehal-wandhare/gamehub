import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://13.60.64.53:5000", {
  transports: ["websocket"],
});

function App() {
  const [scores, setScores] = useState([]); // ✅ changed to array
  const [player, setPlayer] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    socket.on("scoreUpdate", (data) => {
      setScores(data);
    });
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && gameStarted) {
      socket.emit("updateScore", {
        player,
        score: count,
      });
      setGameStarted(false);
    }
  }, [timeLeft, gameStarted, player, count]);

  const startGame = () => {
    if (!player) return alert("Enter name");
    setCount(0);
    setTimeLeft(10);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gray-900 text-white">

      <h1 className="text-4xl font-bold mb-6 text-purple-400 animate-pulse">
        🎮 GameHub Click Battle
      </h1>

      {!gameStarted ? (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <input
            className="p-2 rounded text-black"
            placeholder="Enter your name"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
          />
          <br /><br />
          <button
            onClick={startGame}
            className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-800 transition"
          >
            Start Game 🚀
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl">⏳ Time: {timeLeft}s</h2>
          <h2 className="text-xl mb-4">🔥 Score: {count}</h2>

          <button
            className="bg-pink-600 text-white text-2xl px-10 py-6 rounded-full hover:scale-110 transition transform"
            onClick={() => setCount(count + 1)}
          >
            CLICK FAST ⚡
          </button>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-10 w-full max-w-md">
        <h2 className="text-2xl mb-3 text-yellow-400">🏆 Leaderboard</h2>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          {scores.length === 0 ? (
            <p>No scores yet</p>
          ) : (
            scores.map((item) => (
              <div
                key={item.player}
                className="flex justify-between border-b border-gray-600 py-2"
              >
                <span>{item.player}</span>
                <span>{item.score}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
