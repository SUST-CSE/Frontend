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
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { useGetMeQuery } from '@/features/auth/authApi';
import { 
  LucideBriefcase, 
  LucidePhone, 
  LucideLayoutDashboard,
  LucideBookOpen,
  LucidePenTool,
  LucideSettings,
  LucideWallet
} from 'lucide-react';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import MyBlogsList from '@/components/dashboard/MyBlogsList';
import ComposeBlog from '@/components/dashboard/ComposeBlog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { Button } from '@mui/material';
import { LucideLogOut } from 'lucide-react';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: userData, isLoading, error } = useGetMeQuery(undefined);
  const user = userData?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
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
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ letterSpacing: -0.5 }}>
              Welcome, {user.name} 👋
            </Typography>
            <Typography color="text.secondary">
              Managing your professional profile and research contributions
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label="Faculty Member" color="secondary" sx={{ fontWeight: 800, borderRadius: 2 }} />
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LucideWallet size={18} />}
              component={Link}
              href="/finance/history"
              sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
            >
              Dept. Finance
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LucideLogOut size={18} />}
              onClick={() => {
                dispatch(logout());
                router.push('/login');
              }}
              sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
            >
              Logout
            </Button>
          </Stack>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, mb: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              px: 3, 
              pt: 1,
              bgcolor: '#fff',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              '& .MuiTab-root': { py: 2.5, fontWeight: 700, minWidth: 160 }
            }}
          >
            <Tab icon={<LucideLayoutDashboard size={18} />} iconPosition="start" label="Overview" />
            <Tab icon={<LucideBookOpen size={18} />} iconPosition="start" label="My Blogs" />
            <Tab icon={<LucidePenTool size={18} />} iconPosition="start" label="Write Blog" />
            <Tab icon={<LucideSettings size={18} />} iconPosition="start" label="Account Settings" />
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {activeTab === 0 && (
              <Grid container spacing={4}>
                {/* Profile Card Summary */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#f1f5f9' }}>
                    <Avatar 
                      src={user.profileImage} 
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '4px solid #fff' }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{user.email}</Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <LucidePhone size={16} color="#475569" />
                        <Typography variant="body2">{user.phone || 'No phone set'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <LucideBriefcase size={16} color="#475569" />
                        <Typography variant="body2">{user.designation || 'Faculty Member'}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Professional Details Detail */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Professional Profile</Typography>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Designation', value: user.designation || 'N/A' },
                      { label: 'Department', value: 'Computer Science & Engineering' },
                      { label: 'Email', value: user.email },
                      { label: 'Role', value: user.role }
                    ].map((detail) => (
                      <Grid size={{ xs: 6 }} key={detail.label}>
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={800}>{detail.label.toUpperCase()}</Typography>
                          <Typography variant="body1" fontWeight={600} color="#002147">{detail.value}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && <MyBlogsList />}
            {activeTab === 2 && <ComposeBlog onSuccess={() => setActiveTab(1)} />}
            {activeTab === 3 && <ProfileSettings user={user} />}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
