// src/hooks/useGameStats.js
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'flag_game_stats';

const getInitialStats = () => {
  const defaultStats = {
    coins: 50,
    totalGames: 0,
    totalScore: 0,
    bestScores: { easy: 0, medium: 0, hard: 0 },
    bestAccuracy: { easy: 0, medium: 0, hard: 0 },
    longestStreak: 0,
    gamesPerLevel: { easy: 0, medium: 0, hard: 0 },
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Migration: اگه فیلدی null یا undefined بود، مقدار پیش‌فرض بده
      return {
        ...defaultStats,
        ...parsed,
        coins: parsed.coins ?? 50, // اگه null یا undefined بود، 50 بده
        longestStreak: parsed.longestStreak ?? 0, // اگه null یا undefined بود، 0 بده
      };
    }
  } catch (e) {
    console.error('Error loading stats:', e);
  }
  
  return defaultStats;
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
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const completionBonus = 10;
    
    setStats(prev => {
      // مطمئن شو مقادیر number هستن نه null
      const currentCoins = prev.coins ?? 0;
      const currentLongestStreak = prev.longestStreak ?? 0;
      const newBestStreak = bestStreakValue ?? 0;
      
      const newLongestStreak = Math.max(currentLongestStreak, newBestStreak);
      
      return {
        ...prev,
        coins: currentCoins + completionBonus,
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

    return completionBonus;
  };

  const earnCoins = (amount) => {
    setStats(prev => ({
      ...prev,
      coins: (prev.coins ?? 0) + amount
    }));
  };

  const spendCoins = (amount) => {
    const currentCoins = stats.coins ?? 0;
    if (currentCoins >= amount) {
      setStats(prev => ({ 
        ...prev, 
        coins: (prev.coins ?? 0) - amount 
      }));
      return true;
    }
    return false;
  };

  const resetStats = () => {
    const defaultStats = {
      coins: 50,
      totalGames: 0,
      totalScore: 0,
      bestScores: { easy: 0, medium: 0, hard: 0 },
      bestAccuracy: { easy: 0, medium: 0, hard: 0 },
      longestStreak: 0,
      gamesPerLevel: { easy: 0, medium: 0, hard: 0 },
    };
    setStats(defaultStats);
  };

  return { stats, updateStats, earnCoins, spendCoins, resetStats };
}