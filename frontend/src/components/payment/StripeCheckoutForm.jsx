import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

const StripeCheckoutForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        onError?.(error);
      } else {
        onSuccess?.(paymentMethod);
      }
    } catch (error) {
      toast.error('TERMINAL ERROR: Payment failed');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '18px',
        color: '#000000',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '700',
        '::placeholder': {
          color: '#A1A1AA',
          textTransform: 'uppercase',
        },
      },
      invalid: {
        color: '#FF0000',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black text-white px-4 py-2 inline-block border-2 border-black rotate-[-1deg] text-xs font-black uppercase tracking-widest">
        Credit Card Input System
      </div>

      <div className="p-5 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-none focus-within:translate-x-1 focus-within:translate-y-1 transition-all">
        <CardElement options={cardElementOptions} />
      </div>

      <div className="flex items-center justify-between p-4 border-t-4 border-b-4 border-black border-dashed bg-gray-50">
        <span className="font-black uppercase tracking-widest text-xs">Total to Authorize:</span>
        <span className="text-3xl font-black text-black tracking-tighter italic">
          ${amount?.toFixed(2)}
        </span>
      </div>

      <Button
        type="submit"
        className={`w-full py-6 bg-green-500 hover:bg-black text-white border-4 border-black font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 disabled:bg-gray-400 ${
          isProcessing ? 'animate-pulse' : ''
        }`}
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'PROCESSING...' : `AUTHORIZE PAYMENT`}
      </Button>

      <div className="flex items-center justify-center gap-2 p-3 bg-black text-white border-2 border-black">
        <ShieldCheck className="h-4 w-4 stroke-[3px]" />
        <p className="text-[10px] font-black uppercase tracking-widest">
          End-to-End Encryption Active
        </p>
      </div>
    </form>
  );
};

export default StripeCheckoutForm;