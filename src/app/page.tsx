'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const ROWS = 12;
const COLS = 7;

function simulatePlinkoPath(startCol: number, humidity: number): number[] {
  const path = [startCol];
  let col = startCol;
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const seed = Math.floor(humidity * 100);
  Math.seed = seed;
  for (let i = 0; i < ROWS; i++) {
    const move = rand(0, 2);
    if (move === 0 && col > 0) col--;
    if (move === 2 && col < COLS - 1) col++;
    path.push(col);
  }
  return path;
}

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [path, setPath] = useState<number[]>([]);
  const [currentRow, setCurrentRow] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
      const temp = json.local_temperature;
      const hum = json.local_humidity;
      const startCol = Math.max(0, Math.min(COLS - 1, Math.floor(((temp - 15) / 40) * COLS)));
      const p = simulatePlinkoPath(startCol, hum);
      setPath(p);
      setCurrentRow(0);
    };

    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (path.length === 0) return;
    const timer = setInterval(() => {
      setCurrentRow((r) => {
        if (r >= path.length - 1) {
          clearInterval(timer);
          return r;
        }
        return r + 1;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [path]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center py-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-8">🔮 Plinko Sensor Game</h1>
      <div className="grid grid-rows-[repeat(12,_30px)] grid-cols-7 gap-1 border p-2 rounded bg-white/10">
        {Array.from({ length: ROWS }).map((_, rowIdx) => (
          Array.from({ length: COLS }).map((_, colIdx) => {
            const isBall = rowIdx === currentRow && path[rowIdx] === colIdx;
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={clsx(
                  'w-8 h-8 rounded-full border border-white flex items-center justify-center',
                  isBall ? 'bg-yellow-400 animate-bounce' : 'bg-white/10'
                )}
              >
                {isBall && '🟡'}
              </div>
            );
          })
        ))}
      </div>
      {data && (
        <div className="mt-8 text-center text-white/80">
          <p>🌡️ Temp: {data.local_temperature}°C</p>
          <p>💧 Humidity: {data.local_humidity}%</p>
        </div>
      )}
    </main>
  );
}
