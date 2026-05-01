import { Medal } from 'lucide-react';
import Card from './Card.jsx';

export default function LeaderboardTable({ rows, currentUserId }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-cyber-line">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-4">Rank</th>
              <th className="px-5 py-4">Display name</th>
              <th className="px-5 py-4">XP</th>
              <th className="px-5 py-4">Level</th>
              <th className="px-5 py-4">Accuracy</th>
              <th className="px-5 py-4">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-line text-sm">
            {rows.map((row) => {
              const isCurrent = row.id === currentUserId;
              return (
                <tr key={row.id} className={isCurrent ? 'bg-cyber-cyan/10' : 'hover:bg-white/[0.03]'}>
                  <td className="px-5 py-4 font-bold text-white">
                    <span className="inline-flex items-center gap-2">
                      {row.rank <= 3 ? <Medal className="h-4 w-4 text-cyber-amber" /> : null}
                      #{row.rank}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white">{row.displayName}</td>
                  <td className="px-5 py-4 text-cyber-green">{row.xp.toLocaleString()}</td>
                  <td className="px-5 py-4">Level {row.level}</td>
                  <td className="px-5 py-4">{row.accuracy}%</td>
                  <td className="px-5 py-4">{row.streak}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
