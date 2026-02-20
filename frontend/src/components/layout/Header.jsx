import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Bell, User, Menu, LogOut, Settings, Tag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b-4 border-black sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 border-2 border-black bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Menu className="h-6 w-6 text-black" />
            </button>
            
            <Link to="/" className="flex items-center ml-4 lg:ml-0 group">
              <span className="text-3xl font-black text-black uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">
                Brutal<span className="bg-black text-white px-2 not-italic ml-1">Eats</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-12">
            <form onSubmit={handleSearch} className="w-full relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="FIND FOOD NOW..."
                className="w-full pl-12 pr-4 py-3 border-4 border-black text-black font-bold placeholder:text-gray-400 focus:outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-black stroke-[3px]" />
            </form>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/promotions"
              className="hidden lg:flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:text-blue-600"
            >
              <Tag className="h-5 w-5" strokeWidth={3} />
              Promos
            </Link>

            <Link
              to="/cart"
              className="relative p-2 border-2 border-transparent hover:border-black hover:bg-green-400 transition-all"
            >
              <ShoppingCart className="h-7 w-7 text-black" strokeWidth={2.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black border-2 border-black h-6 w-6 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 border-2 border-transparent hover:border-black hover:bg-blue-400 transition-all"
              >
                <Bell className="h-7 w-7 text-black" strokeWidth={2.5} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black border-2 border-black h-6 w-6 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 border-4 border-black bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                >
                  <div className="bg-black p-1 text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden md:inline-block text-xs font-black uppercase tracking-tighter pr-2">
                    {user?.first_name || user?.username || 'User'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-0 overflow-hidden">
                    {[
                      { to: '/profile', icon: User, label: 'Profile' },
                      { to: '/orders', icon: ShoppingCart, label: 'My Orders' },
                      { to: '/addresses', icon: Settings, label: 'Addresses' },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center px-4 py-3 text-sm font-black uppercase border-b-2 border-black hover:bg-yellow-400"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <item.icon className="h-4 w-4 mr-3" strokeWidth={3} />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm font-black uppercase text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" strokeWidth={3} />
                      Exit System
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-black uppercase border-2 border-black hover:bg-black hover:text-white transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-black uppercase border-4 border-black bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH..."
            className="w-full pl-10 pr-4 py-2 border-4 border-black text-black font-black placeholder:text-gray-400 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black stroke-[3px]" />
        </form>
      </div>
    </header>
  );
};

export default Header;