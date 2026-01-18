'use client';

import { Box, Container, Typography, Grid, Link as MuiLink, IconButton, Divider } from '@mui/material';
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#0f172a', color: '#94a3b8', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 800, mb: 2 }}>
              SUST <span style={{ color: '#3b82f6' }}>CSE</span>
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3 }}>
              The Department of Computer Science and Engineering at Shahjalal University of Science and Technology is a center of excellence in computing education and research in Bangladesh.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Facebook, Linkedin, Twitter].map((Icon, idx) => (
                <IconButton 
                  key={idx} 
                  sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' } }}
                >
                  <Icon size={20} />
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Admission', 'Current Students', 'Faculty', 'Research', 'Alumni'].map((item) => (
                <MuiLink 
                  key={item} 
                  component={Link} 
                  href="#" 
                  underline="none" 
                  sx={{ color: '#94a3b8', fontSize: '0.875rem', '&:hover': { color: '#ffffff' } }}
                >
                  {item}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Course Catalog', 'Academic Calendar', 'Library', 'Forms', 'IT Support'].map((item) => (
                <MuiLink 
                  key={item} 
                  component={Link} 
                  href="#" 
                  underline="none" 
                  sx={{ color: '#94a3b8', fontSize: '0.875rem', '&:hover': { color: '#ffffff' } }}
                >
                  {item}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <MapPin size={20} color="#3b82f6" style={{ marginTop: 2 }} />
                <Typography variant="body2">
                  Department of CSE, SUST<br />
                  Kumargaon, Sylhet-3114, Bangladesh
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Phone size={20} color="#3b82f6" />
                <Typography variant="body2">+880-123456789</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Mail size={20} color="#3b82f6" />
                <Typography variant="body2">office.cse@sust.edu</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} SUST CSE Department. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink href="#" sx={{ color: '#94a3b8', fontSize: '0.75rem', '&:hover': { color: '#ffffff' } }}>Privacy Policy</MuiLink>
            <MuiLink href="#" sx={{ color: '#94a3b8', fontSize: '0.75rem', '&:hover': { color: '#ffffff' } }}>Terms of Service</MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
