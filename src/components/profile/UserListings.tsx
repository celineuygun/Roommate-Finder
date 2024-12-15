import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { ListingCard } from '../listings/ListingCard';
import type { Listing } from '../../types';

interface UserListingsProps {
  listings: Listing[];
}

export function UserListings({ listings }: UserListingsProps) {
  return (
    <div className="bg-white dark:bg-slate-950  rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Listings</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/new-listing'}
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Add New Listing</span>
        </Button>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-slate-900  rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You haven't created any listings yet.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/new-listing'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Listing
          </Button>
        </div>
      )}
    </div>
  );
}