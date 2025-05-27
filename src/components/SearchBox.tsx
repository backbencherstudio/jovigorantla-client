import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useFilter } from '@/context/FilterContext';

const SearchBox = () => {
  const { searchQuery, handleSearch } = useFilter();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localSearch);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    // If search is cleared, update filters immediately
    if (!value.trim()) {
      handleSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={localSearch}
        onChange={handleChange}
        placeholder="Search listings..."
        className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    </form>
  );
};

export default SearchBox; 