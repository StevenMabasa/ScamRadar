import {
  BookOpen,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Play,
  Radar,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './Button.jsx';

const links = [
  { to: '/', label: 'Home', icon: Home, public: true },
  { to: '/play', label: 'Play', icon: Play, protected: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy, public: true },
  { to: '/learn', label: 'Learn', icon: BookOpen, public: true },
  { to: '/profile', label: 'Profile', icon: User, protected: true },
];

function NavItem({ link, onClick }) {
  const Icon = link.icon;
  return (
    <NavLink
      to={link.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive ? 'bg-cyber-cyan/12 text-cyber-cyan' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {link.label}
    </NavLink>
  );
}

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const visibleLinks = links.filter((link) => !link.protected || currentUser);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cyber-cyan/20 bg-cyber-ink/92 backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan shadow-glow">
            <Radar className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-black tracking-wide">ScamRadar</span>
            <span className="block font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Threat trainer</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {visibleLinks.map((link) => (
            <NavItem key={link.to} link={link} />
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {currentUser ? (
            <Button icon={LogOut} onClick={handleLogout} variant="outline">
              Logout
            </Button>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="ghost">Login</Button>
              </NavLink>
              <NavLink to="/register">
                <Button>Register</Button>
              </NavLink>
            </>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cyber-line text-slate-200 lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-cyber-line bg-cyber-panel px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <NavItem key={link.to} link={link} onClick={() => setIsOpen(false)} />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {currentUser ? (
              <Button className="w-full" icon={LogOut} onClick={handleLogout} variant="outline">
                Logout
              </Button>
            ) : (
              <>
                <NavLink className="flex-1" to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Login
                  </Button>
                </NavLink>
                <NavLink className="flex-1" to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Register</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
