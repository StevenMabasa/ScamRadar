import { LogOut, Mail, Save, User, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getLevelProgress } from '../utils/levelSystem';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateDisplayName, userProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(userProfile?.displayName || currentUser?.displayName || '');
  }, [currentUser, userProfile]);

  const levelProgress = getLevelProgress(userProfile?.xp || 0);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await updateDisplayName(displayName.trim());
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Could not log out.');
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-black text-white">Profile</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your ScamRadar identity and view account progress.</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <StatCard accent="green" icon={Zap} label="Total XP" value={(userProfile?.xp || 0).toLocaleString()} />
        <StatCard label="Level" value={userProfile?.level || 1} />
        <StatCard label="Best streak" value={userProfile?.bestStreak || 0} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="p-6">
          <h2 className="text-xl font-black text-white">Account details</h2>
          <form className="mt-5 space-y-5" onSubmit={handleSave}>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Display name</span>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-cyber-line bg-slate-950 px-3">
                <User className="h-4 w-4 text-slate-500" />
                <input
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  onChange={(event) => setDisplayName(event.target.value)}
                  value={displayName}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-cyber-line bg-slate-950 px-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  className="h-11 w-full bg-transparent text-sm text-slate-400 outline-none"
                  readOnly
                  value={currentUser?.email || ''}
                />
              </div>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button disabled={saving} icon={Save} type="submit">
                {saving ? 'Saving...' : 'Update display name'}
              </Button>
              <Button icon={LogOut} onClick={handleLogout} type="button" variant="outline">
                Log out
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-white">Level progress</h2>
          <p className="mt-2 text-sm text-slate-400">
            {levelProgress.nextLevel
              ? `${levelProgress.remaining} XP to Level ${levelProgress.nextLevel}`
              : 'You have reached Level 10.'}
          </p>
          <ProgressBar className="mt-5" tone="green" value={levelProgress.percent} />
          <div className="mt-6 rounded-lg border border-cyber-line bg-white/[0.03] p-4 text-sm leading-6 text-slate-400">
            ScamRadar stores progress in Cloud Firestore. Generated messages are fictional and should not use real
            personal or banking details.
          </div>
        </Card>
      </div>
    </section>
  );
}
