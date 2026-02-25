// src/hooks/useGameEngine.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { countries } from '../data/countries';

export function useGameEngine(onGameComplete, onSaveProgress, onEarnCoins) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState('easy');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [hintsUsed, setHintsUsed] = useState([]);
  
  const usedCountriesRef = useRef(new Set());
  const availableCountriesRef = useRef([]);

  const startGame = useCallback((level) => {
    setCurrentLevel(level);
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCurrentQuestion(0);
    setIsGameComplete(false);
    setIsAnswered(false);
    setFeedback(null);
    setHintsUsed([]);
    
    let questionCount;
    if (level === 'easy') questionCount = 10;
    else if (level === 'medium') questionCount = 15;
    else questionCount = 20;
    
    setTotalQuestions(questionCount);
    
    usedCountriesRef.current = new Set();
    availableCountriesRef.current = [...countries];
    availableCountriesRef.current.sort(() => Math.random() - 0.5);
    
    if (availableCountriesRef.current.length > 0) {
      const firstCountry = availableCountriesRef.current[0];
      usedCountriesRef.current.add(firstCountry.code);
      setCurrentCountry(firstCountry);
      console.log(`🎮 Game started - Question 1/${questionCount}:`, firstCountry.name);
    }
  }, []);

  const resumeGame = useCallback((savedProgress) => {
    if (!savedProgress) return;
    
    setCurrentLevel(savedProgress.currentLevel);
    setGameStarted(true);
    setScore(savedProgress.score);
    setStreak(savedProgress.streak);
    setBestStreak(savedProgress.bestStreak);
    setCorrectAnswers(savedProgress.correctAnswers);
    setWrongAnswers(savedProgress.wrongAnswers);
    setCurrentQuestion(savedProgress.currentQuestion);
    setTotalQuestions(savedProgress.totalQuestions);
    setIsGameComplete(false);
    setIsAnswered(false);
    setFeedback(null);
    setHintsUsed([]);
    
    usedCountriesRef.current = new Set(savedProgress.usedCountries || []);
    availableCountriesRef.current = countries.filter(c => !usedCountriesRef.current.has(c.code));
    availableCountriesRef.current.sort(() => Math.random() - 0.5);
    
    const country = countries.find(c => c.code === savedProgress.currentCountryCode);
    if (country) {
      setCurrentCountry(country);
      console.log(`🔄 Game resumed - Question ${savedProgress.currentQuestion + 1}/${savedProgress.totalQuestions}:`, country.name);
    }
  }, []);

  const submitAnswer = useCallback((answer) => {
    if (isAnswered || !currentCountry) return;
    
    const isCorrect = answer.toLowerCase().trim() === currentCountry.name.toLowerCase().trim();
    setIsAnswered(true);
    
    const basePoints = currentLevel === 'easy' ? 10 : currentLevel === 'medium' ? 20 : 30;
    const streakBonus = streak >= 3 ? Math.floor(streak / 3) * 5 : 0;
    const hintPenalty = hintsUsed.length * 5;
    const totalPoints = isCorrect ? Math.max(0, basePoints + streakBonus - hintPenalty) : 0;
    
    let coinsEarned = 0;
    if (isCorrect) {
      coinsEarned = 2;
      if (streak >= 5) coinsEarned += 3;
      if (hintsUsed.length === 0) coinsEarned += 1;
      
      console.log('💰 Earning coins:', coinsEarned);
      if (onEarnCoins) {
        onEarnCoins(coinsEarned);
      }
      
      setScore(prev => prev + totalPoints);
      setCorrectAnswers(prev => {
        const newCorrect = prev + 1;
        
        // ✅ Check if this was the last question
        const nextQuestionIndex = currentQuestion + 1;
        console.log(`📊 Progress: ${nextQuestionIndex}/${totalQuestions}`);
        
        if (nextQuestionIndex >= totalQuestions) {
          console.log('🎉 Game will complete after this answer!');
        }
        
        return newCorrect;
      });
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
  }, [isAnswered, currentCountry, streak, currentLevel, hintsUsed, currentQuestion, totalQuestions, onEarnCoins]);

  const nextQuestion = useCallback(() => {
    // ✅ اول از همه چک کنیم که آیا به آخر رسیدیم
    const nextQuestionIndex = currentQuestion + 1;
    
    console.log(`🔍 Checking next question: current=${currentQuestion}, next=${nextQuestionIndex}, total=${totalQuestions}`);
    
    // ✅ اگر سوال بعدی از total بیشتر یا مساوی شد، بازی تموم شده
    if (nextQuestionIndex >= totalQuestions) {
      console.log('🏁 Game completed! Finalizing...');
      setIsGameComplete(true);
      
      const finalAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      // Completion bonus
      let completionBonus = 0;
      if (finalAccuracy >= 90) completionBonus = 10;
      else if (finalAccuracy >= 70) completionBonus = 5;
      
      if (onEarnCoins && completionBonus > 0) {
        console.log('🎁 Completion bonus:', completionBonus);
        onEarnCoins(completionBonus);
      }
      
      if (onGameComplete) {
        onGameComplete(currentLevel, score, correctAnswers, totalQuestions, bestStreak);
      }
      
      // ✅ پاک کردن state ها
      setIsAnswered(false);
      setFeedback(null);
      setHintsUsed([]);
      setCurrentCountry(null);
      
      return; // ✅ مهم: از ادامه function جلوگیری می‌کنه
    }
    
    // ✅ اگر هنوز سوال داریم، ادامه بده
    console.log('➡️ Moving to next question...');
    
    setIsAnswered(false);
    setFeedback(null);
    setHintsUsed([]);
    
    // پیدا کردن کشور بعدی
    let nextCountry = null;
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!nextCountry && attempts < maxAttempts) {
      if (availableCountriesRef.current.length === 0) {
        console.log('🔄 Resetting available countries pool');
        availableCountriesRef.current = countries.filter(c => !usedCountriesRef.current.has(c.code));
        availableCountriesRef.current.sort(() => Math.random() - 0.5);
      }
      
      if (availableCountriesRef.current.length === 0) {
        console.log('♻️ All countries used, resetting completely');
        usedCountriesRef.current.clear();
        availableCountriesRef.current = [...countries];
        availableCountriesRef.current.sort(() => Math.random() - 0.5);
      }
      
      const candidate = availableCountriesRef.current.shift();
      
      if (candidate && !usedCountriesRef.current.has(candidate.code)) {
        nextCountry = candidate;
        usedCountriesRef.current.add(candidate.code);
      }
      
      attempts++;
    }
    
    if (nextCountry) {
      setCurrentCountry(nextCountry);
      setCurrentQuestion(nextQuestionIndex);
      console.log(`✅ Question ${nextQuestionIndex + 1}/${totalQuestions}:`, nextCountry.name);
      
      // Save progress
      if (onSaveProgress) {
        onSaveProgress({
          currentLevel,
          currentQuestion: nextQuestionIndex,
          totalQuestions,
          score,
          streak,
          bestStreak,
          correctAnswers,
          wrongAnswers,
          currentCountryCode: nextCountry.code,
          usedCountries: Array.from(usedCountriesRef.current),
          timestamp: Date.now(),
        });
      }
    } else {
      console.error('❌ Could not find next country');
      setIsGameComplete(true);
      if (onGameComplete) {
        onGameComplete(currentLevel, score, correctAnswers, totalQuestions, bestStreak);
      }
    }
  }, [currentQuestion, totalQuestions, currentLevel, score, streak, bestStreak, correctAnswers, wrongAnswers, onSaveProgress, onGameComplete, onEarnCoins]);

  const useHint = useCallback((type) => {
    if (!currentCountry || hintsUsed.includes(type)) return null;
    
    setHintsUsed(prev => [...prev, type]);
    
    if (type === 'first-letter') {
      return currentCountry.name[0];
    }
    if (type === 'continent') {
      return currentCountry.continent;
    }
    
    return null;
  }, [currentCountry, hintsUsed]);

  const resetGame = useCallback(() => {
    console.log('🔄 Resetting game...');
    setGameStarted(false);
    setCurrentCountry(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCurrentQuestion(0);
    setTotalQuestions(0);
    setIsAnswered(false);
    setFeedback(null);
    setIsGameComplete(false);
    setHintsUsed([]);
    usedCountriesRef.current.clear();
    availableCountriesRef.current = [];
  }, []);

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    gameStarted,
    currentLevel,
    score,
    streak,
    bestStreak,
    correctAnswers,
    wrongAnswers,
    currentQuestion,
    totalQuestions,
    currentCountry,
    isAnswered,
    feedback,
    isGameComplete,
    accuracy,
    startGame,
    resumeGame,
    submitAnswer,
    nextQuestion,
    useHint,
    resetGame,
  };
}