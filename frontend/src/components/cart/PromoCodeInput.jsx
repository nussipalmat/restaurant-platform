import { useState } from 'react';
import { Tag, X, Ticket } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { promotionsAPI } from '../../api/promotions';
import toast from 'react-hot-toast';

const PromoCodeInput = ({ onApply, currentPromo, onRemove, orderData }) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Code required', { style: { border: '3px solid black', borderRadius: 0 } });
      return;
    }

    setIsValidating(true);
    try {
      const result = await promotionsAPI.validate(code, orderData);
      
      if (result.valid) {
        onApply(code, result.discount_amount);
        setCode('');
        toast.success('Discount Unlocked!', { style: { border: '3px solid black', borderRadius: 0 } });
      } else {
        toast.error(result.message || 'Invalid code');
      }
    } catch (error) {
      const message = error.response?.data?.detail || 
                      error.response?.data?.message ||
                      'Validation failed';
      toast.error(message);
    } finally {
      setIsValidating(false);
    }
  };

  if (currentPromo) {
    return (
      <div className="flex items-center justify-between p-4 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce-subtle">
        <div className="flex items-center">
          <Tag className="h-6 w-6 text-black mr-3 stroke-[3px]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-tighter">Active Promo</span>
            <p className="font-black text-black uppercase text-lg leading-none">
              {currentPromo}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 border-2 border-black hover:bg-black hover:text-white transition-colors"
          aria-label="Remove promo"
        >
          <X className="h-5 w-5 stroke-[3px]" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <label className="block text-xs font-black uppercase tracking-widest text-black mb-3 flex items-center gap-2">
        <Ticket size={16} strokeWidth={3} /> Got a code?
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="PROMO2026"
            className="border-3 border-black font-black uppercase tracking-widest focus:bg-yellow-50"
          />
        </div>
        <Button
          onClick={handleApply}
          loading={isValidating}
          className="bg-black text-white px-8 font-black uppercase border-4 border-black hover:bg-gray-800 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default PromoCodeInput;