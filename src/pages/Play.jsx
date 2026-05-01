import {
  Crosshair,
  Flame,
  Gamepad2,
  Gauge,
  RadioTower,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Timer,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import RadarDisplay from '../components/RadarDisplay.jsx';
import ResultPanel from '../components/ResultPanel.jsx';
import ScenarioCard from '../components/ScenarioCard.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { CATEGORIES, DIFFICULTIES } from '../data/scamTemplates';
import { fetchBadgesForUser, recordAttempt } from '../firebase/firestore';
import { categoryKey, evaluateBadges } from '../utils/badgeEngine';
import { generateScenario } from '../utils/scenarioGenerator';
import { calculateAnswerResult } from '../utils/scoring';

const timerLimit = 45;

export default function Play() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [category, setCategory] = useState('Random');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [scenario, setScenario] = useState(() => generateScenario('Random', 'Beginner'));
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [saving, setSaving] = useState(false);
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerLimit);

  const timerPercent = useMemo(() => Math.round((timeLeft / timerLimit) * 100), [timeLeft]);

  const startNewScenario = () => {
    setScenario(generateScenario(category, difficulty));
    setSelectedAnswer(null);
    setResult(null);
    setEarnedBadges([]);
    setSaving(false);
    setTimeLeft(timerLimit);
  };

  useEffect(() => {
    startNewScenario();
  }, [category, difficulty]);

  async function submitAnswer(answer) {
    if (!scenario || result || saving) return;

    setSelectedAnswer(answer);
    setSaving(true);

    const answerResult = calculateAnswerResult({
      scenario,
      userAnswer: answer,
      profile: userProfile || {},
    });

    setResult(answerResult);

    try {
      const existingBadges = await fetchBadgesForUser(currentUser.uid);
      const badges = evaluateBadges({
        profile: userProfile || {},
        scenario,
        isCorrect: answerResult.isCorrect,
        nextStats: answerResult.nextStats,
        existingBadges,
      });

      setEarnedBadges(badges);

      await recordAttempt({
        uid: currentUser.uid,
        scenario,
        userAnswer: answer,
        isCorrect: answerResult.isCorrect,
        pointsEarned: answerResult.pointsEarned,
        nextStats: answerResult.nextStats,
        categoryKey: categoryKey(scenario.category),
        earnedBadges: badges,
      });

      toast.success(answerResult.isCorrect ? `Answer saved: +${answerResult.pointsEarned} XP` : 'Answer saved');
      badges.forEach((badge) => toast.success(`Badge earned: ${badge.name}`));
    } catch (error) {
      toast.error(error.message || 'Could not save this attempt.');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!timedMode || result || !scenario) return undefined;

    if (timeLeft <= 0) {
      toast.error('Time ran out');
      submitAnswer('timeout');
      return undefined;
    }

    const timeout = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [timedMode, timeLeft, result, scenario?.id]);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-4 top-0 -z-0 h-64 rounded-lg border border-cyber-cyan/10 hud-lines opacity-30" />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge tone="green">
            <Gamepad2 className="h-3.5 w-3.5" />
            Mission Control
          </Badge>
          <h1 className="mt-3 text-4xl font-black text-white">Classify the intercepted signal.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            These messages are fictional simulations generated locally from ScamRadar templates.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
          <StatCard accent="green" icon={Zap} label="XP" value={(userProfile?.xp || 0).toLocaleString()} />
          <StatCard accent="cyan" icon={Flame} label="Streak" value={userProfile?.streak || 0} />
          <StatCard accent="amber" icon={Gauge} label="Level" value={userProfile?.level || 1} />
        </div>
      </div>

      <div className="relative z-10 mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card className="h-fit p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Loadout</p>
              <h2 className="mt-1 text-lg font-black text-white">Challenge setup</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
              <Crosshair className="h-5 w-5" />
            </div>
          </div>

          <RadarDisplay compact className="mt-5 min-h-[300px]" />

          <label className="mt-5 block">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Category</span>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-cyber-line bg-slate-950 px-3 text-sm font-semibold text-white outline-none focus:border-cyber-cyan"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item === 'Random' ? 'Random Challenge' : item}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Difficulty</span>
            <div className="mt-2 grid gap-2">
              {DIFFICULTIES.map((item) => (
                <button
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-bold transition ${
                    difficulty === item
                      ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan shadow-glow'
                      : 'border-cyber-line bg-slate-950 text-slate-300 hover:border-cyber-cyan/60 hover:text-white'
                  }`}
                  key={item}
                  onClick={() => setDifficulty(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-cyber-line bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Timer className="h-4 w-4 text-cyber-cyan" />
                Timed mode
              </div>
              <button
                aria-label="Toggle timed mode"
                className={`h-6 w-11 rounded-full border transition ${
                  timedMode
                    ? 'border-cyber-green bg-cyber-green/30'
                    : 'border-cyber-line bg-slate-900'
                }`}
                onClick={() => {
                  setTimedMode((value) => !value);
                  setTimeLeft(timerLimit);
                }}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${
                    timedMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {timedMode ? (
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-slate-400">
                  <span>Time left</span>
                  <span>{timeLeft}s</span>
                </div>
                <ProgressBar tone={timeLeft <= 10 ? 'red' : 'cyan'} value={timerPercent} />
              </div>
            ) : null}
          </div>

          <Button className="mt-5 w-full" icon={Shuffle} onClick={startNewScenario} variant="outline">
            New Scenario
          </Button>
        </Card>

        <div className="space-y-6">
          <ScenarioCard scenario={scenario} />

          <Card className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Decision gate</p>
                <h2 className="mt-1 text-xl font-black text-white">Lock in your call</h2>
                <p className="mt-1 text-sm text-slate-400">Classify the signal before the next packet arrives.</p>
              </div>
              {selectedAnswer ? (
                <Badge tone={selectedAnswer === 'scam' ? 'red' : selectedAnswer === 'safe' ? 'green' : 'amber'}>
                  Selected: {selectedAnswer}
                </Badge>
              ) : null}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button
                className="h-16 text-base"
                disabled={Boolean(result) || saving}
                icon={ShieldCheck}
                onClick={() => submitAnswer('safe')}
                size="lg"
                variant="success"
              >
                Authorize Safe
              </Button>
              <Button
                className="h-16 text-base"
                disabled={Boolean(result) || saving}
                icon={ShieldAlert}
                onClick={() => submitAnswer('scam')}
                size="lg"
                variant="danger"
              >
                Flag Scam
              </Button>
            </div>
          </Card>

          {result ? (
            <ResultPanel
              earnedBadges={earnedBadges}
              onDashboard={() => navigate('/dashboard')}
              onNext={startNewScenario}
              result={result}
              scenario={scenario}
            />
          ) : (
            <Card className="p-5 text-sm leading-6 text-slate-400">
              <div className="flex gap-3">
                <RadioTower className="h-5 w-5 shrink-0 text-cyber-cyan" />
                Your answer will update XP, streak, category stats, recent attempts, and badge progress.
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
