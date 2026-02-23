import { Bell, Package, Calendar, Tag } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import { NOTIFICATION_TYPES } from '../../utils/constants';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    const iconProps = { className: "h-6 w-6 stroke-[3px]" };
    switch (notification.type) {
      case NOTIFICATION_TYPES.ORDER:
        return <Package {...iconProps} />;
      case NOTIFICATION_TYPES.RESERVATION:
        return <Calendar {...iconProps} />;
      case NOTIFICATION_TYPES.PROMOTION:
        return <Tag {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  return (
    <div
      onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
      className={`p-6 border-b-4 border-black cursor-pointer transition-all ${
        !notification.is_read 
          ? 'bg-blue-400 hover:bg-blue-300' 
          : 'bg-white hover:bg-gray-100'
      }`}
    >
      <div className="flex items-start">
        <div className={`p-3 border-4 border-black mr-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
          !notification.is_read ? 'bg-white text-black' : 'bg-gray-200 text-gray-600'
        }`}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-black uppercase tracking-tighter text-lg leading-none">
              {notification.title}
            </h4>
            {!notification.is_read && (
              <span className="ml-2 px-2 py-1 bg-yellow-400 border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                NEW
              </span>
            )}
          </div>
          
          <p className="font-bold text-sm text-black mb-2 uppercase leading-tight">
            {notification.message}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/60 bg-black/10 px-2 py-0.5 border border-black/20">
              {formatRelativeTime(notification.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;