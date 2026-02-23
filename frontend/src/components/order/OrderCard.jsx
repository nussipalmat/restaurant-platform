import { formatCurrency, formatDateTime, formatOrderStatus } from '../../utils/formatters';
import Badge from '../common/Badge';
import { STATUS_COLORS } from '../../utils/constants';
import { Clock, MapPin, ChevronRight } from 'lucide-react';

const OrderCard = ({ order, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(order)}
      className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-black italic leading-none mb-1">
            ID: {order.id || order.order_number}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <Badge 
          className="border-2 border-black font-black uppercase text-[10px] px-3 py-1 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          variant={STATUS_COLORS[order.status]}
        >
          {formatOrderStatus(order.status)}
        </Badge>
      </div>

      <div className="bg-gray-100 border-2 border-black p-3 mb-4 flex items-center group-hover:bg-yellow-400 transition-colors">
        <span className="text-2xl mr-3 filter grayscale group-hover:grayscale-0">🍽️</span>
        <span className="font-black uppercase tracking-tight text-black">
          {order.restaurant?.name || order.restaurant_name}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-black uppercase tracking-widest text-black/60">
          PACKING: {order.items?.length || order.total_items} UNITS
        </p>

        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase">
          <div className="flex items-center bg-black text-white px-2 py-1">
            <Clock className="h-3 w-3 mr-1 stroke-[4px]" />
            <span>{order.order_type}</span>
          </div>
          
          {(order.delivery_address || order.address) && (
            <div className="flex items-center border-2 border-black px-2 py-1">
              <MapPin className="h-3 w-3 mr-1 stroke-[4px]" />
              <span className="truncate max-w-[150px]">
                {order.delivery_address?.street || order.address}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t-4 border-black border-dotted">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-gray-400 leading-none">Total Payable</span>
          <span className="text-2xl font-black text-black tracking-tighter">
            {formatCurrency(order.total_amount || order.total)}
          </span>
        </div>
        <div className="bg-black text-white p-2 group-hover:bg-blue-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <ChevronRight className="h-6 w-6 stroke-[4px]" />
        </div>
      </div>
    </div>
  );
};

export default OrderCard;