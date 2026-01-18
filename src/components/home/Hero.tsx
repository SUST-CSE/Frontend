'use client';

import { useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import gsap from 'gsap';
import { LucideChevronRight, LucideZap } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);

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

  return (
    <Box
      ref={containerRef}
      sx={{
        bgcolor: '#002147',
        color: '#ffffff',
        pt: { xs: 10, md: 15 },
        pb: { xs: 12, md: 20 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Accent */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          bgcolor: 'rgba(37, 99, 235, 0.05)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 800 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, opacity: 0.8 }}>
            <LucideZap size={18} color="#3b82f6" />
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: '#3b82f6' }}>
              Excellence in Innovation
            </Typography>
          </Stack>

          <Typography
            variant="h1"
            ref={titleRef}
            sx={{
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: -1,
              mb: 3,
            }}
          >
            Empowering the Next Generation of <span style={{ color: '#3b82f6' }}>Engineers</span>
          </Typography>

          <Typography
            variant="h5"
            ref={descriptionRef}
            sx={{
              color: '#94a3b8',
              lineHeight: 1.6,
              mb: 6,
              fontWeight: 400,
              maxWidth: 600,
            }}
          >
            Join the Department of Computer Science and Engineering at SUST. 
            Where academic rigor meets cutting-edge research and professional growth.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} ref={buttonsRef}>
            <Button
              variant="contained"
              size="large"
              endIcon={<LucideChevronRight size={18} />}
              sx={{
                bgcolor: '#2563eb',
                '&:hover': { bgcolor: '#1d4ed8' },
                px: 4,
                py: 1.8,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              Explore Programs
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                '&:hover': { 
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.05)' 
                },
                px: 4,
                py: 1.8,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
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
