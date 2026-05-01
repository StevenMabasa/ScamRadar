export default function ProgressBar({ value = 0, className = '', tone = 'cyan' }) {
  const clamped = Math.max(0, Math.min(100, value));
  const fill = {
    cyan: 'bg-cyber-cyan',
    green: 'bg-cyber-green',
    red: 'bg-cyber-red',
    amber: 'bg-cyber-amber',
  }[tone];

  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className={`h-full rounded-full ${fill} transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
