import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CircleDollarSign,
  Eye,
  Flag,
  ListChecks,
  Radar,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import RadarDisplay from '../components/RadarDisplay.jsx';

const features = [
  { title: 'Realistic scam scenarios', icon: ShieldAlert },
  { title: 'Instant feedback', icon: BadgeCheck },
  { title: 'XP and levels', icon: Sparkles },
  { title: 'Leaderboard', icon: Trophy },
  { title: 'Cyber safety tips', icon: BookOpen },
];

const steps = [
  { title: 'Read the message', icon: Eye },
  { title: 'Decide Safe or Scam', icon: Flag },
  { title: 'Learn from the red flags', icon: ListChecks },
  { title: 'Improve your scam detection score', icon: TrendingUp },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-cyber-line">
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <div className="absolute inset-0 matrix-noise opacity-40" />
        <RadarDisplay className="pointer-events-none absolute right-[-5rem] top-10 hidden w-[min(48rem,72vw)] opacity-60 md:block" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cyber-ink to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Badge tone="green">Mission ready - simulated threats only</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              Can You Spot the Scam?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Train yourself to identify phishing emails, fake SMS messages, WhatsApp scams, fake job offers,
              banking scams, and online fraud.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button icon={ArrowRight} size="lg">
                  Start Training
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button icon={Radar} size="lg" variant="outline">
                  View Demo
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-cyber-green/30 bg-cyber-ink/78 p-4 backdrop-blur">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Threat feed</p>
              <p className="mt-2 text-2xl font-black text-cyber-green">Live</p>
            </div>
            <div className="rounded-lg border border-cyber-cyan/30 bg-cyber-ink/78 p-4 backdrop-blur">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Categories</p>
              <p className="mt-2 text-2xl font-black text-cyber-cyan">10</p>
            </div>
            <div className="rounded-lg border border-cyber-red/30 bg-cyber-ink/78 p-4 backdrop-blur">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Drill type</p>
              <p className="mt-2 text-2xl font-black text-cyber-red">Scam or Safe</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-5 transition hover:-translate-y-1 hover:border-cyber-cyan/50">
                <Icon className="h-6 w-6 text-cyber-cyan" />
                <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
                <div className="mt-5 flex gap-1">
                  <span className="h-1.5 flex-1 rounded-full bg-cyber-cyan" />
                  <span className="h-1.5 flex-1 rounded-full bg-cyber-green" />
                  <span className="h-1.5 flex-1 rounded-full bg-white/10" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-cyber-line bg-cyber-panel/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge tone="cyan">How it works</Badge>
            <h2 className="mt-4 text-3xl font-black text-white">Short drills. Clear feedback. Better instincts.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} className="p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-cyber-green" />
                    <span className="text-sm font-black text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-cyber-green/30 bg-cyber-green/10 text-cyber-green">
            <CircleDollarSign className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Free to build and deploy</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              ScamRadar uses a frontend-only architecture with Firebase Authentication, Cloud Firestore on the Spark
              plan, and Netlify deployment.
            </p>
          </div>
          <Link to="/learn">
            <Button variant="outline">Explore Lessons</Button>
          </Link>
        </Card>
      </section>

      <footer className="border-t border-cyber-line px-4 py-8 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-300">ScamRadar</p>
        <p className="mt-2">
          ScamRadar is an educational cybersecurity awareness tool. It is not a replacement for professional security
          advice.
        </p>
      </footer>
    </>
  );
}
