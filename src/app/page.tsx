'use client';

import { useState } from 'react';

type WeatherData = {
  local_temperature: number;
  local_humidity: number;
  owm_temperature: number;
  owm_humidity: number;
  owm_description: string;
};

export default function GuessGame() {
  const [realData, setRealData] = useState<WeatherData | null>(null);
  const [guessedTemp, setGuessedTemp] = useState('');
  const [guessedHumidity, setGuessedHumidity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch('/api/data');
    const json = await res.json();
    setRealData(json);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">🌡️ Guess the Room Weather</h1>

      <div className="space-y-4 w-full max-w-md">
        <div>
          <label className="block text-sm mb-1">Guess the Temperature (°C):</label>
          <input
            type="number"
            value={guessedTemp}
            onChange={(e) => setGuessedTemp(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            disabled={submitted}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Guess the Humidity (%):</label>
          <input
            type="number"
            value={guessedHumidity}
            onChange={(e) => setGuessedHumidity(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            disabled={submitted}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
          disabled={submitted}
        >
          Submit Guess
        </button>
      </div>

      {submitted && realData && (
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-xl font-semibold">📊 Actual Values:</h2>
          <p>🌡️ Temperature: <strong>{realData.local_temperature}°C</strong></p>
          <p>💧 Humidity: <strong>{realData.local_humidity}%</strong></p>
          <p>☁️ Outside: <strong>{realData.owm_description}</strong> ({realData.owm_temperature}°C / {realData.owm_humidity}%)</p>
        </div>
      )}
    </div>
  );
}
