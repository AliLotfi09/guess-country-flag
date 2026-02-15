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
    coins: 100, // سکه اولیه
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

  const updateStats = (level, score, correctAnswers, totalQuestions, bestStreakValue) => {
    // محاسبه دقیق accuracy
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // محاسبه سکه‌های به‌دست آمده
    const baseCoins = Math.floor(score / 10);
    const correctBonus = correctAnswers * 2;
    const coinsEarned = baseCoins + correctBonus;
    
    setStats(prev => {
      const newLongestStreak = Math.max(prev.longestStreak || 0, bestStreakValue || 0);
      
      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        totalGames: prev.totalGames + 1,
        totalScore: prev.totalScore + score,
        bestScores: {
          ...prev.bestScores,
          [level]: Math.max(prev.bestScores[level] || 0, score),
        },
        bestAccuracy: {
          ...prev.bestAccuracy,
          [level]: Math.max(prev.bestAccuracy[level] || 0, accuracy),
        },
        longestStreak: newLongestStreak,
        gamesPerLevel: {
          ...prev.gamesPerLevel,
          [level]: (prev.gamesPerLevel[level] || 0) + 1,
        },
      };
    });

    return coinsEarned;
  };

  const spendCoins = (amount) => {
    if (stats.coins >= amount) {
      setStats(prev => ({ ...prev, coins: prev.coins - amount }));
      return true;
    }
    return false;
  };

  const resetStats = () => {
    setStats(getInitialStats());
  };

  return { stats, updateStats, spendCoins, resetStats };
}