'use client';

import { Box, Container, Typography, Grid, Paper, Avatar, Stack, TextField, InputAdornment, Button, Pagination, Skeleton } from '@mui/material';
import { useGetStudentsQuery } from '@/features/user/userApi';
import { LucideSearch, LucideCode, LucideGithub } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentsPage() {
  const router = useRouter();
  const { user } = useSelector((state: { auth: { user: { _id: string; role: string } | null } }) => state.auth);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const { data, isLoading } = useGetStudentsQuery({ search, page, limit });
  const students = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  if (!user && typeof window !== 'undefined') {
    return (
      <Box sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h5">Please login to view student profiles.</Typography>
        <Button variant="contained" onClick={() => router.push('/login')} sx={{ mt: 2 }}>Login</Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Skeleton width={300} height={60} sx={{ mb: 2 }} />
              <Skeleton width={400} height={24} />
            </Box>
            <Skeleton width={300} height={56} sx={{ borderRadius: 2 }} />
          </Box>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Skeleton variant="circular" width={64} height={64} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                       <Box sx={{ flex: 1 }}>
                         <Skeleton width="60%" height={24} />
                         <Skeleton width="40%" height={16} />
                       </Box>
                       <Skeleton variant="circular" width={24} height={24} />
                    </Box>
                    <Skeleton width="80%" height={20} sx={{ mt: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                       <Skeleton width={80} height={24} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight={900} color="#002147" sx={{ mb: 2 }}>
              Student Community
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Browse profiles of talented students and their projects.
            </Typography>
          </Box>
          <TextField
            placeholder="Search by Name or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LucideSearch size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />
        </Box>

        <Grid container spacing={3}>
          {students.map((student: any) => (
            <Grid size={{ xs: 12, md: 6 }} key={student._id}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  border: '1px solid rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  transition: '0.2s',
                  '&:hover': { bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
                }}
              >
                <Link href={`/profile/${student._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%', alignItems: 'center', gap: 24 }}>
                  <Avatar src={student.profileImage} sx={{ width: 64, height: 64 }}>
                    {student.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800} sx={{ '&:hover': { color: '#002147' } }}>
                          {student.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          ID: {student.studentId} • Batch: {student.batch}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    {student.projects?.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <LucideCode size={14} style={{ marginTop: 4, opacity: 0.6 }} />
                        <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                          {student.projects.length} Projects: {student.projects.map((p: any) => p.title).join(', ')}
                        </Typography>
                      </Stack>
                    )}
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="text" 
                        size="small" 
                        sx={{ textTransform: 'none', fontWeight: 600, p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {!isLoading && students.length > 0 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} students
            </Typography>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(_, value) => { setPage(value); setSearch(''); }}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
