import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsAPI } from '../api/restaurants';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { Search, XCircle } from 'lucide-react';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', searchQuery],
    queryFn: () => restaurantsAPI.getAll({
      search: searchQuery,
    }),
  });

  const restaurants = data?.results || data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section - High Contrast Neobrutalism */}
      <div className="bg-yellow-400 border-b-8 border-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-black text-black mb-4 uppercase tracking-tighter leading-none">
            Hungry? <br /> Order food now!
          </h1>
          <p className="text-2xl font-bold text-black mb-10 max-w-lg leading-tight uppercase">
            Discover the best restaurants in your area with lightning speed.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, cuisines..."
                className="w-full pl-14 pr-6 py-6 rounded-none border-4 border-black text-black text-xl font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all placeholder-gray-600"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-8 w-8 text-black" />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 py-2 font-black uppercase hover:bg-gray-800 transition-colors"
              >
                Find
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Active Search Notification */}
        {searchQuery && (
          <div className="bg-blue-500 border-4 border-black p-4 mb-10 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-white text-lg font-black uppercase">
              Results for: "{searchQuery}"
            </p>
            <button
              onClick={clearSearch}
              className="flex items-center space-x-2 bg-white border-2 border-black px-3 py-1 font-bold hover:bg-gray-100 transition-colors"
            >
              <XCircle className="h-5 w-5" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* Results Info */}
        {!isLoading && !error && (
            <div className="mb-8 flex items-center">
                <span className="bg-black text-white px-4 py-1 text-sm font-black uppercase tracking-widest">
                    {restaurants.length} Resto{restaurants.length !== 1 ? 's' : ''} available
                </span>
                <div className="flex-grow border-t-4 border-black ml-4"></div>
            </div>
        )}

        {/* Dynamic Display */}
        {isLoading ? (
          <Loading />
        ) : error ? (
          <EmptyState
            title="SYSTEM ERROR"
            message="We couldn't fetch the food data. Check your connection."
            className="border-4 border-red-600"
          />
        ) : restaurants.length === 0 ? (
          <EmptyState
            title="NO MATCHES FOUND"
            message="Try searching for something else, like 'Pizza' or 'Sushi'."
            className="border-4 border-black"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="hover:translate-y-[-4px] transition-transform">
                 <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;