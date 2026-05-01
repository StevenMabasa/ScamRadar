const variants = {
  primary:
    'border border-cyber-cyan/70 bg-cyber-cyan text-cyber-ink hover:bg-cyan-200 focus-visible:ring-cyber-cyan shadow-glow',
  success:
    'border border-cyber-green/70 bg-cyber-green text-cyber-ink hover:bg-green-200 focus-visible:ring-cyber-green shadow-success',
  danger:
    'border border-cyber-red/70 bg-cyber-red text-white hover:bg-red-400 focus-visible:ring-cyber-red shadow-danger',
  outline:
    'border border-cyber-line bg-cyber-panel2/70 text-slate-100 hover:border-cyber-cyan hover:bg-cyber-cyan/10 hover:text-cyber-cyan focus-visible:ring-cyber-cyan',
  ghost:
    'text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-cyber-cyan',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export default function Button({
  children,
  className = '',
  icon: Icon,
  size = 'md',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-wide transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-ink active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
