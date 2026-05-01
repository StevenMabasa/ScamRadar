import { Award } from 'lucide-react';
import Card from './Card.jsx';

export default function BadgeCard({ badge, locked = false }) {
  return (
    <Card className={`p-4 ${locked ? 'opacity-50' : ''}`}>
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{badge.badgeName || badge.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{badge.description}</p>
        </div>
      </div>
    </Card>
  );
}
