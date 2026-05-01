import { format } from 'date-fns';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Flame,
  Gauge,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import BadgeCard from '../components/BadgeCard.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ProgressChart from '../components/ProgressChart.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { badgeDefinitions } from '../data/badges';
import { fetchAttemptsForUser, fetchBadgesForUser } from '../firebase/firestore';
import { getLevelProgress } from '../utils/levelSystem';

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  return new Date(value);
}

function formatAttemptDate(value) {
  const date = toDate(value);
  return date ? format(date, 'MMM d, HH:mm') : 'Just now';
}

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [attemptRows, badgeRows] = await Promise.all([
          fetchAttemptsForUser(currentUser.uid),
          fetchBadgesForUser(currentUser.uid),
        ]);
        setAttempts(
          attemptRows.sort((a, b) => {
            const dateA = toDate(a.createdAt)?.getTime() || 0;
            const dateB = toDate(b.createdAt)?.getTime() || 0;
            return dateB - dateA;
          }),
        );
        setBadges(badgeRows);
      } catch (error) {
        toast.error(error.message || 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [currentUser.uid]);

  const stats = useMemo(() => {
    const total = userProfile?.totalAttempts || 0;
    const correct = userProfile?.correctAnswers || 0;
    const incorrect = userProfile?.incorrectAnswers ?? Math.max(0, total - correct);
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    return { total, correct, incorrect, accuracy };
  }, [userProfile]);

  const chartData = useMemo(() => {
    const groups = attempts.reduce((acc, attempt) => {
      if (!acc[attempt.category]) {
        acc[attempt.category] = { name: attempt.category, attempts: 0, correct: 0 };
      }
      acc[attempt.category].attempts += 1;
      acc[attempt.category].correct += attempt.isCorrect ? 1 : 0;
      return acc;
    }, {});

    const categoryData = Object.values(groups).map((group) => ({
      ...group,
      accuracy: group.attempts ? Math.round((group.correct / group.attempts) * 100) : 0,
      name: group.name.replace(' Scam', '').replace('Phishing ', 'Phishing '),
    }));

    const attemptsByDay = attempts.reduce((acc, attempt) => {
      const date = toDate(attempt.createdAt);
      const key = date ? format(date, 'MMM d') : 'Today';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const attemptsOverTime = Object.entries(attemptsByDay)
      .map(([name, count]) => ({ name, count }))
      .slice(-10);

    let cumulativeXp = 0;
    const xpGrowth = [...attempts]
      .reverse()
      .map((attempt, index) => {
        cumulativeXp += attempt.pointsEarned || 0;
        return {
          name: `${index + 1}`,
          xp: cumulativeXp,
        };
      })
      .slice(-20);

    return { categoryData, attemptsOverTime, xpGrowth };
  }, [attempts]);

  const levelProgress = getLevelProgress(userProfile?.xp || 0);
  const earnedNames = new Set(badges.map((badge) => badge.badgeName));
  const lockedBadges = badgeDefinitions.filter((badge) => !earnedNames.has(badge.name));
  const recommended = chartData.categoryData
    .filter((item) => item.attempts >= 1)
    .sort((a, b) => a.accuracy - b.accuracy)[0]?.name;

  if (loading) return <LoadingSpinner label="Loading your progress" />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge tone="cyan">Command center</Badge>
          <h1 className="mt-3 text-4xl font-black text-white">
            Operator HUD: {userProfile?.displayName || 'defender'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">Track XP, streaks, signal accuracy, and weak spots.</p>
        </div>
        <Link to="/play">
          <Button icon={Target}>Start Challenge</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard accent="green" icon={Zap} label="Total XP" value={(userProfile?.xp || 0).toLocaleString()} />
        <StatCard accent="cyan" icon={Gauge} label="Level" value={userProfile?.level || 1} />
        <StatCard accent="amber" icon={Flame} label="Current streak" value={userProfile?.streak || 0} />
        <StatCard accent="green" icon={Award} label="Best streak" value={userProfile?.bestStreak || 0} />
        <StatCard icon={BarChart3} label="Completed" value={stats.total} />
        <StatCard accent="green" icon={Target} label="Accuracy" value={`${stats.accuracy}%`} />
        <StatCard accent="green" icon={CheckCircle2} label="Correct answers" value={stats.correct} />
        <StatCard accent="red" icon={XCircle} label="Incorrect answers" value={stats.incorrect} />
      </div>

      <Card className="mt-6 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Level progress</h2>
            <p className="mt-1 text-sm text-slate-400">
              {levelProgress.nextLevel
                ? `${levelProgress.remaining} XP to Level ${levelProgress.nextLevel}`
                : 'Maximum level reached'}
            </p>
          </div>
          <Badge tone="green">{levelProgress.percent}%</Badge>
        </div>
        <ProgressBar className="mt-4" tone="green" value={levelProgress.percent} />
      </Card>

      {attempts.length ? (
        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <ProgressChart
            color="#54f28b"
            data={chartData.categoryData}
            dataKey="accuracy"
            title="Accuracy by category"
          />
          <ProgressChart
            color="#23d7ff"
            data={chartData.attemptsOverTime}
            dataKey="count"
            title="Attempts over time"
          />
          <ProgressChart color="#f7c948" data={chartData.xpGrowth} dataKey="xp" title="XP growth" type="line" />
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            action={
              <Link to="/play">
                <Button>Play your first challenge</Button>
              </Link>
            }
            message="Your charts will appear once you complete a challenge."
            title="No attempts yet"
          />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-white">Signal log</h2>
            <Badge tone="slate">{attempts.length} saved</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {attempts.slice(0, 8).map((attempt) => (
              <div
                key={attempt.id}
                className="flex flex-col gap-3 rounded-lg border border-cyber-line bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{attempt.category}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {attempt.difficulty} - {formatAttemptDate(attempt.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={attempt.isCorrect ? 'green' : 'red'}>
                    {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                  <Badge tone="cyan">+{attempt.pointsEarned || 0} XP</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-xl font-black text-white">Recommended focus</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {recommended
                ? `Spend a few rounds on ${recommended}. It currently has your lowest category accuracy.`
                : 'Start with Phishing Email or Banking Scam to learn the most common red flags.'}
            </p>
          </Card>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-xl font-black text-white">
              <TrendingUp className="h-5 w-5 text-cyber-green" />
              Badges earned
            </h2>
            <div className="mt-4 space-y-3">
              {badges.length ? (
                badges.map((badge) => <BadgeCard badge={badge} key={badge.id} />)
              ) : (
                <p className="text-sm text-slate-400">No badges yet. Your first correct scam catch unlocks one.</p>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-black text-white">Locked badges</h2>
            <div className="mt-4 space-y-3">
              {lockedBadges.slice(0, 4).map((badge) => (
                <BadgeCard badge={badge} key={badge.id} locked />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
