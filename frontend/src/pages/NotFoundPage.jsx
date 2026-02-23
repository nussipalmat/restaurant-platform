import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white border-8 border-black p-12 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-[120px] font-black text-black leading-none uppercase tracking-tighter mb-4">
          404
        </h1>
        
        <div className="inline-block bg-red-500 text-white px-4 py-1 border-4 border-black font-black uppercase tracking-widest mb-6">
          Error Detected
        </div>

        <h2 className="text-3xl font-black text-black mt-4 mb-4 uppercase tracking-tight">
          Page Not Found
        </h2>
        
        <p className="text-xl font-bold text-gray-800 mb-10 leading-tight uppercase">
          The page you're looking for doesn't exist or has been moved to another dimension.
        </p>

        <Link to="/" className="block">
          <Button 
            size="lg" 
            fullWidth 
            className="py-6 text-2xl font-black uppercase tracking-tighter border-4 border-black bg-yellow-400 text-black hover:bg-yellow-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            Go Back Home
          </Button>
        </Link>
        
        <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;