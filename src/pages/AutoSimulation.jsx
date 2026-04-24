import React, { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function AutoSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matches, setMatches] = useState(0);

  const startSimulation = () => {
    setIsRunning(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setIsRunning(false);
        clearInterval(interval);
      }
      setProgress(currentProgress);
      setMatches(Math.floor(currentProgress / 5));
    }, 500);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setProgress(0);
    setMatches(0);
    setIsRunning(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Auto Simulation</h1>

      <div className="bg-gray-800 border border-red-600 p-6 rounded mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Simulation Progress</h2>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-red-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mt-2">{Math.floor(progress)}% Complete</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400">Matches Simulated</p>
            <p className="text-3xl font-bold text-red-600">{matches}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400">Status</p>
            <p className="text-xl font-bold">{isRunning ? '🟢 Running' : '⏹️ Stopped'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Play size={20} /> Start
          </button>
          <button
            onClick={pauseSimulation}
            disabled={!isRunning}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Pause size={20} /> Pause
          </button>
          <button
            onClick={resetSimulation}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <RotateCcw size={20} /> Reset
          </button>
        </div>
      </div>

      <div className="bg-gray-800 border border-red-600 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Recent Results</h2>
        <div className="space-y-2">
          <p className="text-gray-400">• Match 1: John Cena defeated The Rock</p>
          <p className="text-gray-400">• Match 2: Stone Cold defeated Undertaker</p>
          <p className="text-gray-400">• Match 3: Triple H defeated Shawn Michaels</p>
        </div>
      </div>
    </div>
  );
}
