'use client';

import { useParams } from 'next/navigation';
import { useGetAlumniByIdQuery } from '@/features/alumni/alumniApi';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Paper,
  Avatar,
  CircularProgress,
  Divider,
  Button,
  Grid,
} from '@mui/material';
import { LucideBuilding, LucideBriefcase, LucideLinkedin, LucideMail, LucideQuote } from 'lucide-react';

export default function AlumniDetailPage() {
  const params = useParams();
  const { data, isLoading } = useGetAlumniByIdQuery(params.id as string);
  const alumni = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ py: 20, textAlign: 'center' }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!alumni) {
    return (
      <Container maxWidth="md" sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Alumni not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Profile Section */}
      <Box 
        sx={{ 
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={6} 
            alignItems="center"
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            <Avatar
              src={alumni.profileImage}
              alt={alumni.name}
              sx={{
                width: { xs: 200, md: 240 },
                height: { xs: 200, md: 240 },
                border: '8px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Chip
                label={`Class of ${alumni.batch}`}
                sx={{
                  bgcolor: '#16a34a',
                  color: '#ffffff',
                  fontWeight: 800,
                  mb: 2,
                  px: 1,
                  fontSize: '0.875rem'
                }}
              />
              <Typography 
                variant="h2" 
                fontWeight={900} 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  letterSpacing: '-0.03em',
                  mb: 1,
                  color: '#ffffff'
                }}
              >
                {alumni.name}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  opacity: 0.9, 
                  fontWeight: 500, 
                  mb: 3,
                  color: '#94a3b8'
                }}
              >
                {alumni.currentPosition} at <span style={{ color: '#ffffff', fontWeight: 700 }}>{alumni.currentCompany}</span>
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={2} 
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                {alumni.linkedIn && (
                  <Button
                    component="a"
                    href={alumni.linkedIn}
                    target="_blank"
                    variant="contained"
                    startIcon={<LucideLinkedin size={20} />}
                    sx={{ 
                      bgcolor: '#0077b5', 
                      '&:hover': { bgcolor: '#005f93' },
                      borderRadius: 2,
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 700
                    }}
                  >
                    LinkedIn
                  </Button>
                )}
                {alumni.email && (
                  <Button
                    component="a"
                    href={`mailto:${alumni.email}`}
                    variant="outlined"
                    startIcon={<LucideMail size={20} />}
                    sx={{ 
                      borderColor: 'rgba(255, 255, 255, 0.3)', 
                      color: '#ffffff',
                      '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' },
                      borderRadius: 2,
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 700
                    }}
                  >
                    Contact
                  </Button>
                )}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Main Content Sections */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={8}>
          {/* Left Column: About & Quote */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ mb: 8 }}>
              <Typography 
                variant="h4" 
                fontWeight={900} 
                color="#0f172a" 
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}
              >
                About Me
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#475569', 
                  fontSize: '1.125rem', 
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line'
                }}
              >
                {alumni.description}
              </Typography>
            </Box>

            {alumni.quotes && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 5, 
                  borderRadius: 6, 
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <LucideQuote 
                  size={80} 
                  style={{ 
                    position: 'absolute', 
                    top: -20, 
                    right: -20, 
                    color: '#16a34a', 
                    opacity: 0.05 
                  }} 
                />
                <Typography 
                  variant="h6" 
                  fontWeight={800} 
                  sx={{ color: '#16a34a', mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                >
                  Words of Wisdom
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontStyle: 'italic', 
                    color: '#0f172a', 
                    lineHeight: 1.6,
                    fontWeight: 500
                  }}
                >
                  &ldquo;{alumni.quotes}&rdquo;
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Right Column: Experience & Details */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" fontWeight={900} color="#0f172a" sx={{ mb: 3 }}>
                  Career Highlights
                </Typography>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 2, 
                        bgcolor: '#f0fdf4', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#16a34a',
                        flexShrink: 0
                      }}
                    >
                      <LucideBriefcase size={24} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="#64748b" fontWeight={700}>Role</Typography>
                      <Typography variant="body1" fontWeight={700} color="#0f172a">{alumni.currentPosition}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 2, 
                        bgcolor: '#eff6ff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#2563eb',
                        flexShrink: 0
                      }}
                    >
                      <LucideBuilding size={24} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="#64748b" fontWeight={700}>Company</Typography>
                      <Typography variant="body1" fontWeight={700} color="#0f172a">{alumni.currentCompany}</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {alumni.previousCompanies && alumni.previousCompanies.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={900} color="#0f172a" sx={{ mb: 2 }}>
                    Previous Journey
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {alumni.previousCompanies.map((company: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={company} 
                        variant="outlined"
                        sx={{ 
                          borderRadius: 2, 
                          fontWeight: 600, 
                          color: '#475569',
                          borderColor: '#e2e8f0'
                        }} 
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
