import React from 'react';
import { X, LogIn, UserPlus, LogOut, User, PlusCircle, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../profile/Avatar';
import type { User as UserType } from '../../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: UserType | null;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, onClose, isAuthenticated, user, onLogout }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="fixed right-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-950 flex flex-col">
        <div className="p-4 flex justify-end">
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {isAuthenticated && user && (
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="sm"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-4 space-y-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={() => window.location.href = '/profile'}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={() => window.location.href = '/new-listing'}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Listing
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={() => window.location.href = '/signin'}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={() => window.location.href = '/register'}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Button>
            </>
          )}
        </div>
        {/* Settings Button at the Bottom */}
        {isAuthenticated && (
          <div className="p-4 border-t border-gray-200 mt-auto">
            <Button 
              variant="primary" 
              size="sm"
              className="w-full flex items-center justify-center"
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}