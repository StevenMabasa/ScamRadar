export const levelThresholds = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 500 },
  { level: 5, xp: 900 },
  { level: 6, xp: 1400 },
  { level: 7, xp: 2000 },
  { level: 8, xp: 2800 },
  { level: 9, xp: 3700 },
  { level: 10, xp: 5000 },
];

export function getLevelForXp(xp = 0) {
  return levelThresholds.reduce((currentLevel, threshold) => {
    return xp >= threshold.xp ? threshold.level : currentLevel;
  }, 1);
}

export function getLevelProgress(xp = 0) {
  const currentLevel = getLevelForXp(xp);
  const current = levelThresholds.find((threshold) => threshold.level === currentLevel);
  const next = levelThresholds.find((threshold) => threshold.level === currentLevel + 1);

  if (!next) {
    return {
      currentLevel,
      nextLevel: null,
      currentXp: current.xp,
      nextXp: current.xp,
      percent: 100,
      remaining: 0,
    };
  }

  const span = next.xp - current.xp;
  const gained = Math.max(0, xp - current.xp);
  const percent = Math.min(100, Math.round((gained / span) * 100));

  return {
    currentLevel,
    nextLevel: next.level,
    currentXp: current.xp,
    nextXp: next.xp,
    percent,
    remaining: Math.max(0, next.xp - xp),
  };
}
