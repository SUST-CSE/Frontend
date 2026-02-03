'use client';

import { Box, Typography, Grid, Paper, Stack, Button } from '@mui/material';
import { LucideFileText, LucideUsers, LucideActivity } from 'lucide-react';
import { useGetBlogsQuery, useGetPendingBlogsQuery } from '@/features/blog/blogApi';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '@/features/user/userApi';
import { useGetNoticesQuery } from '@/features/content/contentApi';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  
  // Queries
  const { data: pendingData } = useGetPendingBlogsQuery({}, { skip: user?.role !== 'ADMIN' && !user?.permissions?.includes('MANAGE_BLOGS') });
  const { data: allBlogs } = useGetBlogsQuery({}, { skip: user?.role !== 'ADMIN' && !user?.permissions?.includes('MANAGE_BLOGS') });
  const { data: userData } = useGetAllUsersQuery({ limit: 1 }, { skip: user?.role !== 'ADMIN' && !user?.permissions?.includes('MANAGE_USERS') });
  const { data: noticeData } = useGetNoticesQuery({}, { skip: user?.role !== 'ADMIN' && !user?.permissions?.includes('MANAGE_NOTICES') });

  // Counts
  const pendingCount = pendingData?.data?.length || 0;
  const totalBlogs = allBlogs?.data?.length || 0;
  const totalUsers = userData?.data?.total || 0;
  const totalNotices = Array.isArray(noticeData) ? noticeData.length : 0;
 
  const STATS = [
    { label: 'Pending Blogs', value: pendingCount, icon: LucideFileText, color: '#eab308', permission: 'MANAGE_BLOGS' },
    { label: 'Total Blogs', value: totalBlogs, icon: LucideFileText, color: '#3b82f6', permission: 'MANAGE_BLOGS' },
    { label: 'Total Users', value: totalUsers, icon: LucideUsers, color: '#16a34a', permission: 'MANAGE_USERS' },
    { label: 'Published Notices', value: totalNotices, icon: LucideActivity, color: '#8b5cf6', permission: 'MANAGE_NOTICES' },
  ].filter(s => user?.role === 'ADMIN' || (s.permission === 'ADMIN' ? false : user?.permissions?.includes(s.permission)));

  const QUICK_ACTIONS = [
    { label: 'Compose Notice', href: '/admin/dashboard/content', permission: 'MANAGE_NOTICES' },
    { label: 'Send Direct Message', href: '/admin/dashboard/messenger', permission: 'ADMIN' },
    { label: 'Manage Users', href: '/admin/dashboard/users', permission: 'MANAGE_USERS' },
  ].filter(a => user?.role === 'ADMIN' || (a.permission === 'ADMIN' ? false : user?.permissions?.includes(a.permission)));

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ letterSpacing: -1, mb: 1 }}>
          Dashboard <span style={{ color: '#16a34a' }}>Overview</span>
        </Typography>
        <Typography color="text.secondary" fontWeight={500}>
          Welcome back, {user?.name}. Here&apos;s what&apos;s happening today.
        </Typography>
      </Box>

      {STATS.length > 0 && (
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {STATS.map((stat) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.label}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  border: '1px solid #e2e8f0',
                  bgcolor: '#fff',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    borderColor: stat.color
                  }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ mb: 0.5 }}>{stat.value}</Typography>
                      <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>{stat.label}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: `${stat.color}10`, color: stat.color, display: 'flex' }}>
                      <stat.icon size={24} />
                    </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
         <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 4, bgcolor: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', minHeight: 300 }}>
               <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Recent Activity</Typography>
               <Box sx={{ py: 10, textAlign: 'center' }}>
                  <Typography color="text.secondary">No recent admin activities recorded.</Typography>
               </Box>
            </Paper>
         </Grid>
         <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, bgcolor: '#111', color: '#fff', borderRadius: 6, border: '1px solid #333' }}>
               <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Quick Actions</Typography>
                <Stack spacing={2}>
                  {QUICK_ACTIONS.map((action) => (
                    <Button 
                      key={action.label}
                      variant="contained" 
                      sx={{ 
                        bgcolor: action.label === 'Compose Notice' ? '#16a34a' : 'transparent', 
                        color: action.label === 'Compose Notice' ? '#fff' : '#fff',
                        border: action.label === 'Compose Notice' ? 'none' : '1px solid #333',
                        '&:hover': { 
                          bgcolor: action.label === 'Compose Notice' ? '#15803d' : 'rgba(255,255,255,0.05)',
                          borderColor: '#fff'
                        }, 
                        py: 1.5 
                      }}
                      onClick={() => router.push(action.href)}
                    >
                      {action.label}
                    </Button>
                  ))}
                  {QUICK_ACTIONS.length === 0 && (
                    <Typography variant="caption" color="text.disabled">No quick actions available.</Typography>
                  )}
               </Stack>
            </Paper>
         </Grid>
      </Grid>
    </Box>
  );
}
