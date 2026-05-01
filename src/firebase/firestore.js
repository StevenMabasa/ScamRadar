import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, requireFirebase } from './firebaseConfig';

function requireDb() {
  requireFirebase();
  return db;
}

export async function createUserProfile(user, displayName) {
  const database = requireDb();
  const userRef = doc(database, 'users', user.uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) return;

  await setDoc(userRef, {
    uid: user.uid,
    displayName: displayName || user.displayName || 'ScamRadar Recruit',
    email: user.email,
    xp: 0,
    level: 1,
    totalAttempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    bestStreak: 0,
    categoryStats: {},
    createdAt: serverTimestamp(),
    lastPlayedDate: null,
  });
}

export async function fetchUserProfile(uid) {
  const database = requireDb();
  const snapshot = await getDoc(doc(database, 'users', uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function updateUserProfile(uid, updates) {
  const database = requireDb();
  await updateDoc(doc(database, 'users', uid), updates);
}

export async function recordAttempt({
  uid,
  scenario,
  userAnswer,
  isCorrect,
  pointsEarned,
  nextStats,
  categoryKey,
  earnedBadges = [],
}) {
  const database = requireDb();
  const batch = writeBatch(database);
  const attemptRef = doc(collection(database, 'attempts'));
  const userRef = doc(database, 'users', uid);

  batch.set(attemptRef, {
    userId: uid,
    scenarioId: scenario.id,
    category: scenario.category,
    difficulty: scenario.difficulty,
    scenarioType: scenario.type,
    userAnswer,
    correctAnswer: scenario.isScam ? 'scam' : 'safe',
    isCorrect,
    pointsEarned,
    redFlags: scenario.redFlags,
    createdAt: serverTimestamp(),
  });

  batch.update(userRef, {
    xp: increment(pointsEarned),
    level: nextStats.level,
    totalAttempts: increment(1),
    correctAnswers: increment(isCorrect ? 1 : 0),
    incorrectAnswers: increment(isCorrect ? 0 : 1),
    streak: nextStats.streak,
    bestStreak: nextStats.bestStreak,
    lastPlayedDate: serverTimestamp(),
    [`categoryStats.${categoryKey}.attempts`]: increment(1),
    [`categoryStats.${categoryKey}.correct`]: increment(isCorrect ? 1 : 0),
    [`categoryStats.${categoryKey}.xp`]: increment(pointsEarned),
  });

  earnedBadges.forEach((badge) => {
    const badgeRef = doc(database, 'badges', `${uid}_${badge.id}`);
    batch.set(badgeRef, {
      userId: uid,
      badgeName: badge.name,
      description: badge.description,
      earnedAt: serverTimestamp(),
    });
  });

  await batch.commit();
  return attemptRef.id;
}

export async function fetchAttemptsForUser(uid, maxCount = 120) {
  const database = requireDb();
  const attemptsQuery = query(
    collection(database, 'attempts'),
    where('userId', '==', uid),
    limit(maxCount),
  );
  const snapshot = await getDocs(attemptsQuery);
  return snapshot.docs.map((attemptDoc) => ({ id: attemptDoc.id, ...attemptDoc.data() }));
}

export async function fetchBadgesForUser(uid) {
  const database = requireDb();
  const badgesQuery = query(collection(database, 'badges'), where('userId', '==', uid));
  const snapshot = await getDocs(badgesQuery);
  return snapshot.docs.map((badgeDoc) => ({ id: badgeDoc.id, ...badgeDoc.data() }));
}

export async function fetchLeaderboard(maxCount = 20) {
  const database = requireDb();
  const leaderboardQuery = query(collection(database, 'users'), orderBy('xp', 'desc'), limit(maxCount));
  const snapshot = await getDocs(leaderboardQuery);

  return snapshot.docs.map((userDoc, index) => {
    const data = userDoc.data();
    const totalAttempts = data.totalAttempts || 0;
    const accuracy = totalAttempts ? Math.round(((data.correctAnswers || 0) / totalAttempts) * 100) : 0;

    return {
      id: userDoc.id,
      rank: index + 1,
      displayName: data.displayName || 'Anonymous defender',
      xp: data.xp || 0,
      level: data.level || 1,
      accuracy,
      streak: data.streak || 0,
    };
  });
}

export async function fetchRankForXp(xp) {
  const database = requireDb();
  const rankQuery = query(collection(database, 'users'), where('xp', '>', xp || 0));
  const snapshot = await getCountFromServer(rankQuery);
  return snapshot.data().count + 1;
}
