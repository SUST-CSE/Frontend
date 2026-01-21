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
  InputAdornment,
  Avatar
} from '@mui/material';
import { LucideSearch, LucideArrowRight, LucidePenTool } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useGetBlogsQuery } from '@/features/blog/blogApi';
import { RootState } from '@/store';
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

const CATEGORIES = ['ALL', 'TECHNOLOGY', 'RESEARCH', 'CAMPUS LIFE', 'ALUMNI', 'CAREER'];

export default function BlogsPage() {
  const { data, isLoading } = useGetBlogsQuery({});
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  
  const containerRef = useRef<HTMLDivElement>(null);

  const blogsList = useMemo(() => data?.data || [], [data]);

  const filteredBlogs = useMemo(() => {
    return blogsList.filter((blog: IBlog) => {
      const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'ALL' || blog.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [blogsList, search, category]);

  useEffect(() => {
    if (!isLoading && filteredBlogs.length > 0) {
      gsap.fromTo(
        '.blog-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [isLoading, filteredBlogs]);

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight={900} color="#0f172a" gutterBottom>
              Community <span style={{ color: '#16a34a' }}>Blog</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Insights, stories, and research from SUST CSE students and faculty.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<LucidePenTool size={18} />}
            onClick={() => router.push('/blogs/create')}
            sx={{
              bgcolor: '#000000',
              color: '#ffffff',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              '&:hover': { bgcolor: '#16a34a' }
            }}
          >
            Write a Blog
          </Button>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 6 }}>
          <TextField
            sx={{ flexGrow: 1, borderRadius: 2 }}
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LucideSearch size={20} color="#94a3b8" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: '#f8fafc' }
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
                  bgcolor: category === cat ? '#000000' : '#f1f5f9',
                  color: category === cat ? '#ffffff' : '#64748b',
                  '&:hover': { bgcolor: category === cat ? '#1f2937' : '#e2e8f0' }
                }}
              />
            ))}
          </Stack>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#16a34a' }} />
          </Box>
        ) : (
          <Grid container spacing={4} ref={containerRef}>
            {filteredBlogs.length > 0 ? filteredBlogs.map((blog: IBlog) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={blog._id} className="blog-card">
                <Paper
                  component={Link}
                  href={`/blogs/${blog._id}`}
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    '&:hover': { 
                      transform: 'translateY(-5px)', 
                      borderColor: '#16a34a',
                      boxShadow: '0 20px 40px -20px rgba(22, 163, 74, 0.15)'
                    }
                  }}
                >
                  <Box sx={{ p: 4, flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip 
                        label={blog.category} 
                        size="small" 
                        sx={{ 
                          fontWeight: 800, 
                          fontSize: '0.7rem',
                          bgcolor: '#dcfce7',
                          color: '#166534',
                          borderRadius: 1
                        }} 
                      />
                    </Stack>
                    
                    <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ mb: 2, lineHeight: 1.3 }}>
                      {blog.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 3,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        lineHeight: 1.6
                      }}
                    >
                      {stripHtml(blog.content)}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar 
                        src={blog.author?.profileImage} 
                        alt={blog.author?.name}
                        sx={{ width: 32, height: 32, bgcolor: '#000000', fontSize: '0.8rem', fontWeight: 700 }}
                      >
                        {blog.author?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ lineHeight: 1 }}>
                          {blog.author?.name || 'Unknown Author'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                    <LucideArrowRight size={20} color="#16a34a" />
                  </Box>
                </Paper>
              </Grid>
            )) : (
              <Box sx={{ width: '100%', textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                <Typography variant="h6" color="text.secondary">No articles found.</Typography>
              </Box>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
