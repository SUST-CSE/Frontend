'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Stack, 
  Chip,
  CircularProgress
} from '@mui/material';
import { LucideExternalLink, LucideUsers, LucideCalendar } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { useGetSocietiesQuery } from '@/features/society/societyApi';

export default function SocietiesPage() {
  const { data, isLoading } = useGetSocietiesQuery({});
  const containerRef = useRef<HTMLDivElement>(null);

  const societies = data?.data || [];

  useEffect(() => {
    if (!isLoading && societies.length > 0) {
      gsap.fromTo(
        '.soc-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }
  }, [isLoading, societies]);

  return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={900} color="#002147" gutterBottom>
            Organizations
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Explore the vibrant ecosystem of organizations and student-led groups
            within the SUST CSE community.
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#002147' }} />
          </Box>
        ) : (
          <Grid container spacing={4} ref={containerRef}>
            {societies.map((society: any) => (
              <Grid item xs={12} md={6} key={society._id} className="soc-card">
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }
                  }}
                >
                  <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        bgcolor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      {society.logo ? (
                        <img src={society.logo} alt={society.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <LucideUsers size={40} color="#94a3b8" />
                      )}
                    </Box>
                    <Box>
                      <Chip 
                        label={society.category} 
                        size="small" 
                        sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 800, mb: 1, fontSize: '0.65rem' }} 
                      />
                      <Typography variant="h5" fontWeight={800} color="#0f172a">
                        {society.name}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, flexGrow: 1 }}>
                    {society.description.length > 180 
                      ? `${society.description.substring(0, 180)}...` 
                      : society.description}
                  </Typography>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2.5} sx={{ color: '#64748b' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LucideCalendar size={16} />
                        <Typography variant="caption" fontWeight={700}>
                          Est. {new Date(society.foundedDate).getFullYear()}
                        </Typography>
                      </Stack>
                    </Stack>
                    
                    <Button
                      component={Link}
                      href={`/societies/${society._id}`}
                      variant="outlined"
                      size="small"
                      endIcon={<LucideExternalLink size={14} />}
                      sx={{ 
                        fontWeight: 700, 
                        borderColor: '#002147', 
                        color: '#002147',
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'rgba(0,33,71,0.05)', borderColor: '#002147' } 
                      }}
                    >
                      View Profile
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
