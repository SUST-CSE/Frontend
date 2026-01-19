'use client';

import { useGetEventsQuery } from '@/features/event/eventApi';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import { Calendar as LucideCalendar, MapPin as LucideMapPin, ArrowRight as LucideArrowRight, ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight, Paperclip as LucidePaperclip } from 'lucide-react';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';

interface IEvent {
  _id: string;
  title: string;
  description: string;
  images: string[];
  startDate: string;
  location: string;
  category: string;
  attachments?: string[];
}

export default function EventsSection() {
  const { data, isLoading } = useGetEventsQuery({});
  const allEvents: IEvent[] = data?.data || [];
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Sort by date descending (latest first)
  const sortedEvents = [...allEvents]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCanPrev(slider.track.details.rel > 0);
      const perView = typeof slider.options.slides === 'object' ? (slider.options.slides as { perView?: number })?.perView || 1 : 1;
      setCanNext(slider.track.details.rel < slider.track.details.slides.length - perView);
    },
    created(slider) {
      setLoaded(true);
      setCanPrev(slider.track.details.rel > 0);
      const perView = typeof slider.options.slides === 'object' ? (slider.options.slides as { perView?: number })?.perView || 1 : 1;
      setCanNext(slider.track.details.rel < slider.track.details.slides.length - perView);
    },
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 600px)': {
        slides: { perView: 2, spacing: 16 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <LucideCalendar size={20} color="#2563eb" />
              <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: 2, color: '#2563eb' }}>
                Join Us
              </Typography>
            </Stack>
            <Typography variant="h3" fontWeight={900} color="#0f172a">
              Latest <span style={{ color: '#2563eb' }}>Events</span>
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {loaded && (
              <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                <IconButton 
                  onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }}
                  disabled={!canPrev}
                  sx={{ border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}
                >
                  <LucideChevronLeft size={20} />
                </IconButton>
                <IconButton 
                  onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }}
                  disabled={!canNext}
                  sx={{ border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}
                >
                  <LucideChevronRight size={20} />
                </IconButton>
              </Stack>
            )}
            <Button 
              component={Link} 
              href="/events" 
              endIcon={<LucideArrowRight size={18} />}
              sx={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}
            >
              Explore All
            </Button>
          </Stack>
        </Stack>

        {sortedEvents.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#ffffff', borderRadius: 4, border: '1px dashed #e2e8f0' }}>
            <Typography variant="h6" color="text.secondary">No events found yet.</Typography>
          </Box>
        ) : (
          <Box ref={sliderRef} className="keen-slider" sx={{ alignItems: 'stretch' }}>
            {sortedEvents.map((event) => (
              <Box key={event._id} className="keen-slider__slide" sx={{ display: 'flex', height: 'auto', p: 1 }}>
                <Card 
                  component={Link}
                  href={`/events/${event._id}`}
                  elevation={0}
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 4, 
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px -20px rgba(37, 99, 235, 0.2)',
                      borderColor: '#2563eb'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
                      alt={event.title}
                      sx={{ 
                        height: 240, 
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block' 
                      }}
                    />
                    <Chip 
                      label={event.category} 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16, 
                        bgcolor: '#ffffff', 
                        color: '#0f172a', 
                        fontWeight: 800,
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ lineHeight: 1.2, mb: 1 }}>
                      {event.title}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" sx={{ mb: 2 }}>
                      <LucideMapPin size={14} />
                      <Typography variant="caption" fontWeight={600}>{event.location}</Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ 
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      mb: 2.5
                    }}>
                      {event.description}
                    </Typography>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 'auto', pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                      <Stack spacing={0.5} sx={{ minWidth: 0, flexGrow: 1, mr: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LucideCalendar size={14} color="#64748b" />
                          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                          <Typography variant="caption" color="#cbd5e1">•</Typography>
                          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Stack>
                        {event.attachments && event.attachments.length > 0 && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LucidePaperclip size={14} color="#2563eb" />
                            <Typography variant="caption" fontWeight={700} color="#2563eb" sx={{ whiteSpace: 'nowrap' }}>
                              {event.attachments.length} {event.attachments.length === 1 ? 'file' : 'files'}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      <Button 
                        component={Link}
                        href={`/events/${event._id}`}
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          borderColor: '#2563eb', 
                          color: '#2563eb',
                          fontWeight: 700,
                          textTransform: 'none',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          px: 2,
                          '&:hover': {
                            bgcolor: '#eff6ff',
                            borderColor: '#1d4ed8'
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
