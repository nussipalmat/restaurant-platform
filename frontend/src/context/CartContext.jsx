import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [promoCode, setPromoCode] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('cart_restaurant');
    const savedPromo = localStorage.getItem('promo_code');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedRestaurant) {
      setRestaurant(JSON.parse(savedRestaurant));
    }
    if (savedPromo) {
      setPromoCode(savedPromo);
    }
    const savedDiscount = localStorage.getItem('promo_discount');
    if (savedDiscount) {
      setDiscount(Number(savedDiscount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    if (restaurant) {
      localStorage.setItem('cart_restaurant', JSON.stringify(restaurant));
    } else {
      localStorage.removeItem('cart_restaurant');
    }
  }, [cartItems, restaurant]);

  const addToCart = (item, restaurantInfo) => {
    if (restaurant && restaurant.id !== restaurantInfo.id) {
      const confirm = window.confirm(
        'Your cart contains items from another restaurant. Do you want to clear it and add items from this restaurant?'
      );
      if (!confirm) return;
      clearCart();
    }

    if (!restaurant) {
      setRestaurant(restaurantInfo);
    }

    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
      toast.success(`${item.name} quantity updated!`, {
        icon: '🛒',
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      toast.success(`${item.name} added to cart!`, {
        icon: '🛒',
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    
    if (updatedCart.length === 0) {
      setRestaurant(null);
      setPromoCode(null);
      setDiscount(0);
    }
    
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    setPromoCode(null);
    setDiscount(0);
    localStorage.removeItem('cart');
    localStorage.removeItem('cart_restaurant');
    localStorage.removeItem('promo_code');
    localStorage.removeItem('promo_discount');
    toast.success('Cart cleared');
  };

  const applyPromoCode = (code, discountAmount) => {
    const amount = Number(discountAmount) || 0;
    setPromoCode(code);
    setDiscount(amount);
    localStorage.setItem('promo_code', code);
    localStorage.setItem('promo_discount', String(amount));
    toast.success('Promo code applied!');
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscount(0);
    localStorage.removeItem('promo_code');
    localStorage.removeItem('promo_discount');
    toast.success('Promo code removed');
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const priceInDollars = item.price;
    return sum + (priceInDollars * item.quantity);
  }, 0);
  const tax = subtotal * 0.12; 
  const deliveryFee = Number(restaurant?.delivery_fee) || 0;
  const total = Number(subtotal) + Number(tax) + Number(deliveryFee) - Number(discount);

  const value = {
    cartItems,
    restaurant,
    promoCode,
    discount,
    subtotal,
    tax,
    deliveryFee,
    total,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};