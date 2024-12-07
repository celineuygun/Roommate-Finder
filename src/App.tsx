import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/home/Hero';
import { ListingCard } from './components/listings/ListingCard';
import { ListingDetail } from './components/listings/ListingDetail';
import { NewListingForm } from './components/listings/NewListingForm';
import { SearchFilters } from './components/search/SearchFilters';
import { SignInForm } from './components/auth/SignInForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProfilePage } from './components/profile/ProfilePage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import type { FilterOptions, Listing } from './types';

export default function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 5000],
    roomType: [],
    location: ''
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Simple client-side routing
  const path = window.location.pathname;
  const listingMatch = path.match(/^\/listing\/(.+)$/);

  if (listingMatch) {
    const listingId = listingMatch[1];
    return <ListingDetail listingId={listingId} />;
  }

  if (path === '/signin') {
    return <SignInForm />;
  }

  if (path === '/register') {
    return <RegisterForm />;
  }

  if (path === '/profile') {
    return <ProfilePage />;
  }

  if (path === '/new-listing') {
    return <NewListingForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}