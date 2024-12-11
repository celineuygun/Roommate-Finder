import React from 'react';
import { User, Calendar, Briefcase } from 'lucide-react';
import type { Listing } from '../../types';

interface ListingPreferencesProps {
  preferences: Listing['preferences'];
}

export function ListingPreferences({ preferences }: ListingPreferencesProps) {
  const formatGender = (gender: string) => {
    if (gender === 'any') return 'Any gender';
    return `${gender.charAt(0).toUpperCase() + gender.slice(1)} only`;
  };

  const formatOccupation = (occupation: string) => {
    if (occupation === 'any') return 'Any occupation';
    return `${occupation.charAt(0).toUpperCase() + occupation.slice(1)}s preferred`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Looking for</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            {formatGender(preferences.gender)}
          </li>
          <li className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Age {preferences.ageRange[0]} - {preferences.ageRange[1]} years
          </li>
          <li className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2" />
            {formatOccupation(preferences.occupation)}
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">House Rules</h3>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className={`w-2 h-2 rounded-full mr-2 ${preferences.smoking ? 'bg-green-500' : 'bg-red-500'}`} />
            {preferences.smoking ? 'Smoking allowed' : 'No smoking'}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className={`w-2 h-2 rounded-full mr-2 ${preferences.pets ? 'bg-green-500' : 'bg-red-500'}`} />
            {preferences.pets ? 'Pets allowed' : 'No pets'}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <span className={`w-2 h-2 rounded-full mr-2 ${preferences.nightLife ? 'bg-green-500' : 'bg-red-500'}`} />
            {preferences.nightLife ? 'Night life friendly' : 'Quiet living preferred'}
          </div>
        </div>
      </div>
    </div>
  );
}