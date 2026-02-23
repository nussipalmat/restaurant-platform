import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notification/NotificationItem';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';
import { useState } from 'react';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    await markAllAsRead();
    await fetchNotifications();
    setIsLoading(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    await fetchNotifications();
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-black text-black uppercase tracking-tighter mb-2">
              Notifications
            </h1>
            {unreadNotifications.length > 0 ? (
              <div className="inline-block bg-blue-600 text-white px-3 py-1 border-2 border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {unreadNotifications.length} New Update{unreadNotifications.length !== 1 ? 's' : ''}
              </div>
            ) : (
              <p className="text-lg font-bold text-gray-600 uppercase tracking-tight">System Clear</p>
            )}
          </div>
          
          {unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              loading={isLoading}
              className="border-4 border-black bg-white hover:bg-black hover:text-white transition-all font-black uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <CheckCheck size={20} />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Notifications List Container */}
        <div className="bg-white border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-16">
              <EmptyState
                icon={Bell}
                title="Silence is Golden"
                message="Your notification feed is empty. We'll ping you when there's news!"
              />
            </div>
          ) : (
            <div className="divide-y-4 divide-black">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`transition-colors ${!notification.is_read ? 'bg-yellow-50' : 'bg-white'}`}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                End of Updates
            </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;