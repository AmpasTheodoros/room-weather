'use client';

import { useEffect, useState } from 'react';

type WeatherData = {
  local_temperature: number;
  local_humidity: number;
  owm_temperature: number;
  owm_humidity: number;
  owm_description: string;
};

export default function GuessTemperatureGame() {
  const [realData, setRealData] = useState<WeatherData | null>(null);
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      setRealData(json);
    };
    fetchInitialData();
  }, []);

  const handleSubmit = () => {
  setSubmitted(true);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">🌡️ Guess the Indoor Temperature</h1>

      {realData === null && !submitted && (
        <p className="text-lg mb-6">Outside temperature is <strong>loading...</strong></p>
      )}

      {!submitted && (
        <div className="space-y-4 w-full max-w-md">
          <div className="text-lg text-center mb-4">
            🧊 Outside (OpenWeather): <strong>{realData?.owm_temperature ?? '--'}°C</strong>
          </div>

          <div>
            <label className="block text-sm mb-1">Guess the Indoor Temperature (°C):</label>
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
          >
            Submit Guess
          </button>
        </div>
      )}

      {submitted && realData && (
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-xl font-semibold">📊 Results:</h2>
          <p>🌡️ Your Guess: <strong>{guess}°C</strong></p>
          <p>🏠 Actual Indoor Temp: <strong>{realData.local_temperature}°C</strong></p>
          <p>☁️ Outside: <strong>{realData.owm_description}</strong> ({realData.owm_temperature}°C / {realData.owm_humidity}%)</p>
        </div>
      )}
    </div>
  );
}
