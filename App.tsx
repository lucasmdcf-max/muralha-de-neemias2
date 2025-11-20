import React, { useState, useRef, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { UIOverlay } from './components/UIOverlay';
import { GameStatus, LeaderboardEntry } from './types';
import { leaderboardService } from './services/leaderboardService';
import { audioService } from './services/audioService';

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('INSTRUCTIONS');
  const [playerName, setPlayerName] = useState<string>('');
  const [finalTime, setFinalTime] = useState<string>('00:00');
  const [finalTimeMs, setFinalTimeMs] = useState<number>(0);
  
  // Game Mode State (Build/Attack)
  const [interactionMode, setInteractionMode] = useState<'BUILD' | 'ATTACK'>('BUILD');
  const [activeWorkerId, setActiveWorkerId] = useState<number | null>(null);

  // Ref to trigger game reset/start in canvas
  const gameControlRef = useRef<{ startGame: () => void; resetGame: () => void } | null>(null);

  const handleAdvance = useCallback(() => {
    setGameStatus('NAME_INPUT');
  }, []);

  const handleStartGame = useCallback(async (name: string) => {
    setPlayerName(name);
    await audioService.init();
    setGameStatus('PLAYING');
    setInteractionMode('BUILD');
    setActiveWorkerId(null);
    if (gameControlRef.current) {
      gameControlRef.current.startGame();
    }
  }, []);

  const handleGameOver = useCallback(() => {
    setGameStatus('GAMEOVER');
  }, []);

  const handleWin = useCallback((timeMs: number, timeStr: string) => {
    setFinalTime(timeStr);
    setFinalTimeMs(timeMs);
    setGameStatus('WON');
    leaderboardService.addScore({
      name: playerName,
      timeMs: timeMs,
      timeStr: timeStr,
      timestamp: Date.now()
    });
  }, [playerName]);

  const handleReset = useCallback(() => {
    setGameStatus('NAME_INPUT'); // Go back to ranking/name screen
    if (gameControlRef.current) {
      gameControlRef.current.resetGame();
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#7dae5f] overflow-hidden">
      {/* The Game Canvas handles the rendering loop and core logic */}
      <GameCanvas
        status={gameStatus}
        interactionMode={interactionMode}
        onGameOver={handleGameOver}
        onWin={handleWin}
        onWorkerSelect={setActiveWorkerId}
        controlRef={gameControlRef}
      />

      {/* UI Overlay handles menus, HUD, and instructions */}
      <UIOverlay
        status={gameStatus}
        playerName={playerName}
        finalTime={finalTime}
        interactionMode={interactionMode}
        activeWorkerId={activeWorkerId}
        onAdvance={handleAdvance}
        onStartGame={handleStartGame}
        onReset={handleReset}
        setInteractionMode={setInteractionMode}
      />
    </div>
  );
}