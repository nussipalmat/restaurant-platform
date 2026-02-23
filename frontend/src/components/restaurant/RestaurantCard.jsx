import { Link } from 'react-router-dom';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant.slug}`}
      className="group block bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative h-52 bg-gray-200 border-b-4 border-black overflow-hidden">
        {restaurant.logo ? (
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl filter grayscale group-hover:grayscale-0 transition-all">
            🍽️
          </div>
        )}
        
        {/* Status Badge - Industrial Style */}
        <div className={`absolute top-4 left-4 px-3 py-1 border-2 border-black font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
          restaurant.is_open_now 
            ? 'bg-green-400 text-black' 
            : 'bg-red-500 text-white'
        }`}>
          {restaurant.is_open_now ? 'System: Open' : 'System: Offline'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter leading-none italic group-hover:text-blue-600 transition-colors">
            {restaurant.name}
          </h3>
          <ArrowRight className="h-6 w-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all stroke-[3px]" />
        </div>
        
        <p className="inline-block bg-yellow-400 border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest mb-4">
          {restaurant.cuisine_type || 'General Utility Food'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 border-t-2 border-black pt-4">
          {restaurant.estimated_delivery_time && (
            <div className="flex items-center bg-gray-100 p-2 border-2 border-black">
              <Clock className="h-4 w-4 mr-2 stroke-[3px]" />
              <span className="text-[10px] font-black uppercase">{restaurant.estimated_delivery_time} MIN</span>
            </div>
          )}
          
          {restaurant.delivery_fee !== undefined && (
            <div className="flex items-center bg-black text-white p-2 border-2 border-black">
              <DollarSign className="h-4 w-4 mr-1 stroke-[3px]" />
              <span className="text-[10px] font-black uppercase">
                {restaurant.delivery_fee === 0 
                  ? 'FREE SHIP' 
                  : `FEE: ${formatCurrency(restaurant.delivery_fee)}`}
              </span>
            </div>
          )}
        </div>

        {/* Min Order Footer */}
        {restaurant.minimum_order && (
          <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-gray-400 border-t border-dashed border-gray-300 pt-2">
            <span>Minimum Requirement</span>
            <span className="text-black">{formatCurrency(restaurant.minimum_order)}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;