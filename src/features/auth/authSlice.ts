import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') return { user: null, token: null, isAuthenticated: false };
  
  const token = Cookies.get('token');
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      // Basic rehydration. name and profileImage will be fetched by getMe API call if needed
      return {
        user: { 
          id: decoded.userId, 
          role: decoded.role, 
          email: decoded.email,
          name: decoded.name || 'User' 
        },
        token,
        isAuthenticated: true,
      };
    } catch (err) {
      return { user: null, token: null, isAuthenticated: false };
    }
  }
  return { user: null, token: null, isAuthenticated: false };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, accessToken } }: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      Cookies.set('token', accessToken, { expires: 7 }); 
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
