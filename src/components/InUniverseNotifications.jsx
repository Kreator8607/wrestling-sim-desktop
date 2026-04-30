import { useState, useEffect } from 'react';
import { Bell, X, Trophy, AlertCircle, Zap, Users } from 'lucide-react';

export default function InUniverseNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulated notifications
  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Auto-dismiss after 5 seconds if not opened
    setTimeout(() => {
      if (!isOpen) {
        dismissNotification(newNotif.id);
      }
    }, 5000);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'title_change':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'injury':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'achievement':
        return <Zap className="w-5 h-5 text-blue-400" />;
      case 'match_result':
        return <Users className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'title_change':
        return 'border-l-4 border-yellow-500 bg-yellow-900 bg-opacity-30';
      case 'injury':
        return 'border-l-4 border-red-500 bg-red-900 bg-opacity-30';
      case 'achievement':
        return 'border-l-4 border-blue-500 bg-blue-900 bg-opacity-30';
      case 'match_result':
        return 'border-l-4 border-purple-500 bg-purple-900 bg-opacity-30';
      default:
        return 'border-l-4 border-gray-500 bg-gray-900 bg-opacity-30';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-300 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border-2 border-red-600 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gray-800 border-b border-red-600 p-4 flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Notifications
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-800 ${getNotificationColor(notif.type)} ${
                    !notif.read ? 'bg-opacity-50' : ''
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{notif.title}</p>
                      <p className="text-gray-300 text-xs mt-1">{notif.message}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {notif.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notif.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Toast Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 pointer-events-none">
        {notifications.slice(0, 3).map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto p-4 rounded-lg border-l-4 bg-opacity-90 backdrop-blur-sm flex items-start gap-3 animate-slide-in ${getNotificationColor(notif.type)}`}
          >
            {getNotificationIcon(notif.type)}
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{notif.title}</p>
              <p className="text-gray-300 text-xs">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Test Button (for demo) */}
      <button
        onClick={() =>
          addNotification({
            type: 'title_change',
            title: 'Championship Change!',
            message: 'John Cena won the WWE Championship!',
          })
        }
        className="hidden"
        id="test-notif"
      >
        Test
      </button>
    </div>
  );
}
