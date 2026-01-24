'use client';

import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { LucideTarget, LucideEye, LucideShield, LucideUsers, LucideLightbulb } from 'lucide-react';

const CORE_VALUES = [
  { title: 'Innovation', icon: LucideLightbulb, description: 'Pushing boundaries to create novel solutions for tomorrow\'s challenges.' },
  { title: 'Integrity', icon: LucideShield, description: 'Upholding different ethical standards in research, teaching, and professional conduct.' },
  { title: 'Collaboration', icon: LucideUsers, description: 'Fostering a culture of teamwork and shared knowledge.' },
  { title: 'Excellence', icon: LucideTarget, description: 'Striving for highest quality in academic and technical pursuits.' },
];

export default function AboutPage() {
  return (
    <Box sx={{ pb: 12 }}>
      {/* Hero Header */}
      <Box sx={{ bgcolor: '#0f172a', py: { xs: 8, md: 12 }, color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color:'white' }}>About Us</Typography>
          <Typography variant="h5" sx={{ color: '#94a3b8', maxWidth: '800px', lineHeight: 1.6 }}>
            Department of Computer Science and Engineering, SUST
          </Typography>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
             <Stack spacing={2}>
               <Stack direction="row" spacing={2} alignItems="center">
                 <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: 2 }}><LucideTarget color="#2563eb" /></Box>
                 <Typography variant="h4" fontWeight={700}>Our Mission</Typography>
               </Stack>
               <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                 To provide world-class education and research opportunities in Computer Science and Engineering, fostering innovation, critical thinking, and ethical leadership to address global challenges.
               </Typography>
             </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
             <Stack spacing={2}>
               <Stack direction="row" spacing={2} alignItems="center">
                 <Box sx={{ p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2 }}><LucideEye color="#16a34a" /></Box>
                 <Typography variant="h4" fontWeight={700}>Our Vision</Typography>
               </Stack>
               <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                 To be a globally recognized center of excellence in computing education and research, producing leaders who drive technological advancement and societal impact.
               </Typography>
             </Stack>
          </Grid>
        </Grid>
      </Container>


      {/* Core Values Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: 10, mt: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 8 }}>Our Core Values</Typography>
          
          <Grid container spacing={4}>
            {CORE_VALUES.map((value, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    borderRadius: 4, 
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }
                  }}
                >
                  <Box sx={{ mb: 3, color: '#0f172a' }}><value.icon size={32} /></Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>{value.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
