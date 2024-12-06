import React from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/home/Hero';
import { ListingCard } from './components/listings/ListingCard';
import { ListingDetail } from './components/listings/ListingDetail';
import { NewListingForm } from './components/listings/NewListingForm';
import { SearchFilters } from './components/search/SearchFilters';
import { SignInForm } from './components/auth/SignInForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProfilePage } from './components/profile/ProfilePage';
import type { FilterOptions } from './types';

export default function App() {
  const [filters, setFilters] = React.useState<FilterOptions>({
    priceRange: [0, 2000],
    roomType: [],
    location: ''
  });

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Listings will be fetched and mapped here */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}