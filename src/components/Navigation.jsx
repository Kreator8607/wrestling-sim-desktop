import { Link } from 'wouter';
import { Menu, Home, Play, History, Trophy, Settings, Zap, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Play, label: 'Booking', href: '/booking' },
    { icon: History, label: 'Histórico', href: '/history' },
    { icon: Trophy, label: 'Rankings', href: '/rankings' },
    { icon: Settings, label: 'Títulos', href: '/titles' },
    { icon: Zap, label: 'Auto Sim', href: '/auto-simulation' },
    { icon: AlertCircle, label: 'Lesões', href: '/injuries' },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-primary hover:text-primary/90 flex items-center gap-2">
              🎭 Pro Wrestling Sim
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors w-full"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
