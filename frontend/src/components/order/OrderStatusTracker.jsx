import { Check, X } from 'lucide-react';
import { ORDER_STATUSES } from '../../utils/constants';

const OrderStatusTracker = ({ currentStatus }) => {
  const statusSteps = [
    { key: ORDER_STATUSES.PENDING, label: 'Pending' },
    { key: ORDER_STATUSES.CONFIRMED, label: 'Confirmed' },
    { key: ORDER_STATUSES.PREPARING, label: 'Preparing' },
    { key: ORDER_STATUSES.READY, label: 'Ready' },
    { key: ORDER_STATUSES.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
    { key: ORDER_STATUSES.DELIVERED, label: 'Delivered' },
  ];

  const filteredSteps = statusSteps;

  const getCurrentStepIndex = () => {
    const index = filteredSteps.findIndex((step) => step.key === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();
  const isCancelled = currentStatus === ORDER_STATUSES.CANCELLED;

  if (isCancelled) {
    return (
      <div className="text-center py-8 border-4 border-black bg-red-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="inline-flex items-center justify-center w-20 h-20 border-4 border-black bg-white mb-4 rotate-3">
          <X className="h-12 w-12 text-black stroke-[4px]" />
        </div>
        <p className="text-2xl font-black uppercase italic tracking-tighter text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          Order Terminated
        </p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 bg-gray-50 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="flex items-start justify-between relative">
        {filteredSteps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
            {/* Step Box */}
            <div
              className={`flex items-center justify-center w-12 h-12 border-4 border-black transition-all duration-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                index <= currentStepIndex
                  ? 'bg-blue-500 text-white translate-y-[-4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black opacity-40 shadow-none translate-y-0'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="h-6 w-6 stroke-[4px]" />
              ) : (
                <span className="text-sm font-black">{index + 1}</span>
              )}
            </div>
            
            {/* Label */}
            <p
              className={`mt-4 text-[10px] font-black uppercase tracking-tighter text-center leading-none max-w-[80px] ${
                index <= currentStepIndex ? 'text-black' : 'text-gray-400'
              }`}
            >
              {step.label}
            </p>

            {/* Connector Line - Абсолютное позиционирование для точности */}
            {index < filteredSteps.length - 1 && (
              <div
                className={`absolute top-6 left-[50%] w-[100%] h-1 border-b-4 border-black -z-10 ${
                  index < currentStepIndex ? 'border-solid opacity-100' : 'border-dashed opacity-20'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Bottom Status bar */}
      <div className="mt-10 pt-4 border-t-2 border-black border-dashed flex justify-between items-center px-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Log:</span>
        <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 italic">
          Current Phase: {filteredSteps[currentStepIndex].label}
        </span>
      </div>
    </div>
  );
};

export default OrderStatusTracker;