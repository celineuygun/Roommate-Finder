import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { cities, districts } from '../../utils/locations';
import type { FilterOptions, LifestylePreference } from '../../types';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

type LifestyleKey = keyof Pick<FilterOptions['preferences'], 'smoking' | 'pets' | 'nightLife'>;

const lifestylePreferences: { key: LifestyleKey; label: string }[] = [
  { key: 'smoking', label: 'Smoking Allowed' },
  { key: 'pets', label: 'Pet Friendly' },
  { key: 'nightLife', label: 'Night Life Friendly' }
];

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const [selectedCity, setSelectedCity] = useState('');

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onFilterChange({
      ...filters,
      location: city ? city : ''
    });
  };

  const handleDistrictChange = (district: string) => {
    onFilterChange({
      ...filters,
      location: district ? `${district}, ${selectedCity}` : selectedCity
    });
  };

  const handleClear = () => {
    setSelectedCity('');
    onFilterChange({
      priceRange: [0, 5000],
      roomType: [],
      location: '',
      preferences: {
        smoking: null,
        pets: null,
        nightLife: null,
        gender: 'any',
        ageRange: [18, 99],
        occupation: 'any'
      }
    });
  };

  const handleLifestyleChange = (key: LifestyleKey, value: boolean) => {
    onFilterChange({
      ...filters,
      preferences: {
        ...filters.preferences,
        [key]: value ? true : null
      }
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="outline" size="sm" onClick={handleClear}>
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="space-y-2">
            <select
              className="w-full px-3 py-2 text-sm border rounded-md"
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            {selectedCity && (
              <select
                className="w-full px-3 py-2 text-sm border rounded-md"
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                <option value="">Select District</option>
                {districts[selectedCity]?.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (₺)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <input
                type="number"
                className="w-full px-3 py-2 text-sm border rounded-md"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    priceRange: [Number(e.target.value), filters.priceRange[1]]
                  })
                }
              />
            </div>
            <div className="w-full">
              <input
                type="number"
                className="w-full px-3 py-2 text-sm border rounded-md"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], Number(e.target.value)]
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type
          </label>
          <div className="space-y-2">
            {['private', 'shared'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.roomType.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filters.roomType, type]
                      : filters.roomType.filter((t) => t !== type);
                    onFilterChange({ ...filters, roomType: newTypes });
                  }}
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences</h4>
          
          {/* Gender */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <select
              className="w-full px-3 py-2 text-sm border rounded-md"
              value={filters.preferences.gender}
              onChange={(e) => onFilterChange({
                ...filters,
                preferences: {
                  ...filters.preferences,
                  gender: e.target.value as FilterOptions['preferences']['gender']
                }
              })}
            >
              <option value="any">Any</option>
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
            </select>
          </div>

          {/* Age Range */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Age Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className="w-full px-3 py-2 text-sm border rounded-md"
                placeholder="Min Age"
                min="18"
                max="99"
                value={filters.preferences.ageRange[0]}
                onChange={(e) => onFilterChange({
                  ...filters,
                  preferences: {
                    ...filters.preferences,
                    ageRange: [Number(e.target.value), filters.preferences.ageRange[1]]
                  }
                })}
              />
              <input
                type="number"
                className="w-full px-3 py-2 text-sm border rounded-md"
                placeholder="Max Age"
                min="18"
                max="99"
                value={filters.preferences.ageRange[1]}
                onChange={(e) => onFilterChange({
                  ...filters,
                  preferences: {
                    ...filters.preferences,
                    ageRange: [filters.preferences.ageRange[0], Number(e.target.value)]
                  }
                })}
              />
            </div>
          </div>

          {/* Occupation */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Occupation</label>
            <select
              className="w-full px-3 py-2 text-sm border rounded-md"
              value={filters.preferences.occupation}
              onChange={(e) => onFilterChange({
                ...filters,
                preferences: {
                  ...filters.preferences,
                  occupation: e.target.value as FilterOptions['preferences']['occupation']
                }
              })}
            >
              <option value="any">Any</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Lifestyle */}
          <div className="space-y-2">
            {lifestylePreferences.map(({ key, label }) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.preferences[key] === true}
                  onChange={(e) => handleLifestyleChange(key, e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}