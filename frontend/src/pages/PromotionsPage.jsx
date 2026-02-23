import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Tag, Calendar, DollarSign, ArrowRight, Ticket } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/client';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { formatDate } from '../utils/formatters';

const PromotionsPage = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchPromotions = useCallback(async () => {
    try {
      const response = await api.get('/promotions/', {
        params: { is_active: true, ordering: '-discount_value' },
      });
      setPromotions(response.data.results || response.data);
    } catch {
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Promo code copied!', {
      style: {
        border: '3px solid black',
        borderRadius: '0px',
        fontWeight: 'bold',
      },
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyPromo = (code) => {
    localStorage.setItem('pending_promo_code', code);
    toast.success('Code ready to use!', { icon: '🔥' });
    navigate('/cart');
  };

  const getDiscountDisplay = (promo) => {
    if (promo.promotion_type === 'PERCENTAGE' || promo.discount_type === 'PERCENTAGE') {
      const val = promo.discount_percentage || promo.discount_value;
      return `${parseFloat(val)}% OFF`;
    }
    const val = promo.discount_amount || promo.discount_value;
    return `$${parseFloat(val).toFixed(0)} OFF`;
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Brutalist Style */}
        <div className="mb-12 border-b-8 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-6xl font-black text-black uppercase tracking-tighter leading-none">
              Mega <br /> Deals
            </h1>
            <p className="text-xl font-bold text-gray-700 uppercase mt-4">
              Exclusive rewards for the hungry
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-2xl uppercase italic">Limited Time Only</p>
          </div>
        </div>

        {promotions.length === 0 ? (
          <div className="bg-white border-4 border-black p-20 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <Tag className="h-20 w-20 text-black mx-auto mb-6" />
            <h3 className="text-3xl font-black text-black uppercase">Sold Out!</h3>
            <p className="text-lg font-bold text-gray-600 uppercase">New codes dropping soon. Stay tuned.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {promotions.map(promo => (
              <div key={promo.id} className="group relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
                
                {/* Discount Banner */}
                <div className="bg-black text-white p-6 border-b-4 border-black">
                  <div className="text-5xl font-black italic uppercase tracking-tighter mb-2">
                    {getDiscountDisplay(promo)}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-80">
                    {promo.description}
                  </div>
                </div>

                <div className="p-6">
                  {/* Code Section */}
                  <div className="mb-6">
                    <label className="text-xs font-black text-black uppercase tracking-[0.2em] mb-2 block">
                      Activation Code
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-yellow-300 border-4 border-black px-4 py-3 font-mono text-xl font-black text-black uppercase">
                        {promo.code}
                      </div>
                      <button 
                        onClick={() => handleCopyCode(promo.code)} 
                        className="p-3 bg-white border-4 border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                      >
                        {copiedCode === promo.code ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-3 mb-8 border-l-4 border-gray-200 pl-4">
                    {promo.minimum_order_amount > 0 && (
                      <div className="flex items-center text-sm font-black uppercase">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Min: ${parseFloat(promo.minimum_order_amount).toFixed(0)}
                      </div>
                    )}
                    {promo.end_date && (
                      <div className="flex items-center text-sm font-black uppercase">
                        <Calendar className="h-4 w-4 mr-2" />
                        Ends: {formatDate(promo.end_date)}
                      </div>
                    )}
                  </div>

                  <Button 
                    fullWidth 
                    onClick={() => handleApplyPromo(promo.code)} 
                    className="py-4 text-xl font-black uppercase bg-blue-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    Use Now <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>

                {/* Decorative Element */}
                <Ticket className="absolute -top-4 -right-4 h-16 w-16 text-black opacity-5 rotate-12" />
              </div>
            ))}
          </div>
        )}

        {/* Instructions Footer */}
        <div className="mt-16 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
          <h3 className="text-2xl font-black text-black uppercase mb-4 flex items-center gap-3">
            <span className="bg-black text-white px-2 py-1">?</span> How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Grab a Code",
              "Fill your Cart",
              "Checkout",
              "Save Cash"
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-4xl font-black text-blue-600">{i + 1}</span>
                <span className="font-bold uppercase leading-tight">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;