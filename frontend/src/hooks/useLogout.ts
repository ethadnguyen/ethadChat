import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const handleLogout = useCallback(async () => {
    await signOut().then(() => {
      navigate('/signin');
    });
  }, [navigate, signOut]);

  return handleLogout;
};
