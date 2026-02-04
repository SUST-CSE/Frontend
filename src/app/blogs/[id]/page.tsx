'use client';

import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  Stack, 
  Chip, 
  Button, 
  Paper,
  Skeleton
} from '@mui/material';
import { LucideArrowLeft, LucideCalendar, LucideClock, LucideShare2 } from 'lucide-react';
import { useGetBlogByIdQuery } from '@/features/blog/blogApi';
import toast from 'react-hot-toast';

export default function BlogDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: blogData, isLoading, error } = useGetBlogByIdQuery(id);

  const blog = blogData?.data;

  // Helper to decode HTML entities if content is double-escaped
  const decodeHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 8, bgcolor: '#ffffff', minHeight: '100vh' }}>
        <Container maxWidth="md">
          <Skeleton width={150} height={32} sx={{ mb: 4 }} />
          <Skeleton width={100} height={32} sx={{ mb: 3 }} />
          <Skeleton width="100%" height={80} sx={{ mb: 4 }} />
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={48} height={48} />
              <Box>
                <Skeleton width={150} height={24} />
                <Skeleton width={200} height={16} />
              </Box>
            </Stack>
            <Skeleton width={100} height={40} sx={{ borderRadius: 4 }} />
          </Box>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4, mb: 6 }} />
          <Skeleton width="100%" height={24} sx={{ mb: 1 }} />
          <Skeleton width="100%" height={24} sx={{ mb: 1 }} />
          <Skeleton width="100%" height={24} sx={{ mb: 1 }} />
          <Skeleton width="60%" height={24} />
        </Container>
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" fontWeight={700} color="text.secondary">Blog post not found</Typography>
        <Button startIcon={<LucideArrowLeft />} onClick={() => router.push('/blogs')} sx={{ color: '#16a34a' }}>
          Back to Blogs
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Button 
          startIcon={<LucideArrowLeft />} 
          onClick={() => router.push('/blogs')}
          sx={{ mb: 4, color: '#64748b', fontWeight: 600, textTransform: 'none' }}
        >
          Back to Article List
        </Button>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Chip 
            label={blog.category} 
            sx={{ 
              fontWeight: 800,                                                            
              bgcolor: '#dcfce7', 
              color: '#166534', 
              borderRadius: 1,
              fontSize: '0.75rem'
            }} 
          />
        </Stack>
        
        <Typography variant="h2" fontWeight={900} color="#0f172a" sx={{ mb: 4, lineHeight: 1.2 }}>
          {blog.title}
        </Typography>

        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              src={blog.author?.profileImage} 
              alt={blog.author?.name}
              sx={{ width: 48, height: 48, bgcolor: '#000000' }}
            >
              {blog.author?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                {blog.author?.name || 'Unknown Author'}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                 <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                   <LucideCalendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}
                 </Typography>
                 <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                   <LucideClock size={14} /> 5 min read
                 </Typography>
              </Stack>
            </Box>
          </Stack>
          
          <Button 
            startIcon={<LucideShare2 size={18} />} 
            variant="outlined" 
            onClick={() => {
              const url = window.location.href;
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  text: `Check out this blog: ${blog.title}`,
                  url
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
              }
            }}
            sx={{ borderRadius: 4, textTransform: 'none', color: '#64748b', borderColor: '#e2e8f0' }}
          >
            Share
          </Button>
        </Box>

        {blog.image && (
          <Box 
            component="img" 
            src={blog.image} 
            alt={blog.title} 
            sx={{ 
              width: '100%', 
              maxHeight: 500, 
              objectFit: 'cover', 
              borderRadius: 4, 
              mb: 6 
            }}
          />
        )}

        <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent', border: 'none' }}>
          <Box 
            component="div"
            dangerouslySetInnerHTML={{ __html: decodeHtml(blog.content) }}
            sx={{ 
              fontSize: '1.15rem', 
              lineHeight: 1.8, 
              color: '#334155',
              '& b, & strong': { fontWeight: 700, color: '#0f172a' },
              // '& b, & strong': { fontWeight: 700, color: '#0f172a' },
              '& i, & em': { fontStyle: 'italic' },
              '& u': { textDecoration: 'underline' },
              '& ul, & ol': { mb: 3, pl: 3 },
              '& li': { mb: 1 },
              '& p': { mb: 3 },
              '& h1, & h2, & h3': { color: '#0f172a', fontWeight: 800, mt: 4, mb: 2 },
              '& a': { color: '#16a34a', textDecoration: 'underline' },
              '& pre': { 
                bgcolor: '#1e293b', 
                color: '#e2e8f0', 
                p: 2, 
                borderRadius: 2, 
                overflow: 'auto',
                mb: 3,
                fontFamily: 'monospace'
              },
              '& code': { 
                bgcolor: '#f1f5f9', 
                color: '#0f172a', 
                px: 1, 
                py: 0.5, 
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.9em'
              },
              '& pre code': {
                bgcolor: 'transparent',
                color: 'inherit',
                p: 0
              },
              '& blockquote': {
                borderLeft: '4px solid #16a34a',
                pl: 3,
                py: 1,
                my: 3,
                fontStyle: 'italic',
                color: '#64748b',
                bgcolor: '#f8fafc'
              }
            }}
          />
        </Paper>

      </Container>
    </Box>
  );
}
