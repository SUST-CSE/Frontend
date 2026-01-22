'use client';

import { Box, Container, Grid, Typography, Card, CardMedia, Button } from '@mui/material';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Consultancy',
    description: 'The Department of Computer Science and Engineering, SUST enjoys the presence of a world class pool of experts from different specialized fields.',
    image: '/IICT1.jpg',
    link: '#'
  },
  {
    title: 'Training',
    description: 'Enhancing expertise in the latest technological advancements through training programs for professionals in IT solutions.',
    image: '/IICT2.jpg',
    link: '#'
  },
  {
    title: 'Social Outreach',
    description: 'Extending our expertise to the community to promoting technology literacy and support local development initiatives.',
    image: '/about3.jpg', 
    link: '#'
  }
];

export default function DepartmentServices() {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
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
                    endIcon={<ArrowRight size={16} />}
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
