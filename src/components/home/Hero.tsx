'use client';

import { useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import gsap from 'gsap';
import { LucideChevronRight, LucideTerminal } from 'lucide-react';
import { useGetHomepageQuery } from '@/features/content/contentApi';

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);

  const { data: homepageData, isLoading } = useGetHomepageQuery({});
  const heroData = homepageData?.data;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.2 }
      )
      .fromTo(
        descriptionRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1 },
        '-=0.8'
      )
      .fromTo(
        buttonsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1 },
        '-=0.6'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (isLoading) return <Box sx={{ height: '80vh', bgcolor: '#002147' }} />;

  return (
    <Box
      ref={containerRef}
      sx={{
        bgcolor: '#001a33',
        color: '#ffffff',
        pt: { xs: 12, md: 20 },
        pb: { xs: 15, md: 25 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Layer with Academic Feel */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #001a33 30%, rgba(0, 26, 51, 0.4) 100%)',
            zIndex: 1,
          }
        }}
      >
        {heroData?.heroImage ? (
          <img 
            src={heroData.heroImage} 
            alt="Campus" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', bgcolor: '#001a33' }} />
        )}
      </Box>

      {/* Decorative Grid/Technical Motifs */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          opacity: 0.1,
          backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          zIndex: 1,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ maxWidth: 850 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
            <Box 
              sx={{ 
                p: 0.8, 
                borderRadius: 1.5, 
                bgcolor: 'rgba(59, 130, 246, 0.1)', 
                display: 'flex',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <LucideTerminal size={16} color="#3b82f6" />
            </Box>
            <Typography 
              variant="overline" 
              sx={{ 
                fontWeight: 800, 
                letterSpacing: 3, 
                color: '#3b82f6',
                fontSize: '0.85rem'
              }}
            >
              {heroData?.subtitle || 'Excellence in Innovation'}
            </Typography>
          </Stack>

          <Typography
            variant="h1"
            ref={titleRef}
            sx={{
              fontSize: { xs: '2.8rem', md: '5rem' },
              fontWeight: 950,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              mb: 4,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {heroData?.title?.split(' ').map((word, i) => (
              <span key={i}>
                {i === heroData.title.split(' ').length - 1 ? (
                  <span style={{ color: '#3b82f6' }}>{word}</span>
                ) : word + ' '}
              </span>
            )) || (
              <>Empowering the Next Generation of <span style={{ color: '#3b82f6' }}>Engineers</span></>
            )}
          </Typography>

          <Typography
            variant="h5"
            ref={descriptionRef}
            sx={{
              color: '#cbd5e1',
              lineHeight: 1.7,
              mb: 7,
              fontWeight: 400,
              maxWidth: 650,
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              borderLeft: '4px solid #3b82f6',
              pl: 3,
            }}
          >
            {heroData?.description || 'Join the Department of Computer Science and Engineering at SUST. Where academic rigor meets cutting-edge research and professional growth.'}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} ref={buttonsRef}>
            <Button
              variant="contained"
              size="large"
              component="a"
              href={heroData?.ctaLink || '/academic'}
              endIcon={<LucideChevronRight size={18} />}
              sx={{
                bgcolor: '#2563eb',
                '&:hover': { 
                  bgcolor: '#1d4ed8',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)'
                },
                px: 5,
                py: 2.2,
                fontSize: '1.1rem',
                fontWeight: 800,
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {heroData?.ctaText || 'Explore Programs'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.25)',
                color: '#ffffff',
                '&:hover': { 
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  transform: 'translateY(-2px)'
                },
                px: 5,
                py: 2.2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                transition: 'all 0.3s ease',
              }}
            >
              View Notice Board
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
