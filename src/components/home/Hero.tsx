'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Stack, IconButton } from '@mui/material';
import Image from 'next/image';
import gsap from 'gsap';
import { LucideChevronRight, LucideTerminal, LucideChevronLeft, LucideChevronRight as LucideChevronRightIcon } from 'lucide-react';
import { useGetHomepageQuery } from '@/features/content/contentApi';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCta?: string;
  image: string;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  
  const { data: homepageData, isLoading } = useGetHomepageQuery({});
  const heroSlides = (homepageData?.data?.heroSlides as HeroSlide[]) || [];
  
  // Static content as fallback if no slides from DB
  const DEFAULT_SLIDES = [
    {
      title: 'Empowering the Next Generation of Engineers',
      subtitle: 'Excellence in Innovation',
      description: 'Join the Department of Computer Science and Engineering at SUST. Where academic rigor meets cutting-edge research.',
      ctaText: 'Explore Programs',
      ctaLink: '/academic',
      secondaryCta: 'View Notice Board',
      image: '/sust.png'
    },
    {
      title: 'Pioneering Research & Development',
      subtitle: 'Advancing Knowledge',
      description: 'Our faculty and students are at the forefront of technological innovation, publishing groundbreaking research in AI, Data Science, and Systems.',
      ctaText: 'View Publications',
      ctaLink: '/research',
      secondaryCta: 'Research Areas',
      image: '/sust.png'
    }
  ];

  const slidesToRender = heroSlides.length > 0 ? heroSlides : DEFAULT_SLIDES;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
  }, [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>;
      let mouseOver = false;
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 6000);
      }
      slider.on('created', () => {
        slider.container.addEventListener('mouseover', () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener('mouseout', () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on('dragStarted', clearNextTimeout);
      slider.on('animationEnded', nextTimeout);
      slider.on('updated', nextTimeout);
    },
  ]);

  // GSAP Animation for active slide content
  useEffect(() => {
    if (loaded) {
      gsap.fromTo(
        `.slide-content-${currentSlide} .animate-item`,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [loaded, currentSlide]);

  if (isLoading) return <Box sx={{ height: '85vh', bgcolor: 'transparent' }} />;

  return (
    <Box sx={{ position: 'relative', height: { xs: 'auto', md: '75vh', lg: '85vh' }, minHeight: { xs: '600px', md: 'auto' }, overflow: 'hidden', bgcolor: '#000' }}>
      {/* Slider Container */}
      <Box ref={sliderRef} className="keen-slider" sx={{ height: '100%' }}>
        {slidesToRender.map((slide: HeroSlide, idx: number) => {
          return (
            <Box 
              key={idx} 
              className="keen-slider__slide" 
              sx={{ 
                position: 'relative', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image 
                src={slide.image} 
                alt={`Slide ${idx + 1}`} 
                fill
                priority={idx === 0}
                unoptimized={true}
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center',
                  opacity: 1.0
                }}
              />
              {/* Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 5%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 100%)',
                  zIndex: 1,
                }}
              />

              {/* Content Layer (Inside Slide) */}
              <Container 
                maxWidth="lg" 
                className={`slide-content-${idx}`}
                sx={{ 
                  position: 'relative', 
                  zIndex: 10,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ maxWidth: 850 }}>
                  <Stack 
                    direction="row" 
                    spacing={1.5} 
                    alignItems="center" 
                    sx={{ mb: 4 }}
                    className="animate-item"
                  >
                    <Box 
                      sx={{ 
                        p: 0.8, 
                        borderRadius: 1.5, 
                        bgcolor: 'rgba(255, 255, 255, 0.1)', 
                        display: 'flex',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <LucideTerminal size={16} color="#ffffff" />
                    </Box>
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        fontWeight: 800, 
                        letterSpacing: 3, 
                        color: '#ffffff',
                        fontSize: '0.85rem'
                      }}
                    >
                      {slide.subtitle}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h1"
                    className="animate-item"
                    sx={{
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                      fontWeight: 950,
                      lineHeight: 1.1,
                      letterSpacing: '-0.04em',
                      mb: 4,
                      color: '#ffffff',
                      textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                     {slide.title}
                  </Typography>

                  <Typography
                    variant="h5"
                    className="animate-item"
                    sx={{
                      color: '#e2e8f0',
                      lineHeight: 1.7,
                      mb: 6,
                      fontWeight: 400,
                      maxWidth: 650,
                      fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                      borderLeft: '4px solid #16a34a',
                      pl: 3,
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    }}
                  >
                    {slide.description}
                  </Typography>

                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2.5} 
                    className="animate-item"
                  >
                    {slide.ctaLink && slide.ctaText && (
                      <Button
                        variant="contained"
                        size="large"
                        component="a"
                        href={slide.ctaLink}
                        endIcon={<LucideChevronRight size={18} />}
                        sx={{
                          bgcolor: '#ffffff',
                          color: '#000000',
                          '&:hover': { 
                            bgcolor: '#f1f5f9',
                            transform: 'translateY(-2px)'
                          },
                          px: { xs: 3, sm: 4 },
                          py: 1.8,
                          fontSize: { xs: '0.9rem', sm: '1.2rem' },
                          fontWeight: 800,
                          borderRadius: 2,
                        }}
                      >
                        {slide.ctaText}
                      </Button>
                    )}
                    {slide.secondaryCta && (
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: 'rgba(255,255,255,0.6)',
                          color: '#ffffff',
                          '&:hover': { 
                            borderColor: '#ffffff',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          px: { xs: 3, sm: 4 },
                          py: 1.8,
                          fontSize: { xs: '0.9rem', sm: '1.2rem' },
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        {slide.secondaryCta}
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Container>
            </Box>
          );
        })}
      </Box>

      {/* Slider Controls */}
      {loaded && (
        <>
          <IconButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              instanceRef.current?.prev();
            }}
            sx={{
              position: 'absolute',
              left: { xs: 10, md: 30 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 11,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <LucideChevronLeft size={28} />
          </IconButton>
          <IconButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              instanceRef.current?.next();
            }}
            sx={{
              position: 'absolute',
              right: { xs: 10, md: 30 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 11,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <LucideChevronRightIcon size={28} />
          </IconButton>

          {/* Dots Pagination */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1.5,
              zIndex: 11
            }}
          >
            {slidesToRender.map((_: HeroSlide, idx: number) => (
              <Box
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                sx={{
                  width: currentSlide === idx ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: currentSlide === idx ? '#16a34a' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
