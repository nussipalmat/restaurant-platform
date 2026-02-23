import { STATUS_COLORS } from '../../utils/constants';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-blue-400 text-black border-black',
    success: 'bg-green-400 text-black border-black',
    warning: 'bg-yellow-400 text-black border-black',
    error: 'bg-red-500 text-white border-black',
    info: 'bg-purple-400 text-black border-black',
    gray: 'bg-gray-200 text-black border-black',
  };

  return (
    <span
      className={`
        inline-flex items-center 
        px-3 py-1 
        border-2 font-black uppercase tracking-tighter text-[10px]
        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        ${variants[variant]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;