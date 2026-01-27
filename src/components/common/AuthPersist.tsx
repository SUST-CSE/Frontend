'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { useGetMeQuery } from '@/features/auth/authApi';
import { Box, CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function AuthPersist({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);
  }, []);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          dispatch(logout());
          setTimeout(() => setIsChecking(false), 0);
        } else {
          // Map either 'userId' or 'id' from JWT to the 'id' field our UI expects
          const userId = decoded.userId || decoded.id;
          if (userId && decoded.role) {
             dispatch(setCredentials({ 
                user: { id: userId, role: decoded.role, name: decoded.name || 'User', email: decoded.email || '' }, 
                accessToken: storedToken 
             }));
          }
          setTimeout(() => setToken(storedToken), 0);
        }
      } catch {
        dispatch(logout());
        setTimeout(() => setIsChecking(false), 0);
      }
    } else {
      setTimeout(() => setIsChecking(false), 0);
    }
  }, [dispatch]);

  const { data, isError, isSuccess } = useGetMeQuery(undefined, {
    skip: !token, 
  });

  useEffect(() => {
    if (!token) return;

    if (isSuccess && data) {
       dispatch(setCredentials({ user: data.data, accessToken: token }));
       setTimeout(() => setIsChecking(false), 0);
    } else if (isError) {
       dispatch(logout());
       setTimeout(() => setIsChecking(false), 0);
    }
  }, [token, data, isError, isSuccess, dispatch]);

  if (!isMounted) return null;

  if (isChecking && !token) {
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
           <CircularProgress size={40} sx={{ color: '#000000' }} />
        </Box>
     );
  }

  return <>{children}</>;
}
