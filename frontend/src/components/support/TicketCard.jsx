import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import { STATUS_COLORS } from '../../utils/constants';
import { MessageSquare, ArrowUpRight } from 'lucide-react';

const TicketCard = ({ ticket, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(ticket)}
      className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Background Decor Label */}
      <div className="absolute -right-4 -top-1 opacity-[0.03] text-6xl font-black uppercase italic pointer-events-none">
        Support
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-2 border-black">
              {ticket.category}
            </span>
            <Badge 
              className="border-2 border-black rounded-none font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              variant={STATUS_COLORS[ticket.status]}
            >
              {ticket.status}
            </Badge>
          </div>
          
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-black uppercase tracking-tighter text-black italic leading-tight group-hover:text-blue-600 transition-colors">
              {ticket.subject}
            </h3>
            <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all stroke-[3px] text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 border-2 border-black p-3 mb-4">
        <p className="text-xs font-bold text-black/70 uppercase leading-relaxed line-clamp-2">
          {ticket.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t-4 border-black border-dotted">
        <div className="flex items-center bg-yellow-400 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <MessageSquare className="h-4 w-4 mr-2 stroke-[3px]" />
          <span className="text-[10px] font-black uppercase tracking-tight">
            {ticket.comments_count || 0} Responses
          </span>
        </div>
        
        <div className="text-right">
          <p className="text-[9px] font-black uppercase text-gray-400 leading-none mb-1">Created At</p>
          <p className="text-[10px] font-black uppercase text-black italic">
            {formatDateTime(ticket.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;