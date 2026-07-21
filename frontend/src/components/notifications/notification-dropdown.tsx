'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Info, AlertTriangle, AlertCircle, CheckCircle2, Check } from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';
import { fetchWithAuth } from '@/lib/api-client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  is_read: boolean;
  created_at: string;
}

export function NotificationDropdown() {
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchNotifications();
      // Polling every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [profile?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      if (!profile?.id) return;
      const res = await fetchWithAuth(`/notifications/${profile.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetchWithAuth(`/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'alert': return <AlertCircle size={16} className="text-red-500" />;
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-primary" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center"
      >
        <Bell size={20} className="group-hover:animate-wiggle" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 max-h-[400px] bg-surface/95 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col anim-scale-in">
          <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest/50">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant flex flex-col items-center opacity-70">
                <Bell size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No new notifications.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors cursor-pointer group flex gap-3 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notif.is_read ? 'font-semibold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                          {notif.title}
                        </h4>
                      </div>
                      <p className={`text-xs ${!notif.is_read ? 'text-on-surface-variant' : 'text-on-surface-variant/70'}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-on-surface-variant/60 mt-2 block">
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    {!notif.is_read && (
                      <button 
                        onClick={(e) => markAsRead(notif.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-primary hover:bg-primary/10 rounded-full h-fit"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
