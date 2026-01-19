'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress, 
  Divider,
  Stack,
  Avatar,
  Chip
} from '@mui/material';
import { useGetMeQuery } from '@/features/auth/authApi';
import { LucideUser, LucideGraduationCap, LucideMail, LucidePhone } from 'lucide-react';

export default function StudentDashboard() {
  const { data: userData, isLoading, error } = useGetMeQuery(undefined);
  const user = userData?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Failed to load profile. Please log in again.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Welcome Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={800} color="#0f172a">
            Welcome, {user?.name} 👋
          </Typography>
          <Typography color="text.secondary">
            Here's an overview of your academic profile
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
              <Avatar 
                src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=random`} 
                alt={user?.name}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#002147', fontSize: '2rem' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Chip label="Student" size="small" sx={{ mt: 1, bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 700 }} />
              
              <Divider sx={{ my: 3 }} />
              
              <Stack spacing={2} textAlign="left">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LucideMail size={18} color="#64748b" />
                  <Typography variant="body2">{user?.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LucidePhone size={18} color="#64748b" />
                  <Typography variant="body2">{user?.phone || 'N/A'}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Academic Stats / Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
               <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <LucideGraduationCap color="#002147" /> Academic Information
               </Typography>
               <Divider sx={{ mb: 3 }} />

               <Grid container spacing={3}>
                 <Grid item xs={6} sm={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>STUDENT ID</Typography>
                    <Typography variant="body1" fontWeight={600}>{user?.studentId || 'N/A'}</Typography>
                 </Grid>
                 <Grid item xs={6} sm={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>BATCH</Typography>
                    <Typography variant="body1" fontWeight={600}>{user?.batch || 'N/A'}</Typography>
                 </Grid>
                 <Grid item xs={6} sm={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>SESSION</Typography>
                    <Typography variant="body1" fontWeight={600}>{user?.session || 'N/A'}</Typography>
                 </Grid>
                 <Grid item xs={6} sm={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>ENROLLMENT YEAR</Typography>
                    <Typography variant="body1" fontWeight={600}>{user?.enrollmentYear || 'N/A'}</Typography>
                 </Grid>
               </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
