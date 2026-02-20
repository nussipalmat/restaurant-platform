import { Package } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Package, 
  title = 'No items found', 
  message = 'There are no items to display.', 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 border-4 border-dashed border-black bg-gray-50">
      <div className="bg-white border-4 border-black p-8 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-3">
        <Icon className="h-16 w-16 text-black" strokeWidth={3} />
      </div>
      <h3 className="text-4xl font-black text-black uppercase tracking-tighter mb-4 text-center">
        {title}
      </h3>
      <p className="text-xl font-bold text-gray-600 text-center mb-10 max-w-sm uppercase leading-none italic">
        {message}
      </p>
      {action && (
        <div className="w-full sm:w-auto transform hover:-rotate-1 transition-transform">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;