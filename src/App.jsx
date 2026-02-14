import { useState } from 'react';
import { IntroScreen } from './features/IntroScreen';
import { ProfileScreen } from './features/ProfileScreen';
import { LevelSelect } from './features/LevelSelect';
import { FlagGame } from './features/flag-game/FlagGame';
import { useGameStats } from './hooks/useGameStats';
import PixelSnow from './components/PixelSnow';


export default function App() {
  const [screen, setScreen] = useState('intro');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { stats, updateStats, resetStats } = useGameStats();

  const handleStart = () => {
    setScreen('level');
  };

  const handleProfile = () => {
    setScreen('profile');
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setScreen('game');
  };

  const handleGameComplete = (level, score, accuracy, streak) => {
    updateStats(level, score, accuracy, streak);
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

  if (screen === 'intro') {
    return <IntroScreen onStart={handleStart} onProfile={handleProfile}
    
    /> ;
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

  return (
    <FlagGame 
      level={selectedLevel} 
      onBack={handleBack}
      onGameComplete={handleGameComplete}
    />
  );
}