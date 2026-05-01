import { SearchX } from 'lucide-react';
import Card from './Card.jsx';

export default function EmptyState({ title, message, action }) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-cyber-line bg-white/5 text-cyber-cyan">
        <SearchX className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
