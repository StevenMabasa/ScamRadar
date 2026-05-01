const tones = {
  cyan: 'border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan',
  green: 'border-cyber-green/40 bg-cyber-green/10 text-cyber-green',
  red: 'border-cyber-red/40 bg-cyber-red/10 text-cyber-red',
  amber: 'border-cyber-amber/40 bg-cyber-amber/10 text-cyber-amber',
  slate: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
};

export default function Badge({ children, tone = 'cyan', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
