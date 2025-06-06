'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type RoomData = {
  temperature?: number;
  humidity?: number;
};

export default function Home() {
  const [data, setData] = useState<RoomData | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const checkWin = (temp: number, hum: number) => {
    const rand = Math.floor(Math.random() * 100) + 1;
    setRandomNumber(rand);

    const min = Math.min(temp, hum);
    const max = Math.max(temp, hum);

    if (rand > min && rand < max) {
      setResult("🎉 You Win!");
    } else {
      setResult("💀 You Lose!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data");
      const json = await res.json();
      setData(json);

      if (json.temperature && json.humidity) {
        checkWin(json.temperature, json.humidity);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">🎰 Lucky Room Draw</h1>

      {data ? (
        <div className="bg-white/10 rounded-xl p-6 sm:p-10 shadow-lg backdrop-blur text-center w-full max-w-md">
          <p className="text-lg sm:text-xl mb-4">
            📡 Temperature: <strong>{data.temperature}°C</strong><br />
            💧 Humidity: <strong>{data.humidity}%</strong>
          </p>

          <AnimatePresence>
            {randomNumber && (
              <motion.div
                key={randomNumber}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-2xl mt-4 mb-2">🎲 Random Number: <strong>{randomNumber}</strong></p>
                <p className={`text-xl font-bold ${result?.includes("Win") ? "text-green-400" : "text-red-400"}`}>
                  {result}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-white text-lg">Waiting for data from Raspberry Pi...</p>
      )}

      <p className="mt-8 text-sm text-white/60 text-center">
        Game updates automatically every 5 seconds from live sensor values.
      </p>
    </div>
  );
}
