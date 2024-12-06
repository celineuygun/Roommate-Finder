import React, { useState, useEffect } from 'react';
import { MapPin, Home, Calendar, ArrowLeft, Share2, Heart, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../profile/Avatar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ListingPreferences } from './ListingPreferences';
import { useAuth } from '../../contexts/AuthContext';
import type { Listing } from '../../types';

interface ListingDetailProps {
  listingId: string;
}

export function ListingDetail({ listingId }: ListingDetailProps) {
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?._id === listing?.host._id;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/listings/${listingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      window.location.href = '/profile';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete listing');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Listing</h2>
          <p className="text-gray-600">{error || 'Listing not found'}</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Listings
            </button>
            <div className="flex space-x-2">
              {isOwner ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/listing/${listingId}/edit`}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Listing Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {listing.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Home className="w-5 h-5 mr-2" />
                  <span className="capitalize">{listing.roomType} Room</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Available from {new Date(listing.availableFrom).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <p className="text-gray-600">{listing.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center text-gray-600"
                    >
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Roommate Preferences Section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">Roommate Preferences</h2>
                <ListingPreferences preferences={listing.preferences} />
              </div>
            </div>
          </div>

          {/* Contact and Host Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  ${listing.price}
                  <span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
              </div>

              {/* Host Information */}
              <div className="mb-6 text-center">
                <Avatar
                  src={listing.host.avatar}
                  alt={listing.host.name}
                  size="lg"
                />
                <h3 className="font-semibold text-lg mt-4">{listing.host.name}</h3>
                <p className="text-gray-600">{listing.host.occupation}</p>
              </div>

              {!isOwner && (
                <>
                  <Button variant="primary" size="lg" className="w-full mb-4">
                    Contact Host
                  </Button>

                  <Button variant="outline" size="lg" className="w-full">
                    Schedule Viewing
                  </Button>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    Usually responds within 24 hours
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}