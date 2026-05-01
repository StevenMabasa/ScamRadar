import { Lock, Mail, UserPlus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, firebaseReady } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      toast.success('Account created');
      navigate('/play', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-lg p-6">
        <h1 className="text-3xl font-black text-white">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">Track XP, streaks, badges, and leaderboard progress.</p>

        {!firebaseReady ? (
          <div className="mt-5 rounded-lg border border-cyber-amber/30 bg-cyber-amber/10 p-4 text-sm text-cyber-amber">
            Firebase environment variables are not configured yet.
          </div>
        ) : null}

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Full name</span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-cyber-line bg-slate-950 px-3">
              <UserPlus className="h-4 w-4 text-slate-500" />
              <input
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                onChange={(event) => updateField('displayName', event.target.value)}
                placeholder="Your name"
                required
                value={form.displayName}
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">Email</span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-cyber-line bg-slate-950 px-3">
              <Mail className="h-4 w-4 text-slate-500" />
              <input
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Password</span>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-cyber-line bg-slate-950 px-3">
                <Lock className="h-4 w-4 text-slate-500" />
                <input
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Password"
                  required
                  type="password"
                  value={form.password}
                />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Confirm password</span>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-cyber-line bg-slate-950 px-3">
                <Lock className="h-4 w-4 text-slate-500" />
                <input
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  placeholder="Confirm"
                  required
                  type="password"
                  value={form.confirmPassword}
                />
              </div>
            </label>
          </div>

          <Button className="w-full" disabled={submitting} icon={UserPlus} type="submit">
            {submitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Already registered?{' '}
          <Link className="text-cyber-cyan hover:text-cyan-200" to="/login">
            Log in
          </Link>
        </p>
      </Card>
    </section>
  );
}
