'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Divider,
  Stack,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Skeleton
} from '@mui/material';
import { useGetMeQuery } from '@/features/auth/authApi';
import { 
  LucideBriefcase, 
  LucidePhone, 
  LucideLayoutDashboard,
  LucideBookOpen,
  LucidePenTool,
  LucideSettings,
  LucideWallet,
  LucideClipboardList,
  LucideLogOut,
  LucideArrowRight,
  LucideBell,
  LucideTrophy,
  LucideBoxes,
  LucideUsers,
  LucideCalendar,
  LucideMail,
  LucideSettings as LucideSettingsIcon
} from 'lucide-react';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import MyBlogsList from '@/components/dashboard/MyBlogsList';
import ComposeBlog from '@/components/dashboard/ComposeBlog';
import FinanceTransparencySection from '@/components/dashboard/FinanceTransparencySection';
import FinanceManager from '@/components/admin/FinanceManager';
import ApplicationManager from '@/components/admin/ApplicationManager';
import WorkManager from '@/components/admin/WorkManager';
import UserManager from '@/components/admin/UserManager';
import BlogModerator from '@/components/admin/BlogModerator';
import NoticeManager from '@/components/admin/NoticeManager';
import EventManager from '@/components/admin/EventManager';
import AchievementManager from '@/components/admin/AchievementManager';
import SocietyManager from '@/components/admin/SocietyManager';
import ProductManager from '@/components/admin/ProductManager';
import MessengerManager from '@/components/admin/MessengerManager';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: userData, isLoading, error } = useGetMeQuery(undefined, {
    pollingInterval: 30000, // Sync permissions every 30s
  });
  const user = userData?.data;
  const permissions = user?.permissions || [];
  const isAdmin = user?.role === 'ADMIN';

  // Sync Redux state with fresh user data from getMe
  useEffect(() => {
    if (user) {
      const token = Cookies.get('token');
      if (token) {
        dispatch(setCredentials({ user, accessToken: token }));
      }
    }
  }, [user, dispatch]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LucideLayoutDashboard size={18} />, component: null },
    { id: 'finance', label: 'Department Finance', icon: <LucideWallet size={18} />, component: <FinanceTransparencySection /> },
    { id: 'blogs', label: 'My Blogs', icon: <LucideBookOpen size={18} />, component: <MyBlogsList /> },
    { id: 'write', label: 'Write Blog', icon: <LucidePenTool size={18} />, component: <ComposeBlog onSuccess={() => setActiveTab(2)} /> },
  ];

  const managementTabs = [];
  if (isAdmin || permissions.includes('MANAGE_ACCOUNTS')) {
    managementTabs.push({ id: 'manage-finance', label: 'Manage Finance', icon: <LucideWallet size={18} />, component: <FinanceManager /> });
  }

  if (isAdmin || permissions.includes('MANAGE_APPLICATIONS')) {
    managementTabs.push({ id: 'apps', label: 'Manage Apps', icon: <LucideClipboardList size={18} />, component: <ApplicationManager /> });
  }

  if (isAdmin || permissions.includes('MANAGE_WORK')) {
    managementTabs.push({ id: 'work-manager', label: 'Manage Work', icon: <LucideBriefcase size={18} />, component: <WorkManager /> });
  }

  if (isAdmin || permissions.includes('MANAGE_USERS')) {
    managementTabs.push({ id: 'user-manager', label: 'Manage Users', icon: <LucideUsers size={18} />, component: <UserManager /> });
  }

  if (isAdmin || permissions.includes('MANAGE_BLOGS')) {
    managementTabs.push({ id: 'blog-moderator', label: 'Moderate Blogs', icon: <LucideBookOpen size={18} />, component: <BlogModerator /> });
  }

  if (isAdmin || permissions.includes('MANAGE_NOTICES')) {
    managementTabs.push({ id: 'notice-manager', label: 'Manage Notices', icon: <LucideBell size={18} />, component: <NoticeManager /> });
  }

  if (isAdmin || permissions.includes('MANAGE_EVENTS')) {
    managementTabs.push({ id: 'event-manager', label: 'Manage Events', icon: <LucideCalendar size={18} />, component: <EventManager /> });
  }

  if (isAdmin || permissions.includes('MANAGE_ACHIEVEMENTS')) {
    managementTabs.push({ id: 'achievement-manager', label: 'Achievements', icon: <LucideTrophy size={18} />, component: <AchievementManager /> });
  }

  if (isAdmin || permissions.includes('MANAGE_SOCIETIES')) {
    managementTabs.push({ id: 'society-manager', label: 'Manage Societies', icon: <LucideBoxes size={18} />, component: <SocietyManager /> });
  }

  if (isAdmin || permissions.includes('MANAGE_CONTENT')) {
    managementTabs.push({ id: 'product-manager', label: 'Manage Projects', icon: <LucideLayoutDashboard size={18} />, component: <ProductManager /> });
  }

  if (isAdmin || permissions.includes('VIEW_EMAIL_LOGS')) {
    managementTabs.push({ id: 'messenger', label: 'Broadcaster', icon: <LucideMail size={18} />, component: <MessengerManager /> });
  }

  // Combine tabs
  const allTabs = [...tabs, ...managementTabs];

  // Settings is always last
  allTabs.push({ id: 'settings', label: 'Account Settings', icon: <LucideSettings size={18} />, component: <ProfileSettings user={user} /> });

  if (isLoading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: { xs: 2, md: 5 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Skeleton width={300} height={48} sx={{ mb: 1 }} />
            <Skeleton width={200} height={24} />
          </Box>
          <Skeleton width={120} height={40} sx={{ borderRadius: 2 }} />
        </Box>
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Skeleton width="100%" height={64} />
          <Box sx={{ p: { xs: 2, md: 5 } }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 2 }} />
                  <Skeleton width="60%" height={32} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton width="40%" height={20} sx={{ mx: 'auto', mb: 3 }} />
                  <Skeleton width="100%" height={1} sx={{ my: 3 }} />
                  <Stack spacing={2}>
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                  </Stack>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Skeleton width="40%" height={24} sx={{ mb: 2 }} />
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, sm: 6 }}><Skeleton height={100} sx={{ borderRadius: 3 }} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Skeleton height={100} sx={{ borderRadius: 3 }} /></Grid>
                </Grid>
                <Skeleton width="40%" height={24} sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}><Skeleton height={80} sx={{ borderRadius: 3 }} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Skeleton height={80} sx={{ borderRadius: 3 }} /></Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );

  if (error || !user) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <Typography variant="h5" fontWeight={800} gutterBottom>Session Expired</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Please log in again to access your dashboard.</Typography>
          <Button variant="contained" onClick={() => router.push('/login')} sx={{ bgcolor: '#002147' }}>Login</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: { xs: 2, md: 5 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#002147" gutterBottom>
              Teacher <span style={{ color: '#16a34a' }}>Dashboard</span>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, <span style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</span>
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<LucideLogOut size={18} />}
            onClick={() => {
              dispatch(logout());
              router.push('/login');
            }}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Logout
          </Button>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', bgcolor: '#fff' }}>
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
            {allTabs.map((tab) => (
              <Tab
                key={tab.id}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
              />
            ))}
          </Tabs>

          <Box sx={{ p: { xs: 2, md: 5 } }}>
            {activeTab === 0 ? (
              <Grid container spacing={4}>
                {/* Profile Card Summary */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, textAlign: 'center', border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                    <Avatar
                      src={user.profileImage}
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" fontWeight={800} color="#002147">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ wordBreak: 'break-all' }}>{user.email}</Typography>
                    <Chip label={user.role} size="small" sx={{ mt: 1, bgcolor: '#475569', color: 'white', fontWeight: 800, fontSize: '0.65rem' }} />

                    <Divider sx={{ my: 3 }} />
                    <Stack spacing={2} sx={{ textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}><LucidePhone size={16} /></Box>
                        <Typography variant="body2" fontWeight={600}>{user.phone || 'No phone set'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}><LucideBriefcase size={16} /></Box>
                        <Typography variant="body2" fontWeight={600}>{user.designation || 'Faculty Member'}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Professional Details & Quick Actions */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={4}>
                    {/* Management Access (Quick Actions) */}
                    {(isAdmin || managementTabs.length > 0) && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight={900} color="#002147" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                          Privileged Management Access
                        </Typography>
                        <Grid container spacing={2}>
                          {isAdmin && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Paper 
                                onClick={() => router.push('/admin/dashboard')}
                                elevation={0} 
                                sx={{ p: 2.5, borderRadius: 3, border: '1px solid #16a34a20', bgcolor: '#f0fdf4', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(22,163,74,0.1)' } }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#16a34a', color: '#fff' }}>
                                    <LucideSettingsIcon size={20} />
                                  </Box>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={800} color="#166534">Admin Panel</Typography>
                                    <Typography variant="caption" color="#16653490" display="block">Full system control</Typography>
                                  </Box>
                                  <LucideArrowRight size={18} color="#16a34a" />
                                </Stack>
                              </Paper>
                            </Grid>
                          )}
                          {managementTabs.map((mTab, idx) => (
                             <Grid size={{ xs: 12, sm: 6 }} key={mTab.id}>
                               <Paper 
                                 onClick={() => setActiveTab(tabs.length + idx)}
                                 elevation={0} 
                                 sx={{ p: 2.5, borderRadius: 3, border: '1px solid #00214710', bgcolor: '#fff', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #00214740' } }}>
                                 <Stack direction="row" spacing={2} alignItems="center">
                                   <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#002147', color: '#fff' }}>
                                     {mTab.icon}
                                   </Box>
                                   <Box sx={{ flexGrow: 1 }}>
                                     <Typography variant="subtitle2" fontWeight={800} color="#002147">{mTab.label}</Typography>
                                     <Typography variant="caption" color="text.secondary" display="block">Delegated Authority</Typography>
                                   </Box>
                                   <LucideArrowRight size={18} color="#002147" />
                                 </Stack>
                               </Paper>
                             </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {/* Professional Profile */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900} color="#002147" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                        Professional Profile Details
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          { label: 'Designation', value: user.designation || 'N/A' },
                          { label: 'Department', value: 'Computer Science & Engineering' },
                          { label: 'Email', value: user.email },
                          { label: 'Role', value: user.role }
                        ].map((detail) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={detail.label}>
                            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={800}>{detail.label.toUpperCase()}</Typography>
                              <Typography variant="body1" fontWeight={700} color="#002147">{detail.value}</Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            ) : (
              allTabs[activeTab]?.component
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
