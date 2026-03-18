import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { telegram } from '@/utils/telegram';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import BottomNav from '@/components/BottomNav';
import OnboardingScreen from '@/screens/OnboardingScreen';
import ShoppingListScreen from '@/screens/ShoppingListScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';
import ProfileScreen from '@/screens/ProfileScreen';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  if (user?.needsProfileSetup) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.needsProfileSetup) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/list" replace />;
}

export default function App() {
  const { isInitializing, setInitializing } = useAuthStore();

  useEffect(() => {
    // Initialize Telegram Mini App
    telegram.ready();
    telegram.expand();

    // Mark as done initializing
    setInitializing(false);
  }, [setInitializing]);

  if (isInitializing) {
    return <LoadingSpinner fullscreen label="SmartCart" />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route
            path="/list"
            element={
              <AuthGuard>
                <AppLayout>
                  <ShoppingListScreen />
                </AppLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/list/:itemId/swaps"
            element={
              <AuthGuard>
                <AppLayout>
                  <ProductDetailScreen />
                </AppLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/swaps"
            element={
              <AuthGuard>
                <AppLayout>
                  <SwapsPlaceholderScreen />
                </AppLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <AppLayout>
                  <ProfileScreen />
                </AppLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <AppLayout>
                  <SettingsPlaceholderScreen />
                </AppLayout>
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--FakeGlassBg)',
            color: 'var(--ContrastColor)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '16px',
            fontFamily: 'Golos Text, sans-serif',
            fontSize: '14px',
            boxShadow: 'var(--FakeGlassShadow)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-accent-green)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-accent-red)',
              secondary: 'white',
            },
          },
        }}
      />
    </ErrorBoundary>
  );
}

function SwapsPlaceholderScreen() {
  return (
    <div className="page-content">
      <h1
        className="text-2xl font-light text-[var(--ContrastColor)] mb-4"
        style={{ fontFamily: 'Unbounded, sans-serif' }}
      >
        Свопы
      </h1>
      <p className="text-sm text-[var(--ContrastColor)] opacity-60">
        Выберите товар в списке покупок, чтобы посмотреть замены.
      </p>
    </div>
  );
}

function SettingsPlaceholderScreen() {
  return (
    <div className="page-content">
      <h1
        className="text-2xl font-light text-[var(--ContrastColor)] mb-4"
        style={{ fontFamily: 'Unbounded, sans-serif' }}
      >
        Настройки
      </h1>
      <p className="text-sm text-[var(--ContrastColor)] opacity-60">
        Скоро здесь появятся настройки приложения.
      </p>
    </div>
  );
}
