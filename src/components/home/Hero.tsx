import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onSearch: (searchTerm: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="relative bg-slate-600">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Modern living room"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find Your Perfect Room <br />
          <span className="text-slate-200">and Ideal Roommate</span>
        </h1>
        
        <p className="mt-6 text-xl text-slate-100 max-w-3xl">
          Connect with like-minded people, find affordable accommodation, and make your
          next move easier. Perfect for young professionals and international students.
        </p>

        <div className="mt-10 max-w-xl">
          <form onSubmit={handleSubmit} className="bg-white p-3 rounded-lg shadow-lg flex">
            <input
              type="text"
              placeholder="Search by location, title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-0 focus:ring-0 px-4"
            />
            <Button type="submit" variant="primary">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}