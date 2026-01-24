'use client';

import { Box, Container, Typography, Grid, Paper, Divider } from '@mui/material';

const SERVICES = [
  { 
    title: 'Consultancy', 
    content: 'The Department provides high-level consultancy services to government and private sectors. Our faculty members serve as key technical experts in national infrastructure projects, ensuring robustness and security in digital implementations.',
    details: ['System Architecture Design', 'Security Audits', 'Technical Feasibility Studies']
  },
  { 
    title: 'Training', 
    content: 'We offer specialized training programs for professionals and students to bridge the gap between academia and industry. Courses range from introductory programming to advanced AI and Cyber Security workshops.',
    details: ['Professional Certification Courses', 'Workshops & Seminars', 'Summer Coding Bootcamps']
  },
  { 
    title: 'Social Outreach', 
    content: 'Committed to giving back, the department organizes regular outreach programs to promote digital literacy in rural areas and among underrepresented groups in technology.',
    details: ['ICT Literacy Programs', 'Tech School Visits', 'Open Source Contributor Mentorship']
  }
];

export default function ServicesPage() {
  return (
    <Box sx={{ pb: 12 }}>
       <Box sx={{ bgcolor: '#0f172a', py: { xs: 8, md: 12 }, color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Services</Typography>
          <Typography variant="h5" sx={{ color: '#94a3b8', maxWidth: '800px', lineHeight: 1.6 }}>
            Serving the community and industry with expertise and dedication.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={6}>
            {SERVICES.map((service, idx) => (
                <Grid item xs={12} key={idx}>
                    <Paper sx={{ p: 5, borderRadius: 4 }} elevation={0} variant="outlined">
                        <Typography variant="h4" fontWeight={800} gutterBottom color="#0f172a">{service.title}</Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#475569', mb: 3 }}>{service.content}</Typography>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Grid container spacing={2}>
                            {service.details.map((detail, dIdx) => (
                                <Grid item xs={12} sm={4} key={dIdx}>
                                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                        <Typography fontWeight={600} color="#334155">{detail}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            ))}
        </Grid>
      </Container>
    </Box>
  );
}
