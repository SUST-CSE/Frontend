'use client';

import { Box, Container, Grid, Typography, Card, CardMedia, Button } from '@mui/material';
import Link from 'next/link';
import { ArrowRight as LucideArrowRight, LucideBuilding2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    title: 'Consultancy',
    description: 'The Department of Computer Science and Engineering, SUST enjoys the presence of a world class pool of experts from different specialized fields.',
    image: '/IICT1.jpg',
    link: '/services'
  },
  {
    title: 'Training',
    description: 'Enhancing expertise in the latest technological advancements through training programs for professionals in IT solutions.',
    image: '/IICT2.jpg',
    link: '/services'
  },
  {
    title: 'Social Outreach',
    description: 'Extending our expertise to the community to promoting technology literacy and support local development initiatives.',
    image: '/about3.jpg',
    link: '/services'
  }
];

export default function DepartmentServices() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <Box ref={containerRef} sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }} className="service-card">
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2, px: 2, py: 1, borderRadius: 'full', bgcolor: 'rgba(22, 163, 74, 0.1)' }}>
            <LucideBuilding2 size={16} color="#16a34a" />
            <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Services
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, color: '#002147', mb: 2 }}>
            Department Services
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto', fontSize: { xs: '1rem', md: '1.125rem' } }}>
            Discover the various services and facilities offered by the department to students and professionals.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index} className="service-card">
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Box sx={{ p: 4, pb: 2 }}>
                  <Typography
                    variant="h4"
                    component="h3"
                    sx={{
                      fontWeight: 800,
                      color: '#1e293b',
                      mb: 2,
                      fontSize: { xs: '1.5rem', md: '1.75rem' }
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#64748b',
                      lineHeight: 1.6,
                      mb: 3,
                      minHeight: '4.8em' // approximate for ~3 lines
                    }}
                  >
                    {service.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={service.link}
                    endIcon={<LucideArrowRight size={16} />}
                    sx={{
                      textTransform: 'none',
                      color: '#991b1b', // Brand red
                      p: 0,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Learn more
                  </Button>
                </Box>
                <CardMedia
                  component="img"
                  height="250"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    mt: 'auto',
                    objectFit: 'cover'
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
