import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const MenuItemCard = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden group">
      <div className="flex flex-col sm:flex-row h-full">
        
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-black uppercase tracking-tighter text-black italic leading-none">
                {item.name}
              </h3>
            </div>
            
            {item.description && (
              <p className="text-xs font-bold text-gray-600 mb-4 line-clamp-2 uppercase leading-tight">
                {item.description}
              </p>
            )}

            {(item.is_vegetarian || item.is_vegan || item.is_spicy) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.is_vegetarian && (
                  <span className="text-[10px] font-black px-2 py-0.5 border-2 border-black bg-green-400 uppercase">
                    🌱 Veggie
                  </span>
                )}
                {item.is_vegan && (
                  <span className="text-[10px] font-black px-2 py-0.5 border-2 border-black bg-emerald-300 uppercase">
                    🌿 Vegan
                  </span>
                )}
                {item.is_spicy && (
                  <span className="text-[10px] font-black px-2 py-0.5 border-2 border-black bg-red-500 text-white uppercase tracking-widest">
                    🌶️ Spicy
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mt-auto pt-4 border-t-2 border-dashed border-black/10">
            <p className="text-2xl font-black text-black tracking-tighter">
              {formatCurrency(item.price)}
            </p>

            {item.is_available ? (
              <Button
                size="sm"
                onClick={() => onAddToCart(item)}
                className="bg-yellow-400 hover:bg-black hover:text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none font-black uppercase text-xs"
              >
                <Plus className="h-4 w-4 mr-1 stroke-[4px]" />
                Add
              </Button>
            ) : (
              <span className="px-3 py-1 bg-gray-200 border-2 border-black text-[10px] font-black uppercase text-gray-500 rotate-3">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {item.image && (
          <div className="w-full sm:w-40 h-40 sm:h-auto border-t-4 sm:border-t-0 sm:border-l-4 border-black overflow-hidden relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 scale-105 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;