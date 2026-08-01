"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center"
      >
        <Bell size={20} className="group-hover:animate-shake" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface shadow-[0_0_8px_rgba(var(--color-error),0.6)] animate-pulse" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface border border-outline-variant/30 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container/50">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <div className="p-4 border-b border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer">
              <p className="text-sm font-medium">Welcome to EduScheduler</p>
              <p className="text-xs text-on-surface-variant mt-1">Your AI Campus OS is ready to use.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
