'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Stack, 
  Tabs, 
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { LucideBookOpen, LucideAward, LucideBarChart3, LucideFileText } from 'lucide-react';
import gsap from 'gsap';
import { useGetCoursesQuery, useGetAcademicStatsQuery, useGetAcademicAchievementsQuery } from '@/features/academic/academicApi';

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({});
  const { data: statsData, isLoading: statsLoading } = useGetAcademicStatsQuery({});
  const { data: achievementData, isLoading: achLoading } = useGetAcademicAchievementsQuery({});
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeTab]);

  const courses = coursesData?.data || [];
  const achievements = achievementData?.data || [];

  return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" fontWeight={900} color="#002147" gutterBottom>
            Academic Programs
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Excellence in education through a rigorous and modern curriculum.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, mb: 6, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, v) => setActiveTab(v)} 
            variant="fullWidth"
            sx={{ 
              bgcolor: '#ffffff',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              '& .MuiTab-root': { py: 3, fontWeight: 700, fontSize: '1rem', color: '#64748b' },
              '& .Mui-selected': { color: '#002147 !important' }
            }}
          >
            <Tab icon={<LucideBookOpen size={20} />} iconPosition="start" label="Curriculum" />
            <Tab icon={<LucideAward size={20} />} iconPosition="start" label="Research & Awards" />
            <Tab icon={<LucideBarChart3 size={20} />} iconPosition="start" label="Statistics" />
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 5 } }} ref={contentRef}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ mb: 4 }}>Undergraduate Courses</Typography>
                {coursesLoading ? <CircularProgress /> : (
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f1f5f9' }}>
                    <Table>
                      <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 800 }}>Code</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Credits</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Level</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {courses.map((course: any) => (
                          <TableRow key={course._id} hover>
                            <TableCell sx={{ fontWeight: 700, color: '#2563eb' }}>{course.courseCode}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{course.title}</TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell>
                              <Chip label={course.type} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                            </TableCell>
                            <TableCell>{course.level}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ mb: 4 }}>Recent Achievements & Research</Typography>
                {achLoading ? <CircularProgress /> : (
                  <Grid container spacing={4}>
                    {achievements.map((ach: any) => (
                      <Grid size={{ xs: 12 }} key={ach._id}>
                        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #f1f5f9' }}>
                          <Stack direction="row" spacing={3}>
                            <Box sx={{ p: 2, bgcolor: '#dcfce7', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                              <LucideAward color="#166534" size={32} />
                            </Box>
                            <Box>
                              <Typography variant="h6" fontWeight={800}>{ach.title}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{ach.description}</Typography>
                              <Chip label={ach.category} size="small" sx={{ fontWeight: 800, bgcolor: '#f1f5f9' }} />
                            </Box>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ mb: 4 }}>Academic Data & Stats</Typography>
                {statsLoading ? <CircularProgress /> : (
                  <Grid container spacing={4}>
                    {[
                      { label: 'Pass Rate', value: '98%', color: '#10b981' },
                      { label: 'Employment Rate', value: '94%', color: '#3b82f6' },
                      { label: 'Avg CGPA', value: '3.65', color: '#f59e0b' },
                      { label: 'Alumni Network', value: '5000+', color: '#6366f1' },
                    ].map((stat, idx) => (
                      <Grid size={{ xs: 6, md: 3 }} key={idx}>
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 4 }}>
                          <Typography variant="h4" fontWeight={900} color={stat.color}>{stat.value}</Typography>
                          <Typography variant="body2" fontWeight={700} color="text.secondary">{stat.label}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
