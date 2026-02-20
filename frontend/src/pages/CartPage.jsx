import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import PromoCodeInput from '../components/cart/PromoCodeInput';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    restaurant,
    promoCode,
    discount,
    subtotal,
    tax,
    deliveryFee,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  const handleAutoApplyPromo = useCallback(() => {
    const pendingPromo = localStorage.getItem('pending_promo_code');
    if (pendingPromo && cartItems.length > 0 && !promoCode) {
      applyPromoCode(pendingPromo);
      localStorage.removeItem('pending_promo_code');
    }
  }, [cartItems, promoCode, applyPromoCode]);

  useEffect(() => {
    handleAutoApplyPromo();
  }, [handleAutoApplyPromo]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            message="Add some delicious items to get started!"
            action={
              <Link to="/">
                <Button className="border-2 border-black font-black py-4 px-8 text-lg">
                  Browse Restaurants
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Shopping Cart</h1>
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all"
          >
            Clear Entire Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white border-4 border-black rounded-xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
              {restaurant && (
                <div className="mb-8 pb-6 border-b-4 border-black">
                  <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-2">
                    {restaurant.name}
                  </h2>
                  <div className="inline-block bg-yellow-300 border-2 border-black px-3 py-1 text-xs font-black uppercase">
                    Ordering Now
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <h3 className="text-lg font-black uppercase mb-4 text-black">Promo Code</h3>
                <PromoCodeInput
                  onApply={applyPromoCode}
                  currentPromo={promoCode}
                  onRemove={removePromoCode}
                  orderData={{
                    restaurant: restaurant?.id,
                    subtotal: subtotal,
                  }}
                />
              </div>

              <div className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="p-6 bg-black text-white">
                  <h3 className="text-lg font-black uppercase tracking-widest">Order Summary</h3>
                </div>
                <div className="p-6">
                  <CartSummary
                    subtotal={subtotal}
                    tax={tax}
                    deliveryFee={deliveryFee}
                    discount={discount}
                    total={total}
                  />
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                variant="success"
                onClick={handleCheckout}
                className="py-6 text-xl font-black uppercase tracking-tighter border-4 border-black bg-green-500 hover:bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                Proceed to Checkout
              </Button>

              <Link to="/" className="block">
                <Button 
                  variant="outline" 
                  fullWidth 
                  className="py-4 font-bold border-2 border-black hover:bg-gray-100"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;