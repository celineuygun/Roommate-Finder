import type { UserPreferences } from './preferences';
import type { Listing } from './listing';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  bio?: string;
  preferences: UserPreferences;
  avatar?: string;
  listings?: Listing[];
  savedListings?: Listing[];
}