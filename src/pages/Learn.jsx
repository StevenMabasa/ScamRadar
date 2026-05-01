import { BookOpen, Lightbulb, ShieldCheck } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import { lessons } from '../data/lessons';

export default function Learn() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <Badge tone="green">Cyber safety lessons</Badge>
        <h1 className="mt-4 text-4xl font-black text-white">Build safer habits one pattern at a time.</h1>
        <p className="mt-4 text-slate-400">
          Beginner-friendly lessons for spotting fake links, pressure tactics, payment tricks, and impersonation scams.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {lessons.map((lesson) => (
          <Card key={lesson.title} className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{lesson.explanation}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-cyber-line bg-white/[0.03] p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-cyber-amber">
                  <Lightbulb className="h-4 w-4" />
                  Example
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{lesson.example}</p>
              </div>
              <div className="rounded-lg border border-cyber-line bg-white/[0.03] p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-cyber-green">
                  <ShieldCheck className="h-4 w-4" />
                  Safety tip
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{lesson.tip}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-5 text-sm leading-6 text-slate-400">
        ScamRadar is an educational cybersecurity awareness tool. It is not a replacement for professional security
        advice. All examples are fictional and simulated.
      </Card>
    </section>
  );
}
