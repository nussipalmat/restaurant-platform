import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t-8 border-black mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 border-b-4 border-black">
          
          {/* About - Сделаем его ярким акцентом */}
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black bg-yellow-400">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4 italic">
              About FoodApp
            </h3>
            <p className="text-black font-bold text-sm leading-tight uppercase">
              Your favorite food delivery service. We don't just deliver food, we deliver satisfaction with brutal efficiency.
            </p>
          </div>

          {/* Quick Links */}
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-black block"></span> Navigation
            </h3>
            <ul className="space-y-3">
              {[
                ['/', 'Home'],
                ['/orders', 'Orders'],
                ['/reservations', 'Reservations'],
                ['/support', 'Support'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center text-black font-black uppercase text-xs tracking-widest hover:translate-x-2 transition-transform"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black bg-blue-50">
            <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 block"></span> Account
            </h3>
            <ul className="space-y-3">
              {[
                ['/profile', 'Profile'],
                ['/addresses', 'Addresses'],
                ['/notifications', 'Notifications'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center text-black font-black uppercase text-xs tracking-widest hover:translate-x-2 transition-transform"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="p-8">
            <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 block"></span> Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 bg-black text-white p-2 text-[10px] font-black uppercase tracking-widest">
                <Mail className="h-4 w-4" strokeWidth={3} />
                support@foodapp.com
              </li>
              <li className="flex items-center gap-3 border-2 border-black p-2 text-[10px] font-black uppercase tracking-widest">
                <Phone className="h-4 w-4" strokeWidth={3} />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest leading-none">
                <MapPin className="h-4 w-4 shrink-0 text-red-500" strokeWidth={3} />
                123 Food Street, NYC, 10001
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-black text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} BrutalEats. Built for speed.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black uppercase cursor-pointer hover:text-yellow-400 transition-colors">Privacy</span>
            <span className="text-[10px] font-black uppercase cursor-pointer hover:text-yellow-400 transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;