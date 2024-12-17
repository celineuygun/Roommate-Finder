import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { ListingCard } from './ListingCard';
import type { Listing } from '../../types';

interface SavedListingsProps {
  listings: Listing[];
}

export function SavedListings({ listings }: SavedListingsProps) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Saved Listings</h2>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
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
            className="inline-flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Listings
          </Button>
        </div>
      )}
    </div>
  );
}
