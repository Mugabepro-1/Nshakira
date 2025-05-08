import { ChangeEvent, FormEvent, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchInput = ({ 
  onSearch, 
  placeholder = 'Search...', 
  initialValue = '' 
}: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
      <button 
        type="submit"
        className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 hover:text-gray-700"
      >
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchInput;