import { create } from 'zustand';
import { toast } from 'sonner';
import type { SigninData, SignupData } from '@/types/auth/auth.type';
import { authService } from '@/services/auth.service';
import type { AuthState } from '@/types/stores/stores';
import { persist } from 'zustand/middleware';
import { useChatStore } from './useChatStore';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,
      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        // localStorage.clear();
        useChatStore.getState().reset();
      },
      setAccessToken: (accessToken: string) => {
        set({ accessToken });
      },
      signUp: async (data: SignupData) => {
        set({ loading: true });
        try {
          await authService.signUp(data);
          toast.success('Đăng ký thành công');
        } catch (error) {
          console.error(error);
          toast.error('Đăng ký thất bại');
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (data: SigninData) => {
        set({ loading: true });
        // localStorage.clear();
        useChatStore.getState().reset();
        try {
          const response = await authService.signIn(data);
          get().setAccessToken(response.accessToken);
          await get().fetchMe();
          await useChatStore.getState().fetchConversations();
          toast.success('Đăng nhập thành công');
        } catch (error) {
          console.error(error);
          toast.error('Đăng nhập thất bại');
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          await authService.signOut();
          get().clearState();
          toast.success('Đăng xuất thành công');
        } catch (error) {
          console.error(error);
          toast.error('Đăng xuất thất bại');
          throw error;
        }
      },
      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();

          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          // toast.error('Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!');
        } finally {
          set({ loading: false });
        }
      },

      refreshToken: async () => {
        set({ loading: true });
        try {
          const { user, fetchMe } = get();
          const accessToken = await authService.refreshToken();
          get().setAccessToken(accessToken);
          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          console.error(error);
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);
