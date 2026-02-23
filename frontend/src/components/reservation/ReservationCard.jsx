import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import { STATUS_COLORS, RESERVATION_STATUSES } from '../../utils/constants';
import { Calendar, Clock, Users, MessageSquareOff } from 'lucide-react';
import Button from '../common/Button';

const ReservationCard = ({ reservation, onCancel }) => {
  const canCancel = reservation.status === RESERVATION_STATUSES.PENDING || 
                    reservation.status === RESERVATION_STATUSES.CONFIRMED;

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none relative overflow-hidden">
      <div className="flex items-start justify-between mb-6">
        <div className="max-w-[70%]">
          <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 italic">
            {reservation.restaurant?.name || reservation.restaurant_name}
          </h3>
          <Badge 
            className="border-2 border-black rounded-none font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            variant={STATUS_COLORS[reservation.status]}
          >
            {reservation.status}
          </Badge>
        </div>
        <div className="bg-yellow-400 border-4 border-black p-2 rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Users className="h-6 w-6 text-black stroke-[3px]" />
          <span className="block text-center font-black text-xs">{reservation.party_size}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center p-3 border-4 border-black bg-blue-50">
          <Calendar className="h-5 w-5 mr-3 stroke-[3px]" />
          <span className="text-xs font-black uppercase tracking-tight">
            {formatDateTime(reservation.date_time, 'MMM dd, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center p-3 border-4 border-black bg-emerald-50">
          <Clock className="h-5 w-5 mr-3 stroke-[3px]" />
          <span className="text-xs font-black uppercase tracking-tight">
            {formatDateTime(reservation.date_time, 'HH:mm')}
          </span>
        </div>
      </div>

      {reservation.special_requests && (
        <div className="mb-6 p-4 bg-black text-white border-4 border-black relative">
          <div className="absolute -top-3 left-4 bg-yellow-400 text-black px-2 py-0.5 border-2 border-black text-[10px] font-black uppercase tracking-widest">
            Special Requests
          </div>
          <p className="text-xs font-bold uppercase italic leading-tight">
            "{reservation.special_requests}"
          </p>
        </div>
      )}

      {canCancel ? (
        <Button
          onClick={() => onCancel(reservation.id)}
          className="w-full py-4 bg-red-500 hover:bg-black text-white border-4 border-black font-black uppercase tracking-[0.15em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          <MessageSquareOff className="h-5 w-5 stroke-[3px]" />
          Abort Reservation
        </Button>
      ) : (
        <div className="w-full py-3 border-4 border-dashed border-gray-300 text-center">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Modification Locked
          </span>
        </div>
      )}
      
      {/* Background Decor */}
      <div className="absolute -bottom-4 -right-4 opacity-5 text-black font-black text-6xl select-none pointer-events-none uppercase italic">
        Table
      </div>
    </div>
  );
};

export default ReservationCard;