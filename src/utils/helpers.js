/**
 * Normalize string for comparison
 */
export const normalizeString = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ');
};

/**
 * Check if answer matches country name
 */
export const checkAnswer = (userAnswer, correctAnswer) => {
  return normalizeString(userAnswer) === normalizeString(correctAnswer);
};

/**
 * Calculate score with streak bonus
 */
export const calculateScore = (isCorrect, streak, basePoints = 100) => {
  if (!isCorrect) return 0;
  const streakBonus = streak >= 3 ? Math.floor(streak / 3) * 25 : 0;
  return basePoints + streakBonus;
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};