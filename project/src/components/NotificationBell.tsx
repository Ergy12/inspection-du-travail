import React from 'react';
import { Bell } from 'lucide-react';
import type { Invitation } from '../types';

interface NotificationBellProps {
  invitations: Invitation[];
  onClick: () => void;
}

export function NotificationBell({ invitations, onClick }: NotificationBellProps) {
  const unreadCount = invitations.filter(inv => !inv.isRead).length;

  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <Bell className="h-6 w-6 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
}