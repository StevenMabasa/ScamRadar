import { Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ForgotPassword() {
  const { resetPassword, firebaseReady } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await resetPassword(email);
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error(error.message || 'Could not send reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-md p-6">
        <h1 className="text-3xl font-black text-white">Reset password</h1>
        <p className="mt-2 text-sm text-slate-400">Send a reset link to your account email.</p>

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

          <Button className="w-full" disabled={submitting} icon={Mail} type="submit">
            {submitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        <Link className="mt-5 inline-block text-sm text-cyber-cyan hover:text-cyan-200" to="/login">
          Back to login
        </Link>
      </Card>
    </section>
  );
}
