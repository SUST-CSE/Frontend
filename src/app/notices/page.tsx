'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Stack, 
  Chip, 
  Paper, 
  Grid,
  CircularProgress,
  InputAdornment,
  Button,
  Avatar,
  Skeleton
} from '@mui/material';
import { LucideSearch, LucideCalendar, LucidePin, LucideBell, LucideGraduationCap, LucideBriefcase, LucideInfo } from 'lucide-react';
import gsap from 'gsap';
import { useGetNoticesQuery } from '@/features/content/contentApi';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['ALL', 'ACADEMIC', 'ADMINISTRATIVE', 'EVENT', 'GENERAL'];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'ACADEMIC': return <LucideGraduationCap size={24} />;
    case 'ADMINISTRATIVE': return <LucideBriefcase size={24} />;
    case 'EVENT': return <LucideCalendar size={24} />;
    case 'GENERAL': return <LucideInfo size={24} />;
    default: return <LucideBell size={24} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'ACADEMIC': return '#2563eb';
    case 'ADMINISTRATIVE': return '#0891b2';
    case 'EVENT': return '#db2777';
    case 'GENERAL': return '#64748b';
    default: return '#002147';
  }
};

export default function NoticesPage() {
  const { data, isLoading } = useGetNoticesQuery({});
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const listRef = useRef<HTMLDivElement>(null);

  const notices = data?.data || [];

  const filteredNotices = useMemo(() => {
    return notices.filter((notice: any) => {
      const matchesSearch = notice.title.toLowerCase().includes(search.toLowerCase()) || 
                           notice.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'ALL' || notice.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [notices, search, category]);

  useEffect(() => {
    if (!isLoading && filteredNotices.length > 0) {
      gsap.fromTo(
        '.notice-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [isLoading, filteredNotices]);

  return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight={900} color="#002147" sx={{ mb: 2 }}>
              Notice Board
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Stay updated with academic and administrative announcements.
            </Typography>
          </Box>
          <TextField
             placeholder="Search notices..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <LucideSearch size={20} />
                 </InputAdornment>
               ),
             }}
             sx={{ bgcolor: 'white', borderRadius: 2, width: { xs: '100%', md: 350 } }}
           />
        </Box>

        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 4, mb: 2 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategory(cat)}
              sx={{
                fontWeight: 700,
                px: 1,
                bgcolor: category === cat ? '#002147' : '#e2e8f0',
                color: category === cat ? '#ffffff' : '#475569',
                '&:hover': { bgcolor: category === cat ? '#001a35' : '#cbd5e1' }
              }}
            />
          ))}
        </Stack>
        
        {isLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid size={{ xs: 12, md: 6 }} key={i}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 3 }}>
                   <Skeleton variant="circular" width={56} height={56} />
                   <Box sx={{ flex: 1 }}>
                      <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                      <Skeleton width="90%" height={28} sx={{ mb: 1 }} />
                      <Skeleton width="100%" height={20} />
                      <Skeleton width="80%" height={20} sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                         <Skeleton width="30%" height={16} />
                         <Skeleton width="20%" height={24} />
                      </Box>
                   </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3} ref={listRef}>
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice: any) => (
                <Grid size={{ xs: 12, md: 6 }} key={notice._id} className="notice-card">
                  <Paper 
                    elevation={0}
                    onClick={() => router.push(`/notices/${notice._id}`)}
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      border: '1px solid rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'flex-start', // Top align for longer text
                      gap: 3,
                      height: '100%',
                      cursor: 'pointer',
                      transition: '0.2s',
                      '&:hover': { bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: `${getCategoryColor(notice.category)}15`, 
                        color: getCategoryColor(notice.category) 
                      }}
                    >
                      {getCategoryIcon(notice.category)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="caption" fontWeight={700} color={getCategoryColor(notice.category)} sx={{ textTransform: 'uppercase' }}>
                           {notice.category}
                        </Typography>
                         {notice.isPinned && (
                             <LucidePin size={14} color="#eab308" fill="#eab308" />
                         )}
                      </Stack>
                      
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1, lineHeight: 1.3, '&:hover': { color: '#002147' } }}>
                        {notice.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ 
                          mb: 2, 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                      }}>
                        {notice.description}
                      </Typography>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center" color="text.disabled">
                             <LucideCalendar size={14} />
                             <Typography variant="caption" fontWeight={600}>
                                {new Date(notice.createdAt).toLocaleDateString()}
                             </Typography>
                          </Stack>

                          <Button 
                            variant="text" 
                            size="small" 
                            sx={{ textTransform: 'none', fontWeight: 600, p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                          >
                            View Details
                          </Button>
                      </Stack>
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                    <Typography variant="h6" color="text.secondary">No notices found.</Typography>
                  </Box>
                </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
