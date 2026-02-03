'use client';

import { useGetNoticesQuery } from '@/features/content/contentApi';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Paper, 
  Button, 
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Bell as LucideBell, ArrowRight as LucideArrowRight, Paperclip as LucidePaperclip, Calendar as LucideCalendar, ExternalLink as LucideExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useEffect, useState } from 'react';

interface INotice {
  _id: string;
  title: string;
  description: string;
  publishDate: string;
  attachments?: string[];
}

export default function NoticesSection() {
  const { data, isLoading } = useGetNoticesQuery({});
  const notices: INotice[] = data?.data || [];
  const [pause, setPause] = useState(false);
  const timer = typeof window !== 'undefined' ? 3000 : 0;

  const [sliderRef, internalSlider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 20,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 2, spacing: 20 },
      },
      '(min-width: 1200px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
    created(s) {
      s.container.addEventListener("mouseover", () => {
        setPause(true);
      });
      s.container.addEventListener("mouseout", () => {
        setPause(false);
      });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!pause && internalSlider.current) {
      interval = setInterval(() => {
        internalSlider.current?.next();
      }, timer);
    }
    return () => clearInterval(interval);
  }, [pause, internalSlider, timer]);

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notices.length === 0) return null;

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <LucideBell size={20} color="#16a34a" />
              <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: 2, color: '#16a34a' }}>
                Stay Updated
              </Typography>
            </Stack>
            <Typography variant="h3" fontWeight={900} color="#0f172a">
              Latest <span style={{ color: '#16a34a' }}>Notices</span>
            </Typography>
          </Box>
          <Button 
            component={Link} 
            href="/notices" 
            endIcon={<LucideArrowRight size={18} />}
            sx={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}
          >
            View All
          </Button>
        </Stack>

        <Box ref={sliderRef} className="keen-slider" sx={{ alignItems: 'stretch' }}>
          {notices.map((notice) => (
            <Box key={notice._id} className="keen-slider__slide" sx={{ py: 2, px: 1 }}>
              <Paper
                component={Link}
                href={`/notices/${notice._id}`}
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  '&:hover': {
                    borderColor: '#16a34a',
                    bgcolor: '#ffffff',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                  }
                }}
              >
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ 
                    mb: 1.5, 
                    lineHeight: 1.2,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2 
                  }}>
                    {notice.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    mb: 2.5
                  }}>
                    {notice.description}
                  </Typography>

                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 'auto', pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                    <Stack spacing={0.5} sx={{ minWidth: 0, flexGrow: 1, mr: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LucideCalendar size={14} color="#64748b" />
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          {new Date(notice.publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                        <Typography variant="caption" color="#cbd5e1">•</Typography>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          {new Date(notice.publishDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Stack>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LucidePaperclip size={14} color="#16a34a" />
                          <Typography variant="caption" fontWeight={700} color="#16a34a" sx={{ whiteSpace: 'nowrap' }}>
                            {notice.attachments.length} {notice.attachments.length === 1 ? 'file' : 'files'}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>

                      <Tooltip title="View Details">
                        <Box 
                          sx={{ 
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#16a34a', 
                            borderRadius: '50%',
                            border: '1px solid #e2e8f0', 
                            transition: 'all 0.2s ease',
                            '&:hover': { bgcolor: '#f0fdf4', borderColor: '#16a34a' } 
                          }}
                        >
                          <LucideExternalLink size={18} />
                        </Box>
                      </Tooltip>
                    </Stack>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
