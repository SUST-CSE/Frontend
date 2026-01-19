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
    setIsMounted(true);
    const storedToken = Cookies.get('token');
    
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          dispatch(logout());
          setIsChecking(false);
        } else {
          // Verify we have enough data to hydrate a temporary user state
          if (decoded.id && decoded.role) {
             // Optimistically set credentials so the app knows we are authenticated content
             dispatch(setCredentials({ 
                user: { id: decoded.id, role: decoded.role, name: decoded.name || 'User', email: decoded.email || '' }, 
                accessToken: storedToken 
             }));
          }
          setToken(storedToken);
        }
      } catch {
        dispatch(logout());
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [dispatch]);

  const { data, isError, isSuccess } = useGetMeQuery(undefined, {
    skip: !token, 
  });

  useEffect(() => {
    if (!token) return;

    if (isSuccess && data) {
       // Update with full fresh data from server
       dispatch(setCredentials({ user: data.data, accessToken: token }));
       setIsChecking(false);
    } else if (isError) {
       dispatch(logout());
       setIsChecking(false);
    }
  }, [token, data, isError, isSuccess, dispatch]);

  if (!isMounted) return null;

  if (isChecking && !token) {
     // Only block if we haven't even found a token yet or are in the middle of initial decode
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
           <CircularProgress size={40} sx={{ color: '#000000' }} />
        </Box>
     );
  }

  return <>{children}</>;
}
