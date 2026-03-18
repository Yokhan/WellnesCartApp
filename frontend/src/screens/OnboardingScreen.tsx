import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OnboardingWizard from '@/components/OnboardingWizard';
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import type { UserGoal } from '@/design-system/tokens';

interface OnboardingData {
  goal: UserGoal;
  weeklyBudgetRub: number;
  stores: string[];
}

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const { updateProfile } = useAuthStore();
  const { setProfileFromUser } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: OnboardingData) => {
    setIsLoading(true);
    try {
      await updateProfile({
        goal: data.goal,
        weeklyBudgetRub: data.weeklyBudgetRub,
        stores: data.stores,
        needsProfileSetup: false,
      });

      setProfileFromUser({
        goal: data.goal,
        weeklyBudgetRub: data.weeklyBudgetRub,
        proteinTargetG: 140,
        calorieTargetKcal: 2200,
        stores: data.stores,
      });

      toast.success('Профиль сохранён!');
      navigate('/list', { replace: true });
    } catch {
      toast.error('Не удалось сохранить профиль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen min-h-dvh flex flex-col justify-center"
      style={{ background: 'linear-gradient(160deg, var(--MainColor) 0%, rgba(123,208,98,0.12) 100%)' }}
    >
      <div className="px-0">
        <OnboardingWizard onComplete={handleComplete} isLoading={isLoading} />
      </div>
    </div>
  );
}
