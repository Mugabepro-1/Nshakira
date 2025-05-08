import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import itemsService from '../../services/itemsService';
import Card from '../../components/common/Card';
import SearchInput from '../../components/common/SearchInput';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface LostItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  lostDate: string;
  contactInfo: string;
  imageUrl: string | null;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface LostItemsResponse {
  content: LostItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const LostItems = () => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'All Categories',
    'Electronics',
    'Jewelry',
    'Clothing',
    'Documents',
    'Keys',
    'Bags',
    'Wallets',
    'Books',
    'Other',
  ];

  useEffect(() => {
    const fetchLostItems = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: 12,
          sort: 'createdAt,desc',
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await itemsService.getLostItems(params);
        const data = response as LostItemsResponse;
        
        // If category filter is active, filter the results client-side
        let filteredItems = data.content;
        if (selectedCategory && selectedCategory !== 'All Categories') {
          filteredItems = data.content.filter(item => item.category === selectedCategory);
        }
        
        setLostItems(filteredItems);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching lost items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, [currentPage, searchTerm, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // API uses 0-based indexing
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'All Categories' ? '' : category);
    setCurrentPage(0); // Reset to first page on category change
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lost Items</h1>
        <p className="mt-1 text-gray-600">
          Browse all reported lost items. If you've found any of these items, please contact the reporter.
        </p>
      </div>

      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <SearchInput onSearch={handleSearch} placeholder="Search lost items..." />
        
        <div className="flex items-center">
          <label htmlFor="category" className="mr-2 text-sm font-medium text-gray-700">
            Filter by:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : lostItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No lost items found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {lostItems.map((item) => (
              <Link key={item.id} to={`/lost/${item.id}`}>
                <Card hoverable className="h-full transition-all duration-200 hover:translate-y-[-4px]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-200 mb-4">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-2">
                      <span className="inline-block rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-800">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-gray-400" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-gray-400" />
                      <span>
                        {format(new Date(item.lostDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage + 1} // API uses 0-based indexing, UI uses 1-based
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default LostItems;