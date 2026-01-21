'use client';

import { useGetBlogsQuery } from '@/features/blog/blogApi';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Paper, 
  Button, 
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material';
import { BookOpen as LucideBookOpen, ArrowRight as LucideArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useEffect, useState, useMemo } from 'react';
import { stripHtml } from '@/utils/string';

interface IBlog {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
    profileImage?: string;
  };
  createdAt: string;
}

export default function BlogSection() {
  const { data, isLoading } = useGetBlogsQuery({});
  const blogs: IBlog[] = useMemo(() => data?.data || [], [data]);
  const [pause, setPause] = useState(false);
  const timer = 5000;

  const [sliderRef, internalSlider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 20,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 20 },
      },
      '(min-width: 1024px)': {
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
    if (!pause && internalSlider.current && blogs.length > 0) {
      interval = setInterval(() => {
        internalSlider.current?.next();
      }, timer);
    }
    return () => clearInterval(interval);
  }, [pause, internalSlider, blogs]);

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <LucideBookOpen size={20} color="#16a34a" />
              <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: 2, color: '#16a34a' }}>
                Latest Stories
              </Typography>
            </Stack>
            <Typography variant="h3" fontWeight={900} color="#0f172a">
              From Our <span style={{ color: '#16a34a' }}>Blog</span>
            </Typography>
          </Box>
          <Button 
            component={Link} 
            href="/blogs" 
            endIcon={<LucideArrowRight size={18} />}
            sx={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}
          >
            Read All
          </Button>
        </Stack>

        <Box ref={sliderRef} className="keen-slider" sx={{ alignItems: 'stretch' }}>
          {blogs.slice(0, 6).map((blog) => (
            <Box key={blog._id} className="keen-slider__slide" sx={{ py: 2, px: 1 }}>
              <Paper
                component={Link}
                href={`/blogs/${blog._id}`}
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  '&:hover': {
                    borderColor: '#16a34a',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px -20px rgba(22, 163, 74, 0.15)',
                  }
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Chip 
                    label={blog.category} 
                    size="small" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 800, 
                      fontSize: '0.7rem',
                      bgcolor: '#dcfce7',
                      color: '#166534',
                      borderRadius: 1
                    }} 
                  />
                  <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ 
                    mb: 2, 
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2 
                  }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 3,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    lineHeight: 1.6
                  }}>
                    {stripHtml(blog.content)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 3, borderTop: '1px solid #f1f5f9' }}>
                  <Avatar 
                    src={blog.author?.profileImage} 
                    alt={blog.author?.name}
                    sx={{ width: 32, height: 32, bgcolor: '#0f172a', fontSize: '0.8rem', fontWeight: 700 }}
                  >
                    {blog.author?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ lineHeight: 1 }}>
                      {blog.author?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
