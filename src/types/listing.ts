import type { ListingPreferences } from './preferences';
import type { User } from './user';

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
  host: User;
}