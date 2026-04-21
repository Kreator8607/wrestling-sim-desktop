import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Menu, X, Home, Play, History, Trophy, Crown, Zap, AlertCircle, Settings, Search, Award, Users, BarChart3, HardDrive, Package } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Auto-collapse sidebar on small screens
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1200;
    }
    return true;
  });
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/', id: 'home' },
    { icon: Play, label: 'Booking', href: '/booking', id: 'booking' },
    { icon: History, label: 'Histórico', href: '/history', id: 'history' },
    { icon: Trophy, label: 'Rankings', href: '/rankings', id: 'rankings' },
    { icon: Crown, label: 'Títulos', href: '/titles', id: 'titles' },
    { icon: Zap, label: 'Auto Sim', href: '/auto-simulation', id: 'auto' },
    { icon: AlertCircle, label: 'Lesões', href: '/injuries', id: 'injuries' },
    { icon: Award, label: 'Achievements', href: '/achievements', id: 'achievements' },
    { icon: Users, label: 'Carreira', href: '/career-mode', id: 'career' },
    { icon: Users, label: 'Customização', href: '/customization', id: 'custom' },
    { icon: BarChart3, label: 'Estatísticas', href: '/advanced-stats', id: 'stats' },
    { icon: HardDrive, label: 'Backup', href: '/backup-recovery', id: 'backup' },
    { icon: Package, label: 'Conteúdo', href: '/content-management', id: 'content' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">🎭</span>
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">Pro Wrestling</p>
                  <p className="text-xs text-muted-foreground truncate">Sim v2.1</p>
                </div>
              )}
            </a>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.href}>
                <a
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors group relative"
                  title={!sidebarOpen ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 group-hover:text-primary transition-colors" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-secondary rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {item.label}
                    </div>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t border-border p-2">
          <Link href="/settings">
            <a
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
              title={!sidebarOpen ? 'Configurações' : ''}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Configurações</span>}
            </a>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex-1 mx-4 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar lutadores, eventos..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
