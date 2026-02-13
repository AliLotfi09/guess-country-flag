import { useState, useCallback } from 'react';

/**
 * Hook for score management
 */
export const useScore = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const addPoints = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  const incrementStreak = useCallback(() => {
    setStreak(prev => {
      const newStreak = prev + 1;
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      return newStreak;
    });
  }, [bestStreak]);

  const resetStreak = useCallback(() => {
    setStreak(0);
  }, []);

  const reset = useCallback(() => {
    setScore(0);
    setStreak(0);
  }, []);

  return {
    score,
    streak,
    bestStreak,
    addPoints,
    incrementStreak,
    resetStreak,
    reset,
  };
};