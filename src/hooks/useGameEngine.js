import { useState, useCallback, useEffect } from 'react';
import { getRandomCountry } from '../data/countries';

export function useGameEngine(onGameComplete, onSaveProgress, onEarnCoins) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions] = useState(50);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [usedCountries, setUsedCountries] = useState([]);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [hintsUsed, setHintsUsed] = useState([]);

  useEffect(() => {
    if (gameStarted && currentCountry && !isGameComplete) {
      const gameState = {
        currentLevel,
        currentQuestion,
        currentCountry,
        usedCountries,
        score,
        correctAnswers,
        wrongAnswers,
        streak,
        bestStreak,
        hintsUsed,
        timestamp: Date.now(),
      };
      onSaveProgress?.(gameState);
    }
  }, [currentQuestion, score, gameStarted]);

  const startGame = useCallback((level) => {
    setCurrentLevel(level);
    setGameStarted(true);
    setCurrentQuestion(0);
    setUsedCountries([]);
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setStreak(0);
    setBestStreak(0);
    setIsAnswered(false);
    setFeedback(null);
    setIsGameComplete(false);
    setHintsUsed([]);
    
    const firstCountry = getRandomCountry(level);
    setCurrentCountry(firstCountry);
    setUsedCountries([firstCountry.code]);
  }, []);

  const resumeGame = useCallback((savedState) => {
    setCurrentLevel(savedState.currentLevel);
    setGameStarted(true);
    setCurrentQuestion(savedState.currentQuestion);
    setCurrentCountry(savedState.currentCountry);
    setUsedCountries(savedState.usedCountries);
    setScore(savedState.score);
    setCorrectAnswers(savedState.correctAnswers);
    setWrongAnswers(savedState.wrongAnswers || 0);
    setStreak(savedState.streak);
    setBestStreak(savedState.bestStreak);
    setHintsUsed(savedState.hintsUsed || []);
    setIsAnswered(false);
    setFeedback(null);
    setIsGameComplete(false);
  }, []);

  const submitAnswer = useCallback((answer) => {
    if (isAnswered || !currentCountry) return;
    
    const isCorrect = answer.toLowerCase().trim() === currentCountry.name.toLowerCase().trim();
    setIsAnswered(true);
    
    const basePoints = currentLevel === 'easy' ? 10 : currentLevel === 'medium' ? 20 : 30;
    const streakBonus = streak >= 3 ? Math.floor(streak / 3) * 5 : 0;
    const hintPenalty = hintsUsed.length * 5;
    const totalPoints = isCorrect ? Math.max(0, basePoints + streakBonus - hintPenalty) : 0;
    
    // محاسبه سکه برای این سوال
    let coinsEarned = 0;
    if (isCorrect) {
      coinsEarned = 2; // پایه
      if (streak >= 5) coinsEarned += 3; // بونوس streak
      if (hintsUsed.length === 0) coinsEarned += 1; // بونوس بدون راهنما
      
      // اضافه کردن سکه
      if (onEarnCoins) {
        onEarnCoins(coinsEarned);
      }
      
      setScore(prev => prev + totalPoints);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
      setWrongAnswers(prev => prev + 1);
    }
    
    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      correctAnswer: currentCountry.name,
      points: totalPoints,
      coins: coinsEarned,
    });
  }, [isAnswered, currentCountry, streak, currentLevel, hintsUsed, onEarnCoins]);

  const useHint = useCallback((type) => {
    if (hintsUsed.includes(type)) return null;
    
    setHintsUsed(prev => [...prev, type]);
    
    if (type === 'first-letter') {
      return currentCountry.name[0];
    } else if (type === 'continent') {
      return currentCountry.continent;
    }
    
    return null;
  }, [currentCountry, hintsUsed]);

  const nextQuestion = useCallback(() => {
    setIsAnswered(false);
    setFeedback(null);
    setHintsUsed([]);
    
    if (currentQuestion + 1 >= totalQuestions) {
      setIsGameComplete(true);
      if (onGameComplete) {
        onGameComplete(currentLevel, score, correctAnswers, totalQuestions, bestStreak);
      }
      return;
    }
    
    const nextCountry = getRandomCountry(currentLevel, usedCountries);
    if (nextCountry) {
      setCurrentCountry(nextCountry);
      setUsedCountries(prev => [...prev, nextCountry.code]);
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, totalQuestions, currentLevel, usedCountries, onGameComplete, correctAnswers, score, bestStreak]);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setCurrentLevel(null);
    setCurrentQuestion(0);
    setCurrentCountry(null);
    setUsedCountries([]);
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setStreak(0);
    setBestStreak(0);
    setIsAnswered(false);
    setFeedback(null);
    setIsGameComplete(false);
    setHintsUsed([]);
  }, []);

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / (currentQuestion + (isAnswered ? 1 : 0))) * 100) : 0;

  return {
    gameStarted,
    currentLevel,
    currentQuestion,
    totalQuestions,
    currentCountry,
    score,
    correctAnswers,
    wrongAnswers,
    streak,
    bestStreak,
    accuracy,
    isAnswered,
    feedback,
    isGameComplete,
    hintsUsed,
    startGame,
    resumeGame,
    submitAnswer,
    useHint,
    nextQuestion,
    resetGame,
  };
}