export interface UserPreferences {
  smoking: boolean;
  pets: boolean;
  nightLife: boolean;
}

export interface ListingPreferences extends UserPreferences {
  gender: 'any' | 'male' | 'female';
  ageRange: [number, number];
  occupation: 'any' | 'student' | 'professional';
}