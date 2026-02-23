import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsAPI } from '../api/restaurants';
import { menuAPI } from '../api/menu';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import MenuItemCard from '../components/menu/MenuItemCard';
import Button from '../components/common/Button';
import { Clock, DollarSign, MapPin, Phone, Calendar, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const RestaurantPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const { data: restaurant, isLoading: loadingRestaurant } = useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => restaurantsAPI.getBySlug(slug),
  });

  const { data: itemsData } = useQuery({
    queryKey: ['menu-items', restaurant?.id],
    queryFn: () => menuAPI.getItems(restaurant.id),
    enabled: !!restaurant?.id,
  });

  const menuItems = itemsData?.results || itemsData || [];

  const handleAddToCart = (item) => {
    addToCart(item, {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      delivery_fee: restaurant.delivery_fee,
    });
  };

  const handleReservation = () => {
    if (!isAuthenticated) {
      toast.error('Login required for booking', {
        style: { border: '3px solid black', borderRadius: 0, fontWeight: 'bold' }
      });
      navigate('/login');
      return;
    }
    navigate('/reservations');
  };

  if (loadingRestaurant) return <Loading fullScreen />;

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-4xl font-black uppercase mb-4">404: Not Found</h2>
          <p className="font-bold text-gray-600 mb-8">This kitchen is empty. Forever.</p>
          <Button onClick={() => navigate('/')} className="border-3 border-black font-black uppercase">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Brutalist Header Area */}
      <div className="bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button 
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 font-black uppercase text-sm hover:underline"
          >
            <ArrowLeft size={16} strokeWidth={3} /> Back to Search
          </button>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Massive Logo Frame */}
            <div className="w-full lg:w-48 h-48 flex-shrink-0 bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-7xl select-none">🍕</div>
              )}
            </div>

            {/* Content Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
                  {restaurant.name}
                </h1>
                <div className={`text-xl font-black uppercase px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  restaurant.is_open_now ? 'bg-green-400 text-black' : 'bg-red-500 text-white'
                }`}>
                  {restaurant.is_open_now ? 'Open' : 'Closed'}
                </div>
              </div>

              <p className="text-xl font-bold text-gray-800 mb-8 max-w-3xl leading-tight uppercase">
                {restaurant.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-100 border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 font-black uppercase text-sm mb-1">
                    <Clock size={18} strokeWidth={3} /> Delivery Time
                  </div>
                  <div className="text-2xl font-black italic">{restaurant.estimated_delivery_time || '--'} MIN</div>
                </div>

                <div className="bg-purple-100 border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 font-black uppercase text-sm mb-1">
                    <DollarSign size={18} strokeWidth={3} /> Shipping
                  </div>
                  <div className="text-2xl font-black italic">
                    {restaurant.delivery_fee === 0 ? 'FREE' : formatCurrency(restaurant.delivery_fee).toUpperCase()}
                  </div>
                </div>

                <div className="bg-yellow-100 border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3 font-black uppercase text-sm mb-1">
                    <MapPin size={18} strokeWidth={3} /> Location
                  </div>
                  <div className="text-sm font-bold uppercase truncate">{restaurant.address || 'Secret Spot'}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleReservation}
                  className="h-16 px-10 text-xl font-black uppercase bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:bg-blue-600 hover:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  <Calendar size={24} strokeWidth={3} /> Book a Table
                </Button>
                {restaurant.phone && (
                  <div className="flex items-center gap-4 px-6 border-4 border-black bg-white font-black text-xl italic shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <Phone size={20} /> {restaurant.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-6xl font-black text-black uppercase tracking-tighter">Menu</h2>
          <div className="flex-1 h-2 bg-black"></div>
        </div>
        
        {menuItems.length === 0 ? (
          <div className="bg-white border-4 border-dashed border-black p-16 text-center">
            <p className="text-2xl font-black text-gray-400 uppercase">Kitchen is warming up... No items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;