import React, { useState, useEffect } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProfileInfo } from './ProfileInfo';
import { UserListings } from '../listings/UserListings';
import { ListingCard } from '../listings/ListingCard';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ChatPortal } from '../chat/ChatPortal';
import type { Listing } from '../../types';

export function ProfilePage() {
  const { logout } = useAuth();
  const { isLoading, error, profileData, updateProfile } = useProfile();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [errorListings, setErrorListings] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/listings/saved-listings', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`Failed to fetch saved listings: ${response.statusText}`);

        const data = await response.json();
        setSavedListings(data);
      } catch (err) {
        setErrorListings(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchSavedListings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-400">{error || 'Failed to load profile data'}</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center text-2xl font-bold text-blue-600 dark:text-slate-200">
              <img 
                  src="/site-icon.png" 
                  alt="Site Icon" 
                  className="w-8 h-8 mr-2"
                />
              RoommateFinder
            </a>
            <div className="flex items-center space-x-2">
              <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.location.href = '/settings'}
                  className="flex items-center"
                >
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={logout}
                  className="flex items-center"
                >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
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

          {/* Saved Listings */}
          <div className="lg:col-span-3 mt-8">
            <div className="bg-white dark:bg-slate-950 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Saved Listings</h2>
              </div>

              {savedListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't saved any listings yet.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/listings'}
                  >
                    Browse Listings
                  </Button>
                </div>
              )}
            </div>
            </div>
          </div>
      </main>
      <ChatPortal/>
    </div>
  );
}