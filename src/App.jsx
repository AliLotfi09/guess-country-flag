import { useState } from 'react';
import { IntroScreen } from '@features/IntroScreen';
import { ProfileScreen } from '@features/ProfileScreen';
import { LevelSelect } from '@features/LevelSelect';
import { FlagGame } from '@features/flag-game/FlagGame';
import { ResumeGameDialog } from '@features/ResumeGameDialog';
import { useGameStats } from '@hooks/useGameStats';
import { useGameProgress } from '@hooks/useGameProgress';

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { stats, updateStats, spendCoins, resetStats } = useGameStats();
  const { savedProgress, saveProgress, clearProgress } = useGameProgress();
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  const handleStart = () => {
    // چک کردن آیا بازی ناتمامی وجود دارد
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
    const coinsEarned = updateStats(level, score, correctAnswers, totalQuestions, bestStreak);
    clearProgress();
    
    // نمایش سکه‌های به دست آمده
    alert(`شما ${coinsEarned} سکه به دست آوردید! 🎉`);
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
    return <IntroScreen onStart={handleStart} onProfile={handleProfile} />;
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
        coins={stats.coins}
        onSpendCoins={spendCoins}
        onSaveProgress={saveProgress}
        savedProgress={screen === 'game-resume' ? savedProgress : null}
      />
    );
  }

  return null;
}