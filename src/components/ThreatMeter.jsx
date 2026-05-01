import ProgressBar from './ProgressBar.jsx';

const difficultySignal = {
  Beginner: { value: 36, label: 'Low noise', tone: 'green' },
  Intermediate: { value: 64, label: 'Mixed signal', tone: 'amber' },
  Advanced: { value: 88, label: 'Deep cover', tone: 'red' },
};

export default function ThreatMeter({ difficulty }) {
  const signal = difficultySignal[difficulty] || difficultySignal.Beginner;

  return (
    <div className="rounded-lg border border-cyber-line bg-cyber-ink/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Signal complexity</p>
          <p className="mt-1 text-sm font-semibold text-white">{signal.label}</p>
        </div>
        <span className="font-mono text-xl font-black text-cyber-cyan">{signal.value}</span>
      </div>
      <ProgressBar tone={signal.tone} value={signal.value} />
    </div>
  );
}
