import { useState, useCallback } from 'react';
import { getRandomCountry } from '../data/countries';

export function useGameEngine(onGameComplete) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions] = useState(50); // تغییر از 10 به 50
  const [currentCountry, setCurrentCountry] = useState(null);
  const [usedCountries, setUsedCountries] = useState([]);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const startGame = useCallback((level) => {
    setCurrentLevel(level);
    setGameStarted(true);
    setCurrentQuestion(0);
    setUsedCountries([]);
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    setBestStreak(0);
    setIsAnswered(false);
    setFeedback(null);
    setIsGameComplete(false);
    
    const firstCountry = getRandomCountry(level);
    setCurrentCountry(firstCountry);
    setUsedCountries([firstCountry.code]);
  }, []);

  const submitAnswer = useCallback((answer) => {
    if (isAnswered || !currentCountry) return;
    
    const isCorrect = answer.toLowerCase() === currentCountry.name.toLowerCase();
    setIsAnswered(true);
    
    const points = currentLevel === 'easy' ? 10 : currentLevel === 'medium' ? 20 : 30;
    const streakBonus = streak >= 3 ? Math.floor(streak / 3) * 5 : 0;
    const totalPoints = isCorrect ? points + streakBonus : 0;
    
    if (isCorrect) {
      setScore(prev => prev + totalPoints);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    
    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      correctAnswer: currentCountry.name,
      points: totalPoints,
    });
  }, [isAnswered, currentCountry, streak, currentLevel]);

  const nextQuestion = useCallback(() => {
    setIsAnswered(false);
    setFeedback(null);
    
    if (currentQuestion + 1 >= totalQuestions) {
      setIsGameComplete(true);
      if (onGameComplete) {
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        onGameComplete(currentLevel, score, accuracy, bestStreak);
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
    setStreak(0);
    setBestStreak(0);
    setIsAnswered(false);
    setFeedback(null);
    setIsGameComplete(false);
  }, []);

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    gameStarted,
    currentLevel,
    currentQuestion,
    totalQuestions,
    currentCountry,
    score,
    correctAnswers,
    streak,
    bestStreak,
    accuracy,
    isAnswered,
    feedback,
    isGameComplete,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame,
  };
}