// src/hooks/useGameEngine.js
import { useState, useCallback, useRef } from 'react';
import { COUNTRIES } from '../data/countries';

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

  // ── refs برای دسترسی به آخرین مقدار بدون stale closure ──
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const bestStreakRef = useRef(0);
  const correctAnswersRef = useRef(0);
  const wrongAnswersRef = useRef(0);
  const currentQuestionRef = useRef(0);
  const totalQuestionsRef = useRef(0);
  const currentLevelRef = useRef('easy');

  const usedCountriesRef = useRef(new Set());
  const availableCountriesRef = useRef([]);

  // helper: هم state هم ref رو آپدیت کن
  const setScoreSync = (val) => { scoreRef.current = val; setScore(val); };
  const setStreakSync = (val) => { streakRef.current = val; setStreak(val); };
  const setBestStreakSync = (val) => { bestStreakRef.current = val; setBestStreak(val); };
  const setCorrectAnswersSync = (val) => { correctAnswersRef.current = val; setCorrectAnswers(val); };
  const setWrongAnswersSync = (val) => { wrongAnswersRef.current = val; setWrongAnswers(val); };
  const setCurrentQuestionSync = (val) => { currentQuestionRef.current = val; setCurrentQuestion(val); };
  const setTotalQuestionsSync = (val) => { totalQuestionsRef.current = val; setTotalQuestions(val); };
  const setCurrentLevelSync = (val) => { currentLevelRef.current = val; setCurrentLevel(val); };

  const startGame = useCallback((level) => {
    const levelCountries = COUNTRIES.filter(c => c.level === level);
    const questionCount = levelCountries.length; // همه کشورهای آن سطح

    setCurrentLevelSync(level);
    setGameStarted(true);
    setScoreSync(0);
    setStreakSync(0);
    setBestStreakSync(0);
    setCorrectAnswersSync(0);
    setWrongAnswersSync(0);
    setCurrentQuestionSync(0);
    setTotalQuestionsSync(questionCount);
    setIsGameComplete(false);
    setIsAnswered(false);
    setFeedback(null);
    setHintsUsed([]);

    usedCountriesRef.current = new Set();
    availableCountriesRef.current = [...levelCountries].sort(() => Math.random() - 0.5);

    const firstCountry = availableCountriesRef.current.shift();
    if (firstCountry) {
      usedCountriesRef.current.add(firstCountry.code);
      setCurrentCountry(firstCountry);
    }
  }, []);

  const resumeGame = useCallback((savedProgress) => {
    if (!savedProgress) return;

    const levelCountries = COUNTRIES.filter(c => c.level === savedProgress.currentLevel);

    setCurrentLevelSync(savedProgress.currentLevel);
    setGameStarted(true);
    setScoreSync(savedProgress.score);
    setStreakSync(savedProgress.streak);
    setBestStreakSync(savedProgress.bestStreak);
    setCorrectAnswersSync(savedProgress.correctAnswers);
    setWrongAnswersSync(savedProgress.wrongAnswers);
    setCurrentQuestionSync(savedProgress.currentQuestion);
    setTotalQuestionsSync(savedProgress.totalQuestions);
    setIsGameComplete(false);
    setIsAnswered(false);
    setFeedback(null);
    setHintsUsed([]);

    usedCountriesRef.current = new Set(savedProgress.usedCountries || []);
    availableCountriesRef.current = levelCountries
      .filter(c => !usedCountriesRef.current.has(c.code))
      .sort(() => Math.random() - 0.5);

    const country = COUNTRIES.find(c => c.code === savedProgress.currentCountryCode);
    if (country) setCurrentCountry(country);
  }, []);

  const submitAnswer = useCallback((answer) => {
    if (isAnswered || !currentCountry) return;

    const isCorrect = answer.toLowerCase().trim() === currentCountry.name.toLowerCase().trim();
    setIsAnswered(true);

    const level = currentLevelRef.current;
    const basePoints = level === 'easy' ? 10 : level === 'medium' ? 20 : 30;
    const streakBonus = streakRef.current >= 3 ? Math.floor(streakRef.current / 3) * 5 : 0;
    const totalPoints = isCorrect ? basePoints + streakBonus : 0;

    let coinsEarned = 0;
    if (isCorrect) {
      coinsEarned = 2;
      if (streakRef.current >= 5) coinsEarned += 3;

      const newScore = scoreRef.current + totalPoints;
      setScoreSync(newScore);

      const newCorrect = correctAnswersRef.current + 1;
      setCorrectAnswersSync(newCorrect);

      const newStreak = streakRef.current + 1;
      setStreakSync(newStreak);
      if (newStreak > bestStreakRef.current) setBestStreakSync(newStreak);

      if (onEarnCoins) onEarnCoins(coinsEarned);
    } else {
      setStreakSync(0);
      const newWrong = wrongAnswersRef.current + 1;
      setWrongAnswersSync(newWrong);
    }

    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      correctAnswer: currentCountry.name,
      points: totalPoints,
      coins: coinsEarned,
    });
  }, [isAnswered, currentCountry, onEarnCoins]);

  const nextQuestion = useCallback(() => {
    const nextIndex = currentQuestionRef.current + 1;
    const total = totalQuestionsRef.current;

    // ── آخرین سوال بود؟ ──
    if (nextIndex >= total) {
      const finalCorrect = correctAnswersRef.current;
      const finalScore = scoreRef.current;
      const finalBestStreak = bestStreakRef.current;
      const level = currentLevelRef.current;
      const finalAccuracy = total > 0 ? Math.round((finalCorrect / total) * 100) : 0;

      // bonus completion
      let completionBonus = 0;
      if (finalAccuracy >= 90) completionBonus = 10;
      else if (finalAccuracy >= 70) completionBonus = 5;
      if (onEarnCoins && completionBonus > 0) onEarnCoins(completionBonus);

      setIsGameComplete(true);
      setIsAnswered(false);
      setFeedback(null);
      setHintsUsed([]);
      setCurrentCountry(null);

      if (onGameComplete) {
        onGameComplete(level, finalScore, finalCorrect, total, finalBestStreak);
      }
      return;
    }

    // ── سوال بعدی ──
    setIsAnswered(false);
    setFeedback(null);
    setHintsUsed([]);

    let nextCountry = null;

    // اگر pool خالی شد، دوباره پر کن (نباید پیش بیاد ولی safety net)
    if (availableCountriesRef.current.length === 0) {
      const levelCountries = COUNTRIES.filter(c => c.level === currentLevelRef.current);
      availableCountriesRef.current = levelCountries
        .filter(c => !usedCountriesRef.current.has(c.code))
        .sort(() => Math.random() - 0.5);
    }

    nextCountry = availableCountriesRef.current.shift() || null;
    if (nextCountry) usedCountriesRef.current.add(nextCountry.code);

    if (nextCountry) {
      setCurrentCountry(nextCountry);
      setCurrentQuestionSync(nextIndex);

      if (onSaveProgress) {
        onSaveProgress({
          currentLevel: currentLevelRef.current,
          currentQuestion: nextIndex,
          totalQuestions: total,
          score: scoreRef.current,
          streak: streakRef.current,
          bestStreak: bestStreakRef.current,
          correctAnswers: correctAnswersRef.current,
          wrongAnswers: wrongAnswersRef.current,
          currentCountryCode: nextCountry.code,
          usedCountries: Array.from(usedCountriesRef.current),
          timestamp: Date.now(),
        });
      }
    } else {
      // بدترین حالت: کشور پیدا نشد → بازی تموم
      setIsGameComplete(true);
      if (onGameComplete) {
        onGameComplete(
          currentLevelRef.current,
          scoreRef.current,
          correctAnswersRef.current,
          total,
          bestStreakRef.current,
        );
      }
    }
  }, [onGameComplete, onSaveProgress, onEarnCoins]);

  const useHint = useCallback((type) => {
    if (!currentCountry || hintsUsed.includes(type)) return null;
    setHintsUsed(prev => [...prev, type]);
    if (type === 'first-letter') return currentCountry.name[0];
    if (type === 'continent') return currentCountry.continent;
    return null;
  }, [currentCountry, hintsUsed]);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setCurrentCountry(null);
    setScoreSync(0);
    setStreakSync(0);
    setBestStreakSync(0);
    setCorrectAnswersSync(0);
    setWrongAnswersSync(0);
    setCurrentQuestionSync(0);
    setTotalQuestionsSync(0);
    setIsAnswered(false);
    setFeedback(null);
    setIsGameComplete(false);
    setHintsUsed([]);
    usedCountriesRef.current.clear();
    availableCountriesRef.current = [];
  }, []);

  const accuracy = totalQuestionsRef.current > 0
    ? Math.round((correctAnswersRef.current / totalQuestionsRef.current) * 100)
    : 0;

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