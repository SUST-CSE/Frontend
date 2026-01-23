'use client';

import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { LucideFileText, LucideUsers, LucideActivity } from 'lucide-react';
import { useGetBlogsQuery, useGetPendingBlogsQuery } from '@/features/blog/blogApi';
// import { useGetStatsQuery } from '@/features/admin/adminApi'; // Placeholder

export default function AdminDashboardPage() {
  const { data: pendingData } = useGetPendingBlogsQuery({});
  const { data: allBlogs } = useGetBlogsQuery({});
  
  const pendingCount = pendingData?.data?.length || 0;
  const totalBlogs = allBlogs?.data?.length || 0;

  const STATS = [
    { label: 'Pending Blogs', value: pendingCount, icon: LucideFileText, color: '#eab308' },
    { label: 'Total Blogs', value: totalBlogs, icon: LucideFileText, color: '#3b82f6' },
    { label: 'Active Users', value: '1,234', icon: LucideUsers, color: '#16a34a' }, // Placeholder
    { label: 'Site Visits', value: '45.2k', icon: LucideActivity, color: '#8b5cf6' }, // Placeholder
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ mb: 4 }}>
        Dashboard <span style={{ color: '#16a34a' }}>Overview</span>
      </Typography>

      <Grid container spacing={4}>
        {STATS.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
               <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${stat.color}15`, color: stat.color }}>
                     <stat.icon size={24} />
                  </Box>
               </Stack>
               <Typography variant="h4" fontWeight={900} color="#0f172a">{stat.value}</Typography>
               <Typography variant="caption" fontWeight={600} color="text.secondary">{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 6, p: 4, bgcolor: '#fff', borderRadius: 4, border: '1px solid #e2e8f0' }}>
         <Typography variant="h6" fontWeight={800} gutterBottom>Quick Actions</Typography>
         <Typography color="text.secondary">Select an option from the sidebar to manage content.</Typography>
      </Box>
    </Box>
  );
}
