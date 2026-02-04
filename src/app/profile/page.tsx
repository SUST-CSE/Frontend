'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Avatar, 
  Button,
  Stack,
  Chip,
  Skeleton
} from '@mui/material';
import { LucideLayoutDashboard, LucideLogOut, LucideUser, LucideMail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery, useLogoutUserMutation } from '@/features/auth/authApi';
import { logout } from '@/features/auth/authSlice';
import { RootState } from '@/store';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: userData, isLoading } = useGetMeQuery(undefined, { skip: !isAuthenticated });
  const [logoutUser] = useLogoutUserMutation();

  const { user: reduxUser } = useSelector((state: RootState) => state.auth);
  
  // Use query data if available, otherwise fall back to redux state
  const user = userData?.data || reduxUser;

  useEffect(() => {
    if (user) {
      console.log('Current User for Dashboard Redirect:', user);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutUser({}).unwrap();
    } catch (err) {
      console.error('Logout failed on server', err);
    } finally {
      dispatch(logout()); // Always clear client state
      router.push('/login');
    }
  };

  const handleDashboardRedirect = () => {
    const role = user?.role?.toUpperCase();
    
    if (!role) {
      toast.error(`User role not found. Please try logging in again.`);
      return;
    }

    if (role === 'STUDENT') router.push('/dashboard/student');
    else if (role === 'TEACHER') router.push('/dashboard/teacher');
    else if (role === 'ADMIN') router.push('/admin/dashboard');
    else {
      toast.error(`Dashboard not available for role: ${role}`);
      router.push('/');
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <Box sx={{ py: 8, bgcolor: '#ffffff', minHeight: '100vh' }}>
        <Container maxWidth="md">
          <Skeleton width={300} height={60} sx={{ mb: 4 }} />
          <Paper elevation={0} sx={{ p: 6, borderRadius: 6, border: '1px solid #e5e7eb', mt: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
              <Skeleton variant="circular" width={150} height={150} />
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Skeleton width="60%" height={40} sx={{ mb: 1 }} />
                <Skeleton width="40%" height={24} sx={{ mb: 4 }} />
                <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Skeleton width={150} height={48} />
                  <Skeleton width={150} height={48} />
                </Stack>
              </Box>
            </Stack>
            <Skeleton width="30%" height={32} sx={{ mt: 8, mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} color="#000000" gutterBottom>
          My <span style={{ color: '#16a34a' }}>Profile</span>
        </Typography>

        <Paper elevation={0} sx={{ p: 6, borderRadius: 6, border: '1px solid #e5e7eb', mt: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={user?.profileImage} 
                alt={user?.name}
                sx={{ width: 150, height: 150, border: '4px solid #f8fafc', boxShadow: '0 0 0 2px #e2e8f0' }}
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 5, 
                  right: 5, 
                  bgcolor: '#16a34a', 
                  borderRadius: '50%', 
                  p: 1, 
                  border: '4px solid #ffffff' 
                }}
              >
                <LucideUser size={20} color="#ffffff" />
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
               <Stack direction="row" alignItems="center" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 1 }}>
                  <Typography variant="h4" fontWeight={800} color="#000000">{user?.name}</Typography>
                  <Chip 
                    label={user?.role} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#000000', 
                      color: '#ffffff', 
                      fontWeight: 800, 
                      fontSize: '0.7rem' 
                    }} 
                  />
               </Stack>
               <Stack direction="row" alignItems="center" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ color: '#64748b', mb: 4 }}>
                  <LucideMail size={18} />
                  <Typography variant="body1" fontWeight={500}>{user?.email}</Typography>
               </Stack>

               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<LucideLayoutDashboard size={20} />}
                    onClick={handleDashboardRedirect}
                    sx={{ 
                      bgcolor: '#000000', 
                      color: '#ffffff', 
                      fontWeight: 700, 
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#16a34a' }
                    }}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LucideLogOut size={20} />}
                    onClick={handleLogout}
                    sx={{ 
                      borderColor: '#ef4444', 
                      color: '#ef4444', 
                      fontWeight: 700, 
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#fef2f2', borderColor: '#ef4444' }
                    }}
                  >
                    Logout
                  </Button>
               </Stack>
            </Box>
          </Stack>

          <Stack sx={{ mt: 8 }} spacing={3}>
             <Typography variant="h5" fontWeight={800} color="#000000">Bio & Details</Typography>
             <Paper elevation={0} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: 4 }}>
                <Typography color="text.secondary">
                   {user?.bio || "No bio available. Please update your profile."}
                </Typography>
                
                {/* Placeholder for Society Designations */}
                <Box sx={{ mt: 4 }}>
                   <Typography variant="subtitle1" fontWeight={800} gutterBottom>Society Designations</Typography>
                   <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Designation information will appear here.
                   </Typography>
                </Box>
             </Paper>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
