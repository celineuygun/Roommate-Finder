import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ListingCard } from './ListingCard';
import { ChatPortal } from '../chat/ChatPortal';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Listing } from '../../types';

export function SavedListingsPage() {
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

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
        console.error('Error fetching saved listings:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
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

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
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
        <h1 className="text-2xl font-bold mb-6">Saved Listings</h1>
        {savedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No saved listings yet.</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => (window.location.href = '/listings')}
            >
              Browse Listings
            </Button>
          </div>
        )}
      </main>

      <ChatPortal />
    </div>
  );
}
