import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Loading from './components/common/Loading';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ReservationsPage from './pages/ReservationsPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import NotificationsPage from './pages/NotificationsPage';
import SupportPage from './pages/SupportPage';
import NotFoundPage from './pages/NotFoundPage';
import PromotionsPage from './pages/PromotionsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/"
                  element={
                    <Layout>
                      <HomePage />
                    </Layout>
                  }
                />
                <Route
                  path="/restaurants/:slug"
                  element={
                    <Layout>
                      <RestaurantPage />
                    </Layout>
                  }
                />

                <Route
                  path="/cart"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/reservations"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <ReservationsPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/addresses"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <AddressesPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <SupportPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/promotions"
                  element={
                    <Layout>
                      <PromotionsPage />
                    </Layout>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#111827',
                    color: '#ffffff',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #374151'
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;