import { useState, useEffect } from 'react';
import { Bell, X, Trophy, AlertCircle, CheckCircle, Zap, Heart } from 'lucide-react';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : [
    {
      id: 1,
      type: 'achievement',
      title: 'Primeiro Evento Criado!',
      message: 'Você criou seu primeiro evento de wrestling',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      icon: Trophy,
    },
    {
      id: 2,
      type: 'title_change',
      title: 'Novo Campeão!',
      message: 'Roman Reigns é o novo WWE Champion',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
      icon: Heart,
    },
    {
      id: 3,
      type: 'injury',
      title: 'Lutador Lesionado',
      message: 'John Cena sofreu uma lesão e estará fora por 30 dias',
      timestamp: new Date(Date.now() - 1 * 3600000),
      read: true,
      icon: AlertCircle,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    // Persist notifications
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }, [notifications]);

  const handleMarkAsRead = (id) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
  };

  const handleDelete = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'achievement':
        return 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30';
      case 'title_change':
        return 'from-red-500/10 to-pink-500/10 border-red-500/30';
      case 'injury':
        return 'from-orange-500/10 to-red-500/10 border-orange-500/30';
      case 'milestone':
        return 'from-green-500/10 to-emerald-500/10 border-green-500/30';
      default:
        return 'from-blue-500/10 to-purple-500/10 border-blue-500/30';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
        title="Notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-bold">Notificações</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Marcar tudo como lido
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${getNotificationColor(notif.type).split(' ')[0]} ${getNotificationColor(notif.type).split(' ')[1]}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm">{notif.title}</h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notif.id);
                              }}
                              className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTime(notif.timestamp)}
                          </p>
                        </div>

                        {!notif.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border text-center">
              <button className="text-xs text-primary hover:underline">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
