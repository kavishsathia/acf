"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 border-2 border-swiss-black bg-white hover:bg-swiss-red hover:border-swiss-red transition-all flex items-center justify-center group"
        aria-label="Profile menu"
      >
        <User className="w-6 h-6 text-swiss-black group-hover:text-white transition-colors" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-swiss-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
          <div className="py-2">
            <button
              disabled
              className="w-full px-4 py-3 text-left font-mono text-sm uppercase tracking-wider text-swiss-black/40 cursor-not-allowed flex items-center gap-3 border-b border-swiss-black/10"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 text-left font-mono text-sm uppercase tracking-wider text-swiss-black hover:bg-swiss-red hover:text-white transition-colors flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
