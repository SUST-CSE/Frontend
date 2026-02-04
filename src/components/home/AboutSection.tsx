'use client';

import { Box, Container, Grid, Typography, Button, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link'; // Added import
import { LucideArrowRight, LucideInfo } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate text content
      gsap.from('.about-animate', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });

      // Animate image grid
      gsap.from('.about-image', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const images = [
    { src: '/about1.jpg', alt: 'Innovative Research' },
    { src: '/about2.jpg', alt: 'Modern Campus' },
    { src: '/about3.jpg', alt: 'Student Collaboration' },
    { src: '/about4.jpg', alt: 'Academic Excellence' },
  ];

  return (
    <Box 
      ref={containerRef} 
      sx={{ 
        py: { xs: 6, md: 10 }, 
        bgcolor: '#ffffff', 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 8, md: 12 }} alignItems="center">
          {/* Left Content Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box ref={leftRef}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box 
                  sx={{ 
                    p: 0.8, 
                    borderRadius: 1.5, 
                    bgcolor: 'rgba(15, 23, 42, 0.04)', 
                    display: 'flex',
                    border: '1px solid rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <LucideInfo size={18} color="#0f172a" />
                </Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    fontWeight: 800, 
                    letterSpacing: 3, 
                    color: '#64748b',
                    fontSize: '0.8rem'
                  }}
                >
                  DEPARTMENT OF CSE, SUST
                </Typography>
              </Stack>

              <Typography 
                variant="h2" 
                className="about-animate"
                sx={{ 
                  fontWeight: 950, 
                  color: '#0f172a',
                  lineHeight: 1.1,
                  mb: 4,
                  fontSize: { xs: '2.2rem', sm: '3.2rem', md: '4.2rem' },
                  letterSpacing: '-0.03em',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Pioneering the <br />
                <span style={{ 
                  color: '#0f172a', 
                  position: 'relative',
                  display: 'inline-block'
                }}>
                  Digital Frontier
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 8, 
                      left: 0, 
                      width: '100%', 
                      height: '8px', 
                      bgcolor: 'rgba(15, 23, 42, 0.06)',
                      zIndex: -1 
                    }} 
                  />
                </span>
              </Typography>

              <Stack spacing={4} sx={{ mb: 7 }} className="about-animate">
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#334155', 
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }, 
                    lineHeight: 1.8,
                    fontWeight: 400,
                    textAlign: 'justify'
                  }}
                >
                  Sustainable technical evolution starts here. As one of the premier institutions for Computer Science in the nation, we blend rigorous theoretical foundations with experimental research.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#64748b', 
                    fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.1rem' }, 
                    lineHeight: 1.8,
                    fontWeight: 400,
                    textAlign: 'justify',
                    borderLeft: '4px solid rgba(15, 23, 42, 0.1)',
                    pl: 3
                  }}
                >
                  Our mission is to empower students with the analytical depth and ethical grounding required to navigate the complexities of modern engineering. From AI to Quantum Computing, we are building the tomorrow we once only imagined.
                </Typography>
              </Stack>

              <Button 
                component={Link} // Link added
                href="/about"    // Href added
                variant="contained" 
                size="large"
                endIcon={<LucideArrowRight size={20} />}
                sx={{ 
                  bgcolor: '#0f172a',
                  color: '#ffffff',
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.8, sm: 2.2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 800,
                  borderRadius: 2,
                  boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#1e293b',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4)',
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Explore Our Core Values
              </Button>
            </Box>
          </Grid>

          {/* Right Image Grid Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 2,
              }}
            >
              {images.map((img, idx) => (
                 <Box
                  key={idx}
                  className="about-image"
                  sx={{
                    position: 'relative',
                    height: { xs: 150, md: 240 },
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: '#f1f5f9',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <Image 
                    src={img.src} 
                    alt={img.alt} 
                    fill 
                    unoptimized
                    style={{ 
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
