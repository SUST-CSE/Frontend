'use client';

import { Box, Container, Typography, Grid, Paper, Avatar, Stack, Chip, Button, Pagination, Skeleton } from '@mui/material';
import { useState } from 'react';
import { useGetFacultyQuery } from '@/features/user/userApi';
import { LucideMail, LucideLinkedin, LucideGlobe } from 'lucide-react';
import Link from 'next/link';

export default function FacultyPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const { data, isLoading } = useGetFacultyQuery({ page, limit });
  const faculty = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  if (isLoading) return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Skeleton width={300} height={60} sx={{ mb: 2 }} />
        <Skeleton width={600} height={24} sx={{ mb: 8 }} />
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                   <Skeleton variant="circular" width={80} height={80} />
                   <Box sx={{ flex: 1 }}>
                      <Skeleton width="80%" height={24} />
                      <Skeleton width="60%" height={16} />
                      <Skeleton width="40%" height={14} />
                   </Box>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                   <Skeleton width={60} height={24} sx={{ borderRadius: 1 }} />
                   <Skeleton width={80} height={24} sx={{ borderRadius: 1 }} />
                   <Skeleton width={70} height={24} sx={{ borderRadius: 1 }} />
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                   <Stack direction="row" spacing={2}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="circular" width={24} height={24} />
                   </Stack>
                   <Skeleton width={100} height={32} sx={{ borderRadius: 2 }} />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
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
          {faculty.map((member: { _id: string; name: string; designation: string; profileImage?: string; researchInterests?: string[]; email?: string; socialLinks?: { linkedin?: string; website?: string }; experiences?: { company: string }[] }) => (
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
                  <Link href={`/profile/${member._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Avatar 
                      src={member.profileImage} 
                      sx={{ width: 80, height: 80, border: '3px solid #e2e8f0', cursor: 'pointer', transition: '0.2s', '&:hover': { borderColor: '#002147' } }} 
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                  </Link>
                  <Box>
                    <Link href={`/profile/${member._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography variant="h6" fontWeight={800} sx={{ '&:hover': { color: '#002147', textDecoration: 'underline' } }}>
                        {member.name}
                      </Typography>
                    </Link>
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

                <Stack direction="row" spacing={2} sx={{ mt: 'auto', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Stack direction="row" spacing={2}>
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
                  <Button 
                    component={Link} 
                    href={`/profile/${member._id}`}
                    variant="outlined" 
                    size="small" 
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    View Profile
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Pagination Controls */}
        {!isLoading && faculty.length > 0 && (
          <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
               Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} distinguished members
            </Typography>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(_, value) => {
                setPage(value);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
