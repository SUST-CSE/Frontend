'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Button,
  Grid,
  Paper,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { 
  LucideChevronLeft, 
  LucideCalendar, 
  LucideUsers, 
  LucideTrophy, 
  LucideAward,
  LucideShare2,
  LucideChevronRight
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import NextImage from 'next/image';
import Link from 'next/link';
import { useGetAchievementByIdQuery } from '@/features/content/contentApi';

export default function AchievementDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { data, isLoading, error } = useGetAchievementByIdQuery(id);
  const achievement = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !achievement) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Achievement not found
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<LucideChevronLeft size={18} />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Breadcrumbs 
          separator={<LucideChevronRight size={14} color="#94a3b8" />}
          sx={{ mb: 4 }}
        >
          <MuiLink component={Link} href="/" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#0f172a' } }}>
            Home
          </MuiLink>
          <MuiLink component={Link} href="/achievements" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#0f172a' } }}>
            Achievements
          </MuiLink>
          <Typography color="text.primary" fontWeight={600}>Details</Typography>
        </Breadcrumbs>

        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {/* Header Image */}
           <Box sx={{ position: 'relative', height: { xs: 300, md: 500 }, bgcolor: '#f1f5f9' }}>
              <NextImage 
                src={achievement.image || '/sust.png'} 
                alt={achievement.title}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
              <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' 
              }} />
              
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: { xs: 3, md: 6 }, width: '100%' }}>
                 <Chip 
                    label={achievement.category} 
                    sx={{ 
                      bgcolor: '#2563eb', 
                      color: 'white', 
                      fontWeight: 700, 
                      mb: 2,
                      fontSize: '0.85rem'
                    }} 
                  />
                 <Typography variant="h3" fontWeight={900} color="white" sx={{ mb: 2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {achievement.title}
                 </Typography>
                 
                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                       <LucideCalendar size={18} />
                       <Typography fontWeight={600}>
                          {new Date(achievement.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                       </Typography>
                    </Box>
                    {achievement.position && (
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LucideTrophy size={18} color="#facc15" />
                          <Typography fontWeight={700} color="#facc15">
                             {achievement.position}
                          </Typography>
                       </Box>
                    )}
                 </Stack>
              </Box>
           </Box>

           <Grid container>
              <Grid size={{ xs: 12, md: 8 }} sx={{ p: { xs: 3, md: 6 }, borderRight: { md: '1px solid #e2e8f0' } }}>
                 <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>About the Achievement</Typography>
                 <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-wrap' }}>
                    {achievement.description || 'No description provided.'}
                 </Typography>

                 <Divider sx={{ my: 6 }} />

                 <Button 
                   variant="outlined" 
                   startIcon={<LucideChevronLeft size={18} />}
                   onClick={() => router.back()}
                   sx={{ fontWeight: 700, borderRadius: 2 }}
                 >
                   Back to Achievements
                 </Button>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} sx={{ p: { xs: 3, md: 6 }, bgcolor: '#f8fafc' }}>
                 <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3 }}>Details</Typography>
                 
                 <Stack spacing={3}>
                    {achievement.competitionName && (
                       <Box>
                          <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ mb: 0.5, display: 'block' }}>COMPETITION</Typography>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                             <LucideAward size={20} color="#3b82f6" style={{ marginTop: 2 }} />
                             <Typography fontWeight={600} color="#0f172a">{achievement.competitionName}</Typography>
                          </Box>
                       </Box>
                    )}

                    {achievement.teamName && (
                       <Box>
                          <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ mb: 0.5, display: 'block' }}>TEAM / PARTICIPANT</Typography>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                             <LucideUsers size={20} color="#3b82f6" style={{ marginTop: 2 }} />
                             <Typography fontWeight={600} color="#0f172a">{achievement.teamName}</Typography>
                          </Box>
                       </Box>
                    )}

                    {achievement.achievedBy && (
                       <Box>
                          <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ mb: 1, display: 'block' }}>SUBMITTED BY</Typography>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                             <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e2e8f0', overflow: 'hidden' }}>
                                <NextImage 
                                  src={achievement.achievedBy.profileImage || '/default-user.png'} 
                                  alt={achievement.achievedBy.name}
                                  width={40}
                                  height={40}
                                  unoptimized
                                />
                             </Box>
                             <Box>
                                <Typography fontWeight={600} variant="body2">{achievement.achievedBy.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{achievement.achievedBy.email}</Typography>
                             </Box>
                          </Stack>
                       </Box>
                    )}

                    <Divider sx={{ my: 2 }} />
                    
                    <Button 
                      variant="contained" 
                      startIcon={<LucideShare2 size={18} />}
                      fullWidth
                      sx={{ bgcolor: '#0f172a', fontWeight: 700, py: 1.5, borderRadius: 2 }}
                      onClick={() => {
                        window.alert('Share functionality coming soon!');
                      }}
                    >
                      Share Achievement
                    </Button>
                 </Stack>
              </Grid>
           </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
