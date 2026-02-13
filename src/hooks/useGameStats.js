import { useState, useEffect } from 'react';

const STORAGE_KEY = 'flag_game_stats';

const getInitialStats = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading stats:', e);
  }
  
  return {
    totalGames: 0,
    totalScore: 0,
    bestScores: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    bestAccuracy: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    longestStreak: 0,
    gamesPerLevel: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  };
};

export function useGameStats() {
  const [stats, setStats] = useState(getInitialStats);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats:', e);
    }
  }, [stats]);

  const updateStats = (level, score, accuracy, streak) => {
    setStats(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      totalScore: prev.totalScore + score,
      bestScores: {
        ...prev.bestScores,
        [level]: Math.max(prev.bestScores[level], score),
      },
      bestAccuracy: {
        ...prev.bestAccuracy,
        [level]: Math.max(prev.bestAccuracy[level], accuracy),
      },
      longestStreak: Math.max(prev.longestStreak, streak),
      gamesPerLevel: {
        ...prev.gamesPerLevel,
        [level]: prev.gamesPerLevel[level] + 1,
      },
    }));
  };

  const resetStats = () => {
    setStats(getInitialStats());
  };

  return { stats, updateStats, resetStats };
}