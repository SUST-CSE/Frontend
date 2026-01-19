'use client';

import { useGetSocietiesQuery, useGetSocietyMembersQuery } from '@/features/society/societyApi';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Button, 
  CircularProgress,
  Paper,
  Avatar
} from '@mui/material';
import { LucideArrowRight, LucideUsers, LucideAward } from 'lucide-react';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useEffect, useState } from 'react';

interface ISocietyMember {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    designation?: string; // Teacher's department position
  };
  designation: string; // Committee role
  session: string;
  image?: string;
}

export default function SocietySection() {
  const { data: societiesData, isLoading: isLoadingSocieties } = useGetSocietiesQuery({});
  
  const societies = societiesData?.data || [];
  const cseSociety = societies.find((s: any) => 
    s.name.toUpperCase().includes('CSE SOCIETY') || 
    s.name.toUpperCase().includes('CSE SOCIET')
  ) || societies[0];

  const { data: membersData, isLoading: isLoadingMembers } = useGetSocietyMembersQuery(cseSociety?._id, {
    skip: !cseSociety?._id
  });

  const members: ISocietyMember[] = membersData?.data || [];
  const [pause, setPause] = useState(false);
  const timer = 3000;

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
      '(min-width: 768px)': {
        slides: { perView: 3, spacing: 24 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 4, spacing: 24 },
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
    if (!pause && internalSlider.current && members.length > 0) {
      interval = setInterval(() => {
        internalSlider.current?.next();
      }, timer);
    }
    return () => clearInterval(interval);
  }, [pause, internalSlider, members]);

  if (isLoadingSocieties || isLoadingMembers) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!cseSociety || members.length === 0) return null;

  return (
    <Box sx={{ py: 12, bgcolor: '#0f172a', color: '#ffffff', overflow: 'hidden', position: 'relative' }}>
      {/* Background decoration */}
      <Box sx={{ 
        position: 'absolute', 
        top: -100, 
        right: -100, 
        width: 400, 
        height: 400, 
        borderRadius: '50%', 
        bgcolor: 'rgba(22, 163, 74, 0.1)', 
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} sx={{ mb: 8 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <LucideUsers size={20} color="#16a34a" />
              <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: 2, color: '#16a34a' }}>
                Leadership Team
              </Typography>
            </Stack>
            <Typography variant="h2" fontWeight={900} sx={{ lineHeight: 1.1 }}>
              Meet Our <span style={{ color: '#16a34a' }}>Society</span>
            </Typography>
          </Box>
          <Button 
            component={Link} 
            href={`/societies/${cseSociety._id}`}
            endIcon={<LucideArrowRight size={18} />}
            sx={{ 
              color: '#94a3b8', 
              fontWeight: 700, 
              mt: { xs: 2, md: 0 },
              '&:hover': { color: '#ffffff' } 
            }}
          >
            Explore Full Society
          </Button>
        </Stack>

        <Box ref={sliderRef} className="keen-slider" sx={{ alignItems: 'stretch' }}>
          {members.map((member) => (
            <Box key={member._id} className="keen-slider__slide" sx={{ py: 2, px: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 6,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderColor: '#16a34a',
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Avatar 
                  src={member.image || member.user.profileImage} 
                  alt={member.user.name}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 3, 
                    border: '4px solid rgba(22, 163, 74, 0.2)',
                    boxShadow: '0 0 20px rgba(22, 163, 74, 0.1)'
                  }}
                />
                
                <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                  {member.user.name}
                </Typography>
                
                <Typography variant="body2" fontWeight={700} color="#16a34a" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {member.designation.replace(/_/g, ' ')}
                </Typography>

                <Box sx={{ mt: 'auto', pt: 2, width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="caption" color="#94a3b8" fontWeight={600} sx={{ display: 'block' }}>
                    {member.user.role === 'TEACHER' ? (
                      member.user.designation || 'Faculty Member'
                    ) : (
                      `Session: ${member.session}`
                    )}
                  </Typography>
                  <Typography variant="caption" color="rgba(148, 163, 184, 0.5)" fontWeight={500}>
                    {member.user.role === 'TEACHER' ? 'Teacher' : 'Student Member'}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 8, p: 4, bgcolor: 'rgba(22, 163, 74, 0.05)', borderRadius: 6, border: '1px solid rgba(22, 163, 74, 0.1)', textAlign: 'center' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <LucideAward color="#16a34a" size={24} />
              <Typography variant="h6" fontWeight={700}>
                Most Active Organization at SUST
              </Typography>
            </Stack>
            <Typography variant="body2" color="#94a3b8" sx={{ maxWidth: 500 }}>
              {cseSociety.description.length > 150 ? `${cseSociety.description.substring(0, 150)}...` : cseSociety.description}
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
