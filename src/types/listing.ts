import type { ListingPreferences } from './preferences';

export interface Listing {
  _id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  amenities: string[];
  description: string;
  roomType: 'private' | 'shared';
  availableFrom: string;
  createdAt: string;
  preferences: ListingPreferences;
  host: {
    _id: string;
    name: string;
    avatar: string;
    occupation: string;
  };
}