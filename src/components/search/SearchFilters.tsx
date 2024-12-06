import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import type { FilterOptions } from '../../types';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <input
                type="number"
                className="w-full px-2 py-2 text-sm border rounded-md"
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
                className="w-full px-2 py-2 text-sm border rounded-md"
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
                <span className="ml-2 text-gray-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter location"
            value={filters.location}
            onChange={(e) =>
              onFilterChange({ ...filters, location: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}