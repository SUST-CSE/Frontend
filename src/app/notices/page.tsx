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
  IconButton,
  Button
} from '@mui/material';
import { LucideSearch, LucideCalendar, LucidePin, LucideFileText, LucideExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { useGetNoticesQuery } from '@/features/content/contentApi';

const CATEGORIES = ['ALL', 'ACADEMIC', 'ADMINISTRATIVE', 'EVENT', 'GENERAL'];

export default function NoticesPage() {
  const { data, isLoading } = useGetNoticesQuery({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const listRef = useRef<HTMLDivElement>(null);

  const notices = data?.data || [];

  // load balancing (memoized filtering) as requested
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
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" fontWeight={900} color="#002147" gutterBottom>
            Notice Board
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Stay updated with the latest academic and administrative announcements.
          </Typography>

          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={3} 
            alignItems={{ xs: 'stretch', md: 'center' }}
            sx={{ mb: 4 }}
          >
            <TextField
              sx={{ flexGrow: 1, bgcolor: '#ffffff', borderRadius: 2 }}
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LucideSearch size={20} color="#64748b" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
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
          </Stack>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#002147' }} />
          </Box>
        ) : (
          <Grid container spacing={4} ref={listRef}>
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice: any) => (
                <Grid item xs={12} key={notice._id} className="notice-card">
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 4, 
                      borderRadius: 4, 
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'border-color 0.3s ease',
                      '&:hover': { borderColor: '#2563eb' }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip 
                          label={notice.category} 
                          size="small" 
                          sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 800, fontSize: '0.65rem' }} 
                        />
                        {notice.isPinned && (
                          <Chip 
                            icon={<LucidePin size={14} />} 
                            label="Pinned" 
                            size="small" 
                            sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 800, fontSize: '0.65rem' }} 
                          />
                        )}
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#64748b' }}>
                        <LucideCalendar size={16} />
                        <Typography variant="caption" fontWeight={600}>
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography variant="h5" fontWeight={800} color="#0f172a" gutterBottom>
                      {notice.title}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                      {notice.description}
                    </Typography>

                    <Stack direction="row" spacing={2}>
                      <Button 
                        startIcon={<LucideFileText size={18} />}
                        endIcon={<LucideExternalLink size={14} />}
                        sx={{ color: '#2563eb', fontWeight: 700, textTransform: 'none' }}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#ffffff', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                  <Typography variant="h6" color="text.secondary">No notices found matching your criteria.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
