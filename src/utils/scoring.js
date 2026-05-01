import { getLevelForXp } from './levelSystem';

export const difficultyPoints = {
  Beginner: 10,
  Intermediate: 20,
  Advanced: 30,
};

export function getStreakBonus(nextStreak) {
  if (nextStreak === 10) return 20;
  if (nextStreak === 5) return 10;
  if (nextStreak === 3) return 5;
  return 0;
}

export function calculateAnswerResult({ scenario, userAnswer, profile }) {
  const correctAnswer = scenario.isScam ? 'scam' : 'safe';
  const isCorrect = userAnswer === correctAnswer;
  const nextStreak = isCorrect ? (profile?.streak || 0) + 1 : 0;
  const basePoints = isCorrect ? difficultyPoints[scenario.difficulty] || scenario.points || 10 : 0;
  const streakBonus = isCorrect ? getStreakBonus(nextStreak) : 0;
  const pointsEarned = basePoints + streakBonus;
  const nextXp = (profile?.xp || 0) + pointsEarned;

  return {
    correctAnswer,
    isCorrect,
    basePoints,
    streakBonus,
    pointsEarned,
    nextStats: {
      xp: nextXp,
      level: getLevelForXp(nextXp),
      streak: nextStreak,
      bestStreak: Math.max(profile?.bestStreak || 0, nextStreak),
      totalAttempts: (profile?.totalAttempts || 0) + 1,
      correctAnswers: (profile?.correctAnswers || 0) + (isCorrect ? 1 : 0),
      incorrectAnswers: (profile?.incorrectAnswers || 0) + (isCorrect ? 0 : 1),
    },
  };
}
