import { ArrowRight, Flag, LayoutDashboard, ShieldAlert, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import Badge from './Badge.jsx';
import Button from './Button.jsx';
import Card from './Card.jsx';

export default function ResultPanel({ scenario, result, earnedBadges = [], onNext, onDashboard }) {
  const correct = result.isCorrect;

  return (
    <Card className={`animate-rise p-5 ${correct ? 'border-cyber-green/50' : 'border-cyber-red/50'}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${
              correct
                ? 'border-cyber-green/40 bg-cyber-green/10 text-cyber-green'
                : 'border-cyber-red/40 bg-cyber-red/10 text-cyber-red'
            }`}
          >
            {correct ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Mission result</p>
            <h3 className="mt-1 text-2xl font-black text-white">{correct ? 'Correct!' : 'Not quite'}</h3>
            <p className="mt-1 text-sm text-slate-400">
              Correct answer: <span className="font-semibold text-white">{result.correctAnswer.toUpperCase()}</span>
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-cyber-line bg-cyber-ink/70 p-4 text-right">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">XP awarded</p>
          <p className={`mt-1 text-3xl font-black ${correct ? 'text-cyber-green' : 'text-slate-500'}`}>
            +{result.pointsEarned}
          </p>
          {result.streakBonus ? <Badge tone="amber">+{result.streakBonus} streak bonus</Badge> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="terminal-frame rounded-lg border border-cyber-line p-4">
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <Flag className="h-4 w-4 text-cyber-red" />
            Red flags
          </h4>
          {scenario.redFlags.length ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {scenario.redFlags.map((flag) => (
                <li key={flag} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyber-red" />
                  {flag}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No serious red flags. The message points to official channels.</p>
          )}
        </div>

        <div className="terminal-frame rounded-lg border border-cyber-line p-4">
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <Terminal className="h-4 w-4 text-cyber-cyan" />
            Explanation
          </h4>
          <p className="mt-3 text-sm leading-6 text-slate-300">{scenario.explanation}</p>
        </div>

        <div className="terminal-frame rounded-lg border border-cyber-line p-4">
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-cyber-green" />
            Safe action
          </h4>
          <p className="mt-3 text-sm leading-6 text-slate-300">{scenario.safeAction}</p>
        </div>
      </div>

      {earnedBadges.length ? (
        <div className="mt-5 rounded-lg border border-cyber-amber/30 bg-cyber-amber/10 p-4">
          <h4 className="flex items-center gap-2 font-semibold text-cyber-amber">
            <Sparkles className="h-4 w-4" />
            Badge earned
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {earnedBadges.map((badge) => (
              <Badge key={badge.id} tone="amber">
                {badge.name}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button icon={ArrowRight} onClick={onNext} variant="primary">
          Next Signal
        </Button>
        <Button icon={LayoutDashboard} onClick={onDashboard} variant="outline">
          Back to Dashboard
        </Button>
      </div>
    </Card>
  );
}
