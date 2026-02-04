'use client';

import { Box, Container, Typography, Button, Paper, Stack, Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetProductQuery } from '@/features/product/productApi';
import { LucideExternalLink, LucideArrowLeft } from 'lucide-react';

export default function ProjectPage() {
  const { id } = useParams();
  const { data: response, isLoading, error } = useGetProductQuery(id);
  const project = response?.data;

  if (isLoading) {
    return (
      <Box sx={{ py: 10, bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Skeleton width={120} height={40} sx={{ mb: 4 }} />
          <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Stack spacing={6} alignItems="center">
              <Skeleton variant="rectangular" width={120} height={120} sx={{ borderRadius: 3 }} />
              <Skeleton width="60%" height={80} />
              <Skeleton width="30%" height={32} />
              <Box sx={{ width: '100%', maxWidth: 800 }}>
                <Skeleton width="100%" height={24} />
                <Skeleton width="100%" height={24} />
                <Skeleton width="100%" height={24} />
                <Skeleton width="70%" height={24} />
              </Box>
              <Skeleton width={250} height={60} sx={{ borderRadius: 2 }} />
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', justifyContent: 'center', gap: 2 }}>
        <Typography variant="h5" color="text.secondary">Project not found</Typography>
        <Button 
          component={Link} 
          href="/" 
          startIcon={<LucideArrowLeft />}
          variant="outlined"
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 10, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Button 
          component={Link} 
          href="/"
          startIcon={<LucideArrowLeft size={18} />}
          sx={{ mb: 4, color: '#64748b', '&:hover': { color: '#0f172a' } }}
        >
          Back to Home
        </Button>

        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: 4, 
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
            <Stack spacing={6}>
                <Box sx={{ textAlign: 'center' }}>
                    {project.icon && (
                        <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mb: 4, borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                            <Image 
                                src={project.icon} 
                                alt={project.name} 
                                fill 
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                    )}
                    <Typography 
                        variant="h1" 
                        sx={{ 
                            fontSize: { xs: '2rem', md: '3.5rem' }, 
                            fontWeight: 800, 
                            color: '#0f172a',
                            mb: 2,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {project.name}
                    </Typography>
                    
                    {project.isActive && (
                        <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: '#dcfce7', color: '#166534', borderRadius: 2, fontWeight: 600, fontSize: '0.875rem' }}>
                            Active Project
                        </Box>
                    )}
                </Box>

                <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.125rem', 
                            lineHeight: 1.8, 
                            color: '#334155',
                            textAlign: 'center',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {project.description || "No description provided."}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                    <Button
                        component="a"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="large"
                        endIcon={<LucideExternalLink size={20} />}
                        sx={{ 
                            bgcolor: '#0f172a', 
                            color: '#fff',
                            px: 6,
                            py: 2,
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#1e293b',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)'
                            },
                        }}
                    >
                        Visit Project Website
                    </Button>
                </Box>
            </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
