import { badgeDefinitions } from '../data/badges';

export function categoryKey(category = '') {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function hasBadge(existingBadges, badgeName) {
  return existingBadges.some((badge) => badge.badgeName === badgeName || badge.name === badgeName);
}

function getBadge(id) {
  return badgeDefinitions.find((badge) => badge.id === id);
}

export function evaluateBadges({ profile, scenario, isCorrect, nextStats, existingBadges = [] }) {
  const earned = [];
  const add = (id, condition) => {
    const badge = getBadge(id);
    if (badge && condition && !hasBadge(existingBadges, badge.name)) {
      earned.push(badge);
    }
  };

  const key = categoryKey(scenario.category);
  const previousCategory = profile?.categoryStats?.[key] || {};
  const nextCategoryCorrect = (previousCategory.correct || 0) + (isCorrect ? 1 : 0);

  add('first-catch', isCorrect && scenario.isScam);
  add('phishing-hunter', isCorrect && scenario.category === 'Phishing Email' && nextCategoryCorrect >= 10);
  add('banking-defender', isCorrect && scenario.category === 'Banking Scam' && nextCategoryCorrect >= 10);
  add('job-scam-spotter', isCorrect && scenario.category === 'Fake Job Offer' && nextCategoryCorrect >= 10);
  add('perfect-five', nextStats.streak >= 5);
  add('scamradar-pro', nextStats.xp >= 1000);
  add('daily-defender', scenario.isDailyChallenge);
  add('sharp-eye', isCorrect && scenario.isScam && scenario.difficulty === 'Advanced');

  return earned;
}
