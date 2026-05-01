export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-slate-300">
      <div className="h-10 w-10 rounded-full border-2 border-cyber-line border-t-cyber-cyan animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
