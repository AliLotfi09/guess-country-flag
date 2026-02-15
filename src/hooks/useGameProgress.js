import { useState, useEffect } from 'react';

const PROGRESS_KEY = 'flag_game_progress';

export function useGameProgress() {
  const [savedProgress, setSavedProgress] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        setSavedProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading progress:', e);
    }
  }, []);

  const saveProgress = (gameState) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(gameState));
      setSavedProgress(gameState);
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  };

  const clearProgress = () => {
    localStorage.removeItem(PROGRESS_KEY);
    setSavedProgress(null);
  };

  return { savedProgress, saveProgress, clearProgress };
}