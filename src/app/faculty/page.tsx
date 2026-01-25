'use client';

import { Box, Container, Typography, Grid, Paper, Avatar, Stack, Chip, CircularProgress, Button } from '@mui/material';
import { useGetFacultyQuery } from '@/features/user/userApi';
import { LucideMail, LucideLinkedin, LucideGlobe } from 'lucide-react';
import Link from 'next/link';

export default function FacultyPage() {
  const { data, isLoading } = useGetFacultyQuery({});
  const faculty = data?.data || [];

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={900} color="#002147" sx={{ mb: 2 }}>
          Our Faculty
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 8, maxWidth: 800 }}>
          Meet the distinguished professors and lecturers shaping the future of Computer Science and Engineering at SUST.
        </Typography>

        <Grid container spacing={4}>
          {faculty.map((member: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member._id}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 4, 
                  border: '1px solid rgba(0,0,0,0.05)',
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)', borderColor: '#002147' }
                }}
              >
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Avatar 
                    src={member.profileImage} 
                    sx={{ width: 80, height: 80, border: '3px solid #e2e8f0' }} 
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>{member.name}</Typography>
                    <Typography variant="body2" color="primary" fontWeight={600}>{member.designation}</Typography>
                    {member.experiences?.[0]?.company && (
                      <Typography variant="caption" color="text.secondary">
                        Ex- {member.experiences[0].company}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {member.researchInterests?.slice(0, 3).map((int: string, i: number) => (
                    <Chip key={i} label={int} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600 }} />
                  ))}
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                  {member.email && (
                    <Link href={`mailto:${member.email}`}>
                      <LucideMail size={20} color="#64748b" style={{ cursor: 'pointer' }} />
                    </Link>
                  )}
                  {member.socialLinks?.linkedin && (
                    <Link href={member.socialLinks.linkedin} target="_blank">
                      <LucideLinkedin size={20} color="#0a66c2" style={{ cursor: 'pointer' }} />
                    </Link>
                  )}
                  {member.socialLinks?.website && (
                    <Link href={member.socialLinks.website} target="_blank">
                      <LucideGlobe size={20} color="#64748b" style={{ cursor: 'pointer' }} />
                    </Link>
                  )}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
