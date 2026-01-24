'use client';

import { Box, Typography, Grid, Paper, Stack, Button } from '@mui/material';
import { LucideFileText, LucideUsers, LucideActivity } from 'lucide-react';
import { useGetBlogsQuery, useGetPendingBlogsQuery } from '@/features/blog/blogApi';
import { useRouter } from 'next/navigation';
// import { useGetStatsQuery } from '@/features/admin/adminApi'; // Placeholder

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: pendingData } = useGetPendingBlogsQuery({});
  const { data: allBlogs } = useGetBlogsQuery({});
  
  const pendingCount = pendingData?.data?.length || 0;
  const totalBlogs = allBlogs?.data?.length || 0;
 
  const STATS = [
    { label: 'Pending Blogs', value: pendingCount, icon: LucideFileText, color: '#eab308' },
    { label: 'Total Blogs', value: totalBlogs, icon: LucideFileText, color: '#3b82f6' },
    { label: 'Active Users', value: '1,234', icon: LucideUsers, color: '#16a34a' },
    { label: 'Site Visits', value: '45.2k', icon: LucideActivity, color: '#8b5cf6' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ letterSpacing: -1, mb: 1 }}>
          Dashboard <span style={{ color: '#16a34a' }}>Overview</span>
        </Typography>
        <Typography color="text.secondary" fontWeight={500}>
          Welcome back, administrator. Here&apos;s what&apos;s happening today.
        </Typography>
      </Box>

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
                  <Button 
                    variant="contained" 
                    sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, py: 1.5 }}
                    onClick={() => router.push('/admin/dashboard/content')}
                  >
                     Compose Notice
                  </Button>
                  <Button 
                    variant="outlined" 
                    sx={{ borderColor: '#333', color: '#fff', '&:hover': { borderColor: '#fff' }, py: 1.5 }}
                    onClick={() => router.push('/admin/dashboard/messenger')}
                  >
                     Send Direct Message
                  </Button>
                  <Button 
                    variant="outlined" 
                    sx={{ borderColor: '#333', color: '#fff', '&:hover': { borderColor: '#fff' }, py: 1.5 }}
                    onClick={() => router.push('/admin/dashboard/users')}
                  >
                     Manage Users
                  </Button>
               </Stack>
            </Paper>
         </Grid>
      </Grid>
    </Box>
  );
}
