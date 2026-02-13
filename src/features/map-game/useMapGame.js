import { useCallback } from 'react';
import { useGameEngine } from '@hooks/useGameEngine';
import { useCountrySearch } from '@hooks/useCountrySearch';
import { checkAnswer } from '@utils/helpers';

/**
 * Hook for map game logic
 */
export const useMapGame = () => {
  const gameState = useGameEngine();

  const handleCountrySelect = useCallback((selectedCountry) => {
    const isCorrect = checkAnswer(
      selectedCountry.name,
      gameState.currentCountry.name
    );
    gameState.submitAnswer(isCorrect);
  }, [gameState]);

  const searchState = useCountrySearch(handleCountrySelect);

  const handleNextQuestion = useCallback(() => {
    searchState.clearQuery();
    gameState.nextQuestion();
  }, [gameState, searchState]);

  return {
    gameState,
    searchState,
    startGame: gameState.startGame,
    handleCountrySelect,
    handleNextQuestion,
  };
};