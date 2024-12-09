import React, { useState, useEffect } from 'react';
import { MapPin, Home, Calendar, ArrowLeft, Share2, Heart, Edit2, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../profile/Avatar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ListingPreferences } from './ListingPreferences';
import { ImageSlider } from './ImageSlider';
import { ChatWindow } from '../chat/ChatWindow';
import { useAuth } from '../../contexts/AuthContext';
import type { Listing, Message } from '../../types';

interface ListingDetailProps {
  listingId: string;
}

export function ListingDetail({ listingId }: ListingDetailProps) {
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);
  const [inquiries, setInquiries] = useState<Message[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Message | null>(null);

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

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!isOwner || !listing || !user) return;

      setIsLoadingInquiries(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages/listing/${listingId}/inquiries`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch inquiries');
        }

        const data = await response.json();
        setInquiries(data);
      } catch (err) {
        console.error('Error fetching inquiries:', err);
      } finally {
        setIsLoadingInquiries(false);
      }
    };

    if (showInquiries) {
      fetchInquiries();
    }
  }, [isOwner, listingId, listing, user, showInquiries]);

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
      <header className="top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
            <ImageSlider images={listing.images} />

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
                  ₺{listing.price}
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

              {isOwner ? (
                <Button
                  variant={showInquiries ? 'secondary' : 'primary'}
                  size="lg"
                  className="w-full mb-4 flex items-center justify-center relative"
                  onClick={() => {
                    setShowInquiries(!showInquiries);
                    setShowChat(false);
                    setSelectedInquiry(null);
                  }}
                >
                  {/* Simgeyi sola sabitledik */}
                  <MessageCircle className="absolute left-4 w-6 h-6" />
                  {/* Yazıyı ortaladık */}
                  <span>{showInquiries ? 'Hide Inquiries' : 'View Inquiries'}</span>
              </Button>
              
              ) : (
                <Button
                  variant={showChat ? 'secondary' : 'primary'}
                  size="lg"
                  className="w-full mb-4 flex items-center justify-center relative"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="absolute left-6 w-6 h-6" />
                  <span>{showChat ? 'Hide Chat' : 'Contact Host'}</span>
                </Button>
              )}

              {showInquiries && isOwner && (
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Recent Inquiries</h4>
                  {isLoadingInquiries ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : inquiries.length === 0 ? (
                    <p className="text-gray-500 text-center">No inquiries yet</p>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inquiry) => (
                        <div
                          key={inquiry._id}
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedInquiry?._id === inquiry._id
                              ? 'bg-blue-50'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <div className="flex items-center mb-2">
                            <Avatar
                              src={inquiry.sender.avatar}
                              alt={inquiry.sender.name}
                              size="sm"
                            />
                            <div className="ml-3">
                              <p className="font-medium">{inquiry.sender.name}</p>
                              <p className="text-sm text-gray-500">
                                {inquiry.sender.occupation}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {inquiry.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {((showChat && !isOwner) || (selectedInquiry && isOwner)) && (
                <div className="mt-6">
                  <ChatWindow
                    otherUser={isOwner ? selectedInquiry!.sender : listing.host}
                    listingId={listingId}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}