'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Button, Stack, IconButton } from '@mui/material';
import Image from 'next/image';
import gsap from 'gsap';
import { LucideChevronRight, LucideTerminal, LucideChevronLeft, LucideChevronRight as LucideChevronRightIcon } from 'lucide-react';
import { useGetHomepageQuery } from '@/features/content/contentApi';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);

  const { data: homepageData, isLoading } = useGetHomepageQuery({});
  const heroData = homepageData?.data;
  const heroImages = heroData?.heroImages || ['/sust.png']; // Fallback

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
        }, 5000);
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

  useEffect(() => {
    if (loaded) {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
      tl.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 })
        .fromTo(descriptionRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.8')
        .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6');
    }
  }, [loaded, currentSlide]);

  if (isLoading) return <Box sx={{ height: '85vh', bgcolor: 'transparent' }} />;

  return (
    <Box sx={{ position: 'relative', height: '85vh', overflow: 'hidden', bgcolor: '#000' }}>
      {/* Slider Container */}
      <Box ref={sliderRef} className="keen-slider" sx={{ height: '100%' }}>
        {heroImages.map((src: string, idx: number) => (
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
              src={src} 
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
            {/* Left-aligned Overlay for Text Legibility while keeping image clear on the right */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0) 70%)',
                zIndex: 1,
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Content Layer (Fixed Position relative to Slider) */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <Box sx={{ maxWidth: 850, pointerEvents: 'auto' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
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
              color: '#ffffff',
              textShadow: '0 4px 30px rgba(0,0,0,0.6)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {heroData?.title?.split(' ').map((word: string, i: number) => (
              <span key={i}>
                {i === heroData?.title?.split(' ').length - 1 ? (
                  <span style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '8px' }}>{word}</span>
                ) : word + ' '}
              </span>
            )) || (
              <>Empowering the Next Generation of <span style={{ color: '#ffffff' }}>Engineers</span></>
            )}
          </Typography>

          <Typography
            variant="h5"
            ref={descriptionRef}
            sx={{
              color: '#ffffff',
              lineHeight: 1.7,
              mb: 7,
              fontWeight: 400,
              maxWidth: 650,
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              borderLeft: '4px solid #ffffff',
              pl: 3,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
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
                bgcolor: '#ffffff',
                color: '#000000',
                '&:hover': { 
                  bgcolor: '#f1f5f9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px -5px rgba(255, 255, 255, 0.4)'
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
                borderColor: 'rgba(255,255,255,0.8)',
                color: '#ffffff',
                '&:hover': { 
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.1)',
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
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 11,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <LucideChevronLeft size={32} />
          </IconButton>
          <IconButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              instanceRef.current?.next();
            }}
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 11,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <LucideChevronRightIcon size={32} />
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
            {heroImages.map((_: string, idx: number) => (
              <Box
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: currentSlide === idx ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
