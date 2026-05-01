import Card from './Card.jsx';

export default function StatCard({ label, value, icon: Icon, accent = 'cyan', helper }) {
  const accentClasses = {
    cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30',
    green: 'text-cyber-green bg-cyber-green/10 border-cyber-green/30',
    red: 'text-cyber-red bg-cyber-red/10 border-cyber-red/30',
    amber: 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/30',
  }[accent];

  const barClasses = {
    cyan: 'bg-cyber-cyan',
    green: 'bg-cyber-green',
    red: 'bg-cyber-red',
    amber: 'bg-cyber-amber',
  }[accent];

  return (
    <Card className="group p-5 transition hover:-translate-y-1 hover:border-cyber-cyan/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
          {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
        </div>
        {Icon ? (
          <div className={`rounded-lg border p-2.5 transition group-hover:scale-105 ${accentClasses}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex gap-1">
        {[0, 1, 2, 3, 4].map((item) => (
          <span key={item} className={`h-1.5 flex-1 rounded-full ${item < 3 ? barClasses : 'bg-white/10'}`} />
        ))}
      </div>
    </Card>
  );
}
