'use client';

import { useEffect, useState } from "react";

type RoomData = {
  temperature?: number;
  humidity?: number;
};

export default function Home() {
  const [data, setData] = useState<RoomData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">🌡️ Room Weather</h1>
        {data ? (
          <div className="space-y-2">
            {data.temperature && <p>Temperature: {data.temperature}°C</p>}
            {data.humidity && <p>Humidity: {data.humidity}%</p>}
          </div>
        ) : (
          <p>Waiting for data from Raspberry Pi...</p>
        )}
      </div>
    </div>
  );
}
