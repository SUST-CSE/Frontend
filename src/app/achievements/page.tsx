'use client';

import { useState, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  Tabs,
  Tab,
  Fade,
  Grow,
  InputBase
} from '@mui/material';
import Link from 'next/link';
import NextImage from 'next/image';
import { 
  LucideChevronRight, 
  LucideTrophy, 
  LucideCalendar, 
  LucideSearch, 
  LucideAward,
  LucideUsers,
  LucideStar
} from 'lucide-react';
import { useGetAchievementsQuery } from '@/features/content/contentApi';

const CATEGORIES = [
  { id: 'ALL', label: 'All' },
  { id: 'CP', label: 'Competitive Programming' },
  { id: 'HACKATHON', label: 'Hackathons' },
  { id: 'ACADEMIC', label: 'Academic' },
  { id: 'CTF', label: 'Cyber Security' },
  { id: 'RESEARCH', label: 'Research' },
  { id: 'OTHER', label: 'Others' },
];

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useGetAchievementsQuery({});
  const achievements = data?.data || [];

  const filteredAchievements = useMemo(() => {
    let filtered = achievements;
    
    if (activeCategory !== 'ALL') {
      filtered = filtered.filter((a: any) => a.category === activeCategory);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((a: any) => 
        a.title.toLowerCase().includes(lowerQuery) || 
        a.description.toLowerCase().includes(lowerQuery) ||
        a.competitionName?.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [achievements, activeCategory, searchQuery]);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', pt: 12, pb: 12 }}>
        <Container maxWidth="lg">
           <Breadcrumbs 
              separator={<LucideChevronRight size={14} color="rgba(255,255,255,0.4)" />}
              sx={{ mb: 4 }}
            >
              <MuiLink component={Link} href="/" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 600, '&:hover': { color: '#ffffff' } }}>
                Home
              </MuiLink>
              <Typography sx={{ color: '#ffffff', fontWeight: 700 }}>Achievements</Typography>
            </Breadcrumbs>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                 <Typography variant="h2" fontWeight={900} sx={{ mb: 2, letterSpacing: -1 }}>
                    Hall of <span style={{ color: '#facc15' }}>Fame</span>
                 </Typography>
                 <Typography variant="h6" color="rgba(255,255,255,0.7)" fontWeight={400} sx={{ maxWidth: 600 }}>
                    Celebrating the remarkable victories and innovative breakthroughs of our students and faculty on the global stage.
                 </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                 <Box sx={{ position: 'relative' }}>
                    <LucideTrophy size={120} color="#facc15" style={{ opacity: 0.2 }} />
                    <LucideStar size={40} color="#ffffff" style={{ position: 'absolute', top: 0, right: 0, opacity: 0.4 }} />
                 </Box>
              </Grid>
            </Grid>
        </Container>
      </Box>

      {/* Controls Section */}
      <Box sx={{  mt: -4, px: 2 }}>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ 
            p: 1, 
            borderRadius: 3, 
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            bgcolor: 'white'
          }}>
             <Tabs 
              value={activeCategory} 
              onChange={(_, v) => setActiveCategory(v)} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                flexGrow: 1,
                width: { xs: '100%', md: 'auto' },
                minHeight: 48,
                '& .MuiTab-root': { 
                  fontWeight: 700, 
                  textTransform: 'none', 
                  minHeight: 48,
                  borderRadius: 2,
                  color: '#64748b'
                },
                '& .Mui-selected': { color: '#0f172a', bgcolor: '#f1f5f9' },
                '& .MuiTabs-indicator': { display: 'none' }
              }}
             >
                {CATEGORIES.map(cat => (
                  <Tab key={cat.id} label={cat.label} value={cat.id} />
                ))}
             </Tabs>
             
             <Box sx={{ 
               position: 'relative', 
               width: { xs: '100%', md: 300 }, 
               bgcolor: '#f8fafc', 
               borderRadius: 2,
               border: '1px solid #e2e8f0'
              }}>
                <Box sx={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }}>
                  <LucideSearch size={18} />
                </Box>
                <InputBase 
                  placeholder="Search achievements..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: '100%', pl: 5, pr: 2, py: 0.8, fontSize: '0.9rem', fontWeight: 600 }}
                />
             </Box>
          </Paper>
        </Container>
      </Box>

      {/* Grid Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
         {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
         ) : filteredAchievements.length === 0 ? (
           <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px dashed #e2e8f0' }}>
              <LucideAward size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={700} color="text.secondary">No records found</Typography>
              <Typography variant="body2" color="text.secondary">Try adjusting your filters.</Typography>
           </Box>
         ) : (
            <Grid container spacing={4}>
               {filteredAchievements.map((item: any, idx: number) => (
                 <Grid item xs={12} md={6} key={item._id}>
                    <Grow in timeout={300 + (idx * 100)}>
                      <Paper 
                         component={Link}
                         href={`/achievements/${item._id}`}
                         elevation={0}
                         sx={{ 
                           height: '100%',
                           display: 'flex',
                           flexDirection: 'column',
                           borderRadius: 5,
                           overflow: 'hidden',
                           border: '1px solid #e2e8f0',
                           transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                           textDecoration: 'none',
                           '&:hover': {
                             transform: 'translateY(-8px)',
                             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                             borderColor: 'rgba(59, 130, 246, 0.3)',
                             '& .card-img': { transform: 'scale(1.08)' },
                             '& .read-more': { color: '#2563eb', transform: 'translateX(4px)' }
                           }
                         }}
                      >
                         <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden', bgcolor: '#f1f5f9' }}>
                            <NextImage 
                               src={item.image || '/sust.png'}
                               alt={item.title}
                               fill
                               className="card-img"
                               style={{ objectFit: 'cover', transition: 'transform 0.7s ease' }}
                               unoptimized
                            />
                            <Box sx={{ 
                              position: 'absolute', 
                              top: 20, 
                              left: 20, 
                              bgcolor: 'rgba(255,255,255,0.95)', 
                              backdropFilter: 'blur(8px)',
                              px: 2, 
                              py: 0.8, 
                              borderRadius: 100,
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                             }}>
                               <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                 <LucideTrophy size={16} color="#f59e0b" fill="#f59e0b" /> {item.position || 'Winner'}
                               </Typography>
                            </Box>
                         </Box>
                         <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                              <Chip 
                                label={item.category} 
                                size="small"
                                sx={{ 
                                  bgcolor: '#eff6ff', 
                                  color: '#2563eb', 
                                  fontWeight: 700, 
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem'
                                }} 
                              />
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#64748b' }}>
                                 <LucideCalendar size={14} />
                                 <Typography variant="caption" fontWeight={600}>
                                    {new Date(item.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                 </Typography>
                              </Stack>
                            </Stack>

                            <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ lineHeight: 1.3, mb: 2, flexGrow: 1 }}>
                              {item.title}
                            </Typography>
                            
                            {item.competitionName && (
                               <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                                 <LucideAward size={18} color="#64748b" />
                                 <Typography variant="body1" color="#475569" fontWeight={500}>
                                   {item.competitionName}
                                 </Typography>
                               </Stack>
                            )}
                            
                            {item.teamName && (
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, mt: -1 }}>
                                 <LucideUsers size={18} color="#64748b" />
                                 <Typography variant="body2" color="#475569" fontWeight={500}>
                                   Team: {item.teamName}
                                 </Typography>
                               </Stack>
                            )}

                            <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2" fontWeight={700} color="#64748b" className="read-more" sx={{ display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.3s ease' }}>
                                Read Full Story <LucideChevronRight size={16} />
                              </Typography>
                            </Box>
                         </Box>
                      </Paper>
                    </Grow>
                 </Grid>
              ))}
           </Grid>
         )}
      </Container>
    </Box>
  );
}
