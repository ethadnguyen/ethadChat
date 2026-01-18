import api from '@/lib/axios';
import type { SigninData, SignupData } from '@/types/auth/auth.type';

export const authService = {
  signUp: async (data: SignupData) => {
    const response = await api.post('/auth/signup', data, {
      withCredentials: true,
    });
    return response.data;
  },

  signIn: async (data: SigninData) => {
    const response = await api.post('/auth/signin', data, {
      withCredentials: true,
    });
    return response.data;
  },

  signOut: async () => {
    const response = await api.post('/auth/logout', {
      withCredentials: true,
    });
    return response.data;
  },

  fetchMe: async () => {
    const response = await api.get('/users/me', {
      withCredentials: true,
    });
    return response.data.user;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh', {
      withCredentials: true,
    });
    return response.data.accessToken;
  },
};
