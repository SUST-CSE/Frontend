'use client';

import { useMemo } from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { LucideUsers, LucideBookOpen, LucideTrophy, LucideBriefcase } from 'lucide-react';

const STATIC_STATS = [
  { label: 'Students', value: 1200, icon: LucideUsers, color: '#3b82f6' },
  { label: 'Courses', value: 85, icon: LucideBookOpen, color: '#10b981' },
  { label: 'Achievements', value: 250, icon: LucideTrophy, color: '#f59e0b' },
  { label: 'Placements', value: 95, icon: LucideBriefcase, color: '#6366f1', suffix: '%' },
];

export default function Stats() {
  // Demonstrating useMemo for data processing as requested
  const processedStats = useMemo(() => {
    // In a real app, this might involve complex calculations from an API response
    return STATIC_STATS.map(stat => ({
      ...stat,
      displayValue: stat.suffix ? `${stat.value}${stat.suffix}` : stat.value.toLocaleString(),
    }));
  }, []);

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {processedStats.map((stat, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  textAlign: 'center',
                  bgcolor: '#ffffff',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
                    borderColor: '#3b82f6'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 3,
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    mb: 2
                  }}
                >
                  <stat.icon size={28} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: '#0f172a', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                  {stat.displayValue}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: 0.5 }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
