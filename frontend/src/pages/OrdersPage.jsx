import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../api/orders';
import OrderCard from '../components/order/OrderCard';
import OrderStatusTracker from '../components/order/OrderStatusTracker';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { Package, XCircle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getAll({ ordering: '-created_at' }),
  });

  const orders = data?.results || data || [];

  const handleOrderClick = (order) => {
    setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await ordersAPI.cancel(orderId);
      toast.success('Order cancelled successfully');
      refetch();
      setExpandedOrderId(null);
    } catch {
      toast.error('Failed to cancel order');
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b-8 border-black pb-4">
          <h1 className="text-5xl font-black text-black uppercase tracking-tighter">My Orders</h1>
          <p className="text-xl font-bold text-gray-600 uppercase mt-2">Track your food journey</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border-4 border-black p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
            <EmptyState
              icon={Package}
              title="No orders found"
              message="Your order history is a blank canvas. Time to fill it with deliciousness!"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
            {orders.map((order) => (
              <div key={order.id} className="group transition-all">
                {/* Order Card Wrap */}
                <div className={`${expandedOrderId === order.id ? 'scale-105' : 'scale-100'} transition-transform duration-200`}>
                  <OrderCard
                    order={order}
                    onClick={handleOrderClick}
                  />
                </div>

                {/* Inline Expanded Details */}
                {expandedOrderId === order.id && (
                  <div className="mt-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] p-6 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="mb-6">
                       <h2 className="text-xs font-black uppercase bg-blue-500 text-white inline-block px-2 py-1 mb-4">Live Tracking</h2>
                       <OrderStatusTracker currentStatus={order.status} />
                    </div>

                    <div className="space-y-6">
                      <section className="bg-gray-100 border-2 border-black p-4">
                        <h3 className="font-black text-black uppercase text-sm mb-3 border-b-2 border-black pb-1">Order Logistics</h3>
                        <div className="space-y-2 text-sm font-bold">
                          <div className="flex justify-between">
                            <span className="text-gray-600">DATE:</span>
                            <span className="text-black">{formatDateTime(order.created_at)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">METHOD:</span>
                            <span className="text-black uppercase">{order.payment_method}</span>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="font-black text-black uppercase text-sm mb-3">Items Purchased</h3>
                        <div className="space-y-3">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm border-b border-gray-200 pb-2">
                              <span className="font-bold text-black">
                                <span className="bg-yellow-300 px-1 mr-2">{item.quantity}x</span> 
                                {item.menu_item?.name || item.name}
                              </span>
                              <span className="font-black text-black">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {order.delivery_address && (
                        <section className="border-t-2 border-black pt-4">
                          <p className="text-xs font-black text-gray-400 uppercase mb-2">Shipping to:</p>
                          <p className="text-sm font-bold text-black leading-tight">
                            {order.delivery_address.street_address || order.delivery_address.street},<br />
                            {order.delivery_address.city}, {order.delivery_address.postal_code}
                          </p>
                        </section>
                      )}

                      <div className="bg-black text-white p-4 flex justify-between items-center">
                        <span className="font-black uppercase tracking-widest">Total Paid</span>
                        <span className="text-2xl font-black">{formatCurrency(order.total_amount || order.total)}</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        {order.status === 'PENDING' && (
                          <Button
                            variant="danger"
                            fullWidth
                            onClick={() => handleCancelOrder(order.id)}
                            className="border-2 border-black bg-red-500 hover:bg-red-600 text-white font-black uppercase py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                          >
                            Cancel Request
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          fullWidth
                          onClick={() => setExpandedOrderId(null)}
                          className="border-2 border-black font-black uppercase py-3 hover:bg-gray-100"
                        >
                          Minimize
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;