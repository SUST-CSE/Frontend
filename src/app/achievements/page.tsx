'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { LucideChevronRight, LucideTrophy } from 'lucide-react';
import { useGetAchievementsQuery } from '@/features/content/contentApi';
import AchievementsSection from '@/components/home/AchievementsSection';

export default function AchievementsPage() {
  const { data, isLoading } = useGetAchievementsQuery({});
  const achievements = data?.data || [];

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 12 }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: '#0f172a', color: '#ffffff', pt: 16, pb: 20 }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<LucideChevronRight size={14} color="rgba(255,255,255,0.5)" />}
            sx={{ mb: 3 }}
          >
            <MuiLink component={Link} href="/" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
              Home
            </MuiLink>
            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>Achievements</Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, backdropFilter: 'blur(10px)' }}>
              <LucideTrophy size={40} color="#facc15" />
            </Box>
            <Box>
              <Typography variant="h1" sx={{ fontWeight: 950, fontSize: { xs: '3rem', md: '4.5rem' }, letterSpacing: '-0.04em', lineHeight: 1 }}>
                Our Achievements
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400, maxWidth: 600, mt: 2 }}>
                Celebrating the successes and milestones of our students, faculty, and research teams in the global digital landscape.
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: -10 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : achievements.length === 0 ? (
          <Box sx={{ p: 10, bgcolor: '#ffffff', borderRadius: 5, textAlign: 'center', border: '1px dashed #e2e8f0' }}>
            <Typography variant="h6" color="text.secondary">No achievements recorded yet.</Typography>
          </Box>
        ) : (
          <AchievementsSection /> 
        )}
      </Container>
    </Box>
  );
}
