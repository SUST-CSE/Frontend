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
  Skeleton,
  Drawer,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Badge
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
  LucideBoxes,
  LucideUsers,
  LucideMail,
  LucideSettings as LucideSettingsIcon,
  LucideFileText,
  LucideMenu,
  LucideX,
  LucideDollarSign
} from 'lucide-react';
import gsap from 'gsap';
import { useRef, useMemo } from 'react';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import MyBlogsList from '@/components/dashboard/MyBlogsList';
import ComposeBlog from '@/components/dashboard/ComposeBlog';
import MyApplicationsSection from '@/components/dashboard/MyApplicationsSection';
import ComposeApplication from '@/components/dashboard/ComposeApplication';
import MyWorkSection from '@/components/dashboard/MyWorkSection';
import FinanceTransparencySection from '@/components/dashboard/FinanceTransparencySection';
import CostManager from '@/components/dashboard/CostManager';
import FinanceManager from '@/components/admin/FinanceManager';
import ApplicationManager from '@/components/admin/ApplicationManager';
import WorkManager from '@/components/admin/WorkManager';
import UserManager from '@/components/admin/UserManager';
import SocietyManager from '@/components/admin/SocietyManager';
import ProductManager from '@/components/admin/ProductManager';
import MessengerManager from '@/components/admin/MessengerManager';
import ImportantDataPage from '@/app/admin/dashboard/important-data/page';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactElement;
  component: React.ReactNode;
  permission?: string;
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: userData, isLoading, error } = useGetMeQuery(undefined, {
    pollingInterval: 30000, // Sync permissions every 30s
  });
  const user = userData?.data;
  const permissions = useMemo(() => user?.permissions || [], [user]);
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

  // GSAP Entrance Animations
  useEffect(() => {
    if (!isLoading && user) {
      const ctx = gsap.context(() => {
        // Header animation
        gsap.from('.dashboard-header', {
          y: -30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        });

        // Profile card
        gsap.from('.profile-card', {
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'back.out(1.2)'
        });

        // Management cards stagger
        gsap.from('.management-card', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: 'power3.out'
        });
      });

      return () => ctx.revert();
    }
  }, [isLoading, user]);

  // Tab change animation
  useEffect(() => {
    gsap.fromTo('.tab-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [activeTab]);

// ... 

  const tabs: TabConfig[] = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: <LucideLayoutDashboard size={18} />, component: null },
    { id: 'finance', label: 'Department Finance', icon: <LucideWallet size={18} />, component: <FinanceTransparencySection /> },
    { id: 'work', label: 'Your Work', icon: <LucideBriefcase size={18} />, component: <MyWorkSection /> },
    { id: 'applications', label: 'Applications', icon: <LucideFileText size={18} />, component: <MyApplicationsSection /> },
    { id: 'write-app', label: 'Write Application', icon: <LucidePenTool size={18} />, component: <ComposeApplication onSuccess={() => setActiveTab(3)} /> },
    { id: 'blogs', label: 'My Blogs', icon: <LucideBookOpen size={18} />, component: <MyBlogsList /> },
    { id: 'write', label: 'Write Blog', icon: <LucidePenTool size={18} />, component: <ComposeBlog onSuccess={() => setActiveTab(5)} /> },
  ], [setActiveTab]);

  const managementTabs = useMemo(() => {
    const list: TabConfig[] = [];
    if (isAdmin || permissions.includes('MANAGE_ACCOUNTS')) {
      list.push({ id: 'manage-finance', label: 'Manage Finance', icon: <LucideWallet size={18} />, component: <FinanceManager /> });
    }
    
    // Check for ANY application management or approval permission
    const hasAppPermission = isAdmin || 
      permissions.includes('MANAGE_APPLICATIONS') ||
      permissions.includes('APPROVE_APPLICATION_L0') ||
      permissions.includes('APPROVE_APPLICATION_L1') ||
      permissions.includes('APPROVE_APPLICATION_L2');
      
    if (hasAppPermission) {
      list.push({ id: 'apps', label: 'Manage Apps', icon: <LucideClipboardList size={18} />, component: <ApplicationManager /> });
    }
    if (isAdmin || permissions.includes('MANAGE_WORK')) {
      list.push({ id: 'work-manager', label: 'Manage Work', icon: <LucideBriefcase size={18} />, component: <WorkManager /> });
    }
    if (isAdmin || permissions.includes('MANAGE_USERS')) {
      list.push({ id: 'user-manager', label: 'Manage Users', icon: <LucideUsers size={18} />, component: <UserManager /> });
    }
    if (isAdmin || permissions.includes('MANAGE_SOCIETIES')) {
      list.push({ id: 'society-manager', label: 'Manage Societies', icon: <LucideBoxes size={18} />, component: <SocietyManager /> });
    }
    if (isAdmin || permissions.includes('MANAGE_CONTENT')) {
      list.push({ id: 'product-manager', label: 'Manage Projects', icon: <LucideLayoutDashboard size={18} />, component: <ProductManager /> });
    }
    if (isAdmin || permissions.includes('VIEW_EMAIL_LOGS')) {
      list.push({ id: 'messenger', label: 'Broadcaster', icon: <LucideMail size={18} />, component: <MessengerManager /> });
    }
    if (isAdmin || permissions.includes('MANAGE_IMPORTANT_DATA')) {
      list.push({ id: 'important-data', label: 'Important Data', icon: <LucideFileText size={18} />, component: <ImportantDataPage /> });
    }
    const hasCostPermission = isAdmin || permissions.some((p: string) => p.startsWith('SUBMIT_COST') || p.startsWith('APPROVE_COST'));
    if (hasCostPermission) {
      list.push({ 
        id: 'cost-manager', 
        label: 'Cost Management', 
        icon: <LucideDollarSign size={18} />, 
        component: <CostManager permissions={permissions} isAdmin={isAdmin} /> 
      });
    }
    return list;
  }, [isAdmin, permissions]);

  // Combine tabs
  const allTabs = useMemo(() => {
    const combined = [...tabs, ...managementTabs];
    // Settings is always last
    combined.push({ id: 'settings', label: 'Account Settings', icon: <LucideSettings size={18} />, component: <ProfileSettings user={user} /> });
    return combined;
  }, [tabs, managementTabs, user]);

  // Bottom nav tabs (mobile - show most important)
  const bottomNavTabs = useMemo(() => [
    { ...allTabs[0], value: 0 }, // Overview
    { ...allTabs[1], value: 1 }, // Finance
    { ...allTabs[2], value: 2 }, // Blogs
    { label: 'More', icon: <LucideMenu size={18} />, value: -1, onClick: () => setDrawerOpen(true) }
  ], [allTabs]);

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
        {/* Header */}
        <Box ref={headerRef} className="dashboard-header" sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="#002147" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
              Teacher <span style={{ color: '#16a34a' }}>Dashboard</span>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, <span style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</span>
            </Typography>
            {managementTabs.length > 0 && (
              <Chip 
                label={`${managementTabs.length} Special ${managementTabs.length === 1 ? 'Permission' : 'Permissions'}`} 
                size="small" 
                sx={{ mt: 1, bgcolor: '#dcfce7', color: '#166534', fontWeight: 800, fontSize: '0.7rem' }} 
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, bgcolor: '#002147', color: '#fff', '&:hover': { bgcolor: '#001529' } }}
            >
              <LucideMenu size={20} />
            </IconButton>
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

          <Box sx={{ p: { xs: 2, md: 5 } }} className="tab-content">
            {activeTab === 0 ? (
              <Grid container spacing={4}>
                {/* Profile Card Summary */}
                <Grid size={{ xs: 12, md: 4 }} ref={profileRef}>
                  <Paper elevation={0} className="profile-card" sx={{ p: 3, borderRadius: 4, textAlign: 'center', border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
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
                              <Paper className="management-card" 
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

        {/* Mobile Content (visible on mobile) */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }} className="tab-content">
          {activeTab === 0 ? (
            <Grid container spacing={3}>
              {/* Mobile Profile Card */}
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} className="profile-card" sx={{ p: 3, borderRadius: 4, textAlign: 'center', border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                  <Avatar
                    src={user.profileImage}
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" fontWeight={800} color="#002147">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ wordBreak: 'break-all' }}>{user.email}</Typography>
                  <Chip label={user.role} size="small" sx={{ mt: 1, bgcolor: '#002147', color: 'white', fontWeight: 800, fontSize: '0.65rem' }} />
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}><LucidePhone size={14} /></Box>
                      <Typography variant="body2" fontWeight={600} fontSize="0.85rem">{user.phone || 'No phone set'}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Management Access */}
              {(isAdmin || managementTabs.length > 0) && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={900} color="#002147" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                    Special Permissions ({managementTabs.length + (isAdmin ? 1 : 0)})
                  </Typography>
                  <Grid container spacing={2}>
                    {isAdmin && (
                      <Grid size={{ xs: 12 }} className="management-card">
                        <Paper
                          onClick={() => router.push('/admin/dashboard')}
                          elevation={0}
                          sx={{ p: 2.5, borderRadius: 3, border: '1px solid #16a34a20', bgcolor: '#f0fdf4', cursor: 'pointer' }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#16a34a', color: '#fff' }}>
                              <LucideSettingsIcon size={18} />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2" fontWeight={800} color="#166534">Admin Panel</Typography>
                              <Typography variant="caption" color="#16653490" display="block">Full system control</Typography>
                            </Box>
                            <LucideArrowRight size={16} color="#16a34a" />
                          </Stack>
                        </Paper>
                      </Grid>
                    )}
                    {managementTabs.map((mTab: TabConfig, idx) => (
                      <Grid size={{ xs: 12 }} key={mTab.id} className="management-card">
                        <Paper
                          onClick={() => { setActiveTab(tabs.length + idx); setDrawerOpen(false); }}
                          elevation={0}
                          sx={{ p: 2.5, borderRadius: 3, border: '1px solid #00214710', bgcolor: '#fff', cursor: 'pointer' }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#002147', color: '#fff' }}>
                              {mTab.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2" fontWeight={800} color="#002147">{mTab.label}</Typography>
                              <Typography variant="caption" color="text.secondary" display="block">Delegated Authority</Typography>
                            </Box>
                            <LucideArrowRight size={16} color="#002147" />
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}

              {/* Academic Details */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" fontWeight={900} color="#002147" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                  Professional Profile
                </Typography>
                <Grid container spacing={1.5}>
                  {[
                    { label: 'Designation', value: user.designation },
                    { label: 'Department', value: user.department },
                  ].map((detail) => (
                    <Grid size={{ xs: 6 }} key={detail.label} className="academic-detail">
                      <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={800} fontSize="0.65rem">{detail.label.toUpperCase()}</Typography>
                        <Typography variant="body2" fontWeight={700} color="#002147" fontSize="0.85rem">{detail.value}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ minHeight: '60vh' }}>
              {allTabs[activeTab]?.component}
            </Box>
          )}
        </Box>

        {/* Mobile Bottom Navigation */}
        <Paper 
          elevation={3} 
          sx={{ 
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            borderRadius: '16px 16px 0 0',
            borderTop: '1px solid #e2e8f0'
          }}
        >
          <BottomNavigation
            value={activeTab}
            onChange={(_, newValue) => {
              if (newValue === -1) {
                setDrawerOpen(true);
              } else {
                setActiveTab(newValue);
              }
            }}
            sx={{ height: 64, bgcolor: '#ffffff', borderRadius: '16px 16px 0 0' }}
          >
            {bottomNavTabs.map((tab, idx) => (
              <BottomNavigationAction
                key={idx}
                label={tab.label}
                icon={tab.value === -1 ? <Badge badgeContent={allTabs.length - 3} color="primary">{tab.icon}</Badge> : tab.icon}
                value={tab.value}
                sx={{ 
                  minWidth: 'auto',
                  '&.Mui-selected': { 
                    color: '#002147',
                    '& .MuiBottomNavigationAction-label': { fontWeight: 800 }
                  }
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>

        {/* Full Tab List Drawer (Mobile) */}
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px 16px 0 0',
              maxHeight: '80vh',
              bgcolor: '#f8fafc'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={900} color="#002147">All Sections</Typography>
              <IconButton onClick={() => setDrawerOpen(false)} size="small">
                <LucideX size={20} />
              </IconButton>
            </Box>
            <Stack spacing={1.5}>
              {allTabs.map((tab, idx) => (
                <Paper
                  key={tab.id}
                  elevation={0}
                  onClick={() => {
                    setActiveTab(idx);
                    setDrawerOpen(false);
                  }}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: activeTab === idx ? '2px solid #002147' : '1px solid #e2e8f0',
                    bgcolor: activeTab === idx ? '#00214708' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:active': { transform: 'scale(0.98)' }
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ color: activeTab === idx ? '#002147' : '#64748b' }}>
                      {tab.icon}
                    </Box>
                    <Typography 
                      variant="body1" 
                      fontWeight={activeTab === idx ? 800 : 600} 
                      color={activeTab === idx ? '#002147' : 'text.primary'}
                      sx={{ flexGrow: 1 }}
                    >
                      {tab.label}
                    </Typography>
                    {activeTab === idx && <LucideArrowRight size={18} color="#002147" />}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
}
