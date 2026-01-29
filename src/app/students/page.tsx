'use client';

import { Box, Container, Typography, Grid, Paper, Avatar, Stack, CircularProgress, TextField, InputAdornment, Button, Pagination } from '@mui/material';
import { useGetStudentsQuery } from '@/features/user/userApi';
import { LucideSearch, LucideCode, LucideGithub } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentsPage() {
  const { user } = useSelector((state: { auth: { user: any } }) => state.auth);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const { data, isLoading } = useGetStudentsQuery({ search, page, limit });
  const students = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  if (!user && typeof window !== 'undefined') {
    // Basic client-side protection (API also protected)
    return (
      <Box sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h5">Please login to view student profiles.</Typography>
        <Button variant="contained" onClick={() => router.push('/login')} sx={{ mt: 2 }}>Login</Button>
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

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {students.map((student: { _id: string; name: string; studentId: string; batch: string; profileImage?: string; socialLinks?: { github?: string }; projects?: { title: string }[] }) => (
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
                    <Avatar 
                      src={student.profileImage} 
                      sx={{ width: 64, height: 64 }} 
                    >
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
                        {student.socialLinks?.github && (
                          <Box 
                            component="span"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(student.socialLinks?.github, '_blank');
                            }}
                            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
                          >
                            <LucideGithub size={20} color="#333" />
                          </Box>
                        )}
                      </Stack>
                      
                      {(student.projects?.length ?? 0) > 0 && (
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                          <LucideCode size={14} style={{ marginTop: 4, opacity: 0.6 }} />
                          <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                            {student.projects?.length || 0} Projects: {student.projects?.map((p: { title: string }) => p.title).join(', ')}
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
        )}

        {/* Pagination Controls */}
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
