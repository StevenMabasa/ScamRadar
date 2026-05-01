import { Activity, Crosshair, RadioTower } from 'lucide-react';
import Badge from './Badge.jsx';

export default function RadarDisplay({ className = '', compact = false }) {
  return (
    <div className={`radar-display ${className}`}>
      <div className="radar-sweep" />
      <span className="radar-blip left-[22%] top-[34%]" />
      <span className="radar-blip danger left-[67%] top-[26%]" />
      <span className="radar-blip left-[74%] top-[68%]" />
      <span className="radar-blip danger left-[36%] top-[72%]" />

      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <Badge tone="green">Scanner online</Badge>
        {!compact ? <Badge tone="red">2 threats</Badge> : null}
      </div>

      <div className={`absolute bottom-4 left-4 right-4 grid gap-3 ${compact ? 'grid-cols-1' : 'sm:grid-cols-3'}`}>
        <div className="rounded-lg border border-cyber-line bg-cyber-ink/72 p-3">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
            <Activity className="h-3.5 w-3.5 text-cyber-green" />
            Signal
          </p>
          <p className="mt-1 text-lg font-black text-white">84%</p>
        </div>
        <div className="rounded-lg border border-cyber-line bg-cyber-ink/72 p-3">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
            <Crosshair className="h-3.5 w-3.5 text-cyber-red" />
            Risk
          </p>
          <p className="mt-1 text-lg font-black text-cyber-red">High</p>
        </div>
        <div className="rounded-lg border border-cyber-line bg-cyber-ink/72 p-3">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
            <RadioTower className="h-3.5 w-3.5 text-cyber-cyan" />
            Feed
          </p>
          <p className="mt-1 text-lg font-black text-cyber-cyan">Live</p>
        </div>
      </div>
    </div>
  );
}
