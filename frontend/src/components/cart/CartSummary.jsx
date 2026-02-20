import { formatCurrency } from '../../utils/formatters';
import { ReceiptText, Truck, Percent } from 'lucide-react';

const CartSummary = ({ subtotal, tax, deliveryFee, discount, total }) => {
  return (
    <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 bg-black text-white font-black text-[10px] uppercase tracking-tighter">
        Final Bill
      </div>

      <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-8 flex items-center gap-2">
        <ReceiptText size={28} strokeWidth={3} /> Summary
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Subtotal</span>
          <div className="flex-1 border-b-2 border-dotted border-gray-300 mx-2 mb-1"></div>
          <span className="font-bold text-lg">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between items-end">
          <span className="text-xs font-black uppercase text-gray-500 tracking-widest text-left">
            Service Tax <span className="text-[10px] bg-black text-white px-1 ml-1">8%</span>
          </span>
          <div className="flex-1 border-b-2 border-dotted border-gray-300 mx-2 mb-1"></div>
          <span className="font-bold text-lg">{formatCurrency(tax)}</span>
        </div>

        <div className="flex justify-between items-end group">
          <span className="flex items-center gap-1 text-xs font-black uppercase text-gray-500 tracking-widest">
            <Truck size={14} strokeWidth={3} /> Logistics
          </span>
          <div className="flex-1 border-b-2 border-dotted border-gray-300 mx-2 mb-1"></div>
          <span className={`font-bold text-lg ${deliveryFee === 0 ? 'text-green-600 italic' : ''}`}>
            {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center bg-green-100 border-2 border-green-600 p-3 mt-4 rotate-1 shadow-[4px_4px_0px_0px_rgba(22,101,52,1)]">
            <span className="flex items-center gap-1 text-xs font-black uppercase text-green-700">
              <Percent size={14} strokeWidth={3} /> Promo Applied
            </span>
            <span className="font-black text-green-700 text-xl">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}
      </div>

      <div className="my-8 border-t-8 border-black border-double pt-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 leading-none">Total Payable</span>
            <span className="text-xs font-bold text-gray-400 italic">VAT included</span>
          </div>
          <div className="text-5xl font-black text-black tracking-tighter italic">
            {formatCurrency(total)}
          </div>
        </div>
      </div>
      
      <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest mt-4">
        Thank you for choosing brutal eats • {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default CartSummary;