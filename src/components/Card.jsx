export default function Card({ children, className = '', as: Component = 'section' }) {
  return (
    <Component
      className={`hud-card rounded-lg border border-cyber-line shadow-glow backdrop-blur ${className}`}
    >
      {children}
    </Component>
  );
}
