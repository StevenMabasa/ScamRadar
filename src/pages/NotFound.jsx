import { Home, Radar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
          <Radar className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-4xl font-black text-white">404</h1>
        <p className="mt-3 text-slate-400">That signal is off the map.</p>
        <Link className="mt-6 inline-block" to="/">
          <Button icon={Home}>Go Home</Button>
        </Link>
      </Card>
    </section>
  );
}
