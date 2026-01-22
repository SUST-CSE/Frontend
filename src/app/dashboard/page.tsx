'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (user?.role === 'TEACHER') {
      router.push('/dashboard/teacher');
    } else if (user?.role === 'STUDENT') {
        // Assuming student dashboard path, might be just /dashboard/student
      router.push('/dashboard/student');
    }
  }, [isAuthenticated, user, router]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">Redirecting to your dashboard...</Typography>
      
      {/* Fallback if redirect is slow or fails */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button component={Link} href="/login" variant="outlined" size="small">
            Go to Login
        </Button>
        <Button component={Link} href="/" variant="outlined" size="small">
            Go Home
        </Button>
      </Box>
    </Box>
  );
}
