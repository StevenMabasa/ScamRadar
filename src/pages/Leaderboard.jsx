import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LeaderboardTable from '../components/LeaderboardTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchLeaderboard, fetchRankForXp } from '../firebase/firestore';

export default function Leaderboard() {
  const { currentUser, firebaseReady, userProfile } = useAuth();
  const [rows, setRows] = useState([]);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      if (!firebaseReady) {
        setLoading(false);
        return;
      }

      try {
        const leaderboardRows = await fetchLeaderboard(20);
        setRows(leaderboardRows);

        if (currentUser && userProfile) {
          setRank(await fetchRankForXp(userProfile.xp || 0));
        }
      } catch (error) {
        toast.error(error.message || 'Could not load leaderboard.');
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [currentUser, firebaseReady, userProfile]);

  if (loading) return <LoadingSpinner label="Loading leaderboard" />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="amber">Leaderboard</Badge>
          <h1 className="mt-3 text-4xl font-black text-white">Top ScamRadar defenders</h1>
          <p className="mt-2 text-sm text-slate-400">Ranked by XP, level, accuracy, and active streaks.</p>
        </div>
        {rank ? (
          <Card className="p-4">
            <p className="text-xs uppercase text-slate-500">Your rank</p>
            <p className="mt-1 text-2xl font-black text-cyber-amber">#{rank}</p>
          </Card>
        ) : null}
      </div>

      {!firebaseReady ? (
        <div className="mt-8">
          <EmptyState
            message="Add Firebase environment variables to load live leaderboard data."
            title="Firebase is not configured"
          />
        </div>
      ) : rows.length ? (
        <div className="mt-8">
          <LeaderboardTable currentUserId={currentUser?.uid} rows={rows} />
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState message="Complete challenges to create the first ranking." title="No leaderboard entries yet" />
        </div>
      )}

      <Card className="mt-6 p-5 text-sm leading-6 text-slate-400">
        <div className="flex gap-3">
          <Trophy className="h-5 w-5 shrink-0 text-cyber-amber" />
          Leaderboard reads are designed for portfolio/demo use. For production privacy, publish only public profile
          fields from a trusted backend or dedicated public collection.
        </div>
      </Card>
    </section>
  );
}
