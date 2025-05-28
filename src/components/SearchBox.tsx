import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useFilter } from '@/context/FilterContext';
import debounce from 'lodash/debounce';

const SearchBox = () => {
  const { searchQuery, handleSearch } = useFilter();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Create a debounced version of handleSearch
  const debouncedSearch = debounce((value: string) => {
    handleSearch(value);
  }, 300);

  useEffect(() => {
    // Update local search when searchQuery changes from outside
    if (searchQuery !== localSearch) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localSearch);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    // Trigger debounced search
    debouncedSearch(value);
  };

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

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