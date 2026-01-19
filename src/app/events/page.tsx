'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Stack, 
  Chip, 
  Button,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { LucideCalendar, LucideMapPin, LucideSearch, LucideArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useGetEventsQuery } from '@/features/event/eventApi';
import Link from 'next/link';

const CATEGORIES = ['ALL', 'WORKSHOP', 'SEMINAR', 'COMPETITION', 'SOCIAL', 'TECHNICAL'];

export default function EventsPage() {
  const { data, isLoading } = useGetEventsQuery({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  
  const containerRef = useRef<HTMLDivElement>(null);

  const eventsList = useMemo(() => data?.data || [], [data]);

  const filteredEvents = useMemo(() => {
    return eventsList.filter((e: { title: string; category: string }) => {
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'ALL' || e.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [eventsList, search, category]);

  useEffect(() => {
    if (!isLoading && filteredEvents.length > 0) {
      gsap.fromTo(
        '.event-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [isLoading, filteredEvents]);

  return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" fontWeight={900} color="#002147" gutterBottom>
            Events & Hackathons
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join our upcoming workshops, seminars, and competitive programming events.
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
            <TextField
              sx={{ flexGrow: 1, bgcolor: '#ffffff', borderRadius: 2 }}
              placeholder="Search events..."
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
          <Grid container spacing={4} ref={containerRef}>
            {filteredEvents.length > 0 ? filteredEvents.map((event: any) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event._id} className="event-card">
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
                  }}
                >
                  <Box sx={{ height: 200, bgcolor: '#f1f5f9', position: 'relative' }}>
                    {event.images?.[0] ? (
                      <img src={event.images[0]} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>
                        <LucideCalendar size={64} />
                      </Box>
                    )}
                    <Chip 
                      label={event.status} 
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16, 
                        fontWeight: 800, 
                        bgcolor: event.status === 'UPCOMING' ? '#2563eb' : '#10b981',
                        color: '#ffffff'
                      }} 
                    />
                  </Box>

                  <Box sx={{ p: 4 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {event.category}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="#002147" sx={{ mt: 1, mb: 3 }}>
                      {event.title}
                    </Typography>

                    <Stack spacing={2} sx={{ mb: 4 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: '#475569' }}>
                        <LucideCalendar size={18} />
                        <Typography variant="body2" fontWeight={600}>
                          {new Date(event.startDate).toLocaleDateString()}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: '#475569' }}>
                        <LucideMapPin size={18} />
                        <Typography variant="body2" fontWeight={600}>{event.location}</Typography>
                      </Stack>
                    </Stack>

                    <Button
                      fullWidth
                      component={Link}
                      href={`/events/${event._id}`}
                      variant="outlined"
                      endIcon={<LucideArrowRight size={18} />}
                      sx={{ 
                        fontWeight: 700, 
                        borderRadius: 2, 
                        borderColor: '#002147', 
                        color: '#002147',
                        py: 1.2
                      }}
                    >
                      Details & RSVP
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            )) : (
              <Box sx={{ width: '100%', textAlign: 'center', py: 10, bgcolor: '#ffffff', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                <Typography variant="h6" color="text.secondary">No events found matching your search.</Typography>
              </Box>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
