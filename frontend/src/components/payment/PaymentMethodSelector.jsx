import { CreditCard, Banknote } from 'lucide-react';
import { PAYMENT_METHODS } from '../../utils/constants';

const PaymentMethodSelector = ({ selected, onChange }) => {
  const paymentMethods = [
    {
      id: PAYMENT_METHODS.CARD,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'SECURE STRIPE GATEWAY',
    },
    {
      id: PAYMENT_METHODS.CASH,
      name: 'Cash on Delivery',
      icon: Banknote,
      description: 'PHYSICAL CURRENCY EXCHANGE',
    },
  ];

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <label
          key={method.id}
          className={`relative flex items-center p-5 border-4 border-black cursor-pointer transition-all ${
            selected === method.id
              ? 'bg-blue-500 text-white translate-x-1 translate-y-1 shadow-none'
              : 'bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={selected === method.id}
              onChange={() => onChange(method.id)}
              className="sr-only" 
            />
            <div className={`w-6 h-6 border-4 border-black flex items-center justify-center mr-4 ${
              selected === method.id ? 'bg-white' : 'bg-white'
            }`}>
              {selected === method.id && <div className="w-2 h-2 bg-black" />}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center">
              <method.icon className={`h-6 w-6 mr-3 stroke-[3px] ${
                selected === method.id ? 'text-white' : 'text-black'
              }`} />
              <span className="font-black uppercase tracking-tighter text-lg leading-none">
                {method.name}
              </span>
            </div>
            <p className={`text-[10px] font-black mt-1 uppercase tracking-[0.1em] ${
              selected === method.id ? 'text-white/80' : 'text-black/50'
            }`}>
              {method.description}
            </p>
          </div>

          {selected === method.id && (
            <div className="absolute -top-3 -right-3 bg-black text-white text-[10px] font-black px-2 py-1 rotate-6 border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
              Selected
            </div>
          )}
        </label>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;