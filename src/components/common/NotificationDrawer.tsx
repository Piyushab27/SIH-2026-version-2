import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Bell, Check, X } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead } = useDemo();
  
  if (!isOpen) return null;
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
      />
      
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-drawer-title"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-700" aria-hidden="true" />
            <h2 id="notification-drawer-title" className="font-extrabold text-slate-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500"
            aria-label="Close notification drawer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm font-medium">
              No notifications yet.
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id}
                className={`p-4 rounded-2xl border transition-all ${
                  !n.read 
                    ? 'bg-white border-emerald-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold text-sm ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${!n.read ? 'text-slate-600' : 'text-slate-500'}`}>
                      {n.message}
                    </p>
                  </div>
                  {!n.read && (
                    <button 
                      onClick={() => markNotificationRead(n.id)}
                      className="w-6 h-6 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-700 transition"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    </>
  );
};
