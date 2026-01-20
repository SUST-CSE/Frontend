'use client';

import { useState } from 'react';
import { useGetAllAlumniQuery } from '@/features/alumni/alumniApi';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import { LucideSearch, LucideBuilding, LucideBriefcase } from 'lucide-react';
import Link from 'next/link';

interface Alumni {
  _id: string;
  name: string;
  batch: string;
  currentCompany: string;
  currentPosition: string;
  description: string;
  profileImage?: string;
}

export default function AlumniPage() {
  const [search, setSearch] = useState('');
  const [batch, setBatch] = useState('');

  const { data, isLoading } = useGetAllAlumniQuery({ search, batch });
  const alumni = data?.data?.alumni || [];

  if (isLoading) {
    return (
      <Box sx={{ py: 20, textAlign: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 10, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header - Matching EventsSection.tsx style */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <LucideBuilding size={20} color="#2563eb" />
              <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: 2, color: '#2563eb' }}>
                Our Community
              </Typography>
            </Stack>
            <Typography variant="h3" fontWeight={900} color="#0f172a">
              Distinguished <span style={{ color: '#2563eb' }}>Alumni</span>
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 2, 
              bgcolor: '#ffffff', 
              p: 1, 
              borderRadius: 3, 
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
            }}
          >
            <TextField
              size="small"
              placeholder="Search alumni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LucideSearch size={16} color="#94a3b8" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: 200,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'transparent',
                  '& fieldset': { border: 'none' },
                }
              }}
            />
            <Divider orientation="vertical" flexItem />
            <TextField
              size="small"
              placeholder="Batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              sx={{ 
                width: 100,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'transparent',
                  '& fieldset': { border: 'none' },
                }
              }}
            />
          </Box>
        </Stack>

        {/* Mobile Search/Filter */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 2, mb: 4, flexDirection: 'column' }}>
            <TextField
                fullWidth
                size="small"
                placeholder="Search alumni..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ bgcolor: '#ffffff', borderRadius: 2 }}
            />
            <TextField
                fullWidth
                size="small"
                placeholder="Batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                sx={{ bgcolor: '#ffffff', borderRadius: 2 }}
            />
        </Box>

        {alumni.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#ffffff', borderRadius: 4, border: '1px dashed #e2e8f0' }}>
            <Typography variant="h6" color="text.secondary">No alumni found.</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {alumni.map((person) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={person._id} sx={{ display: 'flex', minWidth: 0, width: '100%', maxWidth: { md: '25%', sm: '50%', xs: '100%' } }}>
                <Card 
                  component={Link}
                  href={`/alumni/${person._id}`}
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
                    bgcolor: '#ffffff',
                    flex: '1 1 0', // Force equal growth and shrink
                    minWidth: 0,
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
                      image={person.profileImage || '/placeholder-avatar.png'}
                      alt={person.name}
                      sx={{ 
                        height: 200, 
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block' 
                      }}
                    />
                    <Chip 
                      label={`Batch ${person.batch}`}
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
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
                      <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ 
                        lineHeight: 1.2, 
                        mb: 1,
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere'
                      }}>
                        {person.name}
                      </Typography>
                    </Box>
                    
                    <Stack spacing={0.5} sx={{ mb: 2, minWidth: 0, width: '100%', overflow: 'hidden' }}>
                       <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" sx={{ minWidth: 0 }}>
                          <LucideBriefcase size={14} />
                          <Typography variant="caption" fontWeight={700} sx={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{person.currentPosition}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" sx={{ minWidth: 0 }}>
                          <LucideBuilding size={14} />
                          <Typography variant="caption" fontWeight={600} sx={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{person.currentCompany}</Typography>
                        </Stack>
                    </Stack>

                    <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden', flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        mb: 2.5,
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere'
                      }}>
                        {person.description}
                      </Typography>
                    </Box>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 'auto', pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                      <Stack spacing={0.5} sx={{ minWidth: 0, flexGrow: 1, mr: 2 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          SUST CSE Alumni
                        </Typography>
                      </Stack>

                      <Button 
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
                        View Profile
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
