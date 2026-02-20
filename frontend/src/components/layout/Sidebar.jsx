import { Link } from 'react-router-dom';
import { X, Home, ShoppingCart, Calendar, User, Bell, Settings, HelpCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', public: true },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', public: false },
    { icon: ShoppingCart, label: 'Orders', path: '/orders', public: false },
    { icon: Calendar, label: 'Reservations', path: '/reservations', public: false },
    { icon: User, label: 'Profile', path: '/profile', public: false },
    { icon: Settings, label: 'Addresses', path: '/addresses', public: false },
    { icon: Bell, label: 'Notifications', path: '/notifications', public: false },
    { icon: HelpCircle, label: 'Support', path: '/support', public: false },
  ];

  const filteredMenuItems = isAuthenticated 
    ? menuItems 
    : menuItems.filter(item => item.public);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r-8 border-black transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-yellow-400">
          <span className="text-2xl font-black uppercase tracking-tighter italic">MENU</span>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
          >
            <X className="h-6 w-6 stroke-[3px]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
          {isAuthenticated && user && (
            <div className="mb-8 p-4 bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-black uppercase tracking-widest text-black/70">Authenticated User</p>
              <p className="text-xl font-black uppercase tracking-tighter truncate text-black">
                {user.first_name || user.username}
              </p>
            </div>
          )}

          <nav className="space-y-3">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="group flex items-center px-4 py-4 border-2 border-transparent hover:border-black hover:bg-gray-50 transition-all active:bg-yellow-100"
              >
                <item.icon className="h-6 w-6 mr-4 stroke-[2.5px] group-hover:rotate-12 transition-transform" />
                <span className="font-black uppercase tracking-widest text-sm">{item.label}</span>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </nav>

          {!isAuthenticated && (
            <div className="mt-10 space-y-4">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full px-4 py-4 text-center font-black uppercase tracking-widest text-white bg-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 hover:shadow-none transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block w-full px-4 py-4 text-center font-black uppercase tracking-widest text-black bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                Create Account
              </Link>
            </div>
          )}
          
          <div className="mt-12 p-4 border-4 border-dashed border-gray-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              System Version: 2.0.4-BRUTAL
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;