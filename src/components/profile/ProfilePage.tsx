import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProfileInfo } from './ProfileInfo';
import { UserListings } from './UserListings';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function ProfilePage() {
  const { logout } = useAuth();
  const { isLoading, error, profileData, updateProfile } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600">{error || 'Failed to load profile data'}</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200w">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center text-2xl font-bold text-blue-600">
              <img 
                  src="/site-icon.png" 
                  alt="Site Icon" 
                  className="w-8 h-8 mr-2"
                />
              RoommateFinder
            </a>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="secondary" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ProfileInfo
              user={profileData}
              onUpdateProfile={updateProfile}
            />
            </div>
          </div>

          {/* User Listings */}
          <div className="lg:col-span-2">
            <UserListings listings={profileData.listings || []} />
          </div>
        </div>
      </main>
    </div>
  );
}