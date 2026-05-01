import { Mail, Lock, LogIn } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function friendlyError(error) {
  if (error.message.includes('Firebase is not configured')) return error.message;
  if (error.code === 'auth/invalid-credential') return 'Check your email and password, then try again.';
  return error.message || 'Something went wrong. Please try again.';
}

export default function Login() {
  const { login, firebaseReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(friendlyError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-md p-6">
        <h1 className="text-3xl font-black text-white">Log in</h1>
        <p className="mt-2 text-sm text-slate-400">Continue your scam detection training.</p>

        {!firebaseReady ? (
          <div className="mt-5 rounded-lg border border-cyber-amber/30 bg-cyber-amber/10 p-4 text-sm text-cyber-amber">
            Firebase environment variables are not configured yet.
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Email</span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-cyber-line bg-slate-950 px-3">
              <Mail className="h-4 w-4 text-slate-500" />
              <input
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">Password</span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-cyber-line bg-slate-950 px-3">
              <Lock className="h-4 w-4 text-slate-500" />
              <input
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                required
                type="password"
                value={password}
              />
            </div>
          </label>

          <Button className="w-full" disabled={submitting} icon={LogIn} type="submit">
            {submitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link className="text-cyber-cyan hover:text-cyan-200" to="/forgot-password">
            Forgot password?
          </Link>
          <Link className="text-slate-400 hover:text-white" to="/register">
            Create account
          </Link>
        </div>
      </Card>
    </section>
  );
}
