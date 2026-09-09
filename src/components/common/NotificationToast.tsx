import React, { useEffect, useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, Bell, CheckCircle2, AlertCircle } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, markNotificationRead } = useDemo();
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

  useEffect(() => {
    // Find unread notifications that haven't been shown yet
    const newUnread = notifications.filter(n => !n.read && !visibleToasts.includes(n.id));
    
    if (newUnread.length > 0) {
      const newIds = newUnread.map(n => n.id);
      setVisibleToasts(prev => [...prev, ...newIds]);

      // Auto-dismiss after 5 seconds
      newIds.forEach(id => {
        setTimeout(() => {
          setVisibleToasts(prev => prev.filter(toastId => toastId !== id));
        }, 5000);
      });
    }
  }, [notifications, visibleToasts]);

  const dismissToast = (id: string) => {
    setVisibleToasts(prev => prev.filter(toastId => toastId !== id));
    markNotificationRead(id);
  };

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {visibleToasts.map(id => {
        const notification = notifications.find(n => n.id === id);
        if (!notification) return null;

        return (
          <div 
            key={id} 
            className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200 min-w-[300px] max-w-[350px] animate-in slide-in-from-right flex gap-3 items-start"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              notification.title.toLowerCase().includes('emergency') || notification.title.toLowerCase().includes('alert')
                ? 'bg-rose-100 text-rose-600'
                : notification.title.toLowerCase().includes('success') || notification.title.toLowerCase().includes('confirmed')
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-blue-100 text-blue-600'
            }`}>
              {notification.title.toLowerCase().includes('emergency') || notification.title.toLowerCase().includes('alert') ? (
                <AlertCircle className="w-4 h-4" />
              ) : notification.title.toLowerCase().includes('success') || notification.title.toLowerCase().includes('confirmed') ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">{notification.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{notification.message}</p>
            </div>
            <button 
              onClick={() => dismissToast(id)}
              className="text-slate-400 hover:text-slate-600 transition p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
