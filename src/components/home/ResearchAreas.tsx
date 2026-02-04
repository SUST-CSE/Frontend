'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Button, Stack, Paper } from '@mui/material';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { 
  LucideGraduationCap, 
  LucideDatabase,
  LucideCpu,
  LucideGlobe,
  LucideShieldCheck,
  LucideCode,
  LucideSearch,
  LucideAtom
} from 'lucide-react';

const RESEARCH_AREAS = [
  {
    title: 'Database and Data Science',
    description: 'Developing advanced algorithms and models to innovate in big data, machine learning, and predictive analysis.',
    icon: LucideDatabase
  },
  {
    title: 'Natural Language Processing',
    description: 'Pioneering advancements in NLP through developing innovative models to enhance machine understanding and generation.',
    icon: LucideSearch
  },
  {
    title: 'Software Engineering',
    description: 'Driving software innovation through pioneering research on software engineering practices, methods and techniques.',
    icon: LucideCode
  },
  {
    title: 'Systems and Networking',
    description: 'Enhancing the foundation of computing through cutting-edge research on optimizing performance and security.',
    icon: LucideGlobe
  },
  {
    title: 'Cyber Security',
    description: 'Building resilient systems and protocols to protect critical infrastructure from evolving digital threats.',
    icon: LucideShieldCheck
  },
  {
    title: 'Artificial Intelligence',
    description: 'Exploring neural architectures and cognitive models to create the next generation of intelligent systems.',
    icon: LucideCpu
  },
  {
    title: 'Algorithms and Theory',
    description: 'Solving complex computational problems through rigorous mathematical analysis and efficient design.',
    icon: LucideGraduationCap
  },
  {
    title: 'Bioinformatics',
    description: 'Applying computational techniques to biological data to unlock new insights in genomics and medicine.',
    icon: LucideAtom
  }
];

export default function ResearchAreas() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [pause, setPause] = useState(false);
  const timer = 5000; // 5 seconds per slide

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: {
      perView: 1,
      spacing: 48,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(s) {
      setLoaded(true);
      s.container.addEventListener("mouseover", () => {
        setPause(true);
      });
      s.container.addEventListener("mouseout", () => {
        setPause(false);
      });
    },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.research-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.research-trigger',
          start: 'top 80%',
        }
      });
    }, sliderRef);

    let interval: NodeJS.Timeout;
    if (!pause && instanceRef.current) {
      interval = setInterval(() => {
        instanceRef.current?.next();
      }, timer);
    }
    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, [pause, instanceRef, sliderRef]);

  // Split RESEARCH_AREAS into groups of 4 for the 2x2 grid look per slide
  const slides = [
    RESEARCH_AREAS.slice(0, 4),
    RESEARCH_AREAS.slice(4, 8)
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Background Pattern */}
      <Box 
        sx={{ 
          position: 'absolute',
          right: '-5%',
          bottom: '-10%',
          width: '500px',
          height: '500px',
          opacity: 0.4,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(185, 28, 28, 0.1)" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(185, 28, 28, 0.1)" strokeWidth="1" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(185, 28, 28, 0.1)" strokeWidth="1" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(185, 28, 28, 0.05)" strokeWidth="1" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(185, 28, 28, 0.05)" strokeWidth="1" />
        </svg>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={8} alignItems="center">
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 4.5 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900, 
                color: '#1e293b', 
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              Research Areas
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748b', 
                fontSize: '1.1rem', 
                lineHeight: 1.8,
                mb: 5,
                textAlign: 'justify'
              }}
            >
              From developing cyber security solutions to recommending potential medicine through AI, our researchers solve problems that impact the world. Our expertise spans multiple disciplines, including Algorithms and Theory, AI and Machine Learning, Bioinformatics, Cyber Security, Database and Data Science, Natural Language Processing, Software Engineering, and Systems and Networking.
            </Typography>
            <Button 
              component={Link} // Link added
              href="/research" // Href added
              variant="contained" 
              sx={{ 
                bgcolor: '#991b1b', // Dark red as in image
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                '&:hover': {
                  bgcolor: '#7f1d1d'
                }
              }}
            >
              Learn more →
            </Button>
          </Grid>

          {/* Right Slider */}
          <Grid size={{ xs: 12, md: 7.5 }} className="research-trigger">
            <Box sx={{ position: 'relative' }}>
              <Box ref={sliderRef} className="keen-slider" sx={{ overflow: 'hidden' }}>
                {slides.map((group, sIdx) => (
                  <Box key={sIdx} className="keen-slider__slide">
                    <Grid container spacing={3}>
                      {group.map((area, aIdx) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={aIdx} className="research-card">
                          <Paper
                            elevation={0}
                            sx={{
                              p: 4,
                              height: '100%',
                              borderRadius: 3,
                              border: '1px solid #e2e8f0',
                              bgcolor: '#ffffff',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
                                borderColor: '#991b1b'
                              }
                            }}
                          >
                            <Box sx={{ color: '#1e293b', mb: 3 }}>
                              <area.icon size={32} strokeWidth={1.5} />
                            </Box>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: 800, 
                                color: '#1e293b', 
                                mb: 2,
                                fontSize: { xs: '1.2rem', sm: '1.4rem' }
                              }}
                            >
                              {area.title}
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: '#64748b', 
                                lineHeight: 1.7,
                                fontSize: '1rem'
                              }}
                            >
                              {area.description}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>

              {/* Slider Dots */}
              {loaded && (
                <Stack 
                  direction="row" 
                  spacing={1} 
                  justifyContent="center" 
                  sx={{ mt: 6 }}
                >
                  {slides.map((_, idx) => (
                    <Box
                      key={idx}
                      onClick={() => instanceRef.current?.moveToIdx(idx)}
                      sx={{
                        width: currentSlide === idx ? 14 : 10,
                        height: 10,
                        borderRadius: 5,
                        bgcolor: currentSlide === idx ? '#1e293b' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
