import type { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { Route, Switch, Redirect, useLocation } from 'wouter-preact';
import { BottomNav } from './shared/ui';
import { C } from './shared/ui/tokens';
import {
  userProfileSignal, isOnboarded, hydrateFromStorage,
} from './shared/state';
import { OnboardingShell, STEPS, type StepId } from './features/onboarding';
import { ListScreen } from './features/list';
import { ProductDetailScreen } from './features/product-detail';
import { ProfileScreen } from './features/profile';

export function App(): JSX.Element {
  const [location] = useLocation();

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const showNav = !location.startsWith('/onboarding');
  const onboarded = isOnboarded.value;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.mid }}>
      <Switch>
        <Route path="/">
          {onboarded ? <Redirect to="/list" /> : <Redirect to="/onboarding/pain" />}
        </Route>

        <Route path="/onboarding/:step">
          {(params) => {
            const step = params.step as StepId;
            if (!STEPS.includes(step)) return <Redirect to="/onboarding/pain" />;
            return <OnboardingShell step={step} />;
          }}
        </Route>

        <Route path="/onboarding">
          <Redirect to="/onboarding/pain" />
        </Route>

        <Route path="/list">
          {userProfileSignal.value ? <ListScreen /> : <Redirect to="/onboarding/pain" />}
        </Route>

        <Route path="/product/:id">
          {(params) => userProfileSignal.value
            ? <ProductDetailScreen productId={params.id} />
            : <Redirect to="/onboarding/pain" />}
        </Route>

        <Route path="/profile">
          {userProfileSignal.value ? <ProfileScreen /> : <Redirect to="/onboarding/pain" />}
        </Route>

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>

      {showNav && userProfileSignal.value && <BottomNav />}
    </div>
  );
}
