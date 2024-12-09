import React, { useState } from 'react';
import { Search, Menu, User, LogIn, UserPlus, LogOut, PlusCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../profile/Avatar';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center text-2xl font-bold text-blue-600">
            <img 
                src="src/components/img/site-icon.png" 
                alt="Site Icon" 
                className="w-8 h-8 mr-2"
              />
              RoommateFinder
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.location.href = '/new-listing'}
                  className="flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
                <a 
                  href="/profile" 
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <Avatar
                    src={user?.avatar}
                    alt={user?.name || 'User'}
                    size="sm"
                  />
                  <span className="ml-2">{user?.name}</span>
                </a>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={logout}
                  className="flex items-center"
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
                  onClick={() => window.location.href = '/signin'}
                  className="flex items-center"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.location.href = '/register'}
                  className="flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />
    </header>
  );
}