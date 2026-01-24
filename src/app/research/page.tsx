'use client';

import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { LucideDatabase, LucideSearch, LucideCode, LucideGlobe, LucideShieldCheck, LucideCpu, LucideGraduationCap, LucideAtom } from 'lucide-react';

const RESEARCH_AREAS = [
    { title: 'Database and Data Science', icon: LucideDatabase, desc: 'Big data, machine learning, and predictive analysis.' },
    { title: 'Natural Language Processing', icon: LucideSearch, desc: 'Machine understanding and text generation models.' },
    { title: 'Software Engineering', icon: LucideCode, desc: 'Software engineering practices, methods and techniques.' },
    { title: 'Systems and Networking', icon: LucideGlobe, desc: 'Optimizing performance, distributed systems and security.' },
    { title: 'Cyber Security', icon: LucideShieldCheck, desc: 'Resilient systems, network defense, and cryptography.' },
    { title: 'Artificial Intelligence', icon: LucideCpu, desc: 'Neural architectures, cognitive models, and intelligent systems.' },
    { title: 'Algorithms and Theory', icon: LucideGraduationCap, desc: 'Computational complexity, graph theory, and algorithm design.' },
    { title: 'Bioinformatics', icon: LucideAtom, desc: 'Genomics, proteomics, and biological data analysis.' }
];

export default function ResearchPage() {
  return (
    <Box sx={{ pb: 12 }}>
      <Box sx={{ bgcolor: '#0f172a', py: { xs: 8, md: 12 }, color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Research</Typography>
          <Typography variant="h5" sx={{ color: '#94a3b8', maxWidth: '800px', lineHeight: 1.6 }}>
            Exploration and discovery at the cutting edge of computer science.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
            {RESEARCH_AREAS.map((area, idx) => (
                <Grid item xs={12} md={6} lg={4} key={idx}>
                    <Paper sx={{ p: 4, height: '100%', borderRadius: 3, border: '1px solid #e2e8f0' }} elevation={0}>
                        <Box sx={{ color: '#991b1b', mb: 2 }}><area.icon size={32} /></Box>
                        <Typography variant="h5" fontWeight={700} gutterBottom>{area.title}</Typography>
                        <Typography color="text.secondary">{area.desc}</Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
      </Container>
    </Box>
  );
}
