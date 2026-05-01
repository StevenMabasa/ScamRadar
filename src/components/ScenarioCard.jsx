import {
  Bitcoin,
  BriefcaseBusiness,
  Gift,
  Fingerprint,
  Landmark,
  Mail,
  MessageCircle,
  Package,
  Radio,
  Share2,
  ShoppingBag,
  Smartphone,
  Terminal,
} from 'lucide-react';
import Badge from './Badge.jsx';
import Card from './Card.jsx';
import ThreatMeter from './ThreatMeter.jsx';

const categoryIcons = {
  'Phishing Email': Mail,
  'Fake SMS': Smartphone,
  'WhatsApp Scam': MessageCircle,
  'Fake Job Offer': BriefcaseBusiness,
  'Banking Scam': Landmark,
  'Delivery Scam': Package,
  'Marketplace Scam': ShoppingBag,
  'Giveaway Scam': Gift,
  'Crypto Scam': Bitcoin,
  'Social Media Scam': Share2,
};

function MessageFrame({ scenario }) {
  if (scenario.category === 'WhatsApp Scam') {
    return (
      <div className="rounded-lg border border-emerald-500/25 bg-emerald-950/30 p-4 shadow-success">
        <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-950/50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">{scenario.sender}</p>
          <span className="h-2 w-2 rounded-full bg-cyber-green shadow-success" />
        </div>
        <div className="ml-auto max-w-[92%] rounded-lg rounded-tr-sm border border-emerald-400/20 bg-emerald-600/25 p-4 text-sm leading-6 text-slate-100">
          {scenario.message}
        </div>
      </div>
    );
  }

  if (scenario.category === 'Fake SMS') {
    return (
      <div className="mx-auto max-w-md rounded-[2rem] border border-cyber-line bg-slate-950 p-4 shadow-glow">
        <div className="mx-auto mb-3 h-1 w-20 rounded-full bg-slate-700" />
        <div className="rounded-lg border border-cyber-line bg-slate-900 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyber-cyan">
            <Radio className="h-3.5 w-3.5" />
            {scenario.sender}
          </p>
          <p className="text-sm leading-6 text-slate-100">{scenario.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-frame relative overflow-hidden rounded-lg border border-cyber-line">
      <div className="scanline" />
      <div className="flex items-center gap-2 border-b border-cyber-line bg-cyber-ink/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-cyber-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyber-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyber-green" />
        <p className="ml-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Intercepted message</p>
      </div>
      <div className="border-b border-cyber-line p-4">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">From</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-100">{scenario.sender}</p>
        {scenario.subject ? (
          <>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Subject</p>
            <p className="mt-1 text-base font-semibold text-white">{scenario.subject}</p>
          </>
        ) : null}
      </div>
      <div className="p-5 text-sm leading-7 text-slate-200">{scenario.message}</div>
      {scenario.link ? (
        <div className="border-t border-cyber-line px-5 py-3">
          <p className="break-all font-mono text-xs text-cyber-cyan">{scenario.link}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function ScenarioCard({ scenario }) {
  const Icon = categoryIcons[scenario.category] || Mail;
  const difficultyTone =
    scenario.difficulty === 'Advanced' ? 'red' : scenario.difficulty === 'Intermediate' ? 'amber' : 'green';

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyber-cyan/10 to-transparent" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan shadow-glow">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Signal packet</p>
            <h2 className="text-xl font-black text-white">{scenario.category}</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="slate">
            <Fingerprint className="h-3.5 w-3.5" />
            {scenario.id.slice(-6).toUpperCase()}
          </Badge>
          <Badge tone="cyan">{scenario.category}</Badge>
          <Badge tone={difficultyTone}>{scenario.difficulty}</Badge>
        </div>
      </div>

      <div className="relative mt-6 grid gap-4 xl:grid-cols-[1fr_260px]">
        <MessageFrame scenario={scenario} />
        <div className="space-y-4">
          <ThreatMeter difficulty={scenario.difficulty} />
          <div className="rounded-lg border border-cyber-line bg-cyber-ink/70 p-4">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
              <Terminal className="h-3.5 w-3.5 text-cyber-green" />
              Classification
            </p>
            <p className="mt-2 text-lg font-black text-white">Pending</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Read the signal. Decide whether it is safe or scam.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
