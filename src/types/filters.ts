import type { ListingPreferences } from './preferences';

export type LifestylePreference = 'smoking' | 'pets' | 'nightLife';

export interface FilterOptions {
  priceRange: [number, number];
  roomType: string[];
  location: string;
  preferences: {
    smoking: boolean | null;
    pets: boolean | null;
    nightLife: boolean | null;
    gender: ListingPreferences['gender'];
    ageRange: ListingPreferences['ageRange'];
    occupation: ListingPreferences['occupation'];
  };
}