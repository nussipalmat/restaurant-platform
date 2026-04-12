import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { addressesAPI } from '../api/addresses';
import { ordersAPI } from '../api/orders';
import { paymentsAPI } from '../api/payments';
import { reservationsAPI } from '../api/reservations';
import CartSummary from '../components/cart/CartSummary';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import StripeCheckoutForm from '../components/payment/StripeCheckoutForm';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { ORDER_TYPES, PAYMENT_METHODS } from '../utils/constants';
import toast from 'react-hot-toast';
import { MapPin, ChevronRight, CalendarDays } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_fake');

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    restaurant,
    promoCode,
    discount,
    subtotal,
    tax,
    deliveryFee,
    total,
    clearCart,
  } = useCart();

  const [orderType, setOrderType] = useState(ORDER_TYPES.DELIVERY);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkedReservation, setLinkedReservation] = useState(null);

  const { handleSubmit } = useForm();

  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesAPI.getAll,
  });

  const { data: reservationsData } = useQuery({
    queryKey: ['checkout-reservations', restaurant?.id],
    queryFn: () => reservationsAPI.getAll({ restaurant: restaurant?.id }),
    enabled: !!restaurant?.id,
  });

  const addresses = addressesData?.results || addressesData || [];
  const reservations = reservationsData?.results || reservationsData || [];
  const availableReservations = reservations.filter((reservation) =>
    ['PENDING', 'CONFIRMED', 'SEATED'].includes(reservation.status)
  );

  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart');

    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((addr) => addr.is_default) || addresses[0];
      setSelectedAddress(defaultAddr?.id);
    }

    const savedReservation = localStorage.getItem('active_reservation_order');
    if (savedReservation) {
      try {
        setLinkedReservation(JSON.parse(savedReservation));
      } catch {
        localStorage.removeItem('active_reservation_order');
      }
    }
  }, [cartItems, addresses, selectedAddress, navigate]);

  const handleReservationChange = (e) => {
    const reservationId = e.target.value;

    if (!reservationId) {
      setLinkedReservation(null);
      localStorage.removeItem('active_reservation_order');
      return;
    }

    const selected = availableReservations.find(
      (reservation) => String(reservation.id) === String(reservationId)
    );

    if (selected) {
      setLinkedReservation(selected);
      localStorage.setItem('active_reservation_order', JSON.stringify(selected));
    }
  };

  const createOrder = async (paymentData = {}) => {
    const orderData = {
      restaurant: restaurant.id,
      order_type: orderType,
      payment_method: paymentMethod,
      items: cartItems.map((item) => ({
        menu_item: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      tax,
      delivery_fee: deliveryFee,
      discount,
      total,
      promo_code: promoCode,
      reservation: linkedReservation?.id || null,
      ...paymentData,
    };

    if (orderType === ORDER_TYPES.DELIVERY && selectedAddress) {
      orderData.delivery_address = selectedAddress;
    }

    return await ordersAPI.create(orderData);
  };

  const handleCardPayment = async (paymentMethodData) => {
    setIsProcessing(true);

    try {
      const paymentIntent = await paymentsAPI.createPaymentIntent({
        amount: total,
        payment_method: paymentMethodData.id,
      });

      await createOrder({ payment_intent_id: paymentIntent.id });
      clearCart();
      localStorage.removeItem('active_reservation_order');

      toast.success('ORDER PLACED!', {
        style: { border: '4px solid black', borderRadius: 0, fontWeight: '900' },
      });

      navigate('/orders');
    } catch (error) {
      toast.error('PAYMENT FAILED');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    setIsProcessing(true);

    try {
      await createOrder();
      clearCart();
      localStorage.removeItem('active_reservation_order');

      toast.success('ORDER PLACED!', {
        style: { border: '4px solid black', borderRadius: 0, fontWeight: '900' },
      });

      navigate('/orders');
    } catch (error) {
      toast.error('ORDER FAILED');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) return <Loading fullScreen />;

  return (
    <div className="min-h-screen bg-[#f0f0f0] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b-8 border-black pb-4 flex justify-between items-end">
          <h1 className="text-6xl font-black uppercase tracking-tighter italic">Checkout</h1>
          <span className="text-sm font-black bg-black text-white px-3 py-1 mb-2 uppercase">
            Step: Final
          </span>
        </header>

        <form onSubmit={handleSubmit(paymentMethod === PAYMENT_METHODS.CASH ? handleCashPayment : () => {})}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-12">
              <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-3">
                  <span className="bg-black text-white px-3 not-italic">01</span> Order Type
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.values(ORDER_TYPES).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`p-6 border-4 font-black uppercase tracking-tighter text-xl text-left transition-all ${
                        orderType === type
                          ? 'bg-yellow-400 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-4px] translate-y-[-4px]'
                          : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </section>

              {orderType === ORDER_TYPES.DELIVERY && (
                <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black uppercase italic flex items-center gap-3">
                      <span className="bg-black text-white px-3 not-italic">02</span> Destination
                    </h2>
                    <Button variant="outline" size="xs" onClick={() => navigate('/addresses')}>
                      Edit list
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address.id)}
                        className={`p-5 border-4 cursor-pointer transition-all flex items-start gap-4 ${
                          selectedAddress === address.id
                            ? 'bg-blue-400 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            : 'border-gray-100 hover:border-black'
                        }`}
                      >
                        <MapPin
                          className={`mt-1 ${selectedAddress === address.id ? 'text-black' : 'text-gray-300'}`}
                          strokeWidth={3}
                        />
                        <div>
                          <p className="font-black uppercase text-sm leading-tight">
                            {address.label || 'Home'}
                          </p>
                          <p className="font-bold text-lg leading-tight mt-1">
                            {address.street_address}
                          </p>
                          <p className="text-xs font-bold opacity-70 uppercase mt-1">
                            {address.city}, {address.state}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-3">
                  <span className="bg-black text-white px-3 not-italic">
                    {orderType === ORDER_TYPES.DELIVERY ? '03' : '02'}
                  </span>
                  Reservation
                </h2>

                <label className="block text-sm font-black uppercase mb-3 text-black">
                  Link order to a table booking
                </label>

                <div className="relative">
                  <CalendarDays
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
                    strokeWidth={3}
                    size={20}
                  />
                  <select
                    value={linkedReservation?.id || ''}
                    onChange={handleReservationChange}
                    className="w-full border-4 border-black px-12 py-4 font-bold bg-white uppercase appearance-none"
                  >
                    <option value="">No reservation</option>

                    {availableReservations.map((reservation) => (
                      <option key={reservation.id} value={reservation.id}>
                        #{reservation.id} — {reservation.reservation_date} {reservation.reservation_time}
                      </option>
                    ))}
                  </select>
                </div>

                {linkedReservation && (
                  <div className="mt-4 border-4 border-black bg-yellow-200 p-4">
                    <p className="font-black uppercase text-sm">
                      Linked reservation: #{linkedReservation.id}
                    </p>
                    <p className="font-bold">
                      {linkedReservation.reservation_date} at {linkedReservation.reservation_time}
                    </p>
                  </div>
                )}

                {availableReservations.length === 0 && (
                  <div className="mt-4 border-4 border-black bg-gray-100 p-4">
                    <p className="font-black uppercase text-sm">No active reservations found</p>
                  </div>
                )}
              </section>

              <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-3">
                  <span className="bg-black text-white px-3 not-italic">
                    {orderType === ORDER_TYPES.DELIVERY ? '04' : '03'}
                  </span>
                  Payment
                </h2>

                <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />

                {paymentMethod === PAYMENT_METHODS.CARD && (
                  <div className="mt-8 p-6 border-4 border-black bg-gray-50 italic">
                    <Elements stripe={stripePromise}>
                      <StripeCheckoutForm
                        amount={total}
                        onSuccess={handleCardPayment}
                        onError={() => setIsProcessing(false)}
                      />
                    </Elements>
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-8 space-y-8">
                <CartSummary
                  subtotal={subtotal}
                  tax={tax}
                  deliveryFee={deliveryFee}
                  discount={discount}
                  total={total}
                />

                {paymentMethod === PAYMENT_METHODS.CASH && (
                  <Button
                    type="submit"
                    fullWidth
                    size="xl"
                    loading={isProcessing}
                    className="bg-green-500 py-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600"
                  >
                    Place Cash Order <ChevronRight className="inline ml-2" strokeWidth={4} />
                  </Button>
                )}

                <div className="p-4 border-4 border-black bg-yellow-200 font-black uppercase text-center text-xs tracking-widest">
                  ⚠️ No refunds after order is in "Preparing" status
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;