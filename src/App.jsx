// src/App.jsx
import { useState, useEffect } from 'react';
import { IntroScreen } from '@features/IntroScreen';
import { ProfileScreen } from '@features/ProfileScreen';
import { LevelSelect } from '@features/LevelSelect';
import { FlagGame } from '@features/flag-game/FlagGame';
import { ResumeGameDialog } from '@features/ResumeGameDialog';
import { useGameStats } from '@hooks/useGameStats';
import { useGameProgress } from '@hooks/useGameProgress';
import { useMiniApp } from '@hooks/useMiniApp';

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { stats, updateStats, earnCoins, spendCoins, resetStats } = useGameStats();
  const { savedProgress, saveProgress, clearProgress } = useGameProgress();
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  // ایتا SDK
  const miniApp = useMiniApp();

  // ── مدیریت دکمه بازگشت گوشی ──
  // هر بار که صفحه عوض می‌شه، بک هندلر مناسب رو ست کن
  useEffect(() => {
    let cleanup;

    if (showResumeDialog) {
      // در دیالوگ resume: بک = انتخاب بازی جدید (بستن دیالوگ)
      cleanup = miniApp.setBackHandler(() => {
        handleNewGame();
      });
    } else if (screen === 'intro') {
      // صفحه اول: هیچ بک هندلری نداریم → دکمه بک اپ رو می‌بنده (رفتار پیش‌فرض)
      cleanup = miniApp.setBackHandler(null);
    } else if (screen === 'profile') {
      cleanup = miniApp.setBackHandler(() => {
        handleBackToIntro();
      });
    } else if (screen === 'level') {
      cleanup = miniApp.setBackHandler(() => {
        handleBackToIntro();
      });
    } else if (screen === 'game' || screen === 'game-resume') {
      // داخل بازی: بک = خروج از بازی (برگشت به لول سلکت)
      cleanup = miniApp.setBackHandler(() => {
        handleBack();
      });
    }

    // cleanup: وقتی صفحه عوض می‌شه، هندلر قبلی رو پاک کن
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [screen, showResumeDialog]);

  const handleStart = () => {
    if (savedProgress && Date.now() - savedProgress.timestamp < 24 * 60 * 60 * 1000) {
      setShowResumeDialog(true);
    } else {
      clearProgress();
      setScreen('level');
    }
  };

  const handleResumeGame = () => {
    setSelectedLevel(savedProgress.currentLevel);
    setShowResumeDialog(false);
    setScreen('game-resume');
  };

  const handleNewGame = () => {
    clearProgress();
    setShowResumeDialog(false);
    setScreen('level');
  };

  const handleProfile = () => {
    setScreen('profile');
  };

  const handleSelectLevel = (level) => {
    clearProgress();
    setSelectedLevel(level);
    setScreen('game');
  };

  const handleGameComplete = (level, score, correctAnswers, totalQuestions, bestStreak) => {
    updateStats(level, score, correctAnswers, totalQuestions, bestStreak);
    clearProgress();
    if (miniApp.isEitaa) {
      miniApp.hapticNotification('success');
    }
  };

  const handleBack = () => {
    setSelectedLevel(null);
    setScreen('level');
  };

  const handleBackToIntro = () => {
    setScreen('intro');
  };

  const handleResetStats = () => {
    resetStats();
    setScreen('intro');
  };

  const handleStartFromProfile = () => {
    setScreen('level');
  };

  if (showResumeDialog) {
    return (
      <ResumeGameDialog
        onResume={handleResumeGame}
        onNewGame={handleNewGame}
        progress={savedProgress}
      />
    );
  }

  if (screen === 'intro') {
    return (
      <IntroScreen
        onStart={handleStart}
        onProfile={handleProfile}
        stats={stats}
        user={miniApp.user}
      />
    );
  }

  if (screen === 'profile') {
    return (
      <ProfileScreen
        stats={stats}
        onBack={handleBackToIntro}
        onReset={handleResetStats}
        onStartGame={handleStartFromProfile}
      />
    );
  }

  if (screen === 'level') {
    return <LevelSelect onSelectLevel={handleSelectLevel} onBack={handleBackToIntro} />;
  }

  if (screen === 'game' || screen === 'game-resume') {
    return (
      <FlagGame
        level={selectedLevel}
        onBack={handleBack}
        onGameComplete={handleGameComplete}
        coins={stats.coins ?? 0}
        onEarnCoins={earnCoins}
        onSpendCoins={spendCoins}
        onSaveProgress={saveProgress}
        savedProgress={screen === 'game-resume' ? savedProgress : null}
        miniApp={miniApp}
      />
    );
  }

  return null;
}
