import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-6 border-b-4 border-black group">
      <div className="relative">
        <div className="w-24 h-24 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex-shrink-0 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl select-none">
              🍔
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight text-black">
          {item.name}
        </h3>
        <p className="text-lg font-bold text-blue-600 italic uppercase">
          {formatCurrency(item.price)} <span className="text-xs text-black opacity-50 font-black">/ unit</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="p-2 border-r-4 border-black hover:bg-red-400 active:bg-red-500 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-5 w-5 stroke-[3px]" />
          </button>
          
          <span className="w-12 text-center font-black text-xl italic select-none">
            {item.quantity}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-2 border-l-4 border-black hover:bg-green-400 active:bg-green-500 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-5 w-5 stroke-[3px]" />
          </button>
        </div>

        <div className="flex flex-col items-end min-w-[120px]">
          <div className="text-2xl font-black text-black uppercase tracking-tighter">
            {formatCurrency(item.price * item.quantity)}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="mt-1 flex items-center gap-1 text-xs font-black uppercase text-red-600 hover:text-white hover:bg-black px-2 py-1 border-2 border-transparent hover:border-black transition-all"
          >
            <Trash2 className="h-4 w-4 stroke-[3px]" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;